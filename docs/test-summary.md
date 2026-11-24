# Furnique Studio — test execution summary

**Execution date:** 2026-11-24  
**Environment:** Windows; Java/Maven; Node.js; local packaged JAR; no cloud resources or live payment credentials.

## Results

| Suite | Result | Notes |
|---|---|---|
| Maven `clean verify` | PASS — 38 tests, 0 failures, 0 errors, 0 skipped | Java source/target 1.8; executable shaded JAR created |
| JaCoCo | 29% instruction / 30% line / 33% branch coverage | 1,280/4,411 instructions, 258/862 lines, and 137/412 branches covered; whole bundle includes HTTP, PostgreSQL, and GCS code not exercised by unit tests |
| API smoke | PASS — 36/36 | Health, catalog, static pages, commerce, customer registration/login/logout, admin login/orders, role isolation, and cross-origin rejection |
| Concurrent health probe | PASS — 200/200 | 0.598 seconds observed (334.6 requests/second) on the final local run; not a capacity/SLA claim |
| Newsletter consent browser check | PASS | Form invalid without checked consent; valid and submits after opt-in |
| Registration mobile layout | PASS | At a 320 CSS-pixel browser viewport, measured document and body widths were both 305 px; no horizontal overflow observed |
| Authentication browser flows | PASS | Created a synthetic customer account, signed in/out, and signed in as the configured synthetic admin to view a test order |
| Earlier browser checks | PASS | Home, Shop, Living/Dining/Bedroom category filters, About, Journal, Contact, and admin/storefront demo flows were checked in the prior work session |
| Cloud / external services | NOT RUN | No Google Cloud project, billing approval, live SQL instance, bucket, or credentials provided |
| Human usability / production security | NOT RUN | No participant evidence or independent security review; do not claim these activities occurred |

## Findings

The initial packaged-JAR launch failed due to retained dependency signatures. The Shade plugin now strips signature metadata and merges service descriptors; the rebuilt JAR starts and the smoke suite passes. The cross-origin sign-in check returned HTTP 403 as expected, and the final registration viewport check showed no overflow. The Java source test suite confirms the Windows file-replacement regression is fixed. Full details are in [defect-log.md](./defect-log.md).

## Coverage interpretation and next tests

JaCoCo reports 1,280 covered / 4,411 instructions (29%), 258 covered / 862 lines (30%), and 137 covered / 412 branches (33%). The API smoke suite ran against the packaged server but did not collect JaCoCo instrumentation. Add focused HTTP handler, PostgreSQL integration, GCS backup, and restart/recovery tests before treating the overall coverage as comprehensive. Run real-user usability sessions and cloud integration checks only in a clearly isolated, approved demo environment.

## Reproducibility

Run the commands in [test-plan.md](./test-plan.md). The API scripts are [api-smoke.js](../tests/api-smoke.js) and [load-test.js](../tests/load-test.js); the 38 unit and authentication cases and results are in [test-cases.csv](./test-cases.csv).
