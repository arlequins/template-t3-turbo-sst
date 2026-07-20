#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const preset = process.argv[2];
if (preset !== "full" && preset !== "minimal") {
  console.error("Usage: node scripts/test-template-output.mjs <full|minimal>");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const target = await mkdtemp(join(tmpdir(), `template-${preset}-`));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args, cwd = target) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: "true", HUSKY: "0" },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function copyRepository() {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root, encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean);

  for (const relativePath of files) {
    const source = join(root, relativePath);
    const destination = join(target, relativePath);
    const sourceStat = await stat(source);
    await mkdir(dirname(destination), { recursive: true });
    if (sourceStat.isDirectory())
      await cp(source, destination, { recursive: true });
    else await copyFile(source, destination);
  }
}

async function assertTemplateIdentityRemoved() {
  const forbidden = ["template-t3-turbo-sst", "@acme", "example.com"];
  const files = execFileSync("git", ["ls-files", "-z"], {
    cwd: target,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  const findings = [];

  for (const relativePath of files) {
    const buffer = await readFile(join(target, relativePath));
    if (buffer.includes(0)) continue;
    const source = buffer.toString("utf8");
    for (const token of forbidden) {
      if (source.includes(token)) findings.push(`${relativePath}: ${token}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Template identity remains:\n${findings.join("\n")}`);
  }
}

try {
  await copyRepository();
  run("git", ["init", "--quiet"]);
  run("git", ["config", "user.email", "template-test@example.invalid"]);
  run("git", ["config", "user.name", "Template Test"]);
  run("git", ["add", "."]);
  run("git", ["commit", "--quiet", "-m", "test fixture"]);
  await copyFile(join(target, ".env.example"), join(target, ".env"));

  run(pnpm, [
    "template:init",
    "--",
    "--name",
    `${preset}-app`,
    "--scope",
    "@company",
    "--domain",
    `${preset}.template.test`,
    "--description",
    `${preset} generated application`,
    "--preset",
    preset,
  ]);
  await assertTemplateIdentityRemoved();

  run(pnpm, ["install", "--frozen-lockfile"]);
  for (const command of ["check:fix", "check", "test", "typecheck", "build"]) {
    run(pnpm, [command]);
  }

  console.log(`Generated ${preset} preset passed qualification: ${target}`);
} finally {
  await rm(target, { recursive: true, force: true });
}
