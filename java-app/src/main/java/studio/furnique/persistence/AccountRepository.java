package studio.furnique.persistence;

import studio.furnique.domain.CustomerAccount;
import studio.furnique.exception.PersistenceException;

public interface AccountRepository {
    boolean create(CustomerAccount account) throws PersistenceException;
    CustomerAccount findByEmail(String email) throws PersistenceException;
}
