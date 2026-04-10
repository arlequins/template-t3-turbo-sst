/// <reference path="./sst-globals.d.ts" />

function toPascalCase(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter((s) => s.length > 0)
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join("");
}

/**
 * SST disallows top-level imports in `sst.config.ts` — use dynamic `import()` inside `app` / `run`.
 * `app()` loads {@link serverEnv} / {@link sstAwsRegion} / {@link Stage} from `@acme/env` (Zod-validated).
 */
export default $config({
  async app(input) {
    const { serverEnv, sstAwsRegion, Stage } = await import("@acme/env");
    const localAwsProfile = serverEnv.SST_AWS_PROFILE?.trim();
    const region = sstAwsRegion();

    return {
      name: "batch",
      removal: input?.stage === Stage.PRODUCTION ? "retain" : "remove",
      protect: input?.stage === Stage.PRODUCTION,
      home: "aws",
      providers: {
        aws: {
          region,
          ...(localAwsProfile ? { profile: localAwsProfile } : {}),
        },
      },
    };
  },
  async run() {
    const { vpcFromEnv, Stage } = await import("@acme/env");
    const { RegisteredManifests } = await import("./config");
    const { HandlerMap } = await import("./lib");
    const { BATCH_TASK_RETRY_POLICY } = await import("./shared");

    /**
     * Default: pass the Task’s state input into `HandlerInvokeEvent.input`.
     * Override per step in the manifest with a JSONata string or a static object.
     */
    function pipelineStepPayloadInput(step: { input?: unknown }): unknown {
      return step.input === undefined ? "{% $states.input %}" : step.input;
    }

    /**
     * For each item in `RegisteredManifests` (`config/index.ts`): one Step Functions state machine
     * + optional EventBridge schedule + starter Lambda.
     * @see https://sst.dev/docs/component/aws/step-functions/
     *
     * Cron `function` gets `STATE_MACHINE_ARN` and `states:StartExecution` on the pipeline ARN.
     *
     * Pipeline steps: one Lambda per `handlerKey` — paths in `lib/index.ts` (`HandlerMap`).
     * Without VPC env (`SUBNET_IDS` / `SECURITY_GROUP_IDS`), Lambdas are not placed in a VPC.
     */
    const stage = $app.name;

    const attach = vpcFromEnv();
    const vpc = attach
      ? {
          privateSubnets: attach.subnetIds,
          securityGroups: attach.securityGroups,
        }
      : undefined;

    /** One Lambda per `handlerKey` (shared across batches that reference the same key). */
    const handlerFns = new Map<string, unknown>();
    for (const [id, def] of Object.entries(HandlerMap)) {
      const name = toPascalCase(id);
      handlerFns.set(
        id,
        new sst.aws.Function(name, {
          handler: def.handler,
          timeout: def.timeout,
          memory: def.memory,
          retention: def.retention,
          ...(vpc ? { vpc } : {}),
        }),
      );
    }

    /** One Lambda for all pipelines; `batchId` is passed in `lambdaInvoke.payload` per state machine. */
    const pipelineFailureFn = new sst.aws.Function(`PipelineFailure`, {
      handler: "lib/functions/common/pipeline-failure.handler",
      timeout: "1 minute",
      memory: "1024 MB",
      retention: stage === Stage.PRODUCTION ? "13 months" : "2 weeks",
      ...(vpc ? { vpc } : {}),
    });

    for (const manifest of RegisteredManifests) {
      const batchId = manifest.id;
      const name = toPascalCase(batchId);

      /** Top-level SST names must be unique — do not reuse `manifest.id` for both Step Functions and Cron. */
      const failureHandled = sst.aws.StepFunctions.succeed({
        name: "pipeline-failure-handled",
      });

      const pipelineFailureAlert = sst.aws.StepFunctions.lambdaInvoke({
        name: "pipeline-failure-alert",
        function: pipelineFailureFn,
        payload: {
          batchId,
          stepFunctionsInput: "{% $states.input %}",
        },
      }).next(failureHandled);

      let chain = sst.aws.StepFunctions.succeed({ name: "pipeline-succeeded" });
      for (const step of [...manifest.steps].reverse()) {
        const handlerFn = handlerFns.get(step.handlerKey);
        if (!handlerFn) {
          throw new Error(
            `Unknown handlerKey "${step.handlerKey}" (step "${step.stateName}"). Register it in lib/index.ts (HandlerMap)`,
          );
        }
        let task = sst.aws.StepFunctions.lambdaInvoke({
          name: step.stateName,
          function: handlerFn,
          payload: {
            batchId,
            stateName: step.stateName,
            input: pipelineStepPayloadInput(step),
          },
        });
        if (step.withRetry) {
          task = task.retry(BATCH_TASK_RETRY_POLICY);
        }
        task = task.catch(pipelineFailureAlert, {
          errors: ["States.ALL"],
        });
        chain = task.next(chain);
      }

      const pipeline = new sst.aws.StepFunctions(`Step${name}`, {
        definition: chain,
      });

      new sst.aws.CronV2(`Cron${name}`, {
        schedule: manifest.schedule,
        enabled: manifest.eventBridgeScheduleEnabled,
        function: {
          handler: manifest.starterHandler,
          timeout: "1 minute",
          link: [pipeline],
          environment: {
            STATE_MACHINE_ARN: pipeline.arn,
          },
          permissions: [
            {
              actions: ["states:StartExecution"],
              resources: [pipeline.arn],
            },
          ],
        },
      });
    }
  },
});
