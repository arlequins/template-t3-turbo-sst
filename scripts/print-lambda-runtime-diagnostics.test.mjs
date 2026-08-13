import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatRuntimeDiagnosticEvents,
  redactRuntimeDiagnostic,
} from "./print-lambda-runtime-diagnostics.mjs";

describe("runtime diagnostics redaction", () => {
  it("removes secret-shaped values and bearer tokens", () => {
    const output = redactRuntimeDiagnostic(
      'API_SECRET="hidden" Authorization: Bearer abcdefghijklmnop',
    );
    assert.match(output, /API_SECRET=\[REDACTED\]/);
    assert.match(output, /Authorization: \[REDACTED\]/);
    assert.doesNotMatch(output, /hidden|abcdefghijklmnop/);
  });

  it("bounds and formats CloudWatch events", () => {
    const lines = formatRuntimeDiagnosticEvents(
      {
        events: [
          { timestamp: 0, message: "first" },
          { timestamp: 1_700_000_000_000, message: "second" },
        ],
      },
      "/aws/lambda/api-production-main",
    );
    assert.equal(lines.length, 2);
    assert.match(lines[1], /2023-11-14T22:13:20.000Z second/);
  });
});
