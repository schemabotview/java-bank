import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, lastLine } from '../ide'
import { outputOf } from '../lab'
import { saveTree } from './tree'
import code from '../../../spine/save/03-try-with-resources/project/Journal.java?raw'
import session from '../../../spine/save/03-try-with-resources/session.txt?raw'
import unclosed from '../../../spine/save/03b-unclosed/session.txt?raw'

// §3 — try-with-resources: one BufferedWriter for the whole run. The 03b lab never closes it: the
// lines sat in the buffer and the file is empty; with try (…) it holds all 3.
const lost = outputOf(unclosed, 'wc -l data/journal.csv')
const kept = outputOf(session, 'wc -l data/journal.csv')

export const saveTryWithResources: SceneModel = ideFrame({
  tree: saveTree('Journal.java'),
  editor: { file: 'Journal.java', code, show: [[lineOf(code, '// One writer'), lineOf(code, 'out.newLine') + 1], [lineOf(code, '@Override'), lastLine(code)]], highlight: [lineOf(code, 'implements AutoCloseable'), lineOf(code, 'Files.newBufferedWriter'), lineOf(code, 'out.close()')] },
  session,
  side: [
    {
      type: 'group', id: 'buffer', title: 'out.write(line)', icon: 'memory', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'b-write', title: 'write()', sub: 'fast: no disk yet', icon: 'zap' },
        { type: 'item', id: 'b-buf', title: 'an 8 KB buffer', sub: 'in memory', icon: 'memory' },
        { type: 'item', id: 'b-disk', title: 'the file', sub: 'when full, or on close()', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'wc -l data/journal.csv, after one run', tone: 'ingest', columns: ['main()', 'journal'], rows: [
        { id: 'lost', cells: ['never closes it (lab)', lost], tone: 'consume' },
        { id: 'kept', cells: ['try (Journal j = …) { … }', kept], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'why', title: 'Why buffer at all', tone: 'ingest', columns: ['each append', 'costs'], rows: [
        ['Files.writeString (8.1)', 'open, write, close: every line'],
        { id: 'buffered', cells: ['BufferedWriter', 'a copy into memory'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'always', tone: 'store', text: 'try (…) calls close() when the block ends, however it ends: normally, by return, or by an exception.' },
  ],
  edges: [
    { from: 'b-write', to: 'b-buf' },
    { from: 'b-buf', to: 'b-disk' },
  ],
})
