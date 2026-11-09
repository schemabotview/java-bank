import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { files } from '../model/tree'
import { WITH_PAGE } from './files'
import code from '../../../spine/collect/06-sorting/project/Entry.java?raw'
import session from '../../../spine/collect/06-sorting/session.txt?raw'

// §6 — sorting: Entry is Comparable — by day, then the larger amount first. Collections.sort uses
// that natural order; both orders are the session's.
export const collectSorting: SceneModel = ideFrame2({
  model: 'compareTo orders by two keys',
  tree: files(WITH_PAGE, 'Entry.java'),
  editor: { file: 'Entry.java', code, highlight: linesFrom(code, 'int byDay', 'return other.tx') },
  session,
  side: [
    {
      type: 'table', id: 'answer', title: 'a.compareTo(b) answers', tone: 'ingest', columns: ['result', 'means', 'here'], rows: [
        ['< 0', 'a first', 'earlier day'],
        ['0', 'a tie', 'never here'],
        ['> 0', 'b first', 'later day'],
      ],
    },
    {
      type: 'group', id: 'keys', title: 'Two keys', icon: 'filter', tone: 'store', children: [
        { type: 'item', id: 'k-day', title: '1. the day', sub: 'on.compareTo(other.on)', icon: 'clock' },
        { type: 'item', id: 'k-amt', title: '2. the amount', sub: 'when days tie: larger first', icon: 'card' },
      ],
    },
    {
      type: 'table', id: 'sorted', title: 'Collections.sort(ledger)', tone: 'store', columns: ['day', 'account', 'amount'], rows: [
        ['2026-10-01', 'SB-0001', '25.10'],
        ['2026-10-01', 'SB-0002', '15.00'],
        ['2026-10-03', 'SB-0001', '40.00'],
        ['2026-10-03', 'SB-0001', '12.99'],
      ],
    },
  ],
  edges: [{ from: 'answer', to: 'keys' }, { from: 'k-day', to: 'k-amt', label: 'tie?' }],
})
