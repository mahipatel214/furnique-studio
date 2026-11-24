package studio.furnique.persistence;

import studio.furnique.domain.CustomerAccount;
import studio.furnique.exception.PersistenceException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

public final class JdbcAccountRepository implements AccountRepository {
    private final String url;
    private final String username;
    private final String password;

    public JdbcAccountRepository(String url, String username, String password) throws PersistenceException {
        this.url = url;
        this.username = username;
        this.password = password;
        initializeSchema();
    }

    @Override
    public boolean create(CustomerAccount account) throws PersistenceException {
        String sql = "INSERT INTO furnique_customers (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)";
        try (Connection connection = connect(); PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, account.getId());
            statement.setString(2, account.getName());
            statement.setString(3, account.getEmail());
            statement.setString(4, account.getPasswordHash());
            statement.setTimestamp(5, Timestamp.from(account.getCreatedAt()));
            statement.executeUpdate();
            return true;
        } catch (SQLException error) {
            if ("23505".equals(error.getSQLState())) return false;
            throw new PersistenceException("Could not create the customer account in PostgreSQL.", error);
        }
    }

    @Override
    public CustomerAccount findByEmail(String email) throws PersistenceException {
        try (Connection connection = connect();
             PreparedStatement statement = connection.prepareStatement(
                     "SELECT id, name, email, password_hash, created_at FROM furnique_customers WHERE email = ?")) {
            statement.setString(1, email);
            try (ResultSet result = statement.executeQuery()) {
                if (!result.next()) return null;
                return new CustomerAccount(result.getString("id"), result.getString("name"),
                        result.getString("email"), result.getString("password_hash"),
                        result.getTimestamp("created_at").toInstant());
            }
        } catch (SQLException error) {
            throw new PersistenceException("Could not read the customer account from PostgreSQL.", error);
        }
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    private void initializeSchema() throws PersistenceException {
        try (Connection connection = connect(); Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE IF NOT EXISTS furnique_customers (" +
                    "id VARCHAR(40) PRIMARY KEY, name VARCHAR(70) NOT NULL, email VARCHAR(120) NOT NULL UNIQUE, " +
                    "password_hash VARCHAR(180) NOT NULL, created_at TIMESTAMP NOT NULL)");
        } catch (SQLException error) {
            throw new PersistenceException("Could not initialize the customer account schema.", error);
        }
    }
}
