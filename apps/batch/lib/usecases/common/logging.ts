/** Structured log line for step debugging / audit (safe to call from any use-case handler). */
export function logStepPayload(scope: string, event: unknown): void {
  console.log(`[${scope}]`, JSON.stringify({ event }));
}
