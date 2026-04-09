/// <reference path="./sst-globals.d.ts" />

import {
  serverEnv,
  sstAwsRegion,
  sstStageForResourceNames,
  Stage,
  vpcFromEnv,
} from "@acme/env";

import type { BatchPipelineStep } from "./steps/types";
import { REGISTERED_BATCHES } from "./config/registry";
import { HandlerMap } from "./lib";
import { BATCH_TASK_RETRY_POLICY } from "./shared";

/**
 * Default: pass the Task’s state input into `HandlerInvokeEvent.input`.
 * Override per step in the manifest with a JSONata string or a static object.
 */
function pipelineStepPayloadInput(step: BatchPipelineStep): unknown {
  return step.input === undefined ? "{% $states.input %}" : step.input;
}

/**
 * Each registry entry = one Step Functions state machine (`sst.aws.StepFunctions`) + its own schedule.
 * @see https://sst.dev/docs/component/aws/step-functions/
 *
 * The schedule Lambda receives `STATE_MACHINE_ARN` and `states:StartExecution` on that ARN
 * (same idea as wiring Cron `job` with `environment` + `permissions`).
 *
 * Pipeline steps: one Lambda per **handler** (`handlerKey`); register paths in `lib/index.ts` (`HandlerMap`).
 * If `SUBNET_IDS` / `SECURITY_GROUP_IDS` are empty, Lambdas are not placed in a VPC.
 */
export default $config({
  app(input) {
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
    /** Matches repo-root `.env` `SST_STAGE` (Turbo / `pnpm with-env`). */
    const stage = sstStageForResourceNames();

    const attach = vpcFromEnv();
    const vpc = attach
      ? {
          privateSubnets: attach.subnetIds,
          securityGroups: attach.securityGroups,
        }
      : undefined;

    /** One Lambda per `handlerKey` (shared across batches that reference the same key). */
    const handlerFns = new Map<string, unknown>();
    for (const [key, handler] of Object.entries(HandlerMap)) {
      handlerFns.set(
        key,
        new sst.aws.Function([stage, "sfn", "uc", key].join("-"), {
          handler,
          timeout: "5 minutes",
          ...(vpc ? { vpc } : {}),
        }),
      );
    }

    /** One Lambda for all pipelines; `batchId` is passed in `lambdaInvoke.payload` per state machine. */
    const pipelineFailureFn = new sst.aws.Function(
      [stage, "sfn", "pipelineFailure"].join("-"),
      {
        handler: "lib/functions/common/pipeline-failure.ts",
        timeout: "1 minute",
        ...(vpc ? { vpc } : {}),
      },
    );

    for (const manifest of REGISTERED_BATCHES) {
      const failureHandled = sst.aws.StepFunctions.succeed({
        name: "PipelineFailureHandled",
      });

      const pipelineFailureAlert = sst.aws.StepFunctions.lambdaInvoke({
        name: "PipelineFailureAlert",
        function: pipelineFailureFn,
        payload: {
          batchId: manifest.id,
          stepFunctionsInput: "{% $states.input %}",
        },
      }).next(failureHandled);

      let chain = sst.aws.StepFunctions.succeed({ name: "PipelineSucceeded" });
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
            batchId: manifest.id,
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

      const pipeline = new sst.aws.StepFunctions(
        manifest.pipelineComponentName,
        {
          definition: chain,
        },
      );

      new sst.aws.CronV2(manifest.cronComponentName, {
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
