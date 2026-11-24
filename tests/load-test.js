const baseUrl = process.argv[2] || "http://localhost:8080";
const requestCount = Number(process.argv[3] || 200);

if (!Number.isInteger(requestCount) || requestCount < 1 || requestCount > 5000) {
  throw new Error("Request count must be an integer from 1 to 5000.");
}

async function run() {
  const start = process.hrtime.bigint();
  const responses = await Promise.all(Array.from({ length: requestCount }, async () => {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      return response.status;
    } catch (error) {
      return String(error);
    }
  }));
  const elapsedSeconds = Number(process.hrtime.bigint() - start) / 1e9;
  const successful = responses.filter((status) => status === 200).length;
  const result = {
    requests: requestCount,
    successful,
    failed: requestCount - successful,
    elapsedSeconds: Number(elapsedSeconds.toFixed(3)),
    requestsPerSecond: Number((requestCount / elapsedSeconds).toFixed(1))
  };
  console.log(JSON.stringify(result, null, 2));
  if (successful !== requestCount) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
