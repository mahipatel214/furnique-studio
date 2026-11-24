# Furnique Studio — Google Cloud deployment guide

**Deployment state:** not deployed. This guide and the workflow are a prepared deployment path, not evidence of a live URL. Do not create billable resources until the account owner has reviewed the pricing calculator and approved the project/region.

## Target architecture

- **Cloud Run:** containerized Java app and packaged static site. Start with one region, scale-to-zero behavior, and a conservative max-instance limit for a class demo.
- **Cloud SQL for PostgreSQL:** durable storage for orders and order items. The current product catalogue/stock remains in memory; this is a known demo-only limitation.
- **Cloud Storage:** optional JSON order backups. Use a private bucket with uniform bucket-level access and a dedicated runtime identity.
- **Secret Manager:** `DB_PASSWORD`, `ADMIN_API_TOKEN`, and `ADMIN_PASSWORD`; bind secret access to the Cloud Run runtime service account only.
- **Artifact Registry:** private Docker repository for workflow-built container images.
- **IAM:** separate CI deploy identity (GitHub OIDC / Workload Identity Federation) from the runtime service account. Grant only the roles each needs.
- **Cloud Logging / Monitoring:** request/container logs and service metrics; add alerting for error rate, latency, instance count, and budget notifications.

## Before provisioning

