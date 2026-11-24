package studio.furnique.persistence;

import studio.furnique.domain.Order;
import studio.furnique.domain.OrderItem;
import studio.furnique.exception.PersistenceException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class JdbcOrderRepository implements OrderRepository {
    private final String url;
    private final String username;
    private final String password;

    public JdbcOrderRepository(String url, String username, String password) throws PersistenceException {
        this.url = url;
        this.username = username;
        this.password = password;
        initializeSchema();
    }

    @Override
    public void save(Order order) throws PersistenceException {
        String insertOrder = "INSERT INTO furnique_orders (id, customer_name, customer_email, address, created_at, total_inr, payment_mode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection connection = connect()) {
            connection.setAutoCommit(false);
            try (PreparedStatement statement = connection.prepareStatement(insertOrder)) {
                statement.setString(1, order.getId());
                statement.setString(2, order.getCustomerName());
                statement.setString(3, order.getCustomerEmail());
                statement.setString(4, order.getAddress());
                statement.setTimestamp(5, Timestamp.from(order.getCreatedAt()));
                statement.setInt(6, order.getTotalInr());
                statement.setString(7, order.getPaymentMode());
                statement.setString(8, order.getStatus());
                statement.executeUpdate();
            }
            try (PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO furnique_order_items (order_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)")) {
                for (OrderItem item : order.getItems()) {
                    statement.setString(1, order.getId());
                    statement.setString(2, item.getProductId());
                    statement.setString(3, item.getProductName());
                    statement.setInt(4, item.getQuantity());
                    statement.addBatch();
                }
                statement.executeBatch();
            }
            connection.commit();
        } catch (SQLException error) {
            throw new PersistenceException("Could not save the order to PostgreSQL.", error);
        }
    }

    @Override
    public Order findById(String id) throws PersistenceException {
        try (Connection connection = connect();
             PreparedStatement statement = connection.prepareStatement(
                     "SELECT * FROM furnique_orders WHERE id = ?")) {
            statement.setString(1, id);
            try (ResultSet results = statement.executeQuery()) {
                return results.next() ? mapOrder(connection, results) : null;
            }
        } catch (SQLException error) {
            throw new PersistenceException("Could not read the order from PostgreSQL.", error);
        }
    }

    @Override
    public List<Order> findAll() throws PersistenceException {
        List<Order> orders = new ArrayList<Order>();
        try (Connection connection = connect();
             PreparedStatement statement = connection.prepareStatement(
                     "SELECT * FROM furnique_orders ORDER BY created_at DESC");
             ResultSet results = statement.executeQuery()) {
            while (results.next()) orders.add(mapOrder(connection, results));
            return orders;
        } catch (SQLException error) {
            throw new PersistenceException("Could not list orders from PostgreSQL.", error);
        }
    }

    private Order mapOrder(Connection connection, ResultSet result) throws SQLException {
        String id = result.getString("id");
        List<OrderItem> items = new ArrayList<OrderItem>();
        try (PreparedStatement statement = connection.prepareStatement(
                "SELECT product_id, product_name, quantity FROM furnique_order_items WHERE order_id = ?")) {
            statement.setString(1, id);
            try (ResultSet lines = statement.executeQuery()) {
                while (lines.next()) {
                    items.add(new OrderItem(lines.getString("product_id"), lines.getString("product_name"),
                            lines.getInt("quantity")));
                }
            }
        }
        return new Order(id, result.getString("customer_name"), result.getString("customer_email"),
                result.getString("address"), result.getTimestamp("created_at").toInstant(),
                result.getInt("total_inr"), result.getString("payment_mode"), items, result.getString("status"));
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    private void initializeSchema() throws PersistenceException {
        try (Connection connection = connect(); Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE IF NOT EXISTS furnique_orders (id VARCHAR(40) PRIMARY KEY, customer_name VARCHAR(70) NOT NULL, customer_email VARCHAR(120) NOT NULL, address VARCHAR(240) NOT NULL, created_at TIMESTAMP NOT NULL, total_inr INTEGER NOT NULL, payment_mode VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL)");
            statement.execute("CREATE TABLE IF NOT EXISTS furnique_order_items (order_id VARCHAR(40) NOT NULL REFERENCES furnique_orders(id) ON DELETE CASCADE, product_id VARCHAR(40) NOT NULL, product_name VARCHAR(120) NOT NULL, quantity INTEGER NOT NULL CHECK (quantity > 0), PRIMARY KEY (order_id, product_id))");
        } catch (SQLException error) {
            throw new PersistenceException("Could not initialize the PostgreSQL schema.", error);
        }
    }
}
