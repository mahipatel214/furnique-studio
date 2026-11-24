const STORAGE_KEYS = {
  products: "furnique-products-v1",
  cart: "furnique-cart-v1",
  wishlist: "furnique-wishlist-v1",
  orders: "furnique-orders-v1",
  newsletter: "furnique-newsletter-v1",
  settings: "furnique-settings-v1"
};

const initialProducts = [
  { id: "p-101", name: "The Sunday Sofa", category: "Living", price: 78900, oldPrice: 89000, rating: 4.9, reviews: 38, stock: 7, label: "Bestseller", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=82", description: "An easy, generous seat with a deep cushion, soft performance linen and just the right amount of give. Made for slow Sundays and long conversations.", details: ["Solid eucalyptus frame", "Performance linen blend", "Made to order in 3–4 weeks"] },
  { id: "p-102", name: "Oak & About Table", category: "Dining", price: 45900, oldPrice: null, rating: 4.8, reviews: 24, stock: 12, label: "New arrival", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=82", description: "A softly rounded oak table that makes room for one more. A natural gathering point for everyday meals, shared plates and everything between.", details: ["Solid European oak", "Seats 4–6 people", "Responsibly sourced timber"] },
  { id: "p-103", name: "Cloud Nine Armchair", category: "Living", price: 32900, oldPrice: null, rating: 4.7, reviews: 19, stock: 5, label: "Studio favourite", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=82", description: "A little reading nook, a quiet cup of tea, a seat that welcomes you back. Cloud Nine is our answer to the in-between moments.", details: ["Kiln-dried hardwood", "High-resilience foam", "Removable linen-blend cover"] },
  { id: "p-104", name: "Sunday Side Table", category: "Living", price: 11900, oldPrice: 14500, rating: 4.6, reviews: 16, stock: 18, label: "A little less", image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=82", description: "An honest little sidekick with a smooth oak top and rounded, tapered legs. Just enough space for your tea, your book and your current favourite thing.", details: ["Solid mango wood", "Hand-finished with natural oil", "No assembly needed"] },
  { id: "p-105", name: "The Quiet Nightstand", category: "Bedroom", price: 18900, oldPrice: null, rating: 4.9, reviews: 31, stock: 4, label: "Almost gone", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82", description: "A considered bedside companion with a soft-close drawer for the things you want close, and a little space for the things you love to see.", details: ["Solid ash wood", "Soft-close drawer", "Made in small batches"] },
  { id: "p-106", name: "Sunday Dining Chair", category: "Dining", price: 14500, oldPrice: null, rating: 4.8, reviews: 27, stock: 14, label: "Made for gathering", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=82", description: "A light, comfortable chair that feels at home around a long table. Gently curved back, solid oak legs and a seat that asks you to stay.", details: ["Solid oak frame", "Hand-woven natural cane", "Designed for everyday dining"] },
  { id: "p-107", name: "Gather Round Bench", category: "Dining", price: 21900, oldPrice: null, rating: 4.6, reviews: 11, stock: 8, label: "Easy living", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=82", description: "Pull up a seat. Crafted in solid wood with a gently eased edge, this versatile bench works just as well at the table as it does in the hallway.", details: ["Solid acacia wood", "Seats two comfortably", "Responsibly made"] },
  { id: "p-108", name: "Soft Landing Bed", category: "Bedroom", price: 62900, oldPrice: 69900, rating: 4.9, reviews: 22, stock: 3, label: "Thoughtfully made", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82", description: "An upholstered headboard, a clean oak frame and no sharp edges. A quiet centrepiece for a room that helps the day come to a close.", details: ["Solid oak and linen upholstery", "Fits standard queen mattress", "Made to order in 4–5 weeks"] }
];

const initialOrders = [
  { id: "FS-2409", customer: "Aarav Mehta", email: "aarav@example.com", date: "2026-11-23", total: 78900, status: "Processing", items: [{ productId: "p-101", name: "The Sunday Sofa", quantity: 1 }], address: "Indiranagar, Bengaluru", payment: "Card · test mode" },
  { id: "FS-2408", customer: "Mira Shah", email: "mira@example.com", date: "2026-11-22", total: 45900, status: "Shipped", items: [{ productId: "p-102", name: "Oak & About Table", quantity: 1 }], address: "Bandra West, Mumbai", payment: "UPI · test mode" },
  { id: "FS-2407", customer: "Nisha Rao", email: "nisha@example.com", date: "2026-11-20", total: 47400, status: "Delivered", items: [{ productId: "p-106", name: "Sunday Dining Chair", quantity: 2 }, { productId: "p-104", name: "Sunday Side Table", quantity: 1 }], address: "Jubilee Hills, Hyderabad", payment: "Card · test mode" },
  { id: "FS-2406", customer: "Kabir Sethi", email: "kabir@example.com", date: "2026-11-19", total: 32900, status: "Delivered", items: [{ productId: "p-103", name: "Cloud Nine Armchair", quantity: 1 }], address: "Koregaon Park, Pune", payment: "Cash on delivery" },
  { id: "FS-2405", customer: "Tara Iyer", email: "tara@example.com", date: "2026-11-18", total: 18900, status: "Cancelled", items: [{ productId: "p-105", name: "The Quiet Nightstand", quantity: 1 }], address: "Adyar, Chennai", payment: "UPI · test mode" }
];

const reviews = [
  { quote: "“The sofa has quietly become the place where everything happens. It feels thoughtful without trying too hard — just like home should.”", name: "Nisha R.", location: "Sample review", initial: "N" },
  { quote: "“Our dining table has hosted late dinners, birthday cake and more cups of coffee than I can count. It is the piece that made the room feel like ours.”", name: "Mira S.", location: "Sample review", initial: "M" },
  { quote: "“The details are so considered, from the finish to the delivery experience. It feels lovely to bring something home that is made to last.”", name: "Aarav M.", location: "Sample review", initial: "A" }
];

const requestedCategory = new URLSearchParams(window.location.search).get("category");
const initialCategory = ["Living", "Dining", "Bedroom"].find((category) => category.toLowerCase() === requestedCategory?.toLowerCase()) || "All";

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? structuredClone(fallback) : JSON.parse(stored);
  } catch (error) {
    console.warn(`Could not read ${key} from local storage; using the demo defaults.`, error);
    return structuredClone(fallback);
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to local storage.`, error);
    showToast("Your browser could not save this change. Please check storage settings.", "error");
  }
}

const state = {
  products: readStorage(STORAGE_KEYS.products, initialProducts),
  cart: readStorage(STORAGE_KEYS.cart, []),
  wishlist: readStorage(STORAGE_KEYS.wishlist, []),
  orders: readStorage(STORAGE_KEYS.orders, initialOrders),
  settings: readStorage(STORAGE_KEYS.settings, { freeShipping: true, lowStockAlerts: true, newsletter: true }),
  activeCategory: initialCategory,
  search: "",
  sort: "featured",
  reviewIndex: 0,
  adminView: "overview",
  adminSearch: "",
  productFormOpen: false,
  editingProductId: null,
  promoCode: ""
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const promoRates = { STUDIO10: 0.10, WELCOME15: 0.15 };
const backendReady = window.location.protocol === "file:"
  ? Promise.resolve(false)
  : fetch("/api/health").then((response) => response.ok).catch((error) => {
    console.warn("The commerce API is unavailable; this browser is using demo-only behavior.", error);
    return false;
  });
const getProduct = (id) => state.products.find((product) => product.id === id);
const getDiscount = (subtotal) => Math.round(subtotal * (promoRates[state.promoCode] || 0));
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const saveCollection = (name) => {
  const keys = { products: STORAGE_KEYS.products, cart: STORAGE_KEYS.cart, wishlist: STORAGE_KEYS.wishlist, orders: STORAGE_KEYS.orders, settings: STORAGE_KEYS.settings };
  writeStorage(keys[name], state[name]);
};

function showToast(message, type = "success") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function getVisibleProducts() {
  const query = state.search.trim().toLowerCase();
  let visible = state.products.filter((product) => {
    const matchesCategory = state.activeCategory === "All" || product.category === state.activeCategory;
    const matchesSearch = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  if (state.sort === "price-low") visible = visible.slice().sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") visible = visible.slice().sort((a, b) => b.price - a.price);
  if (state.sort === "rating") visible = visible.slice().sort((a, b) => b.rating - a.rating);
  return visible;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const products = getVisibleProducts();
  grid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        ${product.label ? `<span class="product-label">${escapeHTML(product.label)}</span>` : ""}
        <button class="product-favorite${state.wishlist.includes(product.id) ? " is-saved" : ""}" type="button" data-action="wishlist" data-id="${escapeHTML(product.id)}" aria-label="${state.wishlist.includes(product.id) ? "Remove from" : "Add to"} saved pieces">${state.wishlist.includes(product.id) ? "♥" : "♡"}</button>
        <button class="product-view" type="button" data-action="quick-view" data-id="${escapeHTML(product.id)}">A closer look&nbsp; ↗</button>
      </div>
      <div class="product-info">
        <div><h3 class="product-name">${escapeHTML(product.name)}</h3><span class="product-category">${escapeHTML(product.category)} · Made with intention</span></div>
        <span class="product-price">${money.format(product.price)}</span>
      </div>
      <div class="product-meta"><span class="stars">★★★★★</span><span>${Number(product.rating).toFixed(1)} (${Number(product.reviews)})</span>${product.stock <= 5 ? `<span class="product-stock">· ${product.stock === 0 ? "Sold out" : "Only " + product.stock + " left"}</span>` : ""}</div>
    </article>`).join("");
  document.getElementById("empty-products")?.classList.toggle("hidden", products.length > 0);
  document.getElementById("shop-result").textContent = `${products.length} demo ${products.length === 1 ? "piece" : "pieces"} · sample ratings`;
  document.querySelectorAll(".filter-chip").forEach((button) => button.classList.toggle("is-active", button.dataset.filter === state.activeCategory));
}

function renderHeaderCounts() {
  document.getElementById("cart-count").textContent = String(state.cart.reduce((total, item) => total + item.quantity, 0));
  document.getElementById("wishlist-count").textContent = String(state.wishlist.length);
}

function renderCart() {
  const items = state.cart.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = state.settings.freeShipping && subtotal >= 25000 ? 0 : (items.length ? 1200 : 0);
  const discount = getDiscount(subtotal);
  const progress = Math.min(100, Math.round(subtotal / 25000 * 100));
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  if (!body || !footer) return;
  body.innerHTML = items.length ? `
    <div class="shipping-progress">${subtotal >= 25000 ? "Your delivery is on us." : `You're ${money.format(25000 - subtotal)} away from complimentary delivery.`}<div class="progress-track"><i style="width:${progress}%"></i></div></div>
    ${items.map(({ product, quantity }) => `
      <div class="cart-line">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">
        <div><h3>${escapeHTML(product.name)}</h3><p>${money.format(product.price)}</p><div class="quantity-control"><button type="button" data-action="cart-quantity" data-id="${escapeHTML(product.id)}" data-change="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button type="button" data-action="cart-quantity" data-id="${escapeHTML(product.id)}" data-change="1" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-action="remove-cart" data-id="${escapeHTML(product.id)}">Remove</button></div>
        <strong>${money.format(product.price * quantity)}</strong>
      </div>`).join("")}
    <form class="promo-form" id="promo-form"><label for="promo-input">Have a studio note?</label><div><input id="promo-input" name="code" maxlength="24" placeholder="Enter a demo code" value="${escapeHTML(state.promoCode)}"><button type="submit">Apply</button></div><small>${state.promoCode ? `${escapeHTML(state.promoCode)} applied — ${Math.round(promoRates[state.promoCode] * 100)}% off.` : "Try STUDIO10 or WELCOME15 · demo only"}</small></form>` : `<div class="drawer-empty"><span>✳</span><h3>Your next favourite is waiting.</h3><p>Your bag is taking a little breather.</p><button class="button button-dark" type="button" data-action="close-overlay">Find a piece <span>↗</span></button></div>`;
  footer.innerHTML = items.length ? `
    <div class="cart-subtotal"><span>Subtotal</span><b>${money.format(subtotal)}</b></div>
    ${discount ? `<div class="cart-subtotal"><span>Studio note · ${escapeHTML(state.promoCode)}</span><span>−${money.format(discount)}</span></div>` : ""}
    <div class="cart-subtotal"><span>Delivery</span><span>${shipping ? money.format(shipping) : "Complimentary"}</span></div>
    <div class="cart-subtotal"><b>Total</b><b>${money.format(subtotal - discount + shipping)}</b></div>
    <p class="cart-small">Taxes included. Delivery calculated at checkout.</p>
    <button class="button button-dark cart-footer-button" type="button" data-action="checkout">Continue to checkout <span>↗</span></button>` : "";
  renderHeaderCounts();
}

function openOverlay(content, { drawer = false, wide = false } = {}) {
  const root = document.getElementById("overlay-root");
  if (!root) return;
  root.innerHTML = `<div class="overlay-backdrop${drawer ? " is-drawer" : ""}" data-action="backdrop-close"><section class="${drawer ? "drawer" : `dialog${wide ? " dialog-wide" : ""}`}" role="dialog" aria-modal="true" aria-label="${escapeHTML(content.title || "Furnique Studio")}">
    <div class="dialog-header"><div><span class="eyebrow">${escapeHTML(content.eyebrow || "FURNIQUE STUDIO")}</span><h2>${escapeHTML(content.title || "")}</h2></div><button class="dialog-close" type="button" data-action="close-overlay" aria-label="Close dialog">×</button></div>
    ${drawer ? `<div class="drawer-body" id="cart-body"></div><div class="drawer-footer" id="cart-footer"></div>` : `<div class="dialog-body">${content.body || ""}</div>`}
    </section></div>`;
  root.querySelector(".overlay-backdrop").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeOverlay();
  });
  if (drawer) renderCart();
  root.querySelector(".dialog-close")?.focus();
}

function closeOverlay() {
  document.getElementById("overlay-root").innerHTML = "";
}

function openCart() {
  openOverlay({ title: "Your bag", eyebrow: "A FEW GOOD THINGS" }, { drawer: true });
}

function openProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  openOverlay({
    title: product.name,
    eyebrow: `${product.category.toUpperCase()} · MADE WITH INTENTION`,
    body: `<div class="product-modal"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"><div class="product-modal-copy"><div class="review-stars">★★★★★ <span style="color:#77786f;font-size:9px;letter-spacing:0">${Number(product.rating).toFixed(1)} · ${Number(product.reviews)} sample reviews</span></div><h2>${escapeHTML(product.name)}</h2><p class="product-modal-price">${money.format(product.price)}${product.oldPrice ? ` <span style="color:#8c8d82;text-decoration:line-through;font-weight:400">${money.format(product.oldPrice)}</span>` : ""}</p><p>${escapeHTML(product.description)}</p><ul class="product-detail-list">${product.details.map((detail) => `<li>${escapeHTML(detail)}</li>`).join("")}</ul><p>${product.stock > 0 ? `${product.stock <= 5 ? `Only ${product.stock} left in the studio.` : "Ready to find a home."}` : "This piece is currently unavailable."}</p><button class="button button-dark" type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}" ${product.stock < 1 ? "disabled" : ""}>${product.stock > 0 ? "Add to your bag" : "Sold out"} <span>↗</span></button></div></div>`
  }, { wide: true });
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product || product.stock < 1) {
    showToast("This piece is currently out of stock.", "error");
    return;
  }
  const line = state.cart.find((item) => item.productId === id);
  if (line && line.quantity >= product.stock) {
    showToast("You have added all available pieces to your bag.", "error");
    return;
  }
  if (line) line.quantity += 1;
  else state.cart.push({ productId: id, quantity: 1 });
  saveCollection("cart");
  renderHeaderCounts();
  showToast(`${product.name} is in your bag.`);
  closeOverlay();
}

function setCartQuantity(id, amount) {
  const line = state.cart.find((item) => item.productId === id);
  const product = getProduct(id);
  if (!line || !product) return;
  const next = line.quantity + amount;
  if (next < 1) state.cart = state.cart.filter((item) => item.productId !== id);
  else if (next > product.stock) showToast("There are not enough pieces in stock.", "error");
  else line.quantity = next;
  saveCollection("cart");
  renderCart();
}

function openCheckout() {
  const subtotal = state.cart.reduce((sum, item) => sum + (getProduct(item.productId)?.price || 0) * item.quantity, 0);
  if (subtotal < 1) {
    showToast("Add a piece to your bag before checkout.", "error");
    return;
  }
  const shipping = state.settings.freeShipping && subtotal >= 25000 ? 0 : 1200;
  const discount = getDiscount(subtotal);
  openOverlay({
    title: "A few details, then home.",
    eyebrow: "SECURE DEMO CHECKOUT",
    body: `<form id="checkout-form">
      <div class="form-grid">
        <div class="field"><label for="checkout-name">Your name *</label><input id="checkout-name" name="name" autocomplete="name" required minlength="2" maxlength="70"></div>
        <div class="field"><label for="checkout-email">Email address *</label><input id="checkout-email" name="email" type="email" autocomplete="email" required maxlength="120"></div>
        <div class="field full"><label for="checkout-address">Delivery address *</label><input id="checkout-address" name="address" autocomplete="street-address" required minlength="8" maxlength="180"></div>
        <div class="field"><label for="checkout-city">City *</label><input id="checkout-city" name="city" autocomplete="address-level2" required maxlength="60"></div>
        <div class="field"><label for="checkout-postal">PIN code *</label><input id="checkout-postal" name="postal" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="postal-code" placeholder="6-digit PIN" required></div>
      </div>
      <div class="checkout-summary"><div><span>Items (${state.cart.reduce((sum, item) => sum + item.quantity, 0)})</span><span>${money.format(subtotal)}</span></div>${discount ? `<div><span>Studio note · ${escapeHTML(state.promoCode)}</span><span>−${money.format(discount)}</span></div>` : ""}<div><span>Delivery</span><span>${shipping ? money.format(shipping) : "Complimentary"}</span></div><div class="checkout-total"><span>Total (tax included)</span><span>${money.format(subtotal - discount + shipping)}</span></div></div>
      <p class="eyebrow">PAYMENT · DEMO MODE ONLY</p><div class="payment-options"><label><input type="radio" name="payment" value="Card · test mode" checked> Card / UPI (simulated, no charge)</label><label><input type="radio" name="payment" value="Cash on delivery"> Cash on delivery</label></div>
      <p class="form-error hidden" id="checkout-error" role="alert"></p>
      <button class="button button-dark" type="submit">Place demo order · ${money.format(subtotal - discount + shipping)} <span>↗</span></button>
      <p class="cart-small" style="margin:12px 0 0">Prototype only: payment is simulated; no real charge will be made.</p>
    </form>`
  }, { wide: true });
  document.getElementById("checkout-form").addEventListener("submit", placeOrder);
}

async function placeOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const unavailable = state.cart.find((item) => !getProduct(item.productId) || getProduct(item.productId).stock < item.quantity);
  if (unavailable) {
    const error = document.getElementById("checkout-error");
    error.textContent = "One of the pieces in your bag no longer has enough stock. Please review your bag.";
    error.classList.remove("hidden");
    return;
  }
  const subtotal = state.cart.reduce((sum, item) => sum + getProduct(item.productId).price * item.quantity, 0);
  const shipping = state.settings.freeShipping && subtotal >= 25000 ? 0 : 1200;
  const discount = getDiscount(subtotal);
  let serverOrder = null;
  if (await backendReady) {
    const requestBody = new URLSearchParams({
      name: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim().toLowerCase(),
      address: `${String(formData.get("address")).trim()}, ${String(formData.get("city")).trim()} ${String(formData.get("postal")).trim()}`,
      items: state.cart.map((item) => `${item.productId}:${item.quantity}`).join("|"),
      paymentMode: "TEST_SUCCESS",
      promoCode: state.promoCode
    });
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: requestBody
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Order request failed (${response.status}).`);
      serverOrder = result;
    } catch (error) {
      const checkoutError = document.getElementById("checkout-error");
      checkoutError.textContent = error instanceof Error ? error.message : "The order could not be placed. Please try again.";
      checkoutError.classList.remove("hidden");
      return;
    }
  }
  const orderId = serverOrder?.id || `FS-${String(Date.now()).slice(-6)}`;
  const order = {
    id: orderId,
    customer: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim().toLowerCase(),
    address: `${String(formData.get("address")).trim()}, ${String(formData.get("city")).trim()} ${String(formData.get("postal")).trim()}`,
    date: new Date().toISOString().slice(0, 10),
    total: serverOrder?.total ?? subtotal - discount + shipping,
    status: "Processing",
    payment: String(formData.get("payment")),
    inventoryReserved: true,
    inventoryReleased: false,
    items: state.cart.map((item) => {
      const product = getProduct(item.productId);
      product.stock -= item.quantity;
      return { productId: product.id, name: product.name, quantity: item.quantity };
    })
  };
  state.orders.unshift(order);
  state.cart = [];
  state.promoCode = "";
  saveCollection("orders");
  saveCollection("products");
  saveCollection("cart");
  openOverlay({
    title: "A little something to look forward to.",
    eyebrow: "ORDER PLACED · DEMO",
    body: `<div class="success-panel"><span class="success-mark">✓</span><h3>Thank you, ${escapeHTML(order.customer.split(" ")[0])}.</h3><p>Your order <strong>${escapeHTML(order.id)}</strong> is confirmed. We'll send an update to <strong>${escapeHTML(order.email)}</strong>.<br><br>This is a demo order. No payment was taken.</p><button class="button button-dark" type="button" data-action="continue-shopping">Back to the studio <span>↗</span></button></div>`
  });
  renderProducts();
  renderHeaderCounts();
}

function openWishlist() {
  const products = state.wishlist.map(getProduct).filter(Boolean);
  openOverlay({
    title: "Pieces you love",
    eyebrow: "SAVED FOR A LITTLE LATER",
    body: products.length ? `<div class="product-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:18px">${products.map((product) => `<article class="product-card"><div class="product-image" style="height:190px"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"><button class="product-favorite is-saved" type="button" data-action="wishlist" data-id="${escapeHTML(product.id)}" aria-label="Remove from saved pieces">♥</button></div><div class="product-info"><div><h3 class="product-name">${escapeHTML(product.name)}</h3><span class="product-category">${escapeHTML(product.category)}</span></div><span class="product-price">${money.format(product.price)}</span></div><button class="text-link" type="button" data-action="quick-view" data-id="${escapeHTML(product.id)}">Take a closer look ↗</button></article>`).join("")}</div>` : `<div class="success-panel"><span class="success-mark">♡</span><h3>A little room for a favourite.</h3><p>Tap the heart on a piece to save it here for later.</p><button class="button button-dark" type="button" data-action="continue-shopping">Explore the collection <span>↗</span></button></div>`
  }, { wide: products.length > 0 });
}

function openTrackOrder() {
  openOverlay({
    title: "Find your order.",
    eyebrow: "A LITTLE UPDATE FOR YOU",
    body: `<form id="track-order-form"><div class="field"><label for="track-order-id">Order number</label><input id="track-order-id" name="orderId" placeholder="For example, FS-2409" required></div><div class="field" style="margin-top:12px"><label for="track-order-email">Email used at checkout</label><input id="track-order-email" name="email" type="email" placeholder="you@example.com" required></div><p class="form-error hidden" id="track-order-error" role="alert"></p><button class="button button-dark" style="margin-top:18px" type="submit">Look up my order <span>↗</span></button></form>`
  });
  document.getElementById("track-order-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order = state.orders.find((item) => item.id.toLowerCase() === String(data.get("orderId")).trim().toLowerCase() && item.email.toLowerCase() === String(data.get("email")).trim().toLowerCase());
    const error = document.getElementById("track-order-error");
    if (!order) {
      error.textContent = "We couldn't find an order matching those details. Please check and try again.";
      error.classList.remove("hidden");
      return;
    }
    openOverlay({
      title: `Order ${order.id}`,
      eyebrow: "YOUR PIECE IS ON ITS WAY",
      body: `<div class="success-panel"><span class="success-mark">${order.status === "Delivered" ? "✓" : "⌂"}</span><h3>${escapeHTML(order.status)}</h3><p>${order.items.map((item) => `${escapeHTML(item.name)} × ${item.quantity}`).join("<br>")}<br><br>Delivery to ${escapeHTML(order.address)}<br>Total ${money.format(order.total)}</p><button class="button button-outline" type="button" data-action="continue-shopping">Back to the studio <span>↗</span></button></div>`
    });
  });
}

