package studio.furnique.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import studio.furnique.domain.CartLine;
import studio.furnique.domain.Order;
import studio.furnique.domain.Product;
import studio.furnique.exception.InvalidOrderException;
import studio.furnique.exception.OutOfStockException;
import studio.furnique.exception.PaymentFailedException;
import studio.furnique.persistence.FileOrderRepository;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class OrderServiceTest {
    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    private ProductCatalog catalog;
    private FileOrderRepository repository;
    private OrderService service;

    @Before
    public void setUp() throws Exception {
        catalog = new ProductCatalog(Arrays.asList(
                new Product("p-1", "Chair", "Living", 10000, 10),
                new Product("p-2", "Table", "Dining", 30000, 2)));
        repository = new FileOrderRepository(temporaryFolder.newFile("orders.bin").toPath());
        service = newService(catalog, repository);
    }

    @After
    public void tearDown() {
        if (service != null) service.close();
    }

    @Test
    public void validOrderIsSavedAndStockReserved() throws Exception {
        Order order = place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
        assertEquals(11200, order.getTotalInr());
        assertEquals(9, catalog.find("p-1").getStock());
        assertEquals(1, repository.findAll().size());
    }

    @Test
    public void minimumNameLengthIsAccepted() throws Exception {
        assertNotNull(place("Al", "al@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", ""));
    }

    @Test(expected = InvalidOrderException.class)
    public void oneCharacterNameIsRejected() throws Exception {
        place("A", "a@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void blankNameIsRejected() throws Exception {
        place(" ", "a@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void nameOverMaximumLengthIsRejected() throws Exception {
        place(repeat("a", 71), "a@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test
    public void nameAtMaximumLengthIsAccepted() throws Exception {
        assertNotNull(place(repeat("a", 70), "a@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", ""));
    }

    @Test(expected = InvalidOrderException.class)
    public void malformedEmailIsRejected() throws Exception {
        place("Ava", "ava.example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test
    public void emailAtMaximumLengthIsAccepted() throws Exception {
        assertNotNull(place("Ava", repeat("a", 116) + "@b.c", "12 Main St",
                lines("p-1", 1), "TEST_SUCCESS", ""));
    }

    @Test(expected = InvalidOrderException.class)
    public void emailOverMaximumLengthIsRejected() throws Exception {
        place("Ava", repeat("a", 117) + "@b.c", "12 Main St",
                lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void addressShorterThanMinimumIsRejected() throws Exception {
        place("Ava", "ava@example.com", "1234567", lines("p-1", 1), "TEST_SUCCESS", "");
    }

    @Test
    public void addressAtMinimumLengthIsAccepted() throws Exception {
        assertNotNull(place("Ava", "ava@example.com", "12345678", lines("p-1", 1), "TEST_SUCCESS", ""));
    }

    @Test(expected = InvalidOrderException.class)
    public void emptyCartIsRejected() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", new ArrayList<CartLine>(), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void zeroQuantityIsRejected() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", lines("p-1", 0), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void quantityAboveMaximumIsRejected() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", lines("p-1", 11), "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void unknownProductIsRejected() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", lines("missing", 1), "TEST_SUCCESS", "");
    }

    @Test(expected = OutOfStockException.class)
    public void stockBoundaryIsEnforced() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", lines("p-2", 3), "TEST_SUCCESS", "");
    }

    @Test
    public void failedPaymentDoesNotConsumeInventory() throws Exception {
        try {
            place("Ava", "ava@example.com", "12 Main St", lines("p-1", 2), "TEST_FAIL", "");
        } catch (PaymentFailedException expected) {
            assertEquals(10, catalog.find("p-1").getStock());
            assertTrue(repository.findAll().isEmpty());
            return;
        }
        throw new AssertionError("Expected the test payment to fail.");
    }

    @Test
    public void studioTenDiscountIsApplied() throws Exception {
        Order order = place("Ava", "ava@example.com", "12 Main St", lines("p-2", 1), "TEST_SUCCESS", "STUDIO10");
        assertEquals(27000, order.getTotalInr());
    }

    @Test
    public void welcomeFifteenDiscountIsApplied() throws Exception {
        Order order = place("Ava", "ava@example.com", "12 Main St", lines("p-2", 1), "TEST_SUCCESS", "WELCOME15");
        assertEquals(25500, order.getTotalInr());
    }

    @Test(expected = InvalidOrderException.class)
    public void unknownPromotionIsRejected() throws Exception {
        place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "FREE100");
    }

    @Test
    public void twoDifferentProductsCanBeOrderedTogether() throws Exception {
        List<CartLine> items = Arrays.asList(new CartLine("p-1", 1), new CartLine("p-2", 1));
        assertEquals(40000, place("Ava", "ava@example.com", "12 Main St", items, "TEST_SUCCESS", "").getTotalInr());
    }

    @Test(expected = InvalidOrderException.class)
    public void duplicateProductLinesAreRejected() throws Exception {
        List<CartLine> items = Arrays.asList(new CartLine("p-1", 1), new CartLine("p-1", 1));
        place("Ava", "ava@example.com", "12 Main St", items, "TEST_SUCCESS", "");
    }

    @Test(expected = InvalidOrderException.class)
    public void moreThanTenDistinctCartLinesAreRejected() throws Exception {
        List<CartLine> items = new ArrayList<CartLine>();
        for (int i = 0; i < 11; i++) items.add(new CartLine("p-" + i, 1));
        place("Ava", "ava@example.com", "12 Main St", items, "TEST_SUCCESS", "");
    }

    @Test
    public void freeDeliveryThresholdIsApplied() throws Exception {
        assertEquals(30000, place("Ava", "ava@example.com", "12 Main St", lines("p-2", 1),
                "TEST_SUCCESS", "").getTotalInr());
    }

    @Test
    public void deliveryFeeIsAppliedBelowThreshold() throws Exception {
        assertEquals(11200, place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1),
                "TEST_SUCCESS", "").getTotalInr());
    }

    @Test
    public void emailIsNormalizedForOrderLookup() throws Exception {
        Order order = place("Ava", "AVA@EXAMPLE.COM", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
        assertEquals("ava@example.com", order.getCustomerEmail());
        assertNotNull(service.findOrder(order.getId(), "AVA@example.com"));
    }

    @Test
    public void absentPromotionCodeIsAccepted() throws Exception {
        assertEquals(11200, place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1),
                "TEST_SUCCESS", null).getTotalInr());
    }

    @Test
    public void orderLookupRequiresMatchingEmail() throws Exception {
        Order order = place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
        assertNotNull(service.findOrder(order.getId(), "AVA@example.com"));
        assertNull(service.findOrder(order.getId(), "other@example.com"));
    }

    @Test
    public void orderSurvivesRepositoryRecreation() throws Exception {
        Order order = place("Ava", "ava@example.com", "12 Main St", lines("p-1", 1), "TEST_SUCCESS", "");
        FileOrderRepository reopened = new FileOrderRepository(repositoryFile());
        assertNotNull(reopened.findById(order.getId()));
    }

    @Test
    public void simultaneousOrdersNeverOversell() throws Exception {
        ProductCatalog smallCatalog = new ProductCatalog(Arrays.asList(new Product("only-one", "Chair", "Living", 10000, 1)));
        OrderService concurrentService = newService(smallCatalog,
                new FileOrderRepository(temporaryFolder.newFile("concurrent.bin").toPath()));
        ExecutorService workers = Executors.newFixedThreadPool(8);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<Future<Boolean>>();
        for (int i = 0; i < 8; i++) {
            results.add(workers.submit(() -> {
                start.await();
                try {
                    concurrentService.placeOrder("Ava", "ava@example.com", "12 Main St", lines("only-one", 1),
                            "TEST_SUCCESS", "");
                    return true;
                } catch (OutOfStockException expected) {
                    return false;
                }
            }));
        }
        start.countDown();
        int successfulOrders = 0;
        for (Future<Boolean> result : results) if (result.get()) successfulOrders++;
        workers.shutdownNow();
        concurrentService.close();
        assertEquals(1, successfulOrders);
        assertEquals(0, smallCatalog.find("only-one").getStock());
    }

    private Order place(String name, String email, String address, List<CartLine> items, String payment, String promo)
            throws Exception {
        return service.placeOrder(name, email, address, items, payment, promo);
    }

    private OrderService newService(ProductCatalog productCatalog, FileOrderRepository orderRepository) {
        return new OrderService(productCatalog, orderRepository, new DemoPaymentProcessor(), () -> { });
    }

    private List<CartLine> lines(String productId, int quantity) {
        return Arrays.asList(new CartLine(productId, quantity));
    }

    private String repeat(String value, int count) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < count; i++) result.append(value);
        return result.toString();
    }

    private java.nio.file.Path repositoryFile() throws Exception {
        File file = temporaryFolder.getRoot().toPath().resolve("orders.bin").toFile();
        return file.toPath();
    }
}
