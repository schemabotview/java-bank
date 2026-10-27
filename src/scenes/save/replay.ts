import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { saveTree } from './tree'
import code from '../../../spine/save/02-replay/project/Bank.java?raw'
import session from '../../../spine/save/02-replay/session.txt?raw'

// §2 — replay: on start, every journal line is applied again (and not re-written); three runs, the
// same balances, still 3 lines (the session).
export const saveReplay: SceneModel = ideFrame({
  tree: saveTree('Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'List<Entry> saved', 'Account open', 0), highlight: [...linesFrom(code, 'List<Entry> saved', 'replay(e);'), ...linesFrom(code, 'void replay', 'ledger.add(e);')] },
  session,
  side: [
    {
      type: 'group', id: 'start', title: 'Every start', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 's-read', title: 'journal.readAll()', sub: 'every line, back into an Entry', icon: 'disk' },
        { type: 'item', id: 's-replay', title: 'replay(e) for each', sub: 'apply to the account, add to the ledger', icon: 'layers' },
        { type: 'item', id: 's-ready', title: 'balances rebuilt', sub: 'Ana 1120.00, Ben 300.00', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'Three runs', tone: 'ingest', columns: ['run', 'did', 'journal'], rows: [
        ['1', 'posted the opening day', '3 lines'],
        { id: 'r2', cells: ['2', 'replayed 3 entries', '3 lines'], tone: 'store' },
        { id: 'r3', cells: ['3', 'replayed 3 entries', '3 lines'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'fold', tone: 'store', text: 'Course 7 folded a balance from the ledger. This is the same idea on disk: the journal is the truth, and the balances are worked out from it.' },
  ],
  edges: [
    { from: 's-read', to: 's-replay' },
    { from: 's-replay', to: 's-ready' },
  ],
})
