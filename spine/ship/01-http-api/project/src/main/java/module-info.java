// The ledger as a module: its name, and the one package others may use.
module ledger {
    requires jdk.httpserver;       // com.sun.net.httpserver
    exports ledger.model;
}
