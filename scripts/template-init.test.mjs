import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  initializeTemplate,
  parseArgs,
  pathsToPrune,
  resolveFeatures,
  transformContent,
  validateOptions,
} from "./template-init.mjs";

describe("template:init", () => {
  it("parses and validates explicit options", () => {
    const options = parseArgs([
      "--",
      "--name",
      "customer-portal",
      "--scope",
      "@company",
      "--dry-run",
    ]);
    assert.equal(options.dryRun, true);
    assert.doesNotThrow(() => validateOptions(options));
    assert.throws(() =>
      validateOptions({ name: "Bad Name", scope: "company" }),
    );
  });

  it("plans physical feature removal only when prune mode is enabled", () => {
    assert.deepEqual(pathsToPrune({ preset: "minimal" }), []);
    const paths = pathsToPrune({ preset: "minimal", prune: true });
    assert.ok(paths.includes("apps/batch"));
    assert.ok(paths.includes("packages/auth"));
    assert.ok(paths.includes("tooling/sst-bootstrap"));
    assert.ok(paths.includes("pnpm-lock.yaml"));
  });

  it("supports a minimal preset and independently selected features", async () => {
    assert.deepEqual([...resolveFeatures({ preset: "minimal" })], []);
    assert.deepEqual(
      [...resolveFeatures({ features: "auth,sst" })],
      ["auth", "sst"],
    );
    assert.throws(() => resolveFeatures({ features: "unknown" }));

    const router = transformContent(
      "packages/trpc/src/router/post.ts",
      'import { protectedProcedure, publicProcedure } from "../trpc";\nconst create = protectedProcedure;\n',
      { name: "app", scope: "@company", preset: "minimal" },
    );
    assert.doesNotMatch(router, /protectedProcedure/);

    const rootPackage = transformContent(
      "package.json",
      JSON.stringify({
        name: "template-t3-turbo-sst",
        scripts: {
          "batch:run": "batch",
          "dev:sst": "sst",
          "sst:ws": "sst",
          test: "test",
          "test:sst": "sst-test",
        },
      }),
      { name: "app", scope: "@company", preset: "minimal" },
    );
    assert.deepEqual(JSON.parse(rootPackage).scripts, { test: "test" });

    const scopedPackage = transformContent(
      "apps/batch/package.json",
      JSON.stringify({
        dependencies: {
          "@acme/env": "workspace:*",
          "@aws-sdk/client-sfn": "latest",
        },
      }),
      { name: "app", scope: "@company" },
    );
    assert.deepEqual(Object.keys(JSON.parse(scopedPackage).dependencies), [
      "@aws-sdk/client-sfn",
      "@company/env",
    ]);

    const trpcProvider = transformContent(
      "apps/web/src/trpc/react.tsx",
      await readFile(
        new URL("../apps/web/src/trpc/react.tsx", import.meta.url),
        "utf8",
      ),
      { name: "app", scope: "@company", preset: "minimal" },
    );
    assert.doesNotMatch(trpcProvider, /useAuth|access_token|\[user\]/);
    assert.match(trpcProvider, /headers: \(\) => new Headers\(\)/);
  });

  it("previews without writing and then initializes tracked text files", async () => {
    const root = await mkdtemp(join(tmpdir(), "template-init-"));
    const packagePath = join(root, "package.json");
    const sstPath = join(root, "apps/web/sst.config.ts");
    await mkdir(join(root, "apps/web"), { recursive: true });
    await writeFile(
      packagePath,
      '{"name":"template-t3-turbo-sst","dependencies":{"@acme/env":"workspace:*"}}\n',
    );
    await writeFile(sstPath, 'name: "web"; // example.com @acme/web\n');
    const files = ["package.json", "apps/web/sst.config.ts"];
    const options = {
      name: "customer-portal",
      scope: "@company",
      domain: "customer.example.org",
      description: "Customer portal",
    };

    assert.deepEqual(
      await initializeTemplate({ ...options, dryRun: true }, { root, files }),
      files,
    );
    assert.match(await readFile(packagePath, "utf8"), /template-t3-turbo-sst/);

    await initializeTemplate(options, { root, files });
    assert.deepEqual(JSON.parse(await readFile(packagePath, "utf8")), {
      name: "customer-portal",
      description: "Customer portal",
      dependencies: { "@company/env": "workspace:*" },
    });
    assert.equal(
      await readFile(sstPath, "utf8"),
      'name: "customer-portal-web"; // customer.example.org @company/web\n',
    );
  });

  it("removes pruned paths and their package dependencies", async () => {
    const root = await mkdtemp(join(tmpdir(), "template-prune-"));
    const packagePath = join(root, "apps/web/package.json");
    const authPath = join(root, "packages/auth/index.ts");
    await mkdir(join(root, "apps/web"), { recursive: true });
    await mkdir(join(root, "packages/auth"), { recursive: true });
    await writeFile(
      packagePath,
      JSON.stringify({
        name: "@acme/web",
        scripts: { "sst:dev": "sst dev" },
        dependencies: {
          "@acme/validators": "workspace:*",
          "@tanstack/react-form": "catalog:",
          "oidc-client-ts": "catalog:",
          react: "catalog:react19",
        },
        devDependencies: { sst: "1.0.0" },
      }),
    );
    await writeFile(authPath, "export const auth = true;\n");

    await initializeTemplate(
      {
        name: "app",
        scope: "@company",
        preset: "minimal",
        prune: true,
      },
      { root, files: ["apps/web/package.json", "packages/auth/index.ts"] },
    );

    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    assert.deepEqual(packageJson.dependencies, { react: "catalog:react19" });
    assert.deepEqual(packageJson.devDependencies, {});
    assert.deepEqual(packageJson.scripts, {});
    await assert.rejects(access(join(root, "packages/auth")));
  });
});
