import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/decide/01-expressions/project/Bank.java?raw'
import session from '../../../spine/decide/01-expressions/session.txt?raw'

// §1 — expressions: a year of interest as one chained BigDecimal expression, and precedence in
// jshell — * before +, brackets first, / and % on whole numbers.
export const decideExpressions: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'BigDecimal yearly', '.setScale') },
  session,
  side: [
    {
      type: 'group', id: 'eval', title: '12050 + 2510 * 2, step by step', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'e-mul', title: '2510 * 2 = 5020', sub: '* binds tighter: it goes first', icon: 'zap' },
        { type: 'item', id: 'e-add', title: '12050 + 5020 = 17070', sub: 'then +', icon: 'zap', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'order', title: 'Who goes first', tone: 'ingest', columns: ['operators', 'order'], rows: [
        ['( … )', 'first: brackets decide'],
        ['*  /  %', 'next, left to right'],
        ['+  -', 'last, left to right'],
      ],
    },
    {
      type: 'table', id: 'whole', title: 'Whole numbers divide whole', tone: 'consume', columns: ['typed', 'answer', 'meaning'], rows: [
        ['17070 / 100', '170', 'whole euros'],
        ['17070 % 100', '70', 'the cents left over'],
      ],
    },
    { type: 'note', id: 'chain', tone: 'store', text: 'BigDecimal has no operators: the year of interest is a chain of method calls, read left to right.' },
  ],
  edges: [{ from: 'e-mul', to: 'e-add' }],
})
