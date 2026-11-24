package studio.furnique.persistence;

import studio.furnique.domain.Order;
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

public class FileOrderRepository implements OrderRepository {
    private final Path file;

    public FileOrderRepository(Path file) {
        this.file = file;
    }

    @Override
    public synchronized void save(Order order) throws PersistenceException {
        List<Order> orders = readAll();
        for (int i = 0; i < orders.size(); i++) {
            if (orders.get(i).getId().equals(order.getId())) {
                orders.set(i, order);
                writeAll(orders);
                return;
            }
        }
        orders.add(order);
        writeAll(orders);
    }

    @Override
    public synchronized Order findById(String id) throws PersistenceException {
        for (Order order : readAll()) {
            if (order.getId().equals(id)) return order;
        }
        return null;
    }

    @Override
    public synchronized List<Order> findAll() throws PersistenceException {
        return new ArrayList<Order>(readAll());
    }

    private List<Order> readAll() throws PersistenceException {
        if (!Files.exists(file)) return new ArrayList<Order>();
        try (ObjectInputStream input = new ObjectInputStream(Files.newInputStream(file))) {
            Object stored = input.readObject();
            if (!(stored instanceof List)) throw new IOException("Order file has an invalid format.");
            @SuppressWarnings("unchecked")
            List<Order> orders = (List<Order>) stored;
            return new ArrayList<Order>(orders);
        } catch (EOFException error) {
            return new ArrayList<Order>();
        } catch (IOException | ClassNotFoundException error) {
            throw new PersistenceException("Could not read the order file.", error);
        }
    }

    private void writeAll(List<Order> orders) throws PersistenceException {
        try {
            Path parent = file.toAbsolutePath().getParent();
            if (parent != null) Files.createDirectories(parent);
            Path temporary = file.resolveSibling(file.getFileName().toString() + ".tmp");
            try (ObjectOutputStream output = new ObjectOutputStream(Files.newOutputStream(temporary))) {
                output.writeObject(orders);
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
            throw new PersistenceException("Could not save the order file.", error);
        }
    }
}
