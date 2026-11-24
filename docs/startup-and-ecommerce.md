# Furnique Studio — startup and e-commerce design

**Status:** concept and student prototype. The market, margins, and funding numbers below are planning assumptions, not validated research or a live business forecast.

## Topic proposal

Furnique Studio is a proposed online furniture retailer for renters, first-time homeowners, and young professionals in Indian cities who want considered furniture without navigating a fragmented set of sellers. The prototype demonstrates room-based discovery, product details, saved items, cart, test-only checkout, order lookup, and a small admin workspace.

**Problem hypothesis:** shoppers struggle to compare style, price, materials, delivery, and after-sales terms across furniture sellers. Validate this with interviews and a small catalogue test before spending on inventory.

**Value proposition:** a curated collection for living, dining, and bedroom spaces, supported by clear item details, delivery expectations, and a responsive online experience.

**Cloud rationale:** a public storefront should be reachable beyond a single campus device, while autoscaling web compute, managed relational storage, object backups, and central monitoring reduce the operations burden for a small team.

## Lean Canvas

| Block | Current hypothesis |
|---|---|
| Problem | Fragmented discovery; unclear product details and delivery terms; customers lack a simple way to track orders |
| Customer segments | Urban renters, newly married couples, and first-time homeowners; secondary segment: independent interior stylists |
| Unique value proposition | Thoughtfully curated furniture for everyday Indian homes, with transparent information and a calm buying experience |
| Solution | Room/category discovery, searchable catalogue, item details, saved pieces, cart, test checkout, order tracking, and admin product/order tools |
| Channels | Search, visual social media, creator partnerships with disclosure, referral, and local design communities |
| Revenue streams | Product margin; optional assembly/delivery service; future paid design consultation |
| Cost structure | Product sourcing, storage, last-mile delivery, returns/damage, payment fees, support, cloud, and customer acquisition |
| Key metrics | Qualified visits, product-detail-to-cart rate, checkout completion, cancellation/return rate, delivery damage rate, repeat purchase |
| Unfair advantage | Not established. A local-maker catalogue and consistent after-sales support are hypotheses to validate, not current advantages |

## Business Model Canvas

| Block | Design |
|---|---|
| Customer segments | City-based renters and homeowners furnishing a room; design-conscious small households |
| Value propositions | Curated room collections, useful product information, convenient online ordering, and trackable service |
| Channels | Website, search, opt-in email, social content, and maker/showroom partnerships |
| Customer relationships | Self-serve shopping, order updates, care guidance, and human support for delivery/returns |
| Revenue streams | Furniture sales; optional assembly and design services only after feasibility and consumer disclosures |
| Key resources | Catalogue/content, supplier relationships, customer-support process, software, inventory and logistics data |
| Key activities | Sourcing, catalogue management, merchandising, order processing, delivery coordination, support, and quality checks |
| Key partners | Makers, logistics/assembly providers, payment gateway in test/production mode as legally approved, cloud provider |
| Cost structure | Inventory and working capital, fulfilment, damage/returns, payment processing, marketing, cloud, and compliance |

## SWOT

| Strengths | Weaknesses |
|---|---|
| Clear room-first catalogue and consistent visual identity | No validated demand, suppliers, real inventory, or real transaction history |
| Prototype demonstrates core discovery and server-backed account sign-in | Sessions are process-local; no recovery, verification, or MFA |
| Test-only Java order API and file/PostgreSQL adapters | No live payment, fulfilment, or deployed cloud instance |

| Opportunities | Threats |
|---|---|
| Partner with local furniture makers; offer smaller curated room bundles | Established marketplaces, price competition, and high furniture delivery costs |
| Use clear material, care, and delivery information to build trust | Damage/returns, inventory mismatch, supplier delays, and cash-flow risk |
| Grow through consent-based design content and referrals | Privacy/security failures, misleading product claims, and undisclosed advertising |

## PESTEL

| Factor | Consideration |
|---|---|
| Political | Track applicable central and state rules for online commerce, tax, consumer protection, and business registration |
| Economic | Furniture is a considered/high-ticket purchase; validate price sensitivity, returns, delivery cost, and working capital |
| Social | Homes, room sizes, language, and furnishing needs differ; test catalogue and support with intended city/user groups |
| Technological | Use HTTPS, least-privilege cloud identities, managed database/object storage, backups, logs, and tested recovery |
| Environmental | Prefer accurate material/sourcing claims; plan packaging reuse and responsible disposal only where partners can evidence it |
| Legal | Seek current professional advice on consumer e-commerce rules, privacy/consent, GST, product/price disclosures, IP, and contracts |

## MVP and validation plan

1. Interview at least 8–12 target shoppers about their last furniture purchase and delivery/returns experience; record consent and anonymize notes.
2. Verify supplier samples, actual prices, stock, packaging, dimensions, delivery coverage, assembly capability, and return costs.
3. Run a small catalogue usability session before taking real orders; test search, category, item details, and delivery clarity.
4. Pilot with a limited number of products and an explicit service area; use a payment gateway's sandbox until legal, security, and operations reviews pass.
5. Review conversion, cancellations, damage, support time, and contribution margin before scaling. Do not treat prototype clicks or seeded reviews as customer evidence.

