// A withdrawal the balance cannot cover: something a caller MUST plan for.
class InsufficientFundsException extends Exception {
    InsufficientFundsException(Money asked, Money balance) {
        super(asked + " is more than the balance, " + balance);
    }
}