function setReview(index) {
  state.reviewIndex = (index + reviews.length) % reviews.length;
  const review = reviews[state.reviewIndex];
  document.getElementById("review-quote").textContent = review.quote;
  document.getElementById("review-name").textContent = review.name;
  document.getElementById("review-location").textContent = review.location;
  document.querySelector(".review-avatar").textContent = review.initial;
  document.getElementById("review-count").textContent = `${String(state.reviewIndex + 1).padStart(2, "0")} / ${String(reviews.length).padStart(2, "0")}`;
}

function formatDate(value) {
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? escapeHTML(value) : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function renderAdmin() {
  const root = document.getElementById("admin-app");
  const gross = state.orders.filter((order) => order.status !== "Cancelled").reduce((total, order) => total + order.total, 0);
  const delivered = state.orders.filter((order) => order.status === "Delivered").length;
  const lowStock = state.products.filter((product) => product.stock < 5).length;
  const labels = ["Overview", "Orders", "Products", "Customers", "Marketing", "Settings"];
  const symbols = ["▦", "▤", "◫", "♙", "✧", "⚙"];
  const nav = labels.map((label, index) => {
    const key = label.toLowerCase();
    return `<button type="button" class="admin-nav-button${state.adminView === key ? " is-active" : ""}" data-action="admin-view" data-view="${key}"><span>${symbols[index]}</span>${label}</button>`;
  }).join("");
  root.innerHTML = `
    <header class="admin-topbar"><div class="admin-top-left"><button class="admin-back" type="button" data-action="storefront">←</button><a class="admin-logo" href="#admin">Furnique<span>Studio workspace</span></a></div><div class="admin-top-right"><span>Store status · <b style="color:#64845e;font-weight:500">Open</b></span><div class="admin-avatar">FS</div></div></header>
    <div class="admin-layout"><aside class="admin-sidebar"><p class="admin-side-label">WORKSPACE</p>${nav}<div class="admin-side-bottom">Demo workspace<br>Changes are saved in this browser.</div></aside><section class="admin-content"><div class="admin-preview-note"><b>Prototype workspace:</b> This admin preview is for demonstration. It uses this browser's local storage; it is not connected to a secure backend or a real payment system.</div>${renderAdminView(gross, delivered, lowStock)}</section></div>`;
}

function renderAdminView(gross, delivered, lowStock) {
  if (state.adminView === "orders") return renderAdminOrders();
  if (state.adminView === "products") return renderAdminProducts();
  if (state.adminView === "customers") return renderAdminCustomers();
  if (state.adminView === "marketing") return renderAdminMarketing();
  if (state.adminView === "settings") return renderAdminSettings();
  const week = [3, 5, 4, 7, 5, 8, Math.max(2, state.orders.length)].map((count) => Math.min(count, 12));
  const max = Math.max(...week);
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">${escapeHTML(today)}</span><h1>Good afternoon, Studio.</h1><p>Here's what's happening in your little corner of the world.</p></div><button class="admin-button" type="button" data-action="admin-view" data-view="orders">View all orders&nbsp; ↗</button></div>
    <div class="admin-stats">
      <article class="admin-stat"><div class="admin-stat-top"><span>Gross sales</span><span>↗</span></div><strong>${money.format(gross)}</strong><small>Across ${state.orders.length} demo orders</small></article>
      <article class="admin-stat"><div class="admin-stat-top"><span>Orders</span><span>↗</span></div><strong>${state.orders.length}</strong><small>${state.orders.filter((order) => order.status === "Processing").length} need a little attention</small></article>
      <article class="admin-stat"><div class="admin-stat-top"><span>Pieces in the studio</span><span>◫</span></div><strong>${state.products.reduce((sum, item) => sum + item.stock, 0)}</strong><small>${lowStock} low-stock pieces to check</small></article>
      <article class="admin-stat"><div class="admin-stat-top"><span>Delivered with care</span><span>✓</span></div><strong>${delivered}</strong><small>${state.orders.length ? Math.round(delivered / state.orders.length * 100) : 0}% of all orders</small></article>
    </div>
    <div class="admin-grid-two"><section class="admin-panel"><div class="admin-panel-head"><div><h2>A few good weeks</h2><p>Orders placed · demo data</p></div><span class="admin-eyebrow">LAST 7 DAYS</span></div><div class="admin-panel-body"><div class="admin-chart">${week.map((count, index) => `<div class="chart-column"><div class="chart-bar" style="height:${Math.max(11, Math.round(count / max * 138))}px" title="${count} orders"></div><span>${["M","T","W","T","F","S","S"][index]}</span></div>`).join("")}</div></div></section>
      <section class="admin-panel"><div class="admin-panel-head"><div><h2>Needs a little love</h2><p>Things to take a look at</p></div></div><div class="admin-panel-body"><div class="admin-order-line"><div><b>${state.orders.filter((order) => order.status === "Processing").length} orders to prepare</b><small>Ready for a studio check-in</small></div><strong>↗</strong></div><div class="admin-order-line"><div><b>${lowStock} pieces running low</b><small>${state.settings.lowStockAlerts ? "Low-stock alerts are on" : "Low-stock alerts are off"}</small></div><strong>↗</strong></div><div class="admin-order-line"><div><b>${state.products.length} pieces on the floor</b><small>Across Living, Dining & Bedroom</small></div><strong>✧</strong></div></div></section></div>
    <section class="admin-panel"><div class="admin-panel-head"><div><h2>Recent orders</h2><p>A little snapshot of your store</p></div><button class="admin-button" type="button" data-action="admin-view" data-view="orders">All orders&nbsp; ↗</button></div>${adminOrdersTable(state.orders.slice(0, 5), false)}</section>`;
}

function adminOrdersTable(orders, editable = true) {
  if (!orders.length) return `<div class="admin-empty">No orders here yet.</div>`;
  return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>TOTAL</th><th>STATUS</th>${editable ? "<th>UPDATE</th>" : ""}</tr></thead><tbody>${orders.map((order) => `<tr><td><b>${escapeHTML(order.id)}</b></td><td>${escapeHTML(order.customer)}<br><span style="color:#91978f;font-size:8px">${escapeHTML(order.email)}</span></td><td>${formatDate(order.date)}</td><td>${money.format(order.total)}</td><td><span class="status-pill status-${escapeHTML(order.status.toLowerCase())}">${escapeHTML(order.status)}</span></td>${editable ? `<td><select data-action="order-status" data-id="${escapeHTML(order.id)}" aria-label="Update status for ${escapeHTML(order.id)}">${["Processing", "Shipped", "Delivered", "Cancelled"].map((status) => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></td>` : ""}</tr>`).join("")}</tbody></table></div>`;
}

function renderAdminOrders() {
  const query = state.adminSearch.trim().toLowerCase();
  const orders = state.orders.filter((order) => `${order.id} ${order.customer} ${order.email} ${order.status}`.toLowerCase().includes(query));
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">YOUR CUSTOMERS' GOOD NEWS</span><h1>Orders</h1><p>Review and update every order with care.</p></div><button class="admin-button" type="button" data-action="export-orders">Export orders&nbsp; ↓</button></div><section class="admin-panel"><div class="admin-toolbar"><input class="admin-search" type="search" placeholder="Search by order, name or email" value="${escapeHTML(state.adminSearch)}" data-admin-search="true"><span class="admin-eyebrow">${orders.length} ORDERS</span></div>${adminOrdersTable(orders)}</section>`;
}

function renderAdminProductRow(product) {
  const isEditing = state.editingProductId === product.id;
  return `<tr><td><b>${escapeHTML(product.name)}</b></td><td>${escapeHTML(product.category)}</td><td>${money.format(product.price)}</td><td class="${product.stock < 5 ? "inventory-low" : ""}">${product.stock}</td><td><span class="status-pill ${product.stock ? "status-delivered" : "status-cancelled"}">${product.stock ? "Active" : "Sold out"}</span></td><td><button class="admin-button" type="button" data-action="edit-product" data-id="${escapeHTML(product.id)}">Edit</button> <button class="admin-button danger" type="button" data-action="delete-product" data-id="${escapeHTML(product.id)}">Remove</button></td></tr>${isEditing ? `<tr><td colspan="6"><form class="admin-inline-form" id="admin-edit-product-form" data-id="${escapeHTML(product.id)}"><div class="field"><label for="edit-name">Piece name</label><input id="edit-name" name="name" value="${escapeHTML(product.name)}" required maxlength="80"></div><div class="field"><label for="edit-image">Image URL</label><input id="edit-image" name="image" type="url" value="${escapeHTML(product.image)}" required></div><div class="field"><label for="edit-price">Price (₹)</label><input id="edit-price" name="price" type="number" min="1" step="1" value="${product.price}" required></div><div class="field"><label for="edit-stock">Stock</label><input id="edit-stock" name="stock" type="number" min="0" step="1" value="${product.stock}" required></div><div class="field"><label for="edit-category">Category</label><select id="edit-category" name="category">${["Living", "Dining", "Bedroom"].map((category) => `<option ${category === product.category ? "selected" : ""}>${category}</option>`).join("")}</select></div><div class="field"><button class="admin-button primary" type="submit">Save changes</button><button class="admin-button" type="button" data-action="cancel-edit">Cancel</button></div></form></td></tr>` : ""}`;
}

function renderAdminProducts() {
  const query = state.adminSearch.trim().toLowerCase();
  const products = state.products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query));
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">THE THOUGHTFUL THINGS</span><h1>Products</h1><p>Manage your collection and keep an eye on stock.</p></div><button class="admin-button primary" type="button" data-action="new-product">+ Add a piece</button></div><section class="admin-panel"><div class="admin-toolbar"><input class="admin-search" type="search" placeholder="Find a product" value="${escapeHTML(state.adminSearch)}" data-admin-search="true"><span class="admin-eyebrow">${products.length} PIECES</span></div>${state.productFormOpen ? `<form class="admin-inline-form" id="admin-product-form"><div class="field"><label for="admin-new-name">Piece name</label><input id="admin-new-name" name="name" required maxlength="80"></div><div class="field"><label for="admin-new-image">Image URL</label><input id="admin-new-image" name="image" type="url" placeholder="https://…" required></div><div class="field"><label for="admin-new-price">Price (₹)</label><input id="admin-new-price" name="price" type="number" min="1" step="1" required></div><div class="field"><label for="admin-new-stock">Stock</label><input id="admin-new-stock" name="stock" type="number" min="0" step="1" required></div><div class="field"><label for="admin-new-category">Category</label><select id="admin-new-category" name="category"><option>Living</option><option>Dining</option><option>Bedroom</option></select><button class="admin-button primary" style="margin-top:8px" type="submit">Save piece</button></div></form>` : ""}<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>PIECE</th><th>CATEGORY</th><th>PRICE</th><th>IN STOCK</th><th>VISIBILITY</th><th>ACTION</th></tr></thead><tbody>${products.map(renderAdminProductRow).join("") || `<tr><td colspan="6"><div class="admin-empty">No matching pieces.</div></td></tr>`}</tbody></table></div></section>`;
}

