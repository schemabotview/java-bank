import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from './files'
import code from '../../../spine/collect/08-unmodifiable/project/Bank.java?raw'
import session from '../../../spine/collect/08-unmodifiable/session.txt?raw'

// §8 — unmodifiable collections: statement() returns List.copyOf(...) — it survives the ledger being
// cleared, and add() throws UnsupportedOperationException (the session).
export const collectUnmodifiable: SceneModel = ideFrame2({
  model: 'TODO',
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'List<Entry> mine', 'List.copyOf', 0), highlight: [lineOf(code, 'ledger.clear()'), lineOf(code, 'mine.add('), lineOf(code, 'List.copyOf')] },
  session,
  side: [
    {
      type: 'group', id: 'copy', bare: true, dir: 'row', children: [
        { type: 'table', id: 'ledger', title: 'ledger', tone: 'ingest', rows: [['3 entries'], ['then cleared: 0']] },
        { type: 'table', id: 'mine', title: "Ana's statement", tone: 'store', rows: [['2 entries'], ['still 2']] },
      ],
    },
    {
      type: 'table', id: 'kinds', title: 'Lists you cannot change', tone: 'ingest', columns: ['made by', 'is', 'add()'], rows: [
        ['List.of(a, b)', 'fixed', 'throws'],
        { id: 'copyof', cells: ['List.copyOf(list)', 'a fixed copy', 'throws'], tone: 'store' },
        ['unmodifiableList(list)', 'a read-only view', 'throws'],
      ],
    },
  ],
  edges: [{ from: 'ledger', to: 'mine', label: 'List.copyOf' }],
})
