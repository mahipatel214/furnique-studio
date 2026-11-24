package studio.furnique.persistence;

import studio.furnique.domain.CustomerAccount;
import studio.furnique.exception.PersistenceException;

import java.io.EOFException;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

public final class FileAccountRepository implements AccountRepository {
    private final Path file;

    public FileAccountRepository(Path file) {
        this.file = file;
    }

    @Override
    public synchronized boolean create(CustomerAccount account) throws PersistenceException {
        List<CustomerAccount> accounts = readAll();
        for (CustomerAccount existing : accounts) {
            if (existing.getEmail().equals(account.getEmail())) return false;
        }
        accounts.add(account);
        writeAll(accounts);
        return true;
    }

    @Override
    public synchronized CustomerAccount findByEmail(String email) throws PersistenceException {
        for (CustomerAccount account : readAll()) {
            if (account.getEmail().equals(email)) return account;
        }
        return null;
    }

    private List<CustomerAccount> readAll() throws PersistenceException {
        if (!Files.exists(file)) return new ArrayList<CustomerAccount>();
        try (ObjectInputStream input = new ObjectInputStream(Files.newInputStream(file))) {
            Object stored = input.readObject();
            if (!(stored instanceof List)) throw new IOException("Account file has an invalid format.");
            @SuppressWarnings("unchecked")
            List<CustomerAccount> accounts = (List<CustomerAccount>) stored;
            return new ArrayList<CustomerAccount>(accounts);
        } catch (EOFException error) {
            return new ArrayList<CustomerAccount>();
        } catch (IOException | ClassNotFoundException error) {
            throw new PersistenceException("Could not read the customer account file.", error);
        }
    }

    private void writeAll(List<CustomerAccount> accounts) throws PersistenceException {
        try {
            Path parent = file.toAbsolutePath().getParent();
            if (parent != null) Files.createDirectories(parent);
            Path temporary = file.resolveSibling(file.getFileName().toString() + ".tmp");
            try (ObjectOutputStream output = new ObjectOutputStream(Files.newOutputStream(temporary))) {
                output.writeObject(accounts);
                output.flush();
            }
            try {
                Files.move(temporary, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (IOException atomicMoveError) {
                try {
                    Files.move(temporary, file, StandardCopyOption.REPLACE_EXISTING);
                } catch (IOException fallbackError) {
                    fallbackError.addSuppressed(atomicMoveError);
                    throw fallbackError;
                }
            }
        } catch (IOException error) {
            throw new PersistenceException("Could not save the customer account file.", error);
        }
    }
}