function renderAdminCustomers() {
  const customers = new Map();
  state.orders.forEach((order) => {
    const key = order.email.toLowerCase();
    const current = customers.get(key) || { name: order.customer, email: order.email, orders: 0, spend: 0, lastOrder: order.date };
    current.orders += 1;
    if (order.status !== "Cancelled") current.spend += order.total;
    if (order.date > current.lastOrder) current.lastOrder = order.date;
    customers.set(key, current);
  });
  const query = state.adminSearch.trim().toLowerCase();
  const rows = [...customers.values()].filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query));
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">THE PEOPLE WHO MAKE IT HOME</span><h1>Customers</h1><p>Customer details are only kept for these local demo orders.</p></div></div><section class="admin-panel"><div class="admin-toolbar"><input class="admin-search" type="search" placeholder="Find a customer" value="${escapeHTML(state.adminSearch)}" data-admin-search="true"><span class="admin-eyebrow">${rows.length} CUSTOMERS</span></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>CUSTOMER</th><th>ORDERS</th><th>SPENT</th><th>LAST ORDER</th></tr></thead><tbody>${rows.map((customer) => `<tr><td><b>${escapeHTML(customer.name)}</b><br><span style="color:#91978f;font-size:8px">${escapeHTML(customer.email)}</span></td><td>${customer.orders}</td><td>${money.format(customer.spend)}</td><td>${formatDate(customer.lastOrder)}</td></tr>`).join("") || `<tr><td colspan="4"><div class="admin-empty">No matching customers.</div></td></tr>`}</tbody></table></div></section>`;
}

