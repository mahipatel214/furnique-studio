package studio.furnique.service;

import studio.furnique.domain.CustomerAccount;
import studio.furnique.exception.PersistenceException;
import studio.furnique.persistence.AccountRepository;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

public final class AuthService {
    private final AccountRepository accounts;
    private final PasswordHasher passwordHasher;
    private final String adminEmail;
    private final String adminPasswordHash;

    public AuthService(AccountRepository accounts, String adminEmail, String adminPassword) {
        this.accounts = accounts;
        this.passwordHasher = new PasswordHasher();
        this.adminEmail = normalizeEmail(adminEmail);
        boolean emailConfigured = adminEmail != null && !adminEmail.trim().isEmpty();
        boolean passwordConfigured = adminPassword != null && !adminPassword.isEmpty();
        if (emailConfigured != passwordConfigured) {
            throw new IllegalArgumentException("Configure both ADMIN_EMAIL and ADMIN_PASSWORD to enable admin login.");
        }
        this.adminPasswordHash = passwordConfigured ? passwordHasher.hash(adminPassword.toCharArray()) : null;
        if (passwordConfigured && !isValidEmail(this.adminEmail)) {
            throw new IllegalArgumentException("ADMIN_EMAIL must be a valid email address when admin login is enabled.");
        }
        if (passwordConfigured && (adminPassword.length() < 12 || adminPassword.length() > 128)) {
            throw new IllegalArgumentException("ADMIN_PASSWORD must contain 12 to 128 characters.");
        }
    }

    public CustomerAccount register(String name, String email, char[] password) throws PersistenceException {
        String normalizedName = name == null ? "" : name.trim();
        String normalizedEmail = normalizeEmail(email);
        validateRegistration(normalizedName, normalizedEmail, password);
        CustomerAccount account = new CustomerAccount(UUID.randomUUID().toString(), normalizedName,
                normalizedEmail, passwordHasher.hash(password), Instant.now());
        return accounts.create(account) ? account : null;
    }

    public CustomerAccount authenticateCustomer(String email, char[] password) throws PersistenceException {
        String normalizedEmail = normalizeEmail(email);
        if (!isValidEmail(normalizedEmail) || password == null || password.length == 0) return null;
        CustomerAccount account = accounts.findByEmail(normalizedEmail);
        String stored = account == null ? dummyPasswordHash() : account.getPasswordHash();
        boolean matches = passwordHasher.verify(password, stored);
        return matches && account != null ? account : null;
    }

    public boolean authenticateAdmin(String email, char[] password) {
        if (adminPasswordHash == null || !normalizeEmail(email).equals(adminEmail) ||
                password == null || password.length == 0) {
            passwordHasher.verify(password == null ? new char[0] : password, dummyPasswordHash());
            return false;
        }
        return passwordHasher.verify(password, adminPasswordHash);
    }

    public boolean isAdminConfigured() {
        return adminPasswordHash != null;
    }

    private void validateRegistration(String name, String email, char[] password) {
        if (name.length() < 2 || name.length() > 70) throw new IllegalArgumentException("Name must contain 2 to 70 characters.");
        if (!isValidEmail(email)) throw new IllegalArgumentException("Enter a valid email address.");
        if (password == null || password.length < 12 || password.length > 128) {
            throw new IllegalArgumentException("Password must contain 12 to 128 characters.");
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.length() <= 120 && email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private String dummyPasswordHash() {
        return "pbkdf2-sha256$600000$MDEyMzQ1Njc4OWFiY2RlZg==$" +
                "A2FvGk8oS9z6m+3qA8x3P6qv0Vn3rIY8tQ7cN4wX2mE=";
    }
}
