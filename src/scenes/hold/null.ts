import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, lastLine } from '../ide'
import { project } from '../start/tree'
import code from '../../../spine/hold/09-null/project/Bank.java?raw'
import session from '../../../spine/hold/09-null/session.txt?raw'

// §9 — null: a field nobody assigned starts as null; printing it is fine, calling a method on it
// throws, and the helpful message names the field (this.note). A field, not a local: the source
// launcher compiles without local names, and would call a local "<local2>".
const at = lineOf(code, 'BigDecimal closing')
export const holdNull: SceneModel = ideFrame({
  tree: project('active'),
  editor: { file: 'Bank.java', code, show: [[1, 5], [at, lastLine(code)]], highlight: [lineOf(code, 'String note;'), lineOf(code, 'note.length()')] },
  session,
  side: [
    {
      type: 'group', id: 'mem', bare: true, dir: 'row', children: [
        { type: 'table', id: 'fields', title: "the program's fields", tone: 'ingest', rows: [{ id: 'note', cells: ['note', 'null'], tone: 'consume' }] },
        { type: 'item', id: 'nothing', title: 'no object', sub: 'null: an arrow to nothing', icon: 'box' },
      ],
    },
    {
      type: 'table', id: 'defaults', title: 'A field starts as …', tone: 'ingest', columns: ['type', 'default'], rows: [
        ['int, long', '0'],
        ['double', '0.0'],
        ['boolean', 'false'],
        { id: 'refs', cells: ['String, any reference', 'null'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'npe', title: 'The helpful message', tone: 'consume', columns: ['it says', 'meaning'], rows: [
        ['Cannot invoke "String.length()"', 'what was tried'],
        ['because "this.note" is null', 'which name was empty'],
      ],
    },
    { type: 'note', id: 'local', tone: 'ingest', text: '"Note: " + note prints null without complaint. Only calling a method on it throws.' },
  ],
  edges: [{ from: 'fields.note', to: 'nothing', label: 'null' }],
})
