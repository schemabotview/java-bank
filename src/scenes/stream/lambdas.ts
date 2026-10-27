import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/01-lambdas/project/Bank.java?raw'
import session from '../../../spine/stream/01-lambdas/session.txt?raw'

// §1 — lambdas: a review rule as a Predicate<Entry>, written as a lambda; two rules combined with or().
export const streamLambdas: SceneModel = ideFrame({
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, '// A review rule', 'Account open', 0), highlight: linesFrom(code, 'Predicate<Entry> large', 'Predicate<Entry> isBen') },
  session,
  side: [
    {
      type: 'group', id: 'anatomy', title: 'e -> e.account().equals(ben.number())', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'a-param', title: 'e', sub: 'the parameter: an Entry', icon: 'key' },
        { type: 'item', id: 'a-body', title: 'the body', sub: 'an expression', icon: 'cpu' },
        { type: 'item', id: 'a-out', title: 'true or false', sub: "Predicate's test()", icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'rules', title: 'Two rules, one combined', tone: 'ingest', columns: ['rule', 'true when'], rows: [
        ['large', 'a withdrawal of 1000.00 or more'],
        ['isBen', "the entry is on Ben's account"],
        { id: 'or', cells: ['large.or(isBen)', 'either one'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'hits', title: 'Sent for review', tone: 'consume', columns: ['day', 'account', 'why'], rows: [
        ['2026-09-01', 'SB-0002', 'isBen'],
        { id: 'big', cells: ['2026-10-03', 'SB-0001', 'large: 1500.00'], tone: 'consume' },
        ['2026-10-05', 'SB-0002', 'isBen'],
        ['2026-10-09', 'SB-0002', 'isBen'],
      ],
    },
  ],
  edges: [
    { from: 'a-param', to: 'a-body' },
    { from: 'a-body', to: 'a-out' },
  ],
})
