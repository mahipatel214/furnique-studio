const baseUrl = process.argv[2] || "http://localhost:8080";
const adminToken = process.env.ADMIN_API_TOKEN;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const results = [];

async function check(id, description, request, expectedStatus, verify) {
  try {
    const response = await request();
    const body = await response.json().catch(() => ({}));
    const passed = response.status === expectedStatus && (!verify || verify(body));
    results.push({ id, description, status: passed ? "PASS" : "FAIL", actual: response.status });
    return { response, body };
  } catch (error) {
    results.push({ id, description, status: "FAIL", actual: String(error) });
    return { response: null, body: {} };
  }
}

async function main() {
  await check("API-01", "Health endpoint reports ready", () => fetch(`${baseUrl}/api/health`), 200,
    (body) => body.status === "ok");
  await check("API-02", "Catalog returns eight seeded products", () => fetch(`${baseUrl}/api/products`), 200,
    (body) => Array.isArray(body.products) && body.products.length === 8);
  await check("API-03", "Root serves the storefront", () => fetch(`${baseUrl}/`), 200);
  await check("API-04", "Unknown API paths are not treated as web pages", () => fetch(`${baseUrl}/api/unknown`), 404);
  for (const [id, page, expectedText] of [
    ["AUTH-PAGE-01", "login.html", "Sign in"],
    ["AUTH-PAGE-02", "register.html", "Create account"],
    ["AUTH-PAGE-03", "admin-login.html", "Administrator sign in"],
    ["AUTH-PAGE-04", "account.html", "YOUR FURNIQUE ACCOUNT"],
    ["AUTH-PAGE-05", "admin.html", "Studio orders"],
    ["AUTH-PAGE-06", "privacy.html", "Privacy for this prototype"]
  ]) {
    await check(id, `${page} is served by the Java app`, async () => {
      const response = await fetch(`${baseUrl}/${page}`);
      const text = await response.text();
      return { status: response.status, json: async () => ({ page: text }) };
    }, 200, (body) => body.page.includes(expectedText));
  }

  const firstProduct = await check("API-05", "Living product is present in catalog", () => fetch(`${baseUrl}/api/products`), 200,
    (body) => body.products.some((product) => product.id === "p-101" && product.category === "Living"));
  const beforeStock = firstProduct.body.products?.find((product) => product.id === "p-101")?.stock;
  const orderPayload = new URLSearchParams({
    name: "Test Customer",
    email: "tester@example.com",
    address: "12 Example Road",
    items: "p-101:1",
    paymentMode: "TEST_SUCCESS",
    promoCode: ""
  });
  const created = await check("API-06", "Valid test-mode order is accepted", () => fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: orderPayload
  }), 201, (body) => body.id && body.status === "Processing");
  await check("API-07", "Successful order reserves one item", () => fetch(`${baseUrl}/api/products`), 200,
    (body) => beforeStock !== undefined && body.products.find((product) => product.id === "p-101").stock === beforeStock - 1);

  await check("API-08", "Order lookup succeeds with matching email", () =>
    fetch(`${baseUrl}/api/orders?orderId=${encodeURIComponent(created.body.id || "")}&email=tester%40example.com`),
  200, (body) => body.id === created.body.id);
  await check("API-09", "Order lookup rejects a different email", () =>
    fetch(`${baseUrl}/api/orders?orderId=${encodeURIComponent(created.body.id || "")}&email=other%40example.com`), 404);
  await check("API-10", "Declined demo payment returns a payment error", () => fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...Object.fromEntries(orderPayload), paymentMode: "TEST_FAIL" })
  }), 402);
  await check("API-11", "Out-of-stock quantity returns a conflict", () => fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...Object.fromEntries(orderPayload), items: "p-101:8" })
  }), 409);
  await check("API-12", "Invalid email is rejected", () => fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...Object.fromEntries(orderPayload), email: "not-an-email" })
  }), 400);
  await check("API-13", "Admin order list requires authentication", () =>
    fetch(`${baseUrl}/api/admin/orders`), adminToken ? 401 : 503);
  if (adminToken) {
    await check("API-14", "Authorized admin can list orders", () =>
      fetch(`${baseUrl}/api/admin/orders`, { headers: { "X-Admin-Token": adminToken } }), 200,
    (body) => body.orders.some((order) => order.id === created.body.id));
  }

  await check("AUTH-01", "Customer session is not available before sign-in", () =>
    fetch(`${baseUrl}/api/auth/session`), 401);
  await check("AUTH-01A", "Customer registration requires privacy acknowledgement", () =>
    fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Test Account",
        email: `no-consent-${Date.now()}@example.test`,
        password: "Furnique-Test-Account-2026!"
      })
    }), 400);
  await check("AUTH-01B", "Cross-origin customer login is rejected", () =>
    fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://untrusted.example"
      },
      body: new URLSearchParams({ email: "tester@example.test", password: "Furnique-Test-Password-2026!" })
    }), 403);
  const customerEmail = `auth-${Date.now()}@example.test`;
  const customerPassword = "Furnique-Test-Account-2026!";
  const registration = await check("AUTH-02", "Customer can register and receives a session cookie", () =>
    fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Test Account", email: customerEmail, password: customerPassword, privacyAcknowledged: "on" })
    }), 201, (body) => body.email === customerEmail && body.role === "customer" &&
      !Object.keys(body).some((key) => /password|hash/i.test(key)));
  const customerCookie = registration.response?.headers.get("set-cookie")?.split(";", 1)[0];
  results.push({
    id: "AUTH-03",
    description: "Customer session cookie is HttpOnly and SameSite strict",
    status: /HttpOnly/i.test(registration.response?.headers.get("set-cookie") || "") &&
      /SameSite=Strict/i.test(registration.response?.headers.get("set-cookie") || "") ? "PASS" : "FAIL",
    actual: registration.response?.headers.get("set-cookie") ? "cookie set" : "missing cookie"
  });
  await check("AUTH-04", "Customer session identifies the signed-in customer", () =>
    fetch(`${baseUrl}/api/auth/session`, { headers: { Cookie: customerCookie || "" } }), 200,
  (body) => body.email === customerEmail && body.role === "customer");
  await check("AUTH-05", "Duplicate customer email is rejected", () => fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ name: "Test Account", email: customerEmail, password: customerPassword, privacyAcknowledged: "on" })
  }), 409);
  await check("AUTH-06", "Customer session cannot access administrator orders", () =>
    fetch(`${baseUrl}/api/admin/orders`, { headers: { Cookie: customerCookie || "" } }), 403);
  await check("AUTH-07", "Customer can sign out and invalidate session", () =>
    fetch(`${baseUrl}/api/auth/logout`, { method: "POST", headers: { Cookie: customerCookie || "" } }), 200,
  (body) => body.signedOut === true);
  await check("AUTH-08", "Signed-out customer session is rejected", () =>
    fetch(`${baseUrl}/api/auth/session`, { headers: { Cookie: customerCookie || "" } }), 401);
  await check("AUTH-09", "Customer can sign in with registered credentials", () =>
    fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email: customerEmail, password: customerPassword })
    }), 200, (body) => body.email === customerEmail && body.role === "customer");
  await check("AUTH-10", "Incorrect customer password is rejected", () =>
    fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email: customerEmail, password: "Incorrect-Password-2026!" })
    }), 401);

  if (adminEmail && adminPassword) {
    await check("AUTH-11", "Admin login rejects an incorrect password", () =>
      fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: adminEmail, password: "Incorrect-Admin-Password-2026!" })
      }), 401);
    const adminLogin = await check("AUTH-12", "Admin can sign in through the separate admin endpoint", () =>
      fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: adminEmail.toUpperCase(), password: adminPassword })
      }), 200, (body) => body.role === "admin");
    const adminCookie = adminLogin.response?.headers.get("set-cookie")?.split(";", 1)[0];
    await check("AUTH-13", "Signed-in administrator can view server orders", () =>
      fetch(`${baseUrl}/api/admin/orders`, { headers: { Cookie: adminCookie || "" } }), 200,
    (body) => body.orders.some((order) => order.id === created.body.id));
    await check("AUTH-14", "Administrator can sign out", () =>
      fetch(`${baseUrl}/api/auth/logout`, { method: "POST", headers: { Cookie: adminCookie || "" } }), 200,
    (body) => body.signedOut === true);
  } else {
    await check("AUTH-11", "Admin sign-in reports missing server configuration", () =>
      fetch(`${baseUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: "admin@example.test", password: "Furnique-Admin-Password!" })
      }), 503);
  }

  const failed = results.filter((result) => result.status !== "PASS");
  console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
