import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, lastLine } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/decide/08-pass-by-value/project/Bank.java?raw'
import session from '../../../spine/decide/08-pass-by-value/session.txt?raw'

// §8 — pass by value (failure): chargeFee gets a COPY of main's reference, points its copy at a new
// BigDecimal, and returns nothing — main's balance still reads 120.50 (the session).
const at = lineOf(code, 'void chargeFee')
export const decidePassByValue: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[7, 17], [at, lastLine(code)]], highlight: [lineOf(code, 'case "fee"'), lineOf(code, 'balance = balance.subtract(fee)')] },
  session,
  side: [
    {
      type: 'group', id: 'mem', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'frames', bare: true, children: [
            { type: 'table', id: 'fee', title: 'chargeFee()', tone: 'consume', rows: [{ id: 'balance', cells: ['balance', '●'] }] },
            { type: 'table', id: 'main', title: 'main()', tone: 'ingest', rows: [{ id: 'balance', cells: ['balance', '●'] }] },
          ],
        },
        {
          type: 'group', id: 'heap', title: 'the heap', icon: 'memory', tone: 'source', children: [
            { type: 'table', id: 'new', title: 'a new BigDecimal', tone: 'consume', rows: [['118.50']] },
            { type: 'table', id: 'old', title: 'a BigDecimal', rows: [['120.50']] },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'seen', title: 'Asked at the teller', tone: 'consume', columns: ['typed', 'printed'], rows: [
        ['balance', '120.50'],
        { id: 'charged', cells: ['fee', 'charged 2.00, balance 118.50'] },
        { id: 'after', cells: ['balance', '120.50: nothing was charged'], tone: 'consume' },
      ],
    },
    { type: 'note', id: 'rule', tone: 'consume', text: 'Java passes a copy of every argument. For a reference, that is a copy of the arrow: pointing the copy elsewhere changes nothing for the caller.' },
  ],
  edges: [
    { from: 'fee.balance', to: 'new' },
    { from: 'main.balance', to: 'old' },
  ],
})
