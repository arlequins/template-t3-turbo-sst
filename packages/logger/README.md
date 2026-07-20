# `@acme/logger`

Small structured JSON logger shared by server applications and packages.

- Create one root logger per process with `createLogger({ service })`.
- Create child loggers for request IDs, batch IDs, and components.
- Use stable event names such as `http.request.completed` instead of prose messages.
- Pass identifiers and counts as fields. Do not log request bodies or authentication data.
- Keys containing authorization, cookies, passwords, secrets, tokens, or API keys are redacted recursively.

Applications can inject a custom `sink` for tests or for a future telemetry transport.
