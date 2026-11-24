package studio.furnique.domain;

public class Product {
    private final String id;
    private final String name;
    private final String category;
    private final int priceInr;
    private int stock;

    public Product(String id, String name, String category, int priceInr, int stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.priceInr = priceInr;
        this.stock = stock;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getPriceInr() { return priceInr; }
    public synchronized int getStock() { return stock; }

    public synchronized void reserve(int quantity) throws IllegalArgumentException {
        if (quantity < 1 || quantity > stock) {
            throw new IllegalArgumentException("Insufficient stock.");
        }
        stock -= quantity;
    }

    public synchronized void release(int quantity) {
        if (quantity > 0) stock += quantity;
    }
}
