import { serverEnv } from "@acme/env";
import { serve } from "@hono/node-server";

import { app } from "./app";

const port = serverEnv.API_PORT ?? 5000;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
