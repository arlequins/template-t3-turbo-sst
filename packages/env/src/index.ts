/**
 * Shared env: {@link serverEnv} (server/tooling), {@link clientEnv} (`NEXT_PUBLIC_*`), helpers.
 */

import { clientEnv } from "./env-client.js";
import { serverEnv } from "./env-server.js";

export { clientEnv } from "./env-client.js";
export { loadDatabaseEnv, type DatabaseEnv } from "./database.js";
export {
  DEFAULT_LOCALHOST_API_URL,
  DEFAULT_LOCALHOST_SITE_URL,
} from "./public-defaults.js";
export {
  DEFAULT_NITRO_PRESET,
  DEFAULT_SST_AWS_REGION,
  globalEnv,
  nitroPreset,
  serverEnv,
  sstAwsRegion,
} from "./env-server.js";
export { skipEnvValidation } from "./skip-validation.js";
export {
  Stage,
  DEFAULT_DEPLOY_STAGE,
  DEFAULT_RAW_SST_STAGE,
  DEPLOY_STAGES,
  type DeployStage,
  rawSstStage,
  resolveDeployStage,
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
  DATABASE_SSL: serverEnv.DATABASE_SSL!,

  NEXT_PUBLIC_SITE_URL: clientEnv.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: clientEnv.NEXT_PUBLIC_API_URL,
};