function renderAdminMarketing() {
  const subscribers = readStorage(STORAGE_KEYS.newsletter, []);
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">A NOTE FROM THE STUDIO</span><h1>Marketing</h1><p>Manage gentle reminders and studio news.</p></div></div><div class="admin-grid-two"><section class="admin-panel"><div class="admin-panel-head"><div><h2>Studio notes</h2><p>A demo discount to welcome someone home.</p></div></div><div class="admin-panel-body"><div class="admin-order-line"><div><b>STUDIO10</b><small>10% off · demo code · no expiry set</small></div><button class="admin-button" data-action="copy-code" data-code="STUDIO10">Copy</button></div><div class="admin-order-line"><div><b>WELCOME15</b><small>15% off · demo code · first order only</small></div><button class="admin-button" data-action="copy-code" data-code="WELCOME15">Copy</button></div><p class="cart-small" style="margin-top:12px">Discounts are demo-only and not applied to real payments.</p></div></section><section class="admin-panel"><div class="admin-panel-head"><div><h2>Newsletter friends</h2><p>Emails saved in this browser only.</p></div><span class="status-pill status-delivered">${subscribers.length} SIGNED UP</span></div><div class="admin-panel-body">${subscribers.length ? subscribers.map((email) => `<div class="admin-order-line"><div><b>${escapeHTML(email)}</b><small>Studio notes subscriber</small></div></div>`).join("") : `<div class="admin-empty">No one has signed up just yet.</div>`}</div></section></div>`;
}

