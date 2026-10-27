import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { saveTree } from './tree'
import code from '../../../spine/save/04-import/project/StatementImport.java?raw'
import csv from '../../../spine/save/04-import/project/data/import/statement-2026-10.csv?raw'
import session from '../../../spine/save/04-import/session.txt?raw'

// §4 — importing a statement: each data row of the file (imported raw) beside its verdict, read
// from the session's "row N: reason" lines — never typed.
const reasons = new Map([...session.matchAll(/^ {2}row (\d+): (.*)$/gm)].map(([, n, why]) => [Number(n), why]))
const rows = csv.trim().split('\n').slice(1).map((row, i) => {
  const why = reasons.get(i + 2)
  return { id: `r${i + 2}`, cells: [row.split(',')[0], row.split(',').slice(3).join(','), why ?? 'accepted'], tone: why ? 'consume' as const : 'store' as const }
})

export const saveImport: SceneModel = ideFrame({
  tree: saveTree('StatementImport.java', ['StatementImport.java', 'statement-2026-10.csv'], true),
  editor: { file: 'StatementImport.java', code, ...view(code, 'private static Entry parse', 'LocalDate.parse', 0), highlight: linesFrom(code, 'if (f.length != 5)', 'not positive') },
  session,
  side: [
    { type: 'table', id: 'rows', title: 'statement-2026-10.csv, row by row', tone: 'ingest', columns: ['id', 'kind, amount', 'verdict'], rows },
    {
      type: 'group', id: 'checks', title: 'Each row, in order', icon: 'filter', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'c-shape', title: '5 fields', icon: 'table' },
        { type: 'item', id: 'c-id', title: 'a new id', icon: 'key' },
        { type: 'item', id: 'c-acct', title: 'a known account', icon: 'users' },
        { type: 'item', id: 'c-amt', title: 'a positive amount', icon: 'card' },
      ],
    },
    { type: 'note', id: 'why', tone: 'store', text: 'A bad row is reported with its row number and reason, and the rest still import. One comma in "12,50" must not stop a whole statement.' },
  ],
  edges: [
    { from: 'c-shape', to: 'c-id' },
    { from: 'c-id', to: 'c-acct' },
    { from: 'c-acct', to: 'c-amt' },
  ],
})
