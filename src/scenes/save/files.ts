import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { outputOf } from '../lab'
import { saveTree } from './tree'
import code from '../../../spine/save/01-files/project/Journal.java?raw'
import session from '../../../spine/save/01-files/session.txt?raw'

// §1 — Path and Files: every posted entry appended as a CSV line. Run twice, and the journal holds
// everything twice (6 lines): the bank writes, but does not yet read back.
const lines = outputOf(session, 'cat data/journal.csv').split('\n')

export const saveFiles: SceneModel = ideFrame({
  tree: saveTree('Journal.java', ['Journal.java', 'journal.csv']),
  editor: { file: 'Journal.java', code, ...view(code, '// The bank', 'List<Entry> readAll', 0), highlight: linesFrom(code, 'void append', 'StandardOpenOption.CREATE') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'post(…), now', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'f-apply', title: 'a.apply(t)', sub: 'the account', icon: 'card' },
        { type: 'item', id: 'f-ledger', title: 'ledger.add(e)', sub: 'in memory', icon: 'layers' },
        { type: 'item', id: 'f-journal', title: 'journal.append(e)', sub: 'on disk', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'csv', title: 'data/journal.csv: day, account, kind, amount', tone: 'store', rows: lines.map((l) => l.split(',')),
    },
    {
      type: 'table', id: 'api', title: 'java.nio.file', tone: 'ingest', columns: ['call', 'does'], rows: [
        ['Path.of("data", "journal.csv")', 'names a file: nothing opened'],
        ['Files.createDirectories(dir)', 'makes data/ if missing'],
        ['Files.writeString(…, APPEND)', 'opens, adds a line, closes'],
      ],
    },
    { type: 'note', id: 'twice', tone: 'consume', text: 'The second run posted the opening day again: 6 lines. The bank remembers on disk, but forgets on start.' },
  ],
  edges: [
    { from: 'f-apply', to: 'f-ledger' },
    { from: 'f-ledger', to: 'f-journal' },
  ],
})