function renderAdminSettings() {
  const settings = [
    ["freeShipping", "Complimentary delivery", "Orders above ₹25,000 get free delivery."],
    ["lowStockAlerts", "Low-stock alerts", "Flag products with fewer than five pieces."],
    ["newsletter", "Studio notes", "Allow local demo newsletter sign-ups."]
  ];
  return `<div class="admin-title-row"><div><span class="admin-eyebrow">THE LITTLE DETAILS</span><h1>Settings</h1><p>Simple store preferences for this browser demo.</p></div></div><div class="admin-settings-grid"><section class="admin-panel"><div class="admin-panel-head"><div><h2>Store preferences</h2><p>These controls are saved locally.</p></div></div><div class="admin-panel-body">${settings.map(([key, title, description]) => `<div class="admin-setting"><div><b>${title}</b><small>${description}</small></div><button class="admin-toggle${state.settings[key] ? " is-on" : ""}" type="button" aria-label="Toggle ${title}" aria-pressed="${state.settings[key]}" data-action="setting-toggle" data-setting="${key}"></button></div>`).join("")}</div></section><section class="admin-panel"><div class="admin-panel-head"><div><h2>Demo data</h2><p>Reset products and clear your local changes.</p></div></div><div class="admin-panel-body"><p class="cart-small" style="line-height:1.7">Your changes are stored only in this browser. Resetting restores the original product collection and example orders.</p><button class="admin-button danger" type="button" data-action="reset-demo">Reset demo data</button></div></section></div>`;
}