## Funding plan (assumption, not a financial commitment)

**Illustrative first-pilot ask: ₹5 lakh**, subject to supplier quotes and mentor review:

| Use | Illustrative allocation |
|---|---:|
| Product samples and quality checks | ₹1,25,000 |
| Packaging, local storage, and delivery pilot | ₹1,50,000 |
| Website, cloud, and security/testing | ₹50,000 |
| Consent-based launch content and customer research | ₹50,000 |
| Returns/damage and working-capital reserve | ₹1,25,000 |

Start with founder contribution and a controlled pilot; consider incubator/student programs, grants, or a small working-capital facility only after eligibility and repayment terms are verified. No investor, grant, or revenue is secured by this prototype.

**Unit-economics hypothesis:** a ₹30,000 average basket is not evidence. Model landed product cost, packaging, delivery, payment fee, discounts, return/damage reserve, tax, support, and acquisition cost separately. Stop or reprice if contribution after variable costs is negative.

## DPIIT, IP, and compliance readiness

- **DPIIT recognition:** not applied for and not claimed. The current [Startup India recognition page](https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html) lists eligible registered entity types and innovation/wealth-or-employment criteria; it currently describes a 10-year period and ₹200 crore turnover ceiling (with different DeepTech limits). Rules and the Gazette notification can change, so confirm the current criteria and apply through the linked National Single Window System before making any eligibility claim. Recognition is not automatic.
- **IP:** clear the Furnique Studio name/logo before commercial use; perform trademark and domain checks. Use original product copy/photos or assets with documented licences and attribution. Contracts should define maker designs, product photography, and reuse rights.
- **Privacy and consumer protection:** minimize collected data, explain purpose/retention, get affirmative newsletter consent, provide withdrawal/contact routes, publish accurate prices/product specifications/delivery/return terms, and avoid dark patterns. Seek professional review of applicable Indian privacy and e-commerce law before launch.
- **Tax and product rules:** obtain professional advice on GST/invoicing, packaged-product declarations, warranties, and state-specific obligations before accepting real orders.
- **Payments:** current interface and API are test-mode only. Never collect card/UPI credentials in this prototype; use a regulated gateway's sandbox during testing and production onboarding only after review.
- **Evidence:** keep supplier permissions, licences, consent records, approvals, and policy versions. Do not fabricate customer reviews, sustainability claims, or endorsements.

## E-commerce flow and operating plan

### Store flow

Home → Shop collection → Living/Dining/Bedroom filter → product details → saved pieces/cart → promo validation → checkout form → simulated payment → demo order confirmation → order lookup. Product, review, price, and stock values are seed data. The Java API performs server-side input validation, synchronized stock reservation, test-only payment authorization, order persistence, and an authenticated admin-order endpoint.

### Revenue and payments

Primary proposed model: retail margin on furniture. Optional assembly and design support are future hypotheses. Checkout uses only `TEST_SUCCESS`/`TEST_FAIL` behavior; no payment gateway or real transaction is configured.

### Delivery and returns

Proposed operations: confirm supplier stock and dimensions; quote delivery by PIN code/region; communicate lead time before payment; inspect packaging; provide proof of delivery; route damage/return requests to a staffed support process. The prototype's ₹25,000 threshold and 14-day return copy are sample UX and must not be used as a real offer until capacity, terms, and consumer-law review confirm them.

### Digital marketing

Use descriptive search content, room guides, opt-in email, and creator partnerships with clear sponsorship disclosures. Measure consent-based campaign performance and honour unsubscribe. Do not buy lists, use fabricated reviews, hide delivery/return conditions, or create false scarcity. Seeded ratings/reviews are labelled sample/demo content.

### Legal/security checklist

| Control | Prototype status / next step |
|---|---|
| Clear demo-only/test-payment statement | Implemented in storefront and API |
| Accurate sample catalog/review disclosure | Implemented; replace all seed content before launch |
| Newsletter opt-in and unsubscribe | Required affirmative opt-in is implemented; real unsubscribe/backend workflow remains future work |
| Privacy notice and data minimization | Demo notice exists; production notice, retention, rights and consent workflow need legal review |
| No card/bank credentials collected | Implemented: no payment fields or provider integration |
| Admin RBAC | Separate admin credentials/session gate the server order page; the old browser-only preview remains demo-only |
| Secrets and transport | No repository secrets; admin password is configured server-side, session cookies are HttpOnly/SameSite, and deployment guide uses Secret Manager/WIF with HTTPS. Live cloud setup not performed |
| Input validation / injection defenses | API bounds input, uses prepared JDBC statements, and has test coverage; production security review remains required |
| Dark patterns/fake reviews | No false scarcity generation; review/rating content is marked as sample. Consent and commercial claims require a launch review |
