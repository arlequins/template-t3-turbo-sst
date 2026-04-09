import { closeLocalDatabasePool } from "@acme/db/client";
import { postService } from "@acme/service";

import type { ProcessMainEvent } from "../../functions/process-main";

export async function processMain(payload: ProcessMainEvent): Promise<void> {
  console.info(
    "[ProcessMain]",
    JSON.stringify({
      batchId: payload.batchId,
      input: payload.input,
    }),
  );

  if (payload.input.type === "raw") {
    console.info("Processing raw input");
    console.info("ProcessMain completed");
    return;
  }

  console.info("Processing db query");
  const result = await postService.listPosts();
  console.info(result);

  // close db connection
  await closeLocalDatabasePool();

  console.info("ProcessMain completed");
}
