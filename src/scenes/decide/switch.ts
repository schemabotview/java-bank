import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/04-switch/project/Bank.java?raw'
import session from '../../../spine/decide/04-switch/session.txt?raw'

// §4 — a switch expression: the fee BY account type, one value per case; a switch that misses a
// value does not compile (the session's jshell error).
export const decideSwitch: SceneModel = ideFrame2({
  model: 'A switch matches one case to a value',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'BigDecimal fee = switch', '};') },
  session,
  side: [
    {
      type: 'group', id: 'match', bare: true, dir: 'row', children: [
        { type: 'item', id: 'value', title: 'type', sub: '"checking"', icon: 'key' },
        {
          type: 'table', id: 'cases', title: 'the cases', tone: 'ingest', columns: ['case', 'fee'], rows: [
            { id: 'checking', cells: ['"checking"', '2.00'], tone: 'store' },
            { id: 'savings', cells: ['"savings"', '0'] },
            { id: 'business', cells: ['"business", …', '9.50'] },
            { id: 'default', cells: ['default', 'throw'], tone: 'consume' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'rules', title: 'A switch expression', tone: 'ingest', columns: ['rule', 'why'], rows: [
        ['case … -> v', 'one value each'],
        ['no fall-through', 'one case runs'],
        ['covers all', 'or no compile'],
      ],
    },
  ],
  edges: [{ from: 'value', to: 'cases.checking' }],
})
