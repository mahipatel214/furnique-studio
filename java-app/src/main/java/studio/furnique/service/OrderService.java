package studio.furnique.service;

import studio.furnique.domain.CartLine;
import studio.furnique.domain.Order;
import studio.furnique.domain.OrderItem;
import studio.furnique.domain.Product;
import studio.furnique.exception.InvalidOrderException;
import studio.furnique.exception.OutOfStockException;
import studio.furnique.exception.PaymentFailedException;
import studio.furnique.exception.PersistenceException;
import studio.furnique.persistence.OrderRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

public class OrderService implements AutoCloseable {
    private final ProductCatalog catalog;
    private final OrderRepository repository;
    private final PaymentProcessor paymentProcessor;
    private final Runnable backupTask;
    private final ExecutorService backgroundWorker = Executors.newSingleThreadExecutor();
    private final AtomicLong orderSequence = new AtomicLong(System.currentTimeMillis());

    public OrderService(ProductCatalog catalog, OrderRepository repository, PaymentProcessor paymentProcessor,
                        Runnable backupTask) {
        this.catalog = catalog;
        this.repository = repository;
        this.paymentProcessor = paymentProcessor;
        this.backupTask = backupTask;
    }

    public Order placeOrder(String name, String email, String address, List<CartLine> lines,
                            String paymentMode, String promoCode) throws InvalidOrderException,
            OutOfStockException, PaymentFailedException, PersistenceException {
        validate(name, email, address, lines);
        List<OrderItem> items = new ArrayList<OrderItem>();
        int subtotal = 0;
        for (CartLine line : lines) {
            Product product = catalog.find(line.getProductId());
            if (product == null) throw new InvalidOrderException("Unknown product.");
            subtotal = Math.addExact(subtotal, Math.multiplyExact(product.getPriceInr(), line.getQuantity()));
            items.add(new OrderItem(product.getId(), product.getName(), line.getQuantity()));
        }

        int discount = discountFor(subtotal, promoCode);
        int shipping = subtotal >= 25000 ? 0 : 1200;
        int total = subtotal - discount + shipping;
        catalog.reserveAll(lines);
        try {
            paymentProcessor.authorize(total, paymentMode);
            String id = "FS-" + orderSequence.incrementAndGet();
            Order order = new Order(id, name.trim(), email.trim().toLowerCase(), address.trim(), Instant.now(),
                    total, paymentMode, items, "Processing");
            repository.save(order);
            backgroundWorker.execute(() -> {
                try {
                    backupTask.run();
                } catch (RuntimeException error) {
                    System.err.println("Order backup failed: " + error.getMessage());
                }
            });
            return order;
        } catch (PaymentFailedException | PersistenceException | RuntimeException error) {
            catalog.releaseAll(lines);
            throw error;
        }
    }

    public Order findOrder(String id, String email) throws PersistenceException {
        Order order = repository.findById(id);
        if (order == null || !order.getCustomerEmail().equalsIgnoreCase(email == null ? "" : email.trim())) return null;
        return order;
    }

    public List<Order> allOrders() throws PersistenceException {
        return repository.findAll();
    }

    private int discountFor(int subtotal, String promoCode) throws InvalidOrderException {
        if (promoCode == null || promoCode.trim().isEmpty()) return 0;
        String normalized = promoCode.trim().toUpperCase();
        if ("STUDIO10".equals(normalized)) return Math.round(subtotal * 0.10f);
        if ("WELCOME15".equals(normalized)) return Math.round(subtotal * 0.15f);
        throw new InvalidOrderException("Promo code is not valid.");
    }

    private void validate(String name, String email, String address, List<CartLine> lines)
            throws InvalidOrderException {
        if (name == null || name.trim().length() < 2 || name.trim().length() > 70) {
            throw new InvalidOrderException("Name must contain 2 to 70 characters.");
        }
        if (email == null || email.length() > 120 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new InvalidOrderException("A valid email address is required.");
        }
        if (address == null || address.trim().length() < 8 || address.trim().length() > 240) {
            throw new InvalidOrderException("Address must contain 8 to 240 characters.");
        }
        if (lines == null || lines.isEmpty() || lines.size() > 10) {
            throw new InvalidOrderException("An order must contain 1 to 10 distinct products.");
        }
        Set<String> productIds = new HashSet<String>();
        for (CartLine line : lines) {
            if (line == null || line.getProductId() == null || !productIds.add(line.getProductId())) {
                throw new InvalidOrderException("Each product may appear only once in the cart.");
            }
            if (line.getQuantity() < 1 || line.getQuantity() > 10) {
                throw new InvalidOrderException("Each product quantity must be between 1 and 10.");
            }
        }
    }

    @Override
    public void close() {
        backgroundWorker.shutdown();
    }
}