1. Get explicit project-owner approval to use a billing-enabled Google Cloud project and choose a region close to the intended users.
2. Confirm the demo-only scope: no real payments, no production account-recovery flow, and no authoritative multi-instance inventory.
3. Estimate monthly cost in the [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator), including Cloud Run, Cloud SQL (often the persistent baseline cost), disk/backups, Artifact Registry, Cloud Storage, logs, network egress, and taxes/currency.
4. Set a billing budget and alerts. Budgets alert; they do not automatically cap spending. Review the current [Cloud Run](https://cloud.google.com/run/pricing), [Cloud SQL](https://cloud.google.com/sql/pricing), and [Cloud Storage](https://cloud.google.com/storage/pricing) pricing pages before creating resources.
5. Do not put keys, passwords, tokens, service-account JSON, or real personal data in source control or GitHub logs.

## One-time Google Cloud setup

Use the Google Cloud Console or `gcloud` with an authorized project owner. Names and values below are placeholders; replace them only after selecting the project, region, database sizing, and approved budget.

1. Create/select a project and enable billing. Enable Cloud Run, Cloud Build, Artifact Registry, Cloud SQL Admin, Secret Manager, and IAM Credentials APIs.
2. Create a private Artifact Registry Docker repository in the chosen region.
3. Create a Cloud SQL PostgreSQL instance and database named `furnique`. Choose the smallest supported configuration only after reviewing availability, SLA, backup, and price; place it in the Cloud Run region. Configure automated backups and a maintenance window.
4. Create a dedicated runtime service account. Grant it `roles/cloudsql.client`, Secret Manager access only to the required secrets, and `roles/storage.objectCreator` only if backups are enabled. Do not grant project Owner/Editor.
5. Create Secret Manager secrets for `DB_PASSWORD`, `ADMIN_API_TOKEN`, and `ADMIN_PASSWORD`; use a unique admin password with at least 12 characters. Set `ADMIN_EMAIL` as a non-secret GitHub variable. Grant the runtime account access to those exact secrets.
6. Create a private Cloud Storage bucket only if backup upload is required. Enable uniform bucket-level access, public access prevention, lifecycle retention, and encryption defaults; grant the runtime account object-create access.
7. Configure GitHub Workload Identity Federation with an attribute condition restricted to the exact GitHub repository and `main` branch/environment. The deploy principal should have only the required Cloud Run deploy, Artifact Registry write, Cloud Build (if used), and `iam.serviceAccountUser` rights.
8. Configure the repository variables listed below. No JSON service-account key is needed.

## Cloud Run runtime configuration

Use the Cloud SQL JDBC socket factory already present in `java-app/pom.xml`. The deploy workflow injects a URL in this form:

```text
jdbc:postgresql:///furnique?cloudSqlInstance=PROJECT_ID:REGION:INSTANCE_ID&socketFactory=com.google.cloud.sql.postgres.SocketFactory
```

Configure these values through GitHub Actions / Cloud Run, not source files:

| Variable / secret | Value |
|---|---|
| `DB_URL` | JDBC URL above with the real instance connection name |
| `DB_USER` | Database user with only the required database privileges |
| `DB_PASSWORD` | Secret Manager secret reference |
| `ADMIN_API_TOKEN` | Secret Manager secret reference; rotate before/after a public demo |
| `ADMIN_EMAIL` | Administrator email; configured as a non-secret Cloud Run environment variable |
| `ADMIN_PASSWORD` | Unique administrator password injected from Secret Manager; at least 12 characters |
| `COOKIE_SECURE` | Set to `true` for HTTPS Cloud Run service |
| `GCS_BUCKET` | Optional private backup bucket name |
| `PORT` | Supplied by Cloud Run; app defaults to 8080 |

`DB_URL` must be configured for a persistent Cloud SQL order store. Do not use the container filesystem for production data: Cloud Run filesystems are ephemeral. Confirm Cloud SQL connectivity, schema creation, database backups, and restore procedure before considering the service usable.

## GitHub repository variables

Create these repository/environment variables; their values are identifiers, not credentials:

- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_WIF_PROVIDER` (full Workload Identity Provider resource name)
- `GCP_DEPLOYER_SERVICE_ACCOUNT` (CI identity email)
- `CLOUD_RUN_RUNTIME_SERVICE_ACCOUNT` (runtime identity email)
- `GCP_ARTIFACT_REPOSITORY`
- `CLOUD_RUN_SERVICE`
- `CLOUD_SQL_INSTANCE_CONNECTION_NAME` (`project:region:instance`)
- `DB_USER`
- `DB_PASSWORD_SECRET_NAME`
- `ADMIN_TOKEN_SECRET_NAME`
- `ADMIN_PASSWORD_SECRET_NAME`
- `ADMIN_EMAIL`
- `GCS_BUCKET` (optional; omit/leave empty to disable object backups)

The `.github/workflows/google-cloud.yml` workflow runs tests for pushes and pull requests. A push to `main` builds/pushes the image and deploys only when all required GitHub variables and IAM setup exist. Keep the deploy job disabled until the project owner approves charges and configures WIF.

## First deployment and verification

1. Review the workflow diff and ensure the repository is the intended private/public project.
2. Run the Maven verification job; do not deploy if it fails.
3. Trigger the protected `main` deployment only after billing approval and resource setup.
4. Verify the Cloud Run revision is ready and `/api/health` returns `200` with `{"status":"ok","service":"furnique"}`.
5. Run the API smoke suite against the deployment using a non-production test environment. Confirm customer registration/login, customer denial from admin orders, administrator login, unauthenticated `/api/admin/orders` returns `401`, the token-protected endpoint returns `200`, test checkout creates a demo order, and a different email cannot retrieve it.
6. Check Cloud SQL for the created test order, inspect Cloud Logging for errors, and verify any optional backup object in the private bucket.
7. Confirm budget alerts, logging retention, SQL backups, secret rotation, and rollback steps. Remove demo orders and disable public access if the assignment demo is complete.

## Cost worksheet (fill with current calculator results)

No fixed monthly price is claimed here because region, SQL sizing, uptime, traffic, storage, egress, and free-tier eligibility are unknown.

| Cost driver | Calculator inputs to capture |
|---|---|
| Cloud Run | Region, CPU/RAM, request count, average duration, concurrency, min/max instances, billing mode |
| Cloud SQL | Region, PostgreSQL version, vCPU/RAM tier, uptime, storage, backup retention, HA option |
| Cloud Storage | Stored GB, operations, retrieval, lifecycle, egress |
| Artifact Registry | Image storage and retention |
| Network / logging | Internet egress, log ingestion and retention, metrics/alerts |
| Total | Monthly estimate, currency, pricing date, budget threshold, cost owner |

## Rollback and cleanup

- Roll back Cloud Run traffic to the last known-good revision, then verify `/api/health`.
- Keep SQL backups before schema/application changes; perform a restore test, not only a backup-exists check.
- When the assignment demo ends, remove traffic or delete only the specifically approved resources. Export any required assignment evidence before cleanup. Do not delete a shared billing project or unrelated resources.
- The current session store and authentication throttle are process-local. Keep the Cloud Run demo at one instance; use distributed session storage and rate limiting before horizontal scaling.

## Official references

- [Cloud Run and Cloud SQL connection](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Cloud SQL PostgreSQL pricing](https://cloud.google.com/sql/pricing)
- [Cloud Run pricing](https://cloud.google.com/run/pricing)
- [Cloud Storage pricing](https://cloud.google.com/storage/pricing)
- [Google Cloud pricing calculator](https://cloud.google.com/products/calculator)
- [Google Cloud budgets](https://cloud.google.com/billing/docs/how-to/budgets)
- [GitHub Actions authentication to Google Cloud](https://github.com/google-github-actions/auth)
- [Cloud Run deploy action](https://github.com/google-github-actions/deploy-cloudrun)
