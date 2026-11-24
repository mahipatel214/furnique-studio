package studio.furnique.service;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

public class PasswordHasherTest {
    @Test
    public void hashesUseDifferentSaltsAndVerifyOnlyTheOriginalPassword() {
        PasswordHasher hasher = new PasswordHasher();
        char[] password = "Customer-Password-2026!".toCharArray();

        String first = hasher.hash(password);
        String second = hasher.hash(password);

        assertNotEquals(first, second);
        assertTrue(hasher.verify(password, first));
        assertFalse(hasher.verify("incorrect-password".toCharArray(), first));
    }

    @Test
    public void malformedStoredHashesAreRejected() {
        assertFalse(new PasswordHasher().verify("password".toCharArray(), "not-a-hash"));
    }
}
