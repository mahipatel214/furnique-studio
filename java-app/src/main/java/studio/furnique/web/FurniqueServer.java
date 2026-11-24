package studio.furnique.web;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import studio.furnique.cloud.BackupService;
import studio.furnique.domain.CartLine;
import studio.furnique.domain.CustomerAccount;
import studio.furnique.domain.Order;
import studio.furnique.domain.OrderItem;
import studio.furnique.domain.Product;
import studio.furnique.exception.InvalidOrderException;
import studio.furnique.exception.OutOfStockException;
import studio.furnique.exception.PaymentFailedException;
import studio.furnique.exception.PersistenceException;
import studio.furnique.persistence.AccountRepository;
import studio.furnique.persistence.FileAccountRepository;
import studio.furnique.persistence.FileOrderRepository;
import studio.furnique.persistence.JdbcAccountRepository;
import studio.furnique.persistence.JdbcOrderRepository;
import studio.furnique.persistence.OrderRepository;
import studio.furnique.service.AuthService;
import studio.furnique.service.DemoPaymentProcessor;
import studio.furnique.service.OrderService;
import studio.furnique.service.ProductCatalog;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Executors;

public final class FurniqueServer {
    private FurniqueServer() { }

    public static void main(String[] args) throws Exception {
        int port = Integer.parseInt(environment("PORT", "8080"));
        String databaseUrl = System.getenv("DB_URL");
        OrderRepository repository;
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            repository = new JdbcOrderRepository(databaseUrl, environment("DB_USER", ""),
                    environment("DB_PASSWORD", ""));
        } else {
            repository = new FileOrderRepository(Paths.get(environment("DATA_DIRECTORY", "data"),
                    "furnique-orders.bin"));
        }
        AccountRepository accountRepository;
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            accountRepository = new JdbcAccountRepository(databaseUrl, environment("DB_USER", ""),
                    environment("DB_PASSWORD", ""));
        } else {
            accountRepository = new FileAccountRepository(Paths.get(environment("DATA_DIRECTORY", "data"),
                    "furnique-customers.bin"));
        }
        AuthService auth = new AuthService(accountRepository, System.getenv("ADMIN_EMAIL"),
                System.getenv("ADMIN_PASSWORD"));
        SessionStore sessions = new SessionStore("true".equalsIgnoreCase(environment("COOKIE_SECURE", "false")));
        AuthRateLimiter authRateLimiter = new AuthRateLimiter();

        ProductCatalog catalog = ProductCatalog.demoCatalog();
        BackupService backupService = BackupService.fromEnvironment();
        Runnable backupTask = () -> {
            try {
                backupService.backup(repository.findAll());
            } catch (IOException | PersistenceException error) {
                throw new IllegalStateException("Could not write or upload the order backup.", error);
            }
        };
        OrderService orders = new OrderService(catalog, repository, new DemoPaymentProcessor(), backupTask);
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
        server.createContext("/api/health", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "GET");
            sendJson(exchange, 200, "{\"status\":\"ok\",\"service\":\"furnique\"}");
        }));
        server.createContext("/api/auth/register", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "POST");
            requireSameOrigin(exchange);
            String rateKey = "register:" + exchange.getRemoteAddress().getAddress().getHostAddress();
            if (!authRateLimiter.allow(rateKey)) {
                sendJson(exchange, 429, "{\"error\":\"Too many account requests. Try again in 15 minutes.\"}");
                return;
            }
            authRateLimiter.record(rateKey);
            Map<String, String> form = parseForm(readBody(exchange.getRequestBody()));
            if (!"on".equals(form.get("privacyAcknowledged"))) {
                throw new IllegalArgumentException("Confirm that you have read the prototype privacy notice.");
            }
            CustomerAccount account = auth.register(form.get("name"), form.get("email"),
                    form.getOrDefault("password", "").toCharArray());
            if (account == null) {
                sendJson(exchange, 409, "{\"error\":\"An account with that email already exists.\"}");
                return;
            }
            sessions.invalidate(sessions.find(exchange));
            SessionStore.Session session = sessions.create("customer", account.getEmail(), account.getName());
            sessions.setCookie(exchange, session);
            sendJson(exchange, 201, sessionJson(session));
        }));
        server.createContext("/api/auth/login", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "POST");
            requireSameOrigin(exchange);
            String rateKey = "login:" + exchange.getRemoteAddress().getAddress().getHostAddress();
            if (!authRateLimiter.allow(rateKey)) {
                sendJson(exchange, 429, "{\"error\":\"Too many sign-in attempts. Try again in 15 minutes.\"}");
                return;
            }
            Map<String, String> form = parseForm(readBody(exchange.getRequestBody()));
            CustomerAccount account = auth.authenticateCustomer(form.get("email"),
                    form.getOrDefault("password", "").toCharArray());
            if (account == null) {
                authRateLimiter.record(rateKey);
                sendJson(exchange, 401, "{\"error\":\"Email or password is incorrect.\"}");
                return;
            }
            authRateLimiter.clear(rateKey);
            sessions.invalidate(sessions.find(exchange));
            SessionStore.Session session = sessions.create("customer", account.getEmail(), account.getName());
            sessions.setCookie(exchange, session);
            sendJson(exchange, 200, sessionJson(session));
        }));
        server.createContext("/api/auth/session", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "GET");
            SessionStore.Session session = sessions.find(exchange);
            if (session == null) {
                sendJson(exchange, 401, "{\"error\":\"Please sign in to continue.\"}");
                return;
            }
            sendJson(exchange, 200, sessionJson(session));
        }));
        server.createContext("/api/auth/logout", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "POST");
            requireSameOrigin(exchange);
            sessions.invalidate(sessions.find(exchange));
            sessions.clearCookie(exchange);
            sendJson(exchange, 200, "{\"signedOut\":true}");
        }));
        server.createContext("/api/admin/login", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "POST");
            requireSameOrigin(exchange);
            if (!auth.isAdminConfigured()) {
                sendJson(exchange, 503, "{\"error\":\"Admin sign-in is not configured on this server.\"}");
                return;
            }
            String rateKey = "login:" + exchange.getRemoteAddress().getAddress().getHostAddress();
            if (!authRateLimiter.allow(rateKey)) {
                sendJson(exchange, 429, "{\"error\":\"Too many sign-in attempts. Try again in 15 minutes.\"}");
                return;
            }
            Map<String, String> form = parseForm(readBody(exchange.getRequestBody()));
            boolean authenticated = auth.authenticateAdmin(form.get("email"),
                    form.getOrDefault("password", "").toCharArray());
            if (!authenticated) {
                authRateLimiter.record(rateKey);
                sendJson(exchange, 401, "{\"error\":\"Email or password is incorrect.\"}");
                return;
            }
            authRateLimiter.clear(rateKey);
            sessions.invalidate(sessions.find(exchange));
            SessionStore.Session session = sessions.create("admin", form.get("email").trim().toLowerCase(Locale.ROOT),
                    "Furnique administrator");
            sessions.setCookie(exchange, session);
            sendJson(exchange, 200, sessionJson(session));
        }));
        server.createContext("/api/products", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "GET");
            StringBuilder json = new StringBuilder("{\"products\":[");
            List<Product> products = catalog.all();
            for (int i = 0; i < products.size(); i++) {
                if (i > 0) json.append(',');
                Product product = products.get(i);
                json.append("{\"id\":\"").append(escape(product.getId())).append("\",\"name\":\"")
                        .append(escape(product.getName())).append("\",\"category\":\"")
                        .append(escape(product.getCategory())).append("\",\"price\":")
                        .append(product.getPriceInr()).append(",\"stock\":").append(product.getStock()).append('}');
            }
            sendJson(exchange, 200, json.append("]}").toString());
        }));
        server.createContext("/api/admin/orders", exchange -> handle(exchange, () -> {
            requireMethod(exchange, "GET");
            requireAdmin(exchange, sessions);
            sendJson(exchange, 200, ordersJson(orders.allOrders()));
        }));
        server.createContext("/api/orders", exchange -> handle(exchange, () -> handleOrders(exchange, orders)));
        server.createContext("/", new StaticHandler());
        server.setExecutor(Executors.newFixedThreadPool(8));
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.stop(1);
            orders.close();
        }));
        server.start();
        System.out.println("Furnique server listening on port " + port);
    }

    private static void handleOrders(HttpExchange exchange, OrderService service)
            throws IOException, InvalidOrderException, PersistenceException {
        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            Map<String, String> query = parseForm(exchange.getRequestURI().getRawQuery());
            Order order = service.findOrder(query.get("orderId"), query.get("email"));
            if (order == null) {
                sendJson(exchange, 404, "{\"error\":\"No order matches those details.\"}");
                return;
            }
            sendJson(exchange, 200, orderJson(order));
            return;
        }
        requireMethod(exchange, "POST");
        Map<String, String> form = parseForm(readBody(exchange.getRequestBody()));
        List<CartLine> items = parseItems(form.get("items"));
        try {
            Order order = service.placeOrder(form.get("name"), form.get("email"), form.get("address"), items,
                    form.get("paymentMode"), form.get("promoCode"));
            sendJson(exchange, 201, orderJson(order));
        } catch (InvalidOrderException error) {
            sendJson(exchange, 400, errorJson(error.getMessage()));
        } catch (OutOfStockException error) {
            sendJson(exchange, 409, errorJson(error.getMessage()));
        } catch (PaymentFailedException error) {
            sendJson(exchange, 402, errorJson(error.getMessage()));
        } catch (PersistenceException error) {
            System.err.println("Order persistence failed: " + error.getMessage());
            sendJson(exchange, 500, errorJson("The order could not be saved."));
        }
    }

    private static List<CartLine> parseItems(String value) throws InvalidOrderException {
        List<CartLine> items = new ArrayList<CartLine>();
        if (value == null || value.trim().isEmpty()) throw new InvalidOrderException("Order items are required.");
        for (String item : value.split("\\|")) {
            String[] parts = item.split(":", -1);
            if (parts.length != 2 || parts[0].trim().isEmpty()) {
                throw new InvalidOrderException("Order items must use productId:quantity pairs.");
            }
            try {
                items.add(new CartLine(parts[0].trim(), Integer.parseInt(parts[1])));
            } catch (NumberFormatException error) {
                throw new InvalidOrderException("Order quantity must be a whole number.");
            }
        }
        return items;
    }

    private static String ordersJson(List<Order> orders) {
        StringBuilder json = new StringBuilder("{\"orders\":[");
        for (int i = 0; i < orders.size(); i++) {
            if (i > 0) json.append(',');
            json.append(orderJson(orders.get(i)));
        }
        return json.append("]}").toString();
    }

    private static String orderJson(Order order) {
        StringBuilder json = new StringBuilder("{\"id\":\"").append(escape(order.getId()))
                .append("\",\"customer\":\"").append(escape(order.getCustomerName()))
                .append("\",\"email\":\"").append(escape(order.getCustomerEmail()))
                .append("\",\"status\":\"").append(escape(order.getStatus()))
                .append("\",\"total\":").append(order.getTotalInr())
                .append(",\"createdAt\":\"").append(order.getCreatedAt().toString()).append("\",\"items\":[");
        List<OrderItem> items = order.getItems();
        for (int i = 0; i < items.size(); i++) {
            if (i > 0) json.append(',');
            OrderItem item = items.get(i);
            json.append("{\"productId\":\"").append(escape(item.getProductId()))
                    .append("\",\"name\":\"").append(escape(item.getProductName()))
                    .append("\",\"quantity\":").append(item.getQuantity()).append('}');
        }
        return json.append("]}").toString();
    }

    private static String sessionJson(SessionStore.Session session) {
        return "{\"role\":\"" + escape(session.getRole()) + "\",\"email\":\"" +
                escape(session.getEmail()) + "\",\"name\":\"" + escape(session.getName()) + "\"}";
    }

    private static void requireAdmin(HttpExchange exchange, SessionStore sessions) throws IOException {
        SessionStore.Session session = sessions.find(exchange);
        if (session != null) {
            if ("admin".equals(session.getRole())) return;
            sendJson(exchange, 403, "{\"error\":\"Administrator access is required.\"}");
            throw new RequestHandledException();
        }
        String expected = System.getenv("ADMIN_API_TOKEN");
        String supplied = exchange.getRequestHeaders().getFirst("X-Admin-Token");
        if (expected == null || expected.trim().isEmpty()) {
            sendJson(exchange, 503, "{\"error\":\"Admin API is not configured.\"}");
            throw new RequestHandledException();
        }
        if (supplied == null || !MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8),
                supplied.getBytes(StandardCharsets.UTF_8))) {
            sendJson(exchange, 401, "{\"error\":\"Admin authorization is required.\"}");
            throw new RequestHandledException();
        }
    }

    private static void requireMethod(HttpExchange exchange, String method) throws IOException {
        if (!method.equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Allow", method);
            sendJson(exchange, 405, "{\"error\":\"Method not allowed.\"}");
            throw new RequestHandledException();
        }
    }

    private static void requireSameOrigin(HttpExchange exchange) throws IOException {
        String fetchSite = exchange.getRequestHeaders().getFirst("Sec-Fetch-Site");
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        String requestHost = exchange.getRequestHeaders().getFirst("Host");
        boolean invalidOrigin = false;
        if (origin != null) {
            try {
                URI originUri = new URI(origin);
                invalidOrigin = originUri.getHost() == null || requestHost == null ||
                        !originUri.getRawAuthority().equalsIgnoreCase(requestHost) ||
                        !("http".equalsIgnoreCase(originUri.getScheme()) ||
                                "https".equalsIgnoreCase(originUri.getScheme()));
            } catch (URISyntaxException error) {
                invalidOrigin = true;
            }
        }
        if ("cross-site".equalsIgnoreCase(fetchSite) || invalidOrigin) {
            sendJson(exchange, 403, "{\"error\":\"Cross-origin authentication requests are not allowed.\"}");
            throw new RequestHandledException();
        }
    }

    private static void handle(HttpExchange exchange, CheckedAction action) throws IOException {
        try {
            exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
            action.run();
        } catch (RequestHandledException ignored) {
        } catch (InvalidOrderException error) {
            sendJson(exchange, 400, errorJson(error.getMessage()));
        } catch (PersistenceException error) {
            System.err.println("Request persistence failed: " + error.getMessage());
            sendJson(exchange, 500, "{\"error\":\"The request could not be completed.\"}");
        } catch (IllegalArgumentException error) {
            sendJson(exchange, 400, errorJson(error.getMessage()));
        } catch (IOException error) {
            System.err.println("Request I/O failed: " + error.getMessage());
            throw error;
        } finally {
            exchange.close();
        }
    }

    private static String errorJson(String message) {
        return "{\"error\":\"" + escape(message) + "\"}";
    }

    private static String readBody(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[2048];
        int total = 0;
        int read;
        while ((read = input.read(buffer)) != -1) {
            total += read;
            if (total > 16384) throw new IOException("Request body exceeds 16 KB.");
            output.write(buffer, 0, read);
        }
        return new String(output.toByteArray(), StandardCharsets.UTF_8);
    }

    private static Map<String, String> parseForm(String encoded) throws IOException {
        Map<String, String> values = new HashMap<String, String>();
        if (encoded == null || encoded.isEmpty()) return values;
        for (String pair : encoded.split("&")) {
            String[] parts = pair.split("=", 2);
            String key = URLDecoder.decode(parts[0], "UTF-8");
            String value = parts.length == 2 ? URLDecoder.decode(parts[1], "UTF-8") : "";
            values.put(key, value);
        }
        return values;
    }

    private static String escape(String value) {
        StringBuilder escaped = new StringBuilder();
        for (char character : value.toCharArray()) {
            switch (character) {
                case '"': escaped.append("\\\""); break;
                case '\\': escaped.append("\\\\"); break;
                case '\b': escaped.append("\\b"); break;
                case '\f': escaped.append("\\f"); break;
                case '\n': escaped.append("\\n"); break;
                case '\r': escaped.append("\\r"); break;
                case '\t': escaped.append("\\t"); break;
                default:
                    if (character < 0x20) escaped.append(String.format("\\u%04x", (int) character));
                    else escaped.append(character);
            }
        }
        return escaped.toString();
    }

    private static void sendJson(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }

    private static String environment(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.trim().isEmpty() ? fallback : value;
    }

    private interface CheckedAction {
        void run() throws IOException, InvalidOrderException, PersistenceException;
    }

    private static final class RequestHandledException extends RuntimeException { }

    private static final class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.startsWith("/api/")) {
                sendJson(exchange, 404, "{\"error\":\"API endpoint not found.\"}");
                exchange.close();
                return;
            }
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod()) &&
                    !"HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.getResponseHeaders().set("Allow", "GET, HEAD");
                sendJson(exchange, 405, "{\"error\":\"Method not allowed.\"}");
                exchange.close();
                return;
            }
            String resource = path == null || "/".equals(path) ? "index.html" : path.substring(1);
            if (resource.contains("..") || resource.contains("\\")) {
                sendJson(exchange, 400, "{\"error\":\"Invalid path.\"}");
                exchange.close();
                return;
            }
            try (InputStream input = FurniqueServer.class.getResourceAsStream("/web/" + resource)) {
                if (input == null) {
                    sendJson(exchange, 404, "{\"error\":\"Page not found.\"}");
                    exchange.close();
                    return;
                }
                byte[] bytes = readResource(input);
                exchange.getResponseHeaders().set("Content-Type", contentType(resource));
                exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
                exchange.getResponseHeaders().set("Content-Security-Policy",
                        "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com; img-src 'self' https://images.unsplash.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
                exchange.getResponseHeaders().set("Referrer-Policy", "strict-origin-when-cross-origin");
                if (resource.endsWith("login.html") || resource.endsWith("register.html") ||
                        resource.equals("account.html") || resource.equals("admin.html")) {
                    exchange.getResponseHeaders().set("Cache-Control", "no-store");
                }
                exchange.sendResponseHeaders(200, "HEAD".equalsIgnoreCase(exchange.getRequestMethod()) ? -1 : bytes.length);
                if (!"HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
                    try (OutputStream output = exchange.getResponseBody()) {
                        output.write(bytes);
                    }
                }
            } finally {
                exchange.close();
            }
        }

        private byte[] readResource(InputStream input) throws IOException {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int read;
            while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
            return output.toByteArray();
        }

        private String contentType(String resource) {
            if (resource.endsWith(".html")) return "text/html; charset=utf-8";
            if (resource.endsWith(".css")) return "text/css; charset=utf-8";
            if (resource.endsWith(".js")) return "text/javascript; charset=utf-8";
            return "application/octet-stream";
        }
    }
}
