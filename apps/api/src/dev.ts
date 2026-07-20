import { serverEnv } from "@acme/env";
import { createLogger } from "@acme/logger";
import { serve } from "@hono/node-server";

import { app } from "./app";

const port = serverEnv.API_PORT ?? 5000;
const logger = createLogger({ service: "api" });

serve({ fetch: app.fetch, port }, (info) => {
  logger.info("api.started", { port: info.port });
});
