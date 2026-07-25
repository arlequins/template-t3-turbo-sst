import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PlaceholderRules = [
  { label: "template package scope", pattern: /@acme(?:\/|\b)/g },
  { label: "template product name", pattern: /\bAcme Workspace\b/g },
  { label: "template user identity", pattern: /\bTemplate User\b/g },
  {
    label: "example domain",
    pattern: /\b(?:example\.(?:com|org|test)|your-domain\.com)\b/g,
  },
  {
    label: "example social profile",
    pattern: /(?:github\.com|linkedin\.com\/in)\/(?:example|your-[a-z-]+)/g,
  },
];

export const DefaultPlaceholderTargets = [
  "apps/web/src/config/brand.config.ts",
  "apps/blog/src/config/brand.config.ts",
];

export function findPlaceholders(source, rules = PlaceholderRules) {
  return rules.flatMap(({ label, pattern }) =>
    [...source.matchAll(pattern)].map((match) => ({
      label,
      value: match[0],
    })),
  );
}

export async function checkPlaceholderFiles(paths, cwd = process.cwd()) {
  const findings = [];
  for (const path of paths) {
    try {
      const source = await readFile(resolve(cwd, path), "utf8");
      findings.push(
        ...findPlaceholders(source).map((finding) => ({ ...finding, path })),
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue;
      }
      throw error;
    }
  }
  return findings;
}

function parseArgs(args) {
  const strict = args.includes("--strict");
  const paths = args.filter((argument) => !argument.startsWith("--"));
  return {
    paths: paths.length > 0 ? paths : [...DefaultPlaceholderTargets],
    strict,
  };
}

async function main() {
  const { paths, strict } = parseArgs(process.argv.slice(2));
  const findings = await checkPlaceholderFiles(paths);
  if (findings.length === 0) {
    console.log("Placeholder check passed");
    return;
  }

  const detail = findings
    .map(
      ({ label, path, value }) =>
        `- ${path}: ${JSON.stringify(value)} (${label})`,
    )
    .join("\n");
  const message = `Replace template placeholders before deployment:\n${detail}`;
  if (strict) throw new Error(message);
  console.warn(message);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
