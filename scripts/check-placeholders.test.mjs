import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  checkPlaceholderFiles,
  findPlaceholders,
} from "./check-placeholders.mjs";

test("findPlaceholders reports deployable example values", () => {
  const findings = findPlaceholders(`
    name: "Acme Workspace"
    email: "hello@example.org"
    github: "https://github.com/example"
  `);

  assert.deepEqual(
    findings.map(({ label }) => label),
    ["template product name", "example domain", "example social profile"],
  );
});

test("checkPlaceholderFiles ignores missing optional targets", async () => {
  const directory = await mkdtemp(join(tmpdir(), "placeholder-check-"));
  await writeFile(join(directory, "brand.ts"), 'name: "Ready Studio"\n');

  const findings = await checkPlaceholderFiles(
    ["brand.ts", "missing.ts"],
    directory,
  );

  assert.deepEqual(findings, []);
});
