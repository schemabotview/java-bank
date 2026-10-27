// How an account earns interest: anything that can answer this one question.
interface InterestPolicy {
    Money monthlyInterest(Money balance);
}
