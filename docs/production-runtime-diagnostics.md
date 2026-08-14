# Production Lambda runtime diagnostics

The protected `Production Lambda runtime diagnostics` workflow reads a bounded
window of CloudWatch Lambda events around a failed deployment run. It is a
diagnostic path, not a deployment path, and it must run only from `main` in the
protected `production` Environment.

Provide the failed deployment run ID, select `api` or `batch`, and confirm with
`production`. The workflow uses GitHub OIDC, never reads deployment secrets,
does not upload raw log files, and redacts private keys, bearer tokens, and
secret-shaped assignments before printing events to the protected run log.

The production deployment role needs only the following additional read
boundary for the selected application:

- `logs:DescribeLogGroups` in the deployment region (the AWS API does not
  support resource-level authorization);
- `logs:FilterLogEvents` on `/aws/lambda/api-production-*` and/or
  `/aws/lambda/batch-production-*` log groups and their streams.

Do not grant `logs:PutLogEvents`, log deletion, wildcard CloudWatch access, or
access to unrelated log groups. If the workflow reports no matching groups,
inspect the SST-generated function names and update the exact policy boundary
before retrying.
