package studio.furnique.domain;

import java.io.Serializable;
import java.time.Instant;

public final class CustomerAccount implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String id;
    private final String name;
    private final String email;
    private final String passwordHash;
    private final Instant createdAt;

    public CustomerAccount(String id, String name, String email, String passwordHash, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Instant getCreatedAt() { return createdAt; }
}
