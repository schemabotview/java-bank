import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/hold/08-arrays/project/Bank.java?raw'
import session from '../../../spine/hold/08-arrays/session.txt?raw'

// §8 — an array: one day's transactions, three fixed slots of references. Printing the array itself
// gives its type code and identity hash (volatile: masked in the replay, never typed here).
export const holdArrays: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, ...view(code, 'BigDecimal[] today', undefined, 0), highlight: linesFrom(code, 'BigDecimal[] today', 'Closing balance') },
  session,
  side: [
    {
      type: 'group', id: 'mem', bare: true, dir: 'row', children: [
        { type: 'table', id: 'names', title: 'names', tone: 'ingest', rows: [{ id: 'today', cells: ['today', '●'] }] },
        {
          type: 'table', id: 'array', title: 'a BigDecimal[3]', tone: 'source', columns: ['index', 'slot'], rows: [
            { id: 's0', cells: ['0', '25.10'], tone: 'store' },
            { id: 's1', cells: ['1', '-40.00'], tone: 'consume' },
            { id: 's2', cells: ['2', '12.99'], tone: 'store' },
            { id: 'len', cells: ['length', '3, fixed'] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'printing', title: 'Printing it', tone: 'ingest', columns: ['printed', 'shows'], rows: [
        { id: 'raw', cells: ['today', '[Ljava.math.BigDecimal;@…'], tone: 'consume' },
        { id: 'pretty', cells: ['Arrays.toString(today)', '[25.10, -40.00, 12.99]'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'closing', title: 'The closing balance', tone: 'store', columns: ['', 'amount'], rows: [
        ['opening', '120.50'],
        ['+ today[0] + today[1] + today[2]', '-1.91'],
        { id: 'close', cells: ['closing', '118.59'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'names.today', to: 'array' }],
})
