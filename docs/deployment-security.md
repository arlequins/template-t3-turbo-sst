# Deployment and Supply-Chain Security

## AWS OIDC setup

Create separate AWS IAM roles for preview and production. Configure GitHub's OIDC provider as the federated principal and restrict the `sub` claim to this repository. Use `repo:OWNER/REPOSITORY:pull_request` for preview and `repo:OWNER/REPOSITORY:environment:production` for production.

Store role ARNs as GitHub variables. Role ARNs identify resources and are not credentials:

- repository: `AWS_PREVIEW_ROLE_ARN`
- `production` environment: `AWS_PRODUCTION_ROLE_ARN`

Set `AWS_REGION` as an environment variable. Do not store AWS access keys in GitHub.

Start with the trust-policy template in [`docs/iam/github-oidc-trust-policy.json`](./iam/github-oidc-trust-policy.json). Replace placeholders before applying it. The deployment permission policy is intentionally not universal: generate it from CloudTrail after a sandbox deployment, then constrain actions and resources to the stacks, state bucket, asset bucket, and roles owned by this repository.

## Environments and branch protection

Create a `production` GitHub Environment with required reviewers, prevent self-review, restrict deployment to protected release branches or tags, and configure an approval timeout. Protect `main` and `develop`, require the CI and Security checks, require review, dismiss stale approvals, and disallow force pushes.

Preview deployments only run for branches in the same repository. Fork pull requests never receive AWS credentials. A closed pull request removes its `pr-NUMBER` stage.

## Security checks

The Security workflow performs dependency review, CodeQL analysis, full-history secret scanning, production-license policy validation, and SPDX JSON SBOM generation. Repository administrators should also enable GitHub secret scanning and push protection.

The license policy rejects AGPL and GPL production dependencies by default. Adjust `scripts/check-licenses.mjs` only after legal review.

## Headers and CSP

The Hono API uses `secureHeaders` and strict CORS. For the statically exported web application, configure a CloudFront response-headers policy with HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame restrictions, and a tested Content Security Policy. Start CSP in report-only mode because OIDC issuer and API origins vary by generated project, then enforce it after collecting violations. Do not hard-code a template-wide production issuer.
