import { describe, expect, it } from "vitest";

import { createPipelineFailureNotifier } from ".";

describe("createPipelineFailureNotifier", () => {
  it("publishes only the allowlisted failure summary", async () => {
    const commands: Array<{
      message: string;
      subject: string;
      topicArn: string;
    }> = [];
    const notify = createPipelineFailureNotifier({
      client: {
        async publish(input) {
          commands.push(input);
        },
      },
      topicArn: "arn:aws:sns:us-east-1:123456789012:application-alerts",
    });

    await notify({
      batchId: "daily-report",
      errorEvent: {
        Cause: "database unavailable",
        Error: "TaskFailed",
        privateToken: "do-not-publish",
        stateName: "PersistReport",
      },
    });

    expect(commands).toHaveLength(1);
    const message = commands[0]?.message ?? "";
    expect(message).toContain("database unavailable");
    expect(message).not.toContain("do-not-publish");
    expect(commands[0]?.topicArn).toContain("application-alerts");
  });

  it("does not publish when no topic is configured", async () => {
    const publish = async () => {
      throw new Error("must not send");
    };
    const notify = createPipelineFailureNotifier({
      client: { publish },
      topicArn: "",
    });

    await expect(
      notify({ batchId: "daily-report", errorEvent: { Error: "failed" } }),
    ).resolves.toBeUndefined();
  });
});
