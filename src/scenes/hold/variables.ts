import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/hold/01-variables/project/Bank.java?raw'
import session from '../../../spine/hold/01-variables/session.txt?raw'

// §1 — variables and static types: every name has a type, fixed when it is declared; `var` asks
// the compiler to infer it. The refused assignment is the session's jshell error.
export const holdVariables: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'String bank', 'var rate') },
  session,
  side: [
    {
      type: 'group', id: 'decl', title: 'A declaration', icon: 'code', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'd-type', title: 'int', sub: 'the type', icon: 'boxes' },
        { type: 'item', id: 'd-name', title: 'accounts', sub: 'the name', icon: 'key' },
        { type: 'item', id: 'd-value', title: '= 1', sub: 'the value', icon: 'database' },
      ],
    },
    {
      type: 'table', id: 'vars', title: "main()'s variables", tone: 'ingest', columns: ['name', 'type', 'value'], rows: [
        ['bank', 'String', '"Syndica Bank"'],
        ['holder', 'String', '"Ana"'],
        { id: 'accounts', cells: ['accounts', 'int', '1'], tone: 'store' },
        ['balance', 'double', '120.5'],
        { id: 'rate', cells: ['rate', 'var → double', '0.015'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'refused', title: 'Refused by the compiler', tone: 'consume', columns: ['typed', 'the answer'], rows: [
        ['int accounts = "one"', 'incompatible types'],
        ['', 'String cannot be converted to int'],
      ],
    },
    { type: 'note', id: 'static', tone: 'ingest', text: 'A type is fixed when the name is declared. var only asks the compiler to work it out: rate is a double, for good.' },
  ],
  edges: [
    { from: 'd-type', to: 'd-name' },
    { from: 'd-name', to: 'd-value' },
  ],
})
