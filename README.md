# Furnique Studio

A student e-commerce project for furniture, with a responsive storefront, customer sign-in/registration, a separate administrator sign-in, and a Java HTTP order API. The project includes startup/e-commerce documents, JUnit and API smoke tests, container files, and a gated Google Cloud deployment workflow.

## Pages and features

- **Home:** featured room collections and product discovery.
- **Shop:** combined Living, Dining, and Bedroom collections with search/filtering.
- **About, Journal, Contact:** separate navigation pages.
- **Storefront interactions:** product details, saved pieces, cart quantities, demo promo codes, test checkout, and order lookup.
- **Customer accounts:** server-backed registration, sign-in, and session-based account page. Passwords are stored as PBKDF2-HMAC-SHA256 hashes; cookies are HttpOnly and SameSite=Strict.
- **Admin sign-in:** separate server-configured admin credentials and a distinct protected workspace for server order viewing.
- **Legacy storefront admin preview:** browser-local demo tools remain mock data only and are not an authenticated management interface.
- **Java API:** `/api/health`, `/api/products`, `/api/orders`, `/api/auth/*`, `/api/admin/login`, and session- or token-protected `/api/admin/orders`; test-only payments; file or PostgreSQL persistence; optional Cloud Storage backup.

Catalog, ratings, stock, and checkout are sample/demo values. The newsletter form requires opt-in; demo signups stay in the current browser. No real payment provider, fulfilment, or email service is connected. Customer accounts are not connected to orders.

## Run the browser prototype

Open `index.html` in a modern browser for the static storefront demo. Customer registration/sign-in and the protected admin workspace require the Java server below; opening those pages as local files will not connect to authentication APIs. No frontend build step is needed; product photography and optional web fonts use external URLs.

## Build and run the Java app

Requires Java 8+ and Maven 3.9+. From the workspace root in PowerShell:

```powershell
mvn -f java-app\pom.xml clean verify
java -jar java-app\target\furnique-commerce-1.0.0.jar
```

The server defaults to port `8080`, serves the frontend at `/`, and uses local file persistence under `data`. Set `PORT`, `DATA_DIRECTORY`, `DB_URL`, `DB_USER`, and `DB_PASSWORD` only in the local process environment as appropriate. For a database-backed run, configure PostgreSQL and the Cloud SQL JDBC socket factory as described in [docs/cloud-deployment.md](docs/cloud-deployment.md).

Set both `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server environment to enable `/admin-login.html`. Configure a unique password with at least 12 characters. The password is hashed in memory at startup; never commit credentials. Set `COOKIE_SECURE=true` when serving over HTTPS. Local HTTP may use `false` for testing. Customer passwords are stored as salted PBKDF2 hashes; registrations are kept in the local data file or the PostgreSQL customer table. Review [privacy.html](privacy.html) before entering account details.

## Test

```powershell
mvn -f java-app\pom.xml clean verify
node tests\api-smoke.js http://127.0.0.1:8080
node tests\load-test.js http://127.0.0.1:8080 200
```

For the API scripts, first launch the Java JAR with a temporary test data directory, `ADMIN_API_TOKEN`, `ADMIN_EMAIL`, and a unique temporary `ADMIN_PASSWORD`; set those same values for the smoke script, then stop the server after testing. Results and coverage are recorded in [docs/test-summary.md](docs/test-summary.md); test execution steps are in [docs/test-plan.md](docs/test-plan.md).

## Docker Compose (local only)

1. Copy `java-app\.env.example` to `java-app\.env` and replace the placeholders with local-only values.
2. From the workspace root:

```powershell
docker compose --env-file java-app\.env -f java-app\docker-compose.yml up --build
```

This starts the app, PostgreSQL, and a local GCS emulator. Set the local admin email/password in the `.env` file. Docker Compose has not been validated in this environment.

## Assignment and deployment documents

- [Startup and e-commerce plan](docs/startup-and-ecommerce.md)
- [Architecture diagrams and limitations](docs/architecture.md)
- [Test plan](docs/test-plan.md), [38 unit and authentication cases](docs/test-cases.csv), [execution summary](docs/test-summary.md), and [defect log](docs/defect-log.md)
- [Project report](docs/project-report.md), [pitch deck outline](docs/pitch-deck.md), and [demo script](docs/demo-script.md)
- [Google Cloud deployment guide](docs/cloud-deployment.md) and [gated GitHub Actions workflow](.github/workflows/google-cloud.yml)

## Production and assignment evidence still required

This workspace has not been deployed to Google Cloud; the workflow needs a configured project, billing approval, IAM/WIF, Cloud SQL, Artifact Registry, secrets, and a manual dispatch confirmation. Customer sessions are held in process memory and are lost on restart; configure a single instance for a demo. Product stock is also in-memory and not shared across instances. Authentication still needs production review, distributed sessions, email verification, password recovery, account deletion, and a stronger rate-limit strategy before public use. The browser admin preview remains demo-only; use the protected admin sign-in and server order workspace instead. Real usability participants, cloud screenshots/URL, and a demo video must come from actual activity. Obtain current legal review before handling real personal data or payments.
