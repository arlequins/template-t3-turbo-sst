import type { BatchManifest } from "../steps/types";
import { sample } from "../steps/sample/manifest";

/** Every batch here gets its own Step Functions + Cron + starter Lambda. Order does not matter. */
export const REGISTERED_BATCHES: BatchManifest[] = [sample];
