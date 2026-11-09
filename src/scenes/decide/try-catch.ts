import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/09-try-catch/project/Bank.java?raw'
import session from '../../../spine/decide/09-try-catch/session.txt?raw'

// §9 — try / catch: "12,50" makes new BigDecimal throw NumberFormatException; it unwinds out of
// money(), deposit() is never called, and main's catch prints a message — the loop goes on.
export const decideTryCatch: SceneModel = ideFrame2({
  model: 'An exception unwinds to its catch',
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[7, 25], [lineOf(code, 'BigDecimal money'), lineOf(code, 'BigDecimal money') + 2]], highlight: [lineOf(code, 'try {'), lineOf(code, 'catch (NumberFormatException'), lineOf(code, 'not an amount')] },
  session,
  side: [
    {
      type: 'group', id: 'unwind', title: 'deposit 12,50: the exception unwinds', icon: 'layers', tone: 'consume', children: [
        { type: 'item', id: 'u-throw', title: 'new BigDecimal("12,50")', sub: 'throws NumberFormatException', icon: 'bell', tone: 'consume' },
        { type: 'item', id: 'u-money', title: 'money() ends at once', sub: 'its frame is popped; nothing returned', icon: 'layers' },
        { type: 'item', id: 'u-catch', title: "main(): catch (NumberFormatException e)", sub: 'deposit() never ran; the balance is untouched', icon: 'shield', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'with', title: 'A bad amount', tone: 'ingest', columns: ['', 'without try', 'with try'], rows: [
        ['the teller', 'stops: a trace', 'not an amount'],
        { id: 'next', cells: ['next line', 'never read', 'read'], tone: 'store' },
      ],
    },
  ],
  edges: [
    { from: 'u-throw', to: 'u-money' },
    { from: 'u-money', to: 'u-catch' },
  ],
})
