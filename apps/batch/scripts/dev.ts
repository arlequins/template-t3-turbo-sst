import { resolve } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

import { RegisteredManifests } from "../config";
import { HandlerMap } from "../lib";

type HandlerFn = (
  event: unknown,
  context?: unknown,
  callback?: unknown,
) => unknown;

const PASSTHROUGH_INPUT = "{% $states.input %}";

type StepCandidate = {
  batchId: string;
  stateName: string;
  handlerKey: keyof typeof HandlerMap;
  configuredInput: unknown;
};

function parseArgs(argv: string[]): { batchId?: string; stepId?: string } {
  let batchId: string | undefined;
  let stepId: string | undefined;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--batch") {
      batchId = argv[i + 1];
      i += 1;
      continue;
    }
    if (argv[i] === "--step") {
      stepId = argv[i + 1];
      i += 1;
    }
  }
  return { batchId, stepId };
}

function stepCandidates(batchId?: string): StepCandidate[] {
  return RegisteredManifests.flatMap((manifest) =>
    batchId && manifest.id !== batchId
      ? []
      : manifest.steps.map((step) => ({
          batchId: manifest.id,
          stateName: step.stateName,
          handlerKey: step.handlerKey,
          configuredInput: step.input,
        })),
  );
}

async function loadHandler(handlerPath: string): Promise<HandlerFn> {
  const absolute = resolve(process.cwd(), handlerPath);
  const mod = (await import(pathToFileURL(absolute).href)) as {
    handler?: HandlerFn;
  };
  if (typeof mod.handler !== "function") {
    throw new Error(`No exported handler function in: ${handlerPath}`);
  }
  return mod.handler;
}

function previewInput(value: unknown): string {
  if (value === undefined || value === PASSTHROUGH_INPUT) {
    return "passthrough ($states.input)";
  }
  return JSON.stringify(value);
}

async function main(): Promise<void> {
  const { batchId, stepId } = parseArgs(process.argv.slice(2));
  const steps = stepCandidates(batchId);
  if (steps.length === 0) {
    const ids = RegisteredManifests.map((m) => m.id).join(", ");
    throw new Error(
      batchId
        ? `No steps found for batch "${batchId}". Available batches: ${ids}`
        : "No steps found in RegisteredManifests.",
    );
  }

  console.info(
    batchId
      ? `\nBatch step definitions (filtered by --batch ${batchId}):`
      : "\nBatch step definitions:",
  );
  steps.forEach((step, index) => {
    console.info(
      `${index + 1}. [${step.batchId}] ${step.stateName} (${step.handlerKey}) input=${previewInput(step.configuredInput)}`,
    );
  });

  const rl = createInterface({ input, output });
  try {
    let step: StepCandidate | undefined;
    if (stepId) {
      step = steps.find((candidate) => candidate.stateName === stepId);
      if (!step) {
        const available = steps
          .map((candidate) => candidate.stateName)
          .join(", ");
        throw new Error(
          `Step "${stepId}" not found. Available step ids: ${available}`,
        );
      }
      console.info(`\n[LocalStep] selected by --step: ${step.stateName}`);
    } else {
      const selectedRaw = await rl.question("\nSelect step number to run: ");
      const selected = Number.parseInt(selectedRaw, 10);
      if (Number.isNaN(selected) || selected < 1 || selected > steps.length) {
        throw new Error(`Invalid selection: ${selectedRaw}`);
      }
      step = steps[selected - 1];
      if (!step) {
        throw new Error(`Step not found for selection: ${selected}`);
      }
    }

    const overrideRaw = await rl.question(
      "Optional JSON override for event.input (Enter = use configured input): ",
    );

    let stepInput: unknown;
    if (overrideRaw.trim() !== "") {
      stepInput = JSON.parse(overrideRaw);
    } else if (
      step.configuredInput === undefined ||
      step.configuredInput === PASSTHROUGH_INPUT
    ) {
      stepInput = {};
    } else {
      stepInput = step.configuredInput;
    }

    const event = {
      batchId: step.batchId,
      stateName: step.stateName,
      input: stepInput,
    };

    const handlerPath = HandlerMap[step.handlerKey];
    const handler = await loadHandler(handlerPath);

    console.info(`\n[LocalStep] -> [${step.batchId}] ${step.stateName}`);
    console.info(`[LocalStep]    event=${JSON.stringify(event)}`);
    const result = await Promise.resolve(handler(event, {}));
    console.info(`[LocalStep] <- output=${JSON.stringify(result)}`);
  } finally {
    rl.close();
  }
}

main().catch((error: unknown) => {
  console.error("[LocalStep] failed", error);
  process.exitCode = 1;
});
