package ledger.model;

// How an account earns interest: anything that can answer this one question.
public interface InterestPolicy {
    Money monthlyInterest(Money balance);
}
