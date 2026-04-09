import type { Handler } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const client = new SFNClient({});

function requireStateMachineArn(): string {
  const arn = process.env.STATE_MACHINE_ARN?.trim();
  if (!arn) {
    throw new Error(
      "STATE_MACHINE_ARN is required (set by CronV2 in sst.config.ts)",
    );
  }
  return arn;
}

/**
 * Cron target: starts one execution of this batch’s state machine.
 * ARN comes from `environment.STATE_MACHINE_ARN` on the Function (see `sst.config.ts`).
 */
export const handler: Handler = async () => {
  await client.send(
    new StartExecutionCommand({
      stateMachineArn: requireStateMachineArn(),
      name: `cron-${Date.now()}`,
    }),
  );
};
