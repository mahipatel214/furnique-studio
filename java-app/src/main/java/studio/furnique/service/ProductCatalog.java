package studio.furnique.service;

import studio.furnique.domain.CartLine;
import studio.furnique.domain.Product;
import studio.furnique.exception.OutOfStockException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductCatalog {
    private final List<Product> products;

    public ProductCatalog(List<Product> products) {
        this.products = new ArrayList<Product>(products);
    }

    public synchronized Product find(String id) {
        for (Product product : products) {
            if (product.getId().equals(id)) return product;
        }
        return null;
    }

    public synchronized List<Product> all() {
        return Collections.unmodifiableList(new ArrayList<Product>(products));
    }

    public synchronized void reserve(String productId, int quantity) throws OutOfStockException {
        Product product = find(productId);
        if (product == null || quantity < 1 || product.getStock() < quantity) {
            throw new OutOfStockException("Product is unavailable in the requested quantity.");
        }
        product.reserve(quantity);
    }

    public synchronized void reserveAll(List<CartLine> lines) throws OutOfStockException {
        Map<String, Integer> quantities = new HashMap<String, Integer>();
        for (CartLine line : lines) {
            Integer current = quantities.get(line.getProductId());
            quantities.put(line.getProductId(), (current == null ? 0 : current) + line.getQuantity());
        }
        for (Map.Entry<String, Integer> entry : quantities.entrySet()) {
            Product product = find(entry.getKey());
            if (product == null || product.getStock() < entry.getValue()) {
                throw new OutOfStockException("Product is unavailable in the requested quantity.");
            }
        }
        for (Map.Entry<String, Integer> entry : quantities.entrySet()) {
            find(entry.getKey()).reserve(entry.getValue());
        }
    }

    public synchronized void release(String productId, int quantity) {
        Product product = find(productId);
        if (product != null) product.release(quantity);
    }

    public synchronized void releaseAll(List<CartLine> lines) {
        for (CartLine line : lines) release(line.getProductId(), line.getQuantity());
    }

    public static ProductCatalog demoCatalog() {
        List<Product> products = new ArrayList<Product>();
        products.add(new Product("p-101", "The Sunday Sofa", "Living", 78900, 7));
        products.add(new Product("p-102", "Oak & About Table", "Dining", 45900, 12));
        products.add(new Product("p-103", "Cloud Nine Armchair", "Living", 32900, 5));
        products.add(new Product("p-104", "Sunday Side Table", "Living", 11900, 18));
        products.add(new Product("p-105", "The Quiet Nightstand", "Bedroom", 18900, 4));
        products.add(new Product("p-106", "Sunday Dining Chair", "Dining", 14500, 14));
        products.add(new Product("p-107", "Gather Round Bench", "Dining", 21900, 8));
        products.add(new Product("p-108", "Soft Landing Bed", "Bedroom", 62900, 3));
        return new ProductCatalog(products);
    }
}
