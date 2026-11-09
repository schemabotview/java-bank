import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/07-methods/project/Bank.java?raw'
import session from '../../../spine/decide/07-methods/session.txt?raw'

// §7 — methods ◆ side pane: the call stack, at the moment deposit(balance, 25.10) is running: its
// frame on top of main's, with its own copies of the parameters; `return after` hands back 145.60.
// No arrow between the frames: routed from a row, it ran through the lower table's title.
const at = lineOf(code, 'BigDecimal deposit(')
export const decideMethods: SceneModel = ideFrame2({
  model: 'A call pushes a frame; return pops it',
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[lineOf(code, 'case "balance"'), lineOf(code, 'case "withdraw"')], [at, lineOf(code, 'return after')]], highlight: [lineOf(code, 'case "deposit"'), at, lineOf(code, 'return after')] },
  session,
  side: [
    {
      type: 'group', id: 'stack', title: 'The call stack, inside deposit()', icon: 'layers', tone: 'ingest', children: [
        {
          type: 'table', id: 'top', title: 'deposit(): the top frame', tone: 'store', columns: ['name', 'holds'], rows: [
            ['balance', '120.50'],
            ['amount', '25.10'],
            { id: 'after', cells: ['after', '145.60'], tone: 'store' },
          ],
        },
        {
          type: 'table', id: 'main', title: 'main(): waiting for the answer', columns: ['name', 'holds'], rows: [
            { id: 'balance', cells: ['balance', '120.50 → 145.60'], tone: 'store' },
            ['words', '["deposit", "25.10"]'],
          ],
        },
      ],
    },
    {
      type: 'table', id: 'sigs', title: 'Four methods', tone: 'ingest', columns: ['method', 'gives back'], rows: [
        ['money(text)', 'a BigDecimal'],
        { id: 'dep', cells: ['deposit(…)', 'the new balance'], tone: 'store' },
        ['withdraw(…)', 'the new balance'],
        ['main()', 'nothing: void'],
      ],
    },
  ],
  edges: [{ from: 'top', to: 'main', label: 'return after' }],
})
