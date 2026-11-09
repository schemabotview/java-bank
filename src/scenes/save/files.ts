import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { outputOf } from '../lab'
import { saveTree } from './tree'
import code from '../../../spine/save/01-files/project/Journal.java?raw'
import session from '../../../spine/save/01-files/session.txt?raw'

// §1 — Path and Files: every posted entry appended as a CSV line. Run twice, and the journal holds
// everything twice (6 lines): the bank writes, but does not yet read back.
const lines = outputOf(session, 'cat data/journal.csv').split('\n')

export const saveFiles: SceneModel = ideFrame2({
  model: 'Every post appends a line on disk',
  tree: saveTree('Journal.java', ['Journal.java', 'journal.csv']),
  editor: { file: 'Journal.java', code, ...view(code, '// The bank', 'List<Entry> readAll', 0), highlight: linesFrom(code, 'void append', 'StandardOpenOption.CREATE') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'post(…), now', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'f-apply', title: 'a.apply(t)', sub: 'the account', icon: 'card' },
        { type: 'item', id: 'f-ledger', title: 'ledger.add(e)', sub: 'in memory', icon: 'layers' },
        { type: 'item', id: 'f-journal', title: 'journal.append(e)', sub: 'on disk', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'csv', title: 'data/journal.csv', tone: 'store', rows: lines.map((l) => l.split(',')),
    },
    {
      type: 'table', id: 'api', title: 'java.nio.file', tone: 'ingest', columns: ['call', 'does'], rows: [
        ['Path.of(…)', 'names a file'],
        ['createDirectories', 'makes data/'],
        ['writeString(…, APPEND)', 'open, add, close'],
      ],
    },
  ],
  edges: [
    { from: 'flow', to: 'csv' },
    { from: 'f-apply', to: 'f-ledger' },
    { from: 'f-ledger', to: 'f-journal' },
  ],
})
