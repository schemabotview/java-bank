import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/05-deadlock/project/src/main/java/ledger/TransferService.java?raw'
import session from '../../../spine/concurrent/05-deadlock/session.txt?raw'

// §5 — deadlock: each thread holds its payer's lock and waits for its payee's — held by the other.
// jstack's own lines (sorted, since it may report the cycle from either thread) are the session's.
export const concurrentDeadlock: SceneModel = ideFrame({
  tree: concurrentTree('TransferService.java', ['Counters.java', 'Tellers.java', 'Transfers.java'], ['TransferService.java', 'Transfers.java'], true),
  editor: { file: 'src/main/java/ledger/TransferService.java', code, highlight: linesFrom(code, 'synchronized (from)', 'synchronized (to)') },
  session,
  side: [
    {
      type: 'group', id: 'cycle', title: 'The wait-for cycle', icon: 'workflow', tone: 'consume', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 't-ab', title: 'ana-to-ben', sub: "holds Ana's lock", icon: 'cpu' },
        { type: 'item', id: 'l-ben', title: "Ben's lock", sub: 'wanted by ana-to-ben', icon: 'lock' },
        { type: 'item', id: 'l-ana', title: "Ana's lock", sub: 'wanted by ben-to-ana', icon: 'lock' },
        { type: 'item', id: 't-ba', title: 'ben-to-ana', sub: "holds Ben's lock", icon: 'cpu' },
      ],
    },
    {
      type: 'table', id: 'jstack', title: 'jstack, on the stuck JVM', tone: 'consume', columns: ['it says'], rows: [
        ['Found one Java-level deadlock:'],
        ['which is held by "ana-to-ben"'],
        ['which is held by "ben-to-ana"'],
      ],
    },
    { type: 'note', id: 'forever', tone: 'consume', text: 'No exception, no timeout: both threads wait forever, and the transfers simply stop. The program had to be killed.' },
  ],
  edges: [
    { from: 't-ab', to: 'l-ben', label: 'waits for' },
    { from: 'l-ben', to: 't-ba', label: 'held by' },
    { from: 't-ba', to: 'l-ana', label: 'waits for' },
    { from: 'l-ana', to: 't-ab', label: 'held by' },
  ],
})
