import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/03-synchronized/project/src/main/java/ledger/model/Account.java?raw'
import session from '../../../spine/concurrent/03-synchronized/session.txt?raw'

// §3 — synchronized ◆ side pane: happens-before. One thread at a time holds an account's monitor,
// and what it wrote is seen by the next holder: the same lab now ends at exactly 1000.00, twice.
export const concurrentSynchronized: SceneModel = ideFrame({
  // model/ stays closed: open, its longest name overflows the explorer (the tab names the file).
  tree: concurrentTree('Account.java', ['Tellers.java'], [], false, true),
  editor: { file: 'src/main/java/ledger/model/Account.java', code, ...view(code, '// Every method that touches', 'public synchronized void apply', 0), highlight: [lineOf(code, 'public synchronized Money balance()'), lineOf(code, 'public synchronized void deposit'), lineOf(code, 'public synchronized void withdraw')] },
  session,
  side: [
    {
      type: 'group', id: 'monitor', title: "Ana's account: one monitor", icon: 'lock', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'm-a', title: 'teller A', sub: 'holds the lock: deposits', icon: 'key', tone: 'store' },
        { type: 'item', id: 'm-b', title: 'teller B', sub: 'blocked: waits its turn', icon: 'clock' },
      ],
    },
    {
      type: 'group', id: 'hb', title: 'Happens-before', icon: 'workflow', tone: 'store', children: [
        { type: 'item', id: 'h-write', title: 'A writes 5.01, then unlocks', icon: 'disk' },
        { type: 'item', id: 'h-read', title: 'B locks, then reads: 5.01', sub: 'guaranteed to see A\'s write', icon: 'check', tone: 'store' },
      ],
    },
    { type: 'table', id: 'runs', title: 'The same lab, now', tone: 'store', columns: ['run', 'balance'], rows: [['1', '1000.00 EUR'], ['2', '1000.00 EUR']] },
  ],
  edges: [
    { from: 'm-a', to: 'm-b', label: 'then' },
    { from: 'h-write', to: 'h-read', label: 'happens before' },
  ],
})
