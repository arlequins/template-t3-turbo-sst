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
    linkedin: "https://www.linkedin.com/in/your-profile"
  `);

  assert.deepEqual(
    findings.map(({ label }) => label),
    [
      "template product name",
      "example domain",
      "example social profile",
      "example social profile",
    ],
  );
});

test("findPlaceholders requires an exact social host and profile path", () => {
  const findings = findPlaceholders(`
    github: "https://notgithub.com/example"
    githubNested: "https://github.com/organization/example"
    linkedin: "https://linkedin.com/in/example/posts"
  `);

  assert.deepEqual(findings, []);
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
