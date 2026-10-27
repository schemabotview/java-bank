import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/decide/09-try-catch/project/Bank.java?raw'
import session from '../../../spine/decide/09-try-catch/session.txt?raw'

// §9 — try / catch: "12,50" makes new BigDecimal throw NumberFormatException; it unwinds out of
// money(), deposit() is never called, and main's catch prints a message — the loop goes on.
export const decideTryCatch: SceneModel = ideFrame({
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
        ['the teller', 'stops, with a stack trace', 'says: not an amount'],
        { id: 'next', cells: ['the next line', 'never read', 'read as usual'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'fixed', tone: 'store', text: 'chargeFee now returns the new balance, like deposit: fee then takes 2.00 for real.' },
  ],
  edges: [
    { from: 'u-throw', to: 'u-money' },
    { from: 'u-money', to: 'u-catch' },
  ],
})
