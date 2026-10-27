import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/02-method-refs/project/Bank.java?raw'
import session from '../../../spine/stream/02-method-refs/session.txt?raw'

// §2 — method references: Entry::account names a method instead of wrapping it in a lambda; a
// Comparator built from two of them sorts by account, then day (the session).
export const streamMethodRefs: SceneModel = ideFrame({
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'ledger.sort(', 'Account open', 0), highlight: [lineOf(code, 'ledger.sort('), ...linesFrom(code, 'Function<Entry, Money>', 'Transaction::amount')] },
  session,
  side: [
    {
      type: 'table', id: 'same', title: 'A lambda, and the reference that means the same', tone: 'ingest', columns: ['lambda', 'method reference'], rows: [
        ['e -> e.account()', 'Entry::account'],
        ['t -> t.amount()', 'Transaction::amount'],
        { id: 'plus', cells: ['(a, b) -> a.plus(b)', 'Money::plus'], tone: 'store' },
        ['() -> new TreeMap<>()', 'TreeMap::new'],
      ],
    },
    {
      type: 'group', id: 'cmp', title: 'Comparator.comparing(Entry::account)', icon: 'filter', tone: 'store', dir: 'row', children: [
        { type: 'item', id: 'c-acct', title: '1. account', sub: 'SB-0001 before SB-0002', icon: 'key' },
        { type: 'item', id: 'c-day', title: '2. .thenComparing(Entry::on)', sub: 'the day, within an account', icon: 'clock' },
      ],
    },
    { type: 'note', id: 'natural', tone: 'ingest', text: "Entry's natural order is still by day. A Comparator is another order, chosen at the call, without touching the class." },
  ],
  edges: [{ from: 'c-acct', to: 'c-day', label: 'tie?' }],
})
