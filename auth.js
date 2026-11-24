const authMessage = document.getElementById("auth-message");

function showAuthMessage(message) {
  if (authMessage) authMessage.textContent = message;
}

async function submitAuthForm(form, endpoint, destination) {
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  showAuthMessage("");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "same-origin",
      body: new URLSearchParams(new FormData(form))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "We couldn't complete sign in. Please try again.");
    window.location.assign(destination);
  } catch (error) {
    showAuthMessage(error instanceof TypeError
      ? "The sign-in service is unavailable. Please open this site through the Java server."
      : error.message);
    submitButton.disabled = false;
  }
}

document.getElementById("customer-login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAuthForm(event.currentTarget, "/api/auth/login", "account.html");
});

document.getElementById("customer-register-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.elements.password.value !== form.elements.confirmPassword.value) {
    showAuthMessage("Those passwords don't match yet.");
    form.elements.confirmPassword.focus();
    return;
  }
  submitAuthForm(form, "/api/auth/register", "account.html");
});

document.getElementById("admin-login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAuthForm(event.currentTarget, "/api/admin/login", "admin.html");
});

async function requestSession(expectedRole) {
  const response = await fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return null;
  const session = await response.json();
  return session.role === expectedRole ? session : null;
}

document.querySelector("[data-sign-out]")?.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    if (!response.ok) throw new Error("The server could not end this session.");
    window.location.assign("index.html");
  } catch (error) {
    const status = document.getElementById("admin-message") ||
      document.getElementById("account-message") || authMessage;
    if (status) status.textContent = error instanceof TypeError
      ? "The sign-out service is unavailable. Please try again."
      : error.message;
  }
});

async function loadCustomerAccount() {
  try {
    const session = await requestSession("customer");
    if (!session) {
      window.location.replace("login.html");
      return;
    }
    document.getElementById("account-name").textContent = session.name;
    document.getElementById("account-email").textContent = session.email;
  } catch (error) {
    document.getElementById("account-email").textContent = "The account service is unavailable.";
  }
}

async function loadAdminWorkspace() {
  const status = document.getElementById("admin-message");
  const rows = document.getElementById("admin-orders");
  try {
    const session = await requestSession("admin");
    if (!session) {
      window.location.replace("admin-login.html");
      return;
    }
    document.getElementById("admin-welcome").textContent = `Signed in as ${session.email}`;
    const response = await fetch("/api/admin/orders", { credentials: "same-origin", cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load orders.");
    rows.replaceChildren();
    if (!Array.isArray(result.orders) || result.orders.length === 0) {
      const empty = document.createElement("tr");
      const message = document.createElement("td");
      message.colSpan = 5;
      message.textContent = "There are no orders to show yet.";
      empty.append(message);
      rows.append(empty);
      return;
    }
    result.orders.forEach((order) => {
      const row = document.createElement("tr");
      [order.id, order.customer, order.email, `₹${Number(order.total).toLocaleString("en-IN")}`, order.status]
        .forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = String(value ?? "");
          row.append(cell);
        });
      rows.append(row);
    });
  } catch (error) {
    status.textContent = error instanceof TypeError
      ? "The admin service is unavailable. Open this page through the Java server."
      : error.message;
    rows.replaceChildren();
  }
}

if (document.getElementById("account-name")) loadCustomerAccount();
if (document.getElementById("admin-orders")) loadAdminWorkspace();
