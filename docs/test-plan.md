# Furnique Studio — test plan

## Purpose and scope

Verify the Java order service, the test-mode HTTP API, the storefront consent update, and the packaged application required for the assignment prototype. This is not a production security certification or live-cloud test.

### In scope

- Order validation, price calculation, promo codes, delivery fee, stock reservation/release, lookup, repository persistence, and concurrent order behavior.
- API health/catalog/static serving, valid and invalid checkout, stock conflict, email-bound lookup, customer registration/login/logout, duplicate registration, customer/admin role isolation, protected admin endpoint, and unknown API routing.
- Cross-origin sign-in rejection and delivery of the customer/admin authentication pages.
- Packaged JAR startup, static page response, required newsletter consent, and mobile horizontal overflow check.
- A bounded 200-request concurrent health endpoint probe.

### Out of scope / not executed

- Live payment gateway, email verification/recovery, real shipping/returns, email delivery, production inventory, PostgreSQL/GCS service integration, public-cloud deployment, cloud recovery, penetration test, real-user usability study, browser/device matrix, and long-duration load/stress testing.

## Test levels and tools

| Level | Tool / location | Coverage |
|---|---|---|
| Unit | JUnit 4 in `java-app/src/test`; Maven Surefire | Order-service and account/password hashing cases |
| Integration / API smoke | Node.js `tests/api-smoke.js` | Commerce and auth HTTP cases against a packaged local JAR |
| Load probe | Node.js `tests/load-test.js` | 200 concurrent requests to `/api/health`; smoke probe only |
| UI acceptance | Integrated browser | newsletter opt-in, home page, mobile overflow; previous session verified page/category navigation and admin/storefront flows |
| Build/package | Maven `clean verify`; Java 8 source/target | tests, JaCoCo report, shaded executable JAR |

## Environment and test data

- Windows host; Java 8 runtime; Maven 3.9.9; Node.js 20.
- Local test server on port `8099`, isolated temporary data directory, synthetic customer accounts, and ephemeral admin credentials/token; never a production secret or real personal information.
- Java unit tests use `TemporaryFolder`, seeded in-memory `ProductCatalog`, and `FileOrderRepository`.
- Test orders use synthetic names/emails/addresses. Payment modes are `TEST_SUCCESS` and `TEST_FAIL`; no gateway is contacted.

## Execution

```powershell
$env:MAVEN_OPTS='-Djavax.net.ssl.trustStoreType=Windows-ROOT'
& 'C:\Users\91635\.copilot\session-state\bb6592fc-c441-4bd6-9d80-0a2c8b51507c\files\tools\apache-maven-3.9.9\bin\mvn.cmd' -f 'java-app\pom.xml' clean verify
node 'tests\api-smoke.js' 'http://127.0.0.1:8099'
node 'tests\load-test.js' 'http://127.0.0.1:8099' 200
```

For API tests, launch `java -jar java-app\target\furnique-commerce-1.0.0.jar` with `PORT`, `DATA_DIRECTORY`, `ADMIN_API_TOKEN`, `ADMIN_EMAIL`, and a temporary `ADMIN_PASSWORD` set. Set `COOKIE_SECURE=false` for local HTTP tests. Stop the exact process after tests and remove only its temporary test data.

## Entry and exit criteria

- Entry: source/dependencies available, Java and Maven functional, isolated local test data, no production secrets.
- Exit: Maven build succeeds; all unit tests and auth/commerce API smoke checks pass; required newsletter consent is enforced; no unexpected server process remains. Performance probe is reported as a single bounded run, not a service-level guarantee.
- Any failure is recorded in the defect log with reproduction/evidence and fixed or explicitly accepted before marking the relevant stage complete.

## Acceptance mapping

`docs/test-cases.csv` is the case register. Automated cases map to named JUnit tests; HTTP and UI coverage is separately summarized in `docs/test-summary.md`. Human usability evidence, GCP screenshots, and a demo video require actual participant/cloud activity and are not fabricated.
