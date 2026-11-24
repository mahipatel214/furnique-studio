package studio.furnique.web;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

final class AuthRateLimiter {
    private static final long WINDOW_SECONDS = 15 * 60;
    private static final int MAX_ATTEMPTS = 10;
    private final Map<String, Window> attempts = new ConcurrentHashMap<String, Window>();

    synchronized boolean allow(String key) {
        long now = Instant.now().getEpochSecond();
        Window window = attempts.get(key);
        if (window == null || now - window.startedAt >= WINDOW_SECONDS) {
            attempts.put(key, new Window(now, 0));
            prune(now);
            return true;
        }
        return window.count < MAX_ATTEMPTS;
    }

    synchronized void record(String key) {
        long now = Instant.now().getEpochSecond();
        Window window = attempts.get(key);
        if (window == null || now - window.startedAt >= WINDOW_SECONDS) {
            attempts.put(key, new Window(now, 1));
        } else {
            window.count++;
        }
        prune(now);
    }

    synchronized void clear(String key) {
        attempts.remove(key);
    }

    private void prune(long now) {
        for (Map.Entry<String, Window> entry : attempts.entrySet()) {
            if (now - entry.getValue().startedAt >= WINDOW_SECONDS) {
                attempts.remove(entry.getKey(), entry.getValue());
            }
        }
    }

    private static final class Window {
        private final long startedAt;
        private int count;

        private Window(long startedAt, int count) {
            this.startedAt = startedAt;
            this.count = count;
        }
    }
}
