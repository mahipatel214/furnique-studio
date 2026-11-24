package studio.furnique.service;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import studio.furnique.domain.CustomerAccount;
import studio.furnique.persistence.FileAccountRepository;

import java.nio.file.Path;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class AuthServiceTest {
    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Test
    public void customerRegistrationNormalizesEmailAndStoresOnlyPasswordHash() throws Exception {
        AuthService auth = newAuth("admin@example.test", "Studio-Admin-Password-2026!");
        CustomerAccount account = auth.register("  Sam Furnique  ", " SAM@EXAMPLE.TEST ",
                "Customer-Password-2026!".toCharArray());

        assertEquals("Sam Furnique", account.getName());
        assertEquals("sam@example.test", account.getEmail());
        assertTrue(account.getPasswordHash().startsWith("pbkdf2-sha256$"));
        assertNull(auth.authenticateCustomer(account.getEmail(), "not-the-password".toCharArray()));
        assertNotNull(auth.authenticateCustomer(account.getEmail(), "Customer-Password-2026!".toCharArray()));
    }

    @Test
    public void duplicateEmailCannotCreateAnotherAccount() throws Exception {
        AuthService auth = newAuth(null, null);
        assertNotNull(auth.register("Sam", "sam@example.test", "Customer-Password-2026!".toCharArray()));
        assertNull(auth.register("Other", "SAM@example.test", "Different-Password-2026!".toCharArray()));
    }

    @Test
    public void customerAccountSurvivesRepositoryRecreation() throws Exception {
        Path path = temporaryFolder.newFile("customers.bin").toPath();
        AuthService first = new AuthService(new FileAccountRepository(path), null, null);
        first.register("Sam", "sam@example.test", "Customer-Password-2026!".toCharArray());

        AuthService reopened = new AuthService(new FileAccountRepository(path), null, null);
        assertNotNull(reopened.authenticateCustomer("sam@example.test", "Customer-Password-2026!".toCharArray()));
    }

    @Test
    public void administratorCredentialsAreSeparateAndCaseInsensitiveByEmail() throws Exception {
        AuthService auth = newAuth("owner@example.test", "Studio-Admin-Password-2026!");
        assertTrue(auth.authenticateAdmin("OWNER@example.test", "Studio-Admin-Password-2026!".toCharArray()));
        assertTrue(!auth.authenticateAdmin("owner@example.test", "Customer-Password-2026!".toCharArray()));
        assertNull(auth.authenticateCustomer("owner@example.test", "Studio-Admin-Password-2026!".toCharArray()));
    }

    @Test(expected = IllegalArgumentException.class)
    public void partialAdminCredentialConfigurationIsRejected() {
        new AuthService(new FileAccountRepository(temporaryFolder.getRoot().toPath().resolve("customers.bin")),
                "owner@example.test", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shortCustomerPasswordIsRejected() throws Exception {
        newAuth(null, null).register("Sam", "sam@example.test", "short".toCharArray());
    }

    private AuthService newAuth(String adminEmail, String adminPassword) throws Exception {
        return new AuthService(new FileAccountRepository(temporaryFolder.newFile().toPath()),
                adminEmail, adminPassword);
    }
}