function openAdmin() {
  window.location.assign("admin-login.html");
}

function openStorefront() {
  document.getElementById("admin-app").classList.add("hidden");
  document.getElementById("storefront").classList.remove("hidden");
  history.replaceState(null, "", "#home");
  window.scrollTo(0, 0);
}

function updateOrderStatus(orderId, nextStatus) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || order.status === nextStatus) return;
  const wasCancelled = order.status === "Cancelled";
  const willBeCancelled = nextStatus === "Cancelled";
  if (order.inventoryReserved && !wasCancelled && willBeCancelled) {
    order.items.forEach((item) => {
      const product = getProduct(item.productId);
      if (product) product.stock += item.quantity;
    });
    order.inventoryReserved = false;
    order.inventoryReleased = true;
    saveCollection("products");
  } else if (order.inventoryReleased && wasCancelled && !willBeCancelled) {
    const unavailable = order.items.find((item) => !getProduct(item.productId) || getProduct(item.productId).stock < item.quantity);
    if (unavailable) {
      showToast("There is not enough stock to reopen this cancelled order.", "error");
      renderAdmin();
      return;
    }
    order.items.forEach((item) => {
      getProduct(item.productId).stock -= item.quantity;
    });
    order.inventoryReserved = true;
    order.inventoryReleased = false;
    saveCollection("products");
  }
  order.status = nextStatus;
  saveCollection("orders");
  renderAdmin();
  renderProducts();
  showToast(`Order ${order.id} is now ${order.status.toLowerCase()}.`);
}

