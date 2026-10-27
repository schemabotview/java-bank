// Everything that can happen to an account: a closed list the compiler knows.
sealed interface Transaction {
    Money amount();

    record Deposit(Money amount) implements Transaction {}
    record Withdrawal(Money amount) implements Transaction {}
    record Transfer(String to, Money amount) implements Transaction {}
}
