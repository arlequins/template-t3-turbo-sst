/// <reference path="./sst-globals.d.ts" />

import {
  serverEnv,
  sstAwsRegion,
  sstStageForResourceNames,
  Stage,
  vpcFromEnv,
} from "@acme/env";

import { REGISTERED_BATCHES } from "./config/registry";
import { BATCH_TASK_RETRY_POLICY } from "./shared";

/**
 * Each registry entry = one Step Functions state machine (`sst.aws.StepFunctions`) + its own schedule.
 * @see https://sst.dev/docs/component/aws/step-functions/
 *
 * The schedule Lambda receives `STATE_MACHINE_ARN` and `states:StartExecution` on that ARN
 * (same idea as wiring Cron `job` with `environment` + `permissions`).
 *
 * Step handlers: `steps/<id>/steps/<step-folder>/handler.ts`.
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

    for (const manifest of REGISTERED_BATCHES) {
      const lambdaSteps = manifest.steps.map((step) => ({
        step,
        fn: new sst.aws.Function(
          [stage, "sfn", manifest.id, step.functionId].join("-"),
          {
            handler: step.handler,
            timeout: "5 minutes",
            ...(vpc ? { vpc } : {}),
          },
        ),
      }));

      let chain = sst.aws.StepFunctions.succeed({ name: "PipelineSucceeded" });
      for (const { step, fn } of [...lambdaSteps].reverse()) {
        let task = sst.aws.StepFunctions.lambdaInvoke({
          name: step.stateName,
          function: fn,
        });
        if (step.withRetry) {
          task = task.retry(BATCH_TASK_RETRY_POLICY);
        }
        chain = task.next(chain);
      }

      const pipeline = new sst.aws.StepFunctions(
        manifest.pipelineComponentName,
        {
          definition: chain,
        },
      );

      if (manifest.eventBridgeScheduleEnabled) {
        new sst.aws.CronV2(manifest.cronComponentName, {
          schedule: manifest.schedule,
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
    }
  },
});
