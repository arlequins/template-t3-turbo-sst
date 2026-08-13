# Observability

The template combines structured JSON logs, CloudWatch Embedded Metric Format,
and optional OpenTelemetry export.

## OpenTelemetry export

Set `OTEL_EXPORTER_OTLP_ENDPOINT` to the base URL of an OTLP/HTTP collector. The
API sends traces to `/v1/traces` and metrics to `/v1/metrics`. With no endpoint,
the SDK remains disabled and local development has no collector dependency.

| Variable | Purpose |
| --- | --- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP/HTTP collector base URL |
| `OTEL_EXPORTER_OTLP_HEADERS` | Comma-separated, percent-encoded `key=value` headers |
| `OTEL_SERVICE_NAME` | Resource service name; defaults to `api` |
| `OTEL_SERVICE_VERSION` | Optional deployed version |

Use a collector as the stable application endpoint and configure the collector
to forward data to the chosen backend. Store authorization headers in the
deployment secret store, never in committed environment files.

The API starts instrumentation before importing Hono, database, and router
modules. Application spans use `Telemetry.trace`; request counters and duration
histograms are emitted through both OpenTelemetry and CloudWatch EMF.

## Local collector

Any OTLP/HTTP-compatible collector listening on port `4318` can be used locally:

```dotenv
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=api
```

Unset the endpoint to return to the dependency-free local mode.

## Batch failure alerts

The shared Step Functions failure path publishes a small, allowlisted summary to
`ALERT_TOPIC_ARN` after configured retries are exhausted. The batch Lambda gets
`sns:Publish` only on that exact topic ARN and never logs the original
Step Functions input, which may contain application content or credentials.

Configure the topic ARN in the protected deployment environment and subscribe
the topic to the operator's preferred channel (email, incident tooling, or an
HTTPS endpoint). Leaving it unset keeps the failure path operational while
logging an explicit disabled-alert message for local and qualification runs.
