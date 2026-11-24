package studio.furnique.service;

import studio.furnique.exception.PaymentFailedException;

public interface PaymentProcessor {
    void authorize(int amountInr, String paymentMode) throws PaymentFailedException;
}
