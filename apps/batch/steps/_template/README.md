# Template (copy to `steps/<your-name>/`)

1. Copy this folder next to `default/` and rename it.
2. Replace every `TEMPLATE` placeholder in `manifest.ts` / `constants.ts`.
3. Reuse `default/start-execution.handler.ts` or copy it; `STATE_MACHINE_ARN` is set in root `sst.config.ts` per batch.
4. Add steps under `steps/<step-name>/handler.ts` and rows in `manifest.ts`.
5. Register the manifest in `registry.ts` and add `Resource` typings in `../../sst-env.d.ts`.
