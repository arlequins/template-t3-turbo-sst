# Test Operations

## Test layers

- Unit and contract tests run on every pull request.
- Migration upgrade tests apply the original schema and then migrate to the current schema in an isolated PostgreSQL container.
- Playwright runs the OIDC flow and accessibility checks on desktop and mobile Chromium.
- AWS sandbox smoke tests validate both deployment presets on a schedule and on demand.
- k6 baseline load tests are manual and target a dedicated non-production endpoint.

Configure `AWS_SMOKE_FUNCTION_URL`, `AWS_SMOKE_GATEWAY_URL`, and `LOAD_TEST_API_URL` as repository variables. Do not run load tests against production without an approved capacity and incident plan.

## Flaky-test policy

A failed test is a failure until understood. Retry is diagnostic, not a pass condition. Fix deterministic race, clock, data, and selector issues first. A temporarily quarantined test must have an issue, owner, expiry date, and separate non-blocking job. Do not add arbitrary sleeps; wait on observable state. Track retry rate and remove quarantine before the expiry date.
