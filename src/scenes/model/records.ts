import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from './tree'
import code from '../../../spine/model/06-records/project/Money.java?raw'
import session from '../../../spine/model/06-records/session.txt?raw'

// §6 — a record: Money(amount, currency). The compact constructor refuses finer than cents and sets
// the scale to 2, so "10" and "10.00" are the same Money (the session).
export const modelRecords: SceneModel = ideFrame({
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'Money.java'], 'Money.java', ['Money.java']),
  editor: { file: 'Money.java', code, ...view(code, 'record Money', 'Money plus', 0), highlight: linesFrom(code, 'Money {', 'amount = amount.setScale') },
  session,
  side: [
    {
      type: 'table', id: 'free', title: 'One line, record Money(…), writes', tone: 'ingest', columns: ['member', 'here'], rows: [
        ['private final fields', 'amount, currency'],
        ['a constructor', 'Money(amount, currency)'],
        ['accessors', 'amount(), currency()'],
        { id: 'eq', cells: ['equals, hashCode', 'by amount and currency'], tone: 'store' },
        ['toString', 'replaced: 10.00 EUR'],
      ],
    },
    {
      type: 'group', id: 'compact', title: 'The compact constructor', icon: 'filter', tone: 'store', dir: 'row', children: [
        { type: 'item', id: 'c-in', title: 'Money.eur("10")', sub: 'scale 0', icon: 'file' },
        { type: 'item', id: 'c-scale', title: 'setScale(2)', sub: 'every Money in cents', icon: 'filter' },
        { type: 'item', id: 'c-out', title: '10.00 EUR', sub: 'equals Money.eur("10.00")', icon: 'check', tone: 'store' },
      ],
    },
    { type: 'note', id: 'refused', tone: 'consume', text: 'Money.eur("0.001") is refused: finer than cents. No Money can exist that the bank cannot pay out.' },
  ],
  edges: [
    { from: 'c-in', to: 'c-scale' },
    { from: 'c-scale', to: 'c-out' },
  ],
})