function exportOrders() {
  const columns = ["order", "customer", "email", "date", "status", "total_inr", "payment"];
  const rows = state.orders.map((order) => [order.id, order.customer, order.email, order.date, order.status, order.total, order.payment]);
  const csv = [columns, ...rows].map((row) => row.map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "furnique-demo-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Your demo orders are ready to download.");
}

document.addEventListener("click", (event) => {
  const categoryLink = event.target.closest("[data-category-link]");
  if (categoryLink && document.getElementById("product-grid")) {
    event.preventDefault();
    state.activeCategory = categoryLink.dataset.categoryLink;
    state.search = "";
    document.getElementById("site-search").value = "";
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    document.querySelector(".main-nav")?.classList.remove("is-open");
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "wishlist") {
    state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id];
    saveCollection("wishlist");
    renderProducts();
    renderHeaderCounts();
    if (!document.getElementById("overlay-root").innerHTML) showToast(state.wishlist.includes(id) ? "Saved for a little later." : "Removed from your saved pieces.");
    else if (document.getElementById("overlay-root").querySelector(".dialog")) openWishlist();
  }
  if (action === "quick-view") openProduct(id);
  if (action === "add-cart") addToCart(id);
  if (action === "cart-quantity") setCartQuantity(id, Number(button.dataset.change));
  if (action === "remove-cart") {
    state.cart = state.cart.filter((item) => item.productId !== id);
    saveCollection("cart");
    renderCart();
  }
  if (action === "close-overlay" || action === "continue-shopping") closeOverlay();
  if (action === "checkout") openCheckout();
  if (action === "admin") openAdmin();
  if (action === "storefront") openStorefront();
  if (action === "admin-view") {
    state.adminView = button.dataset.view;
    state.adminSearch = "";
    renderAdmin();
  }
  if (action === "new-product") {
    state.productFormOpen = !state.productFormOpen;
    state.editingProductId = null;
    renderAdmin();
  }
  if (action === "edit-product") {
    state.productFormOpen = false;
    state.editingProductId = id;
    renderAdmin();
  }
  if (action === "cancel-edit") {
    state.editingProductId = null;
    renderAdmin();
  }
  if (action === "delete-product") {
    const hasOrderHistory = state.orders.some((order) => order.items.some((item) => item.productId === id));
    if (hasOrderHistory) {
      showToast("This piece is in an order history. Set its stock to 0 instead of removing it.", "error");
      return;
    }
    const product = getProduct(id);
    if (!product) return;
    state.products = state.products.filter((item) => item.id !== id);
    saveCollection("products");
    renderAdmin();
    renderProducts();
    showToast(`${product.name} has been removed from the collection.`);
  }
  if (action === "setting-toggle") {
    const key = button.dataset.setting;
    if (Object.hasOwn(state.settings, key)) {
      state.settings[key] = !state.settings[key];
      saveCollection("settings");
      renderAdmin();
      showToast("Your studio preference has been saved.");
    }
  }
  if (action === "export-orders") exportOrders();
  if (action === "copy-code") {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(button.dataset.code).then(() => showToast(`${button.dataset.code} copied.`)).catch(() => showToast(`Use code ${button.dataset.code} at checkout.`));
    } else {
      showToast(`Use code ${button.dataset.code} at checkout.`);
    }
  }
  if (action === "reset-demo") {
    if (!window.confirm("Reset this browser's demo products, orders, saved pieces and bag?")) return;
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    state.products = structuredClone(initialProducts);
    state.cart = [];
    state.wishlist = [];
    state.orders = structuredClone(initialOrders);
    state.settings = { freeShipping: true, lowStockAlerts: true, newsletter: true };
    state.adminSearch = "";
    state.productFormOpen = false;
    state.editingProductId = null;
    saveCollection("products");
    saveCollection("orders");
    saveCollection("settings");
    renderAdmin();
    renderProducts();
    renderHeaderCounts();
    showToast("The studio demo is back to its original state.");
  }
  if (action === "clear-search") {
    state.search = "";
    state.activeCategory = "All";
    document.getElementById("site-search").value = "";
    renderProducts();
  }
  if (action === "review-prev") setReview(state.reviewIndex - 1);
  if (action === "review-next") setReview(state.reviewIndex + 1);
  if (action === "track-order") openTrackOrder();
  if (action === "help") openOverlay({ title: "A little help, whenever you need it.", eyebrow: "HERE WHEN YOU NEED US", body: `<p style="color:#707168;font-size:11px;line-height:1.9">Delivery is complimentary on orders above ₹25,000. For other orders, a ₹1,200 delivery fee is shown at checkout. If your new piece doesn't feel right, get in touch within 14 days of delivery and we'll help arrange a return.</p><p style="color:#707168;font-size:11px;line-height:1.9">For care advice or a hand from our team, write to <a href="mailto:hello@furniquestudio.example" style="text-decoration:underline">hello@furniquestudio.example</a> (Mon–Sat, 10am–6pm IST).</p>` });
  if (action === "privacy") openOverlay({ title: "Your space is yours.", eyebrow: "PRIVACY, IN PLAIN WORDS", body: `<p style="color:#707168;font-size:11px;line-height:1.9">This student prototype stores demo cart and saved pieces in your browser. If you create an account, your name and email plus a salted password hash are stored by the Java server. Sign-in uses an HttpOnly session cookie. Demo checkout details are stored with test orders and are not sent to a payment provider. Please use test details only. <a href="privacy.html" style="text-decoration:underline">Read the full prototype privacy notice</a>.</p>` });
  if (action === "terms") openOverlay({ title: "The thoughtful details.", eyebrow: "DEMO TERMS", body: `<p style="color:#707168;font-size:11px;line-height:1.9">Furnique Studio is a student e-commerce prototype. Product availability, delivery estimates, prices, offers and order statuses are illustrative. No real order, payment, fulfilment or return is created. Payments are simulated in test mode only.</p>` });
});

