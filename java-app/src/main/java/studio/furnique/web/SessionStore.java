package studio.furnique.web;

import com.sun.net.httpserver.HttpExchange;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class SessionStore {
    public static final String COOKIE_NAME = "furnique_session";
    private static final long SESSION_SECONDS = 8 * 60 * 60;
    private final Map<String, Session> sessions = new ConcurrentHashMap<String, Session>();
    private final SecureRandom random = new SecureRandom();
    private final boolean secureCookie;

    public SessionStore(boolean secureCookie) {
        this.secureCookie = secureCookie;
    }

    public Session create(String role, String email, String name) {
        byte[] tokenBytes = new byte[32];
        random.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        Session session = new Session(role, email, name, Instant.now().getEpochSecond() + SESSION_SECONDS);
        sessions.put(token, session);
        return new Session(token, role, email, name, session.expiresAt);
    }

    public Session find(HttpExchange exchange) {
        String token = cookieValue(exchange.getRequestHeaders().getFirst("Cookie"));
        if (token == null) return null;
        Session session = sessions.get(token);
        if (session == null) return null;
        if (session.expiresAt < Instant.now().getEpochSecond()) {
            sessions.remove(token);
            return null;
        }
        return new Session(token, session.role, session.email, session.name, session.expiresAt);
    }

    public void invalidate(Session session) {
        if (session != null) sessions.remove(session.token);
    }

    public void setCookie(HttpExchange exchange, Session session) {
        String value = COOKIE_NAME + "=" + session.token + "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" +
                SESSION_SECONDS + (secureCookie ? "; Secure" : "");
        exchange.getResponseHeaders().add("Set-Cookie", value);
    }

    public void clearCookie(HttpExchange exchange) {
        String value = COOKIE_NAME + "=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0" +
                (secureCookie ? "; Secure" : "");
        exchange.getResponseHeaders().add("Set-Cookie", value);
    }

    private String cookieValue(String header) {
        if (header == null) return null;
        for (String cookie : header.split(";")) {
            String[] parts = cookie.trim().split("=", 2);
            if (parts.length == 2 && COOKIE_NAME.equals(parts[0])) return parts[1];
        }
        return null;
    }

    public static final class Session {
        private final String token;
        private final String role;
        private final String email;
        private final String name;
        private final long expiresAt;

        private Session(String role, String email, String name, long expiresAt) {
            this(null, role, email, name, expiresAt);
        }

        private Session(String token, String role, String email, String name, long expiresAt) {
            this.token = token;
            this.role = role;
            this.email = email;
            this.name = name;
            this.expiresAt = expiresAt;
        }

        public String getToken() { return token; }
        public String getRole() { return role; }
        public String getEmail() { return email; }
        public String getName() { return name; }
    }
}
