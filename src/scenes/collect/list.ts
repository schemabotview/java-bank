import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { COLLECT } from './files'
import code from '../../../spine/collect/01-list/project/Bank.java?raw'
import session from '../../../spine/collect/01-list/session.txt?raw'

// §1 — ArrayList ◆ side pane: growth. The ledger is a List that grows; the declined withdrawal never
// reaches it (3 entries, the session). Capacity 10, then × 1.5, is OpenJDK's ArrayList.
export const collectList: SceneModel = ideFrame({
  tree: files(COLLECT, 'Bank.java', ['Entry.java']),
  editor: { file: 'Bank.java', code, ...view(code, 'List<Entry> ledger', 'void post', 0), highlight: [lineOf(code, 'List<Entry> ledger'), lineOf(code, 'ledger.add(')] },
  session,
  side: [
    {
      type: 'table', id: 'backing', title: 'ledger: an ArrayList over an array', tone: 'ingest', columns: ['slot', '0', '1', '2', '3 … 9'], rows: [
        { id: 'used', cells: ['entry', 'Deposit', 'Withdrawal', 'Deposit', 'empty'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'grow', title: 'The 11th add, when all 10 slots are full', icon: 'layers', tone: 'ingest', children: [
        { type: 'item', id: 'g-new', title: 'a new array, half as big again', sub: '10 → 15 → 22 → 33 …', icon: 'boxes' },
        { type: 'item', id: 'g-copy', title: 'copy every entry across', sub: 'the old array is left for the GC', icon: 'layers' },
        { type: 'item', id: 'g-add', title: 'then add', sub: 'rare, so add is fast on average', icon: 'zap', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'ops', title: 'Asked of the list', tone: 'ingest', columns: ['call', 'answer'], rows: [
        ['ledger.size()', '3: the declined one is not there'],
        ['ledger.get(0)', 'the first entry'],
        ['ledger.getLast()', 'the newest entry'],
      ],
    },
  ],
  edges: [
    { from: 'g-new', to: 'g-copy' },
    { from: 'g-copy', to: 'g-add' },
  ],
})
