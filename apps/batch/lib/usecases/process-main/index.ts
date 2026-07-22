import { db } from "@acme/db-backbone/client";
import { createDrizzlePostRepository } from "@acme/db-backbone/post-repository";
import { createLogger } from "@acme/logger";
import { createPostService } from "@acme/service";

import type { ProcessMainEvent } from "../../functions/process-main";

const logger = createLogger({
  service: "batch",
  bindings: { component: "process-main" },
});
const postService = createPostService({
  logger: logger.child({ component: "post-service" }),
  repository: createDrizzlePostRepository(db),
});

export async function processMain(payload: ProcessMainEvent): Promise<void> {
  const runLogger = logger.child({ batchId: payload.batchId });
  runLogger.info("batch.process.started", { inputType: payload.input.type });

  if (payload.input.type === "raw") {
    runLogger.info("batch.process.completed", { inputType: "raw" });
    return;
  }

  const result = await postService.listPosts();
  runLogger.info("batch.process.completed", {
    inputType: "db",
    resultCount: result.total,
  });
}
