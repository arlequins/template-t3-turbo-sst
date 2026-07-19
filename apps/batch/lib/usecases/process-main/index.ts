import { db } from "@acme/db-backbone/client";
import { createPostService } from "@acme/service";

import type { ProcessMainEvent } from "../../functions/process-main";

const postService = createPostService(db);

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

  console.info("ProcessMain completed");
}
