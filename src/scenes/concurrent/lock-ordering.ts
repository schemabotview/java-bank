import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/06-lock-ordering/project/src/main/java/ledger/TransferService.java?raw'
import session from '../../../spine/concurrent/06-lock-ordering/session.txt?raw'

// §6 — lock ordering: both threads take the lower account number's lock first, so neither can hold
// what the other waits for; the same 400000 transfers finish, the total unchanged (the session).
export const concurrentLockOrdering: SceneModel = ideFrame({
  tree: concurrentTree('TransferService.java', ['Counters.java', 'Tellers.java', 'Transfers.java'], [], true),
  editor: { file: 'src/main/java/ledger/TransferService.java', code, ...view(code, 'public class TransferService', undefined, 0), highlight: linesFrom(code, 'boolean fromFirst', 'synchronized (second)') },
  session,
  side: [
    {
      type: 'table', id: 'order', title: 'Which lock each thread takes first', tone: 'ingest', columns: ['thread', 'before', 'now'], rows: [
        { id: 'ab', cells: ['ana-to-ben', 'Ana, then Ben', 'SB-0001, then SB-0002'], tone: 'store' },
        { id: 'ba', cells: ['ben-to-ana', 'Ben, then Ana', 'SB-0001, then SB-0002'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'no-cycle', title: 'One order, no cycle', icon: 'shield', tone: 'store', dir: 'row', children: [
        { type: 'item', id: 'n-first', title: 'both want SB-0001 first', sub: 'one gets it, one waits', icon: 'lock' },
        { type: 'item', id: 'n-done', title: 'the winner takes SB-0002', sub: 'finishes, releases both', icon: 'check', tone: 'store' },
      ],
    },
    { type: 'table', id: 'result', title: 'The same lab', tone: 'store', columns: ['', 'after 400000 transfers'], rows: [['Ana', '5000.00 EUR'], ['Ben', '5000.00 EUR'], ['total', '10000.00 EUR: not a cent lost']] },
  ],
  edges: [{ from: 'n-first', to: 'n-done' }],
})
