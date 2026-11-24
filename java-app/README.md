# Furnique Java commerce API

Java 8-compatible core application and HTTP API for test-mode orders. The server serves the storefront files from the packaged JAR, exposes a public product catalog and health endpoint, accepts demo orders, writes orders to a local file or PostgreSQL, and can upload CSV backups to Google Cloud Storage.

## Run locally

Requirements: JDK 8 or later and Maven 3.8+.

From the project root:

```powershell
mvn -f java-app\pom.xml clean verify
java -jar java-app\target\furnique-commerce-1.0.0.jar
```

Open `http://localhost:8080`. Without `DB_URL`, orders are stored in `data\furnique-orders.bin`; set `DATA_DIRECTORY` to change this. Set `PORT` to change the HTTP port.

The browser UI probes `/api/health`. When it is served by this Java process, it loads stock from `/api/products` and sends checkout to `/api/orders`. Opening `index.html` directly keeps the original localStorage-only demo mode.

## API examples

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/products
```

`POST /api/orders` accepts form fields `name`, `email`, `address`, `items` (`p-101:1|p-102:2`), `paymentMode` (`TEST_SUCCESS` or `TEST_FAIL`), and optional `promoCode`. All successful payments are simulations; the API cannot charge a real payment method.

`GET /api/orders?orderId=...&email=...` requires both order ID and matching email. `GET /api/admin/orders` requires the `X-Admin-Token` header and a non-empty `ADMIN_API_TOKEN` environment variable. The browser admin workspace remains a local demonstration; it is not connected to this protected API.

## PostgreSQL and backups

Set `DB_URL`, `DB_USER`, and `DB_PASSWORD` to select the JDBC PostgreSQL repository. If `GCS_BUCKET` is configured, the background backup worker writes a CSV snapshot under `BACKUP_DIRECTORY` and uploads it using Application Default Credentials. On Cloud Run, grant the runtime service account only the needed Cloud SQL and Storage permissions; do not put credentials in the repository.

For a local container demo, copy `.env.example` to `.env`, replace the placeholder values, then run `docker compose -f java-app\docker-compose.yml up --build`. Create the emulator bucket once with `java-app\scripts\create-local-bucket.ps1`. The compose services are local development equivalents, not public-cloud deployment evidence.

## Design and verification

The domain uses `Product`, `Order`, `OrderItem`, and `CartLine`; `OrderService` uses a `PaymentProcessor` interface and a test-only implementation. Custom exceptions distinguish invalid orders, stock conflicts, failed demo payments, and persistence failures. A bounded HTTP executor supports concurrent requests, while inventory reservation is synchronized to prevent overselling. `FileOrderRepository` provides atomic file replacement with a Windows-compatible fallback.

Run `mvn -f java-app\pom.xml clean verify` for the JUnit suite and JaCoCo report at `java-app\target\site\jacoco\index.html`. See `docs\` at the project root for assignment materials and limitations.
