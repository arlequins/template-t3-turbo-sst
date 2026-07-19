/**
 * Shared env: {@link serverEnv} (server/tooling), {@link clientEnv} (`NEXT_PUBLIC_*`), helpers.
 */

import { clientEnv } from "./env-client.js";
import { serverEnv } from "./env-server.js";

export { type DatabaseEnv, loadDatabaseEnv } from "./database.js";
export { clientEnv } from "./env-client.js";
export {
  DEFAULT_SST_AWS_REGION,
  globalEnv,
  serverEnv,
  sstAwsRegion,
} from "./env-server.js";
export {
  DEFAULT_LOCALHOST_API_URL,
  DEFAULT_LOCALHOST_SITE_URL,
} from "./public-defaults.js";
export { skipEnvValidation } from "./skip-validation.js";
export {
  DEFAULT_DEPLOY_STAGE,
  DEFAULT_RAW_SST_STAGE,
  DEPLOY_STAGES,
  type DeployStage,
  rawSstStage,
  resolveDeployStage,
  Stage,
  sstStageForResourceNames,
} from "./stage.js";
export { parseAwsIdList, vpcFromEnv, vpcIdFromEnv } from "./vpc.js";

export const LambdaEnvironment = {
  NODE_ENV: "production",
  DATABASE_HOST: serverEnv.DATABASE_HOST!,
  DATABASE_PORT: serverEnv.DATABASE_PORT!,
  DATABASE_USER: serverEnv.DATABASE_USER!,
  DATABASE_PASSWORD: serverEnv.DATABASE_PASSWORD!,
  DATABASE_NAME: serverEnv.DATABASE_NAME!,
  API_CORS_ORIGINS:
    serverEnv.API_CORS_ORIGINS ?? clientEnv.NEXT_PUBLIC_SITE_URL,

  NEXT_PUBLIC_SITE_URL: clientEnv.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: clientEnv.NEXT_PUBLIC_API_URL,
};
