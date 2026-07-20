import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE_NAME = "template-t3-turbo-sst";
const TEMPLATE_SCOPE = "@acme";
const OPTIONAL_FEATURES = ["auth", "batch", "sst", "example-ui"];

export function resolveFeatures(options) {
  if (options.preset === "minimal") return new Set();
  const requested = options.features
    ? options.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean)
    : OPTIONAL_FEATURES;
  const unknown = requested.filter(
    (feature) => !OPTIONAL_FEATURES.includes(feature),
  );
  if (unknown.length > 0)
    throw new Error(`Unknown features: ${unknown.join(", ")}`);
  return new Set(requested);
}

export function parseArgs(args) {
  const options = { dryRun: false, force: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--") continue;
    if (argument === "--dry-run") options.dryRun = true;
    else if (argument === "--force") options.force = true;
    else if (argument?.startsWith("--")) {
      const key = argument.slice(2);
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`Missing value for ${argument}`);
      options[key] = value;
      index += 1;
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

export function validateOptions(options) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(options.name ?? "")) {
    throw new Error("--name must be a lowercase npm-safe slug");
  }
  if (!/^@[a-z0-9][a-z0-9._-]*$/.test(options.scope ?? "")) {
    throw new Error("--scope must be an npm scope such as @company");
  }
  if (options.domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(options.domain)) {
    throw new Error("--domain must be a hostname such as example.org");
  }
  if (
    options.preset &&
    options.preset !== "full" &&
    options.preset !== "minimal"
  ) {
    throw new Error("--preset must be full or minimal");
  }
  resolveFeatures(options);
}

export function transformContent(relativePath, source, options) {
  const features = resolveFeatures(options);
  let output = source
    .split(TEMPLATE_SCOPE)
    .join(options.scope)
    .split(TEMPLATE_NAME)
    .join(options.name);
  if (options.domain) output = output.split("example.com").join(options.domain);

  const appName = new Map([
    ["apps/web/sst.config.ts", "web"],
    ["apps/api/sst.config.ts", "api"],
    ["apps/batch/sst.config.ts", "batch"],
    ["tooling/sst-bootstrap/sst.config.ts", "bootstrap"],
  ]).get(relativePath);
  if (appName) {
    output = output.replace(
      `name: "${appName}"`,
      `name: "${options.name}-${appName}"`,
    );
  }

  if (relativePath === "package.json") {
    const packageJson = JSON.parse(output);
    packageJson.name = options.name;
    if (options.description) packageJson.description = options.description;
    if (!features.has("batch")) delete packageJson.scripts["batch:run"];
    if (!features.has("sst")) {
      delete packageJson.scripts["dev:sst"];
      delete packageJson.scripts["env:pull"];
      delete packageJson.scripts["env:push"];
    }
    output = `${JSON.stringify(packageJson, undefined, 2)}\n`;
  }

  if (!features.has("auth")) {
    if (relativePath === "packages/trpc/src/trpc.ts") {
      output = output
        .replace(/import \{ authApi \} from "[^"]+\/auth";\n/, "")
        .replace(
          / {2}const session = await authApi\.getSession\(\{\n {4}headers: opts\.headers,\n {2}\}\);\n/,
          "",
        )
        .replace("    authApi,\n", "")
        .replace("    session,\n", "")
        .replace("initTRPC, TRPCError", "initTRPC")
        .replace(
          /export const protectedProcedure = t\.procedure[\s\S]*$/,
          "export const protectedProcedure = publicProcedure;\n",
        );
    }
    if (relativePath === "packages/trpc/src/root.ts") {
      output = output
        .replace('import { authRouter } from "./router/auth";\n', "")
        .replace("  auth: authRouter,\n", "");
    }
    if (relativePath === "packages/trpc/src/router/post.ts") {
      output = output
        .replace(
          'import { protectedProcedure, publicProcedure } from "../trpc";',
          'import { publicProcedure } from "../trpc";',
        )
        .replaceAll("protectedProcedure", "publicProcedure");
    }
    if (relativePath === "packages/trpc/src/router/auth.ts") {
      output =
        'import type { TRPCRouterRecord } from "@trpc/server";\n\nimport { publicProcedure } from "../trpc";\n\nexport const authRouter = {\n  me: publicProcedure.query(() => null),\n} satisfies TRPCRouterRecord;\n';
    }
    if (relativePath === "apps/web/src/app/layout.tsx") {
      output = output
        .replace('import { OidcAuthProvider } from "~/auth/provider";\n', "")
        .replace(
          "          <OidcAuthProvider>\n            <TRPCReactProvider>{props.children}</TRPCReactProvider>\n          </OidcAuthProvider>",
          "          <TRPCReactProvider>{props.children}</TRPCReactProvider>",
        );
    }
    if (relativePath === "apps/web/src/app/page.tsx") {
      output = output
        .replace('import { AuthStatus } from "~/auth/status";\n', "")
        .replace("        <AuthStatus />\n", "");
    }
    if (relativePath === "apps/web/src/auth/status.tsx") {
      output = "export function AuthStatus() {\n  return null;\n}\n";
    }
  }

  if (
    !features.has("example-ui") &&
    relativePath === "apps/web/src/app/page.tsx"
  ) {
    const authImport = features.has("auth")
      ? 'import { AuthStatus } from "~/auth/status";\n'
      : "";
    const authStatus = features.has("auth") ? "      <AuthStatus />\n" : "";
    output = `"use client";\n\n${authImport}import { env } from "~/env";\n\nexport default function HomePage() {\n  return (\n    <main className="container py-16">\n${authStatus}      <h1 className="text-4xl font-bold">${options.name}</h1>\n      <p className="text-muted-foreground mt-4">\n        API: {env.NEXT_PUBLIC_API_URL}\n      </p>\n    </main>\n  );\n}\n`;
  }

  if (relativePath === "template.features.json") {
    output = `${JSON.stringify(
      { preset: options.preset ?? "full", features: [...features] },
      undefined,
      2,
    )}\n`;
  }
  return output;
}

function trackedFiles(root) {
  return execFileSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
}

function assertClean(root) {
  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
  });
  if (status.trim())
    throw new Error(
      "Working tree is not clean. Commit changes or pass --force.",
    );
}

export async function initializeTemplate(options, runtime = {}) {
  validateOptions(options);
  const root = resolve(runtime.root ?? process.cwd());
  if (!options.dryRun && !options.force && !runtime.files) assertClean(root);
  const files = runtime.files ?? trackedFiles(root);
  const changed = [];

  for (const relativePath of files) {
    const path = resolve(root, relativePath);
    const buffer = await readFile(path);
    if (buffer.includes(0)) continue;
    const source = buffer.toString("utf8");
    const output = transformContent(relativePath, source, options);
    if (source === output) continue;
    changed.push(relativePath);
    if (!options.dryRun) await writeFile(path, output, "utf8");
  }
  return changed;
}

const isCli =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isCli) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const changed = await initializeTemplate(options);
    console.log(
      `${options.dryRun ? "Would update" : "Updated"} ${changed.length} files:`,
    );
    for (const file of changed) console.log(`- ${file}`);
    if (!options.dryRun)
      console.log("Run pnpm install, pnpm check, and pnpm typecheck next.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    console.error(
      "pnpm template:init -- --name my-app --scope @company [--preset full|minimal] [--features auth,batch,sst,example-ui] [--description text] [--domain example.org] [--dry-run] [--force]",
    );
    process.exitCode = 1;
  }
}
