// The bank's API, called from Java: one GET, then 100 payments at once.
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;

HttpClient client = HttpClient.newHttpClient();
String bank = "http://localhost:8080";

void main() throws Exception {
    IO.println(get("/accounts/SB-0001"));
    try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
        for (int i = 0; i < 100; i++) {
            String key = "pay-" + i;
            pool.submit(() -> pay(key, "from=SB-0001&to=SB-0002&amount=0.01"));
            pool.submit(() -> pay(key, "from=SB-0001&to=SB-0002&amount=0.01"));
        }
    }
    IO.println(get("/accounts/SB-0001"));
}

String get(String path) throws Exception {
    var request = HttpRequest.newBuilder(URI.create(bank + path)).build();
    var response = client.send(request, BodyHandlers.ofString());
    return response.statusCode() + " " + response.body().strip();
}

String pay(String key, String form) throws Exception {
    var request = HttpRequest.newBuilder(URI.create(bank + "/transfers"))
            .header("Idempotency-Key", key)
            .POST(HttpRequest.BodyPublishers.ofString(form))
            .build();
    return client.send(request, BodyHandlers.ofString()).body();
}
