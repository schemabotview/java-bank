import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/03-fold/project/Bank.java?raw'
import session from '../../../spine/stream/03-fold/session.txt?raw'

// §3 — filter / map / reduce: an account's balance, folded from the ledger, equals the balance the
// Account kept (the session) — the balance is DERIVED from the ledger.
export const streamFold: SceneModel = ideFrame({
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'for (Account a : List.of', 'Money signed', 0), highlight: linesFrom(code, 'Money folded = ledger.stream()', '.reduce(') },
  session,
  side: [
    {
      type: 'group', id: 'pipe', title: "Ana's balance, as a pipeline", icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'p-src', title: 'ledger.stream()', sub: '7 entries, one at a time', icon: 'layers' },
        { type: 'item', id: 'p-filter', title: '.filter(her account)', sub: '4 entries go on', icon: 'filter' },
        { type: 'item', id: 'p-map', title: '.map(signed)', sub: '+1200, -80, +2500, -1500', icon: 'zap' },
        { type: 'item', id: 'p-reduce', title: '.reduce(0.00, Money::plus)', sub: '2120.00 EUR', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'check', title: 'Kept, and folded', tone: 'store', columns: ['account', 'Account kept', 'ledger folded'], rows: [
        ['SB-0001', '2120.00', '2120.00'],
        ['SB-0002', '244.20', '244.20'],
      ],
    },
    { type: 'note', id: 'derived', tone: 'store', text: 'The balance is a fold of the ledger. Keep the ledger, and every balance can be worked out again: Course 8 rebuilds the bank this way after a restart.' },
  ],
  edges: [
    { from: 'p-src', to: 'p-filter' },
    { from: 'p-filter', to: 'p-map' },
    { from: 'p-map', to: 'p-reduce' },
  ],
})
