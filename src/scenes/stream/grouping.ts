import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/04-grouping/project/Bank.java?raw'
import session from '../../../spine/stream/04-grouping/session.txt?raw'

// §4 — groupingBy: the ledger into months (a TreeMap, so months come in order), each month's net
// folded; and a count per account. All figures are the session's.
export const streamGrouping: SceneModel = ideFrame2({
  model: 'groupingBy sorts entries into buckets',
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'Map<YearMonth, List<Entry>>', 'Money signed', 0), highlight: linesFrom(code, 'Map<YearMonth, List<Entry>>', 'TreeMap::new') },
  session,
  side: [
    {
      type: 'group', id: 'buckets', bare: true, children: [
        { type: 'item', id: 'src', title: 'ledger.stream()', sub: '7 entries', icon: 'layers' },
        {
          type: 'table', id: 'months', title: 'groupingBy(YearMonth)', tone: 'store', columns: ['month', 'entries', 'net'], rows: [
            { id: 'sep', cells: ['2026-09', '3', '+1420.00'] },
            { id: 'oct', cells: ['2026-10', '4', '+944.20'] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'parts', title: 'groupingBy(key, map, down)', tone: 'ingest', columns: ['argument', 'here'], rows: [
        ['key', 'YearMonth.from(e.on())'],
        ['map', 'TreeMap::new: in order'],
        ['downstream', 'toList(), counting()'],
      ],
    },
  ],
  edges: [{ from: 'src', to: 'months' }],
})