document.addEventListener("change", (event) => {
  if (event.target.matches(".filter-chip")) {
    state.activeCategory = event.target.dataset.filter;
    renderProducts();
  }
  if (event.target.id === "sort-products") {
    state.sort = event.target.value;
    renderProducts();
  }
  if (event.target.matches('[data-action="order-status"]')) {
    updateOrderStatus(event.target.dataset.id, event.target.value);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "site-search") {
    state.search = event.target.value;
    renderProducts();
  }
  if (event.target.matches("[data-admin-search]")) {
    const caret = event.target.selectionStart;
    state.adminSearch = event.target.value;
    renderAdmin();
    const updated = document.querySelector("[data-admin-search]");
    updated?.focus();
    updated?.setSelectionRange(caret, caret);
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "promo-form") {
    event.preventDefault();
    const code = String(new FormData(event.target).get("code") || "").trim().toUpperCase();
    if (!Object.hasOwn(promoRates, code)) {
      state.promoCode = "";
      showToast("That studio note isn't in the drawer. Try STUDIO10 or WELCOME15.", "error");
    } else {
      state.promoCode = code;
      showToast(`${code} is ready for checkout.`);
    }
    renderCart();
  }
  if (event.target.id === "newsletter-form") {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    const email = document.getElementById("newsletter-email");
    if (!state.settings.newsletter) {
      document.getElementById("newsletter-message").textContent = "Studio notes are paused for a little while.";
      return;
    }
    const subscribers = readStorage(STORAGE_KEYS.newsletter, []);
    if (subscribers.includes(email.value.trim().toLowerCase())) {
      document.getElementById("newsletter-message").textContent = "You're already on the list. Lovely to have you.";
      return;
    }
    subscribers.push(email.value.trim().toLowerCase());
    writeStorage(STORAGE_KEYS.newsletter, subscribers);
    document.getElementById("newsletter-message").textContent = "You're on the list. Look out for a note from us soon.";
    email.value = "";
    showToast("You're on the studio notes list.");
  }
  if (event.target.id === "admin-product-form") {
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    const formData = new FormData(event.target);
    const product = {
      id: `p-${Date.now()}`,
      name: String(formData.get("name")).trim(),
      category: String(formData.get("category")),
      price: Number(formData.get("price")),
      oldPrice: null,
      rating: 5,
      reviews: 0,
      stock: Number(formData.get("stock")),
      label: "New arrival",
      image: String(formData.get("image")).trim(),
      description: "A thoughtful new piece, added to the studio collection.",
      details: ["Responsibly made", "Designed for everyday living", "A Furnique Studio original"]
    };
    if (!Number.isFinite(product.price) || product.price < 1 || !Number.isInteger(product.stock) || product.stock < 0 || !/^https?:\/\//i.test(product.image)) {
      showToast("Check the price, stock and image URL before saving.", "error");
      return;
    }
    state.products.unshift(product);
    state.productFormOpen = false;
    saveCollection("products");
    renderAdmin();
    renderProducts();
    showToast(`${product.name} has been added to the collection.`);
  }
  if (event.target.id === "admin-edit-product-form") {
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    const product = getProduct(event.target.dataset.id);
    if (!product) {
      showToast("This piece could not be found in the studio.", "error");
      return;
    }
    const formData = new FormData(event.target);
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const image = String(formData.get("image")).trim();
    if (!Number.isFinite(price) || price < 1 || !Number.isInteger(stock) || stock < 0 || !/^https?:\/\//i.test(image)) {
      showToast("Check the price, stock and image URL before saving.", "error");
      return;
    }
    product.name = String(formData.get("name")).trim();
    product.category = String(formData.get("category"));
    product.price = price;
    product.stock = stock;
    product.image = image;
    state.editingProductId = null;
    saveCollection("products");
    renderAdmin();
    renderProducts();
    showToast(`${product.name} has been updated.`);
  }
});

document.querySelector(".cart-open").addEventListener("click", openCart);
document.querySelector(".wishlist-open").addEventListener("click", openWishlist);
document.querySelector(".mobile-menu").addEventListener("click", (event) => {
  const isOpen = document.querySelector(".main-nav").classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeOverlay();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("site-search").focus();
  }
});

renderProducts();
renderHeaderCounts();
if (window.location.hash === "#admin") openAdmin();
backendReady.then(async (available) => {
  if (!available) return;
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
    const result = await response.json();
    if (!Array.isArray(result.products)) throw new Error("The catalog response has an invalid format.");
    const serverProducts = new Map(result.products.map((product) => [product.id, product]));
    state.products = state.products.map((product) => {
      const current = serverProducts.get(product.id);
      return current ? { ...product, name: current.name, category: current.category, price: current.price, stock: current.stock } : product;
    });
    renderProducts();
  } catch (error) {
    console.error("Could not load the server catalog.", error);
    showToast("The live catalog could not be loaded. Please refresh and try again.", "error");
  }
});
