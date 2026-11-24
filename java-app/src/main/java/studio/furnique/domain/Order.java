package studio.furnique.domain;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Order implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String id;
    private final String customerName;
    private final String customerEmail;
    private final String address;
    private final Instant createdAt;
    private final int totalInr;
    private final String paymentMode;
    private final List<OrderItem> items;
    private final String status;

    public Order(String id, String customerName, String customerEmail, String address, Instant createdAt,
                 int totalInr, String paymentMode, List<OrderItem> items, String status) {
        this.id = id;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.address = address;
        this.createdAt = createdAt;
        this.totalInr = totalInr;
        this.paymentMode = paymentMode;
        this.items = new ArrayList<OrderItem>(items);
        this.status = status;
    }

    public String getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public String getAddress() { return address; }
    public Instant getCreatedAt() { return createdAt; }
    public int getTotalInr() { return totalInr; }
    public String getPaymentMode() { return paymentMode; }
    public List<OrderItem> getItems() { return Collections.unmodifiableList(items); }
    public String getStatus() { return status; }

    public Order withStatus(String nextStatus) {
        return new Order(id, customerName, customerEmail, address, createdAt, totalInr, paymentMode, items, nextStatus);
    }
}
