import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { files } from './tree'
import code from '../../../spine/model/08-interfaces/project/Promotion.java?raw'
import session from '../../../spine/model/08-interfaces/session.txt?raw'

// §8 — interfaces and composition: an Account HAS an InterestPolicy; AccountType and Promotion both
// implement it, and Ben's account swaps in a Promotion without any subclass. Amounts are the session's.
export const modelInterfaces: SceneModel = ideFrame({
  tree: files(['Account.java', 'AccountType.java', 'Bank.java', 'InterestPolicy.java', 'Money.java', 'Promotion.java'], 'Promotion.java', ['InterestPolicy.java', 'Promotion.java']),
  editor: { file: 'Promotion.java', code, highlight: [lineOf(code, 'implements InterestPolicy'), lineOf(code, 'after.monthlyInterest')] },
  session,
  side: [
    {
      type: 'group', id: 'has', bare: true, dir: 'row', children: [
        { type: 'item', id: 'account', title: 'Account', sub: 'has an InterestPolicy', icon: 'card' },
        { type: 'item', id: 'policy', title: 'interface InterestPolicy', sub: 'monthlyInterest(balance)', icon: 'layers', tone: 'store' },
        {
          type: 'group', id: 'impls', title: 'implemented by', tone: 'ingest', children: [
            { type: 'item', id: 'i-type', title: 'AccountType', sub: 'SAVINGS: 1.5%', icon: 'boxes' },
            { type: 'item', id: 'i-promo', title: 'Promotion', sub: '3% for 2 months, then …', icon: 'zap' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'months', title: 'Interest on 1000.00', tone: 'ingest', columns: ['month', 'Ana: SAVINGS', 'Ben: Promotion'], rows: [
        ['1', '15.00', '30.00'],
        ['2', '15.22', '30.90'],
        { id: 'm3', cells: ['3', '15.45', '15.91: back to 1.5%'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'vs', title: 'Why not class PromoAccount extends Account?', tone: 'consume', columns: ['', 'extends', 'has a policy'], rows: [
        ['change at runtime', 'no: fixed at new', 'yes: earnWith(…)'],
        ['savings + promotion', 'another subclass', 'combine two policies'],
      ],
    },
  ],
  edges: [
    { from: 'account', to: 'policy' },
    { from: 'policy', to: 'impls' },
  ],
})
