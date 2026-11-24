package studio.furnique.service;

import studio.furnique.exception.PaymentFailedException;

public class DemoPaymentProcessor implements PaymentProcessor {
    @Override
    public void authorize(int amountInr, String paymentMode) throws PaymentFailedException {
        if (amountInr < 1) throw new PaymentFailedException("Payment amount must be positive.");
        if (!"TEST_SUCCESS".equals(paymentMode)) {
            throw new PaymentFailedException("Demo payment was declined; no real charge was attempted.");
        }
    }
}
