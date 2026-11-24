# Furnique Studio — demo script

**Target length:** 4–5 minutes  
**Environment:** local app or approved isolated demo; use synthetic customer data only. Do not enter real payment/personal information.

## 0:00–0:30 — Set expectations

“This is Furnique Studio, a student furniture-commerce prototype. The catalogue, ratings, stock, and checkout are sample data; payment is simulated. The separate admin UI is a browser-local preview, not production authentication.”

## 0:30–1:20 — Discover products

1. Show the Home page and the separate Home / Shop / About / Journal / Contact navigation.
2. Select the Living room category card; point out that Living, Dining, and Bedroom are filters within the Shop page.
3. Search or sort the collection and open a product detail.
4. Save an item and add it to the bag.

## 1:20–2:10 — Cart and test checkout

1. Change quantity and apply a demo promo code.
2. Explain that checkout uses `TEST_SUCCESS` only and has no payment processor.
3. Enter synthetic details such as “Demo Customer”, `demo@example.test`, and “12 Example Road”.
4. Submit and note the generated demo order ID.

## 2:10–2:50 — Order lookup and API

1. Use the order ID and matching email to find the test order.
2. If demonstrating the Java API, show `/api/health`, `/api/products`, and the protected admin endpoint response when called without a token (`401`).
3. Do not display or paste the test admin token.

## 2:50–3:35 — Admin preview

1. Return to the footer and open the admin workspace.
2. Show that sample totals/products and any edits are local to this browser.
3. Do not imply this UI is connected to the backend or safe for real data.

## 3:35–4:20 — Assignment evidence and next steps

1. Mention 30 passing JUnit cases, 14 passing API smoke checks, and a bounded 200-request health probe.
2. Show the project architecture, test summary, cloud deployment guide, and startup/e-commerce plan.
3. Close by naming the remaining work: persistent inventory, production admin/auth, legal review, cloud account/budget approval, usability participants, and real deployment evidence.
