package studio.furnique.cloud;

import com.google.cloud.NoCredentials;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import studio.furnique.domain.Order;
import studio.furnique.domain.OrderItem;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;

public class BackupService {
    private final Path backupDirectory;
    private final String bucketName;

    public BackupService(Path backupDirectory, String bucketName) {
        this.backupDirectory = backupDirectory;
        this.bucketName = bucketName;
    }

    public void backup(List<Order> orders) throws IOException {
        Files.createDirectories(backupDirectory);
        String fileName = "orders-" + Instant.now().toEpochMilli() + ".csv";
        Path backup = backupDirectory.resolve(fileName);
        StringBuilder csv = new StringBuilder("order_id,email,status,total_inr,product_id,product_name,quantity\n");
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                csv.append(cell(order.getId())).append(',')
                        .append(cell(order.getCustomerEmail())).append(',')
                        .append(cell(order.getStatus())).append(',')
                        .append(order.getTotalInr()).append(',')
                        .append(cell(item.getProductId())).append(',')
                        .append(cell(item.getProductName())).append(',')
                        .append(item.getQuantity()).append('\n');
            }
        }
        Files.write(backup, csv.toString().getBytes(StandardCharsets.UTF_8));
        if (bucketName != null && !bucketName.trim().isEmpty()) {
            String emulator = System.getenv("STORAGE_EMULATOR_HOST");
            StorageOptions.Builder options = StorageOptions.newBuilder().setProjectId("furnique");
            if (emulator != null && !emulator.trim().isEmpty()) {
                options.setHost(emulator).setCredentials(NoCredentials.getInstance());
            }
            Storage storage = options.build().getService();
            BlobInfo blob = BlobInfo.newBuilder(bucketName, fileName).setContentType("text/csv").build();
            storage.create(blob, Files.readAllBytes(backup));
        }
    }

    public static BackupService fromEnvironment() {
        String directory = System.getenv("BACKUP_DIRECTORY");
        String bucket = System.getenv("GCS_BUCKET");
        return new BackupService(Paths.get(directory == null || directory.trim().isEmpty() ? "data/backups" : directory),
                bucket);
    }

    private String cell(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
