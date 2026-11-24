# Furnique Studio — project report

## Abstract

Furnique Studio is a furniture e-commerce concept and student prototype. It combines a multi-page responsive storefront and browser-based administration preview with a Java 8-compatible HTTP service that validates demo orders, calculates totals, reserves sample inventory, simulates payment, and persists orders to a local file or PostgreSQL. The project includes test documentation, container files, a Google Cloud deployment design, and a gated CI/CD workflow. It is not a live store and does not process real payments.

## Objectives and completed scope

- Provide Home, Shop, About, Journal, and Contact pages. Living, Dining, and Bedroom remain filters within Shop.
- Demonstrate product discovery, category filters, saved pieces, cart, promo codes, checkout, order lookup, responsive styling, customer login/registration, and a separate admin sign-in/workspace.
- Implement a Java API with domain/service/repository separation, custom exceptions, PBKDF2 password hashing, HttpOnly sessions, separate configured admin credentials, synchronized sample-stock reservation, test-only payment processing, file and PostgreSQL persistence, protected admin orders, and optional Cloud Storage backups.
- Verify commerce and account rules with 38 JUnit cases, 36 HTTP smoke checks, a bounded 200-request health probe, and browser tests of customer/admin login and required consent.
- Prepare an architecture diagram, startup/e-commerce planning, test plan/case register, defect log, project report, presentation outline, demo script, and Google Cloud deployment package.

## Requirements and implementation summary

| Area | Deliverable / current status |
|---|---|
| Startup and e-commerce planning | Lean Canvas, Business Model Canvas, SWOT, PESTEL, MVP, funding assumptions, DPIIT/IP/compliance readiness, and operating flow documented in `startup-and-ecommerce.md` |
| Customer storefront | Responsive pages, shop filters, product interactions, cart, demo checkout and order lookup |
| Authentication | Server-side customer registration/login; separate server-configured admin login; role-scoped 8-hour process-local sessions |
| Admin | Separate login and server-backed order list; legacy browser preview remains demo-only and is not an authenticated management interface |
| Java core | Java 8 source/target; domain, service, custom exception, repository, payment processor, HTTP server, background backup |
| Persistence | File repository by default; optional PostgreSQL order repository. Product/stock catalog remains in-memory |
| Tests | 38 JUnit tests; API auth/commerce smoke checks; 200 local concurrent health requests. See `test-summary.md` |
| Containers | Dockerfile and Docker Compose for local PostgreSQL and a GCS emulator |
| Cloud | Cloud Run/SQL/Storage/Secret Manager architecture and GitHub Actions WIF deployment workflow prepared; no resources created |
| Security/compliance | Demo/test-only notice, salted PBKDF2 hashes, HttpOnly/SameSite sessions, per-process auth throttling, separate admin credentials, no card fields, required newsletter opt-in, prepared-statement SQL; production controls still incomplete |

## Architecture and technology

The browser uses HTML, CSS, and vanilla JavaScript; the Java server uses the JDK HTTP server and a fixed thread pool. `OrderService` validates order fields, applies two demo promo codes and delivery thresholds, coordinates inventory reservation with a test payment processor, saves successful orders through an `OrderRepository`, and schedules optional backup work on a single-thread executor. The PostgreSQL adapter uses prepared statements; the file adapter supports local persistence. See [architecture.md](./architecture.md).

## Validation results

- `mvn clean verify`: **38 passed, 0 failed/errors/skipped**.
- JaCoCo: **29% instructions, 30% lines, 33% branches** across all 26 analyzed classes.
- API smoke: **36/36 passed** against the rebuilt packaged JAR, including customer/admin authentication and cross-origin rejection.
- Load probe: **200/200** health requests succeeded in one local run; this is not a production performance result.
- Newsletter consent: cannot submit without opt-in; submits after the checkbox is checked.
- Registration page at a 320 CSS-pixel browser viewport: measured document width equals scroll width; no horizontal overflow found. Browser flows also verified registration, customer sign-in, admin sign-in/order viewing, and sign-out.

## Risks and limitations

The catalogue and inventory are sample in-memory data. Orders in the legacy browser admin preview are local to the current browser; the new admin workspace reads server orders but currently offers no management actions. Checkout uses test modes only and customer accounts are not linked to orders. Sessions and throttling are process-local. The system lacks real payment settlement, email verification, password recovery, MFA, account deletion, distributed sessions/rate limits, email/consent withdrawal, fulfilment, legal policies, production inventory, and cloud deployment evidence. Cloud SQL/GCS connectors and Docker Compose have not been tested end-to-end.

## Conclusion and next phase

The prototype demonstrates core catalog, checkout, account registration/login, and protected admin order access while preserving clear demo boundaries. Next, validate the market and suppliers, implement persistent transactional inventory and full authenticated admin workflows, add account recovery/deletion and shared sessions, obtain privacy/consumer-law advice, add PostgreSQL/GCS integration tests, complete an independent security review, then deploy only with an approved project and budget. Human usability results, cloud screenshots/URL, and video must be captured from real sessions; none are claimed here.
