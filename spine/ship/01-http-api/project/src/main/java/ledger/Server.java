package ledger;

import module java.base;
import module jdk.httpserver;

import ledger.model.Account;
import ledger.model.Entry;
import ledger.model.InsufficientFundsException;
import ledger.model.Money;
import ledger.model.Transaction;
import ledger.store.Journal;

// Syndica Bank on the network: a small JSON API on the JDK's own HTTP server.
class Server {
    record Reply(int status, String json) {}

    final Bank bank = new Bank();
    final TransferService transfers = new TransferService();

    void main() throws IOException {
        System.setProperty("java.util.logging.SimpleFormatter.format",
                "%4$-7s %3$s: %5$s%n");
        bank.journal = new Journal(Path.of("data", "journal.csv"));
        bank.run();
        HttpServer http = HttpServer.create(new InetSocketAddress(8080), 0);
        http.createContext("/accounts/", this::account);
        http.createContext("/transfers", this::transfer);
        http.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        http.start();
        IO.println("listening on http://localhost:8080");
    }

    // GET /accounts/SB-0001
    void account(HttpExchange ex) throws IOException {
        String path = ex.getRequestURI().getPath();
        String number = path.substring("/accounts/".length());
        Account a = bank.accounts.get(number);
        send(ex, a == null
                ? new Reply(404, "{\"error\": \"no account " + number + "\"}")
                : new Reply(200, json(a)));
    }

    static String json(Account a) {
        return "{\"number\": \"%s\", \"holder\": \"%s\", \"balance\": \"%s\"}"
                .formatted(a.number(), a.holder(), a.balance());
    }

    // POST /transfers, with a form body: from=SB-0001&to=SB-0002&amount=25
    void transfer(HttpExchange ex) throws IOException {
        String body = new String(ex.getRequestBody().readAllBytes());
        Map<String, String> form = form(body);
        send(ex, pay(form));
    }

    Reply pay(Map<String, String> form) {
        Account from = bank.accounts.get(form.get("from"));
        Account to = bank.accounts.get(form.get("to"));
        if (from == null || to == null) {
            return new Reply(404, "{\"error\": \"no such account\"}");
        }
        Money amount = Money.eur(form.get("amount"));
        try {
            transfers.transfer(from, to, amount);
            LocalDate today = LocalDate.now(bank.BANK_ZONE);
            bank.record(new Entry(today, from.number(),
                    new Transaction.Transfer(to.number(), amount)));
            bank.record(new Entry(today, to.number(),
                    new Transaction.Deposit(amount)));
            return new Reply(200, "{\"paid\": \"%s\", \"%s\": \"%s\"}"
                    .formatted(amount, from.number(), from.balance()));
        } catch (InsufficientFundsException e) {
            return new Reply(409, "{\"declined\": \"" + e.getMessage() + "\"}");
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    static Map<String, String> form(String body) {
        Map<String, String> fields = new HashMap<>();
        for (String pair : body.split("&")) {
            String[] kv = pair.split("=", 2);
            fields.put(kv[0], kv.length > 1 ? kv[1] : "");
        }
        return fields;
    }

    static void send(HttpExchange ex, Reply reply) throws IOException {
        byte[] body = (reply.json() + "\n").getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json");
        ex.sendResponseHeaders(reply.status(), body.length);
        try (OutputStream out = ex.getResponseBody()) {
            out.write(body);
        }
    }
}
