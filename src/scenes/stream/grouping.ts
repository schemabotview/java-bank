import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/04-grouping/project/Bank.java?raw'
import session from '../../../spine/stream/04-grouping/session.txt?raw'

// §4 — groupingBy: the ledger into months (a TreeMap, so months come in order), each month's net
// folded; and a count per account. All figures are the session's.
export const streamGrouping: SceneModel = ideFrame({
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'Map<YearMonth, List<Entry>>', 'Money signed', 0), highlight: linesFrom(code, 'Map<YearMonth, List<Entry>>', 'TreeMap::new') },
  session,
  side: [
    {
      type: 'group', id: 'buckets', bare: true, dir: 'row', children: [
        { type: 'item', id: 'src', title: 'ledger.stream()', sub: '7 entries', icon: 'layers' },
        {
          type: 'group', id: 'months', title: 'groupingBy(YearMonth)', icon: 'boxes', tone: 'store', children: [
            { type: 'table', id: 'sep', title: '2026-09', rows: [['3 entries'], ['net +1420.00']] },
            { type: 'table', id: 'oct', title: '2026-10', rows: [['4 entries'], ['net +944.20']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'parts', title: 'groupingBy(key, map, downstream)', tone: 'ingest', columns: ['argument', 'here'], rows: [
        ['the key', 'e -> YearMonth.from(e.on())'],
        ['the map', 'TreeMap::new: months in order'],
        ['the downstream', 'toList(), or counting()'],
      ],
    },
    { type: 'note', id: 'count', tone: 'ingest', text: 'groupingBy(Entry::account, counting()) gives {SB-0002=3, SB-0001=4}: a HashMap, so no order is promised.' },
  ],
  edges: [{ from: 'src', to: 'months' }],
})
