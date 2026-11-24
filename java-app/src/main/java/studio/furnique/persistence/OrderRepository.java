package studio.furnique.persistence;

import studio.furnique.domain.Order;
import studio.furnique.exception.PersistenceException;

import java.util.List;

public interface OrderRepository {
    void save(Order order) throws PersistenceException;
    Order findById(String id) throws PersistenceException;
    List<Order> findAll() throws PersistenceException;
}
