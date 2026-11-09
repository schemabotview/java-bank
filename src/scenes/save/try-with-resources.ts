import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { outputOf } from '../lab'
import { saveTree } from './tree'
import code from '../../../spine/save/03-try-with-resources/project/Journal.java?raw'
import session from '../../../spine/save/03-try-with-resources/session.txt?raw'
import unclosed from '../../../spine/save/03b-unclosed/session.txt?raw'

// §3 — try-with-resources: one BufferedWriter for the whole run. The 03b lab never closes it: the
// lines sat in the buffer and the file is empty; with try (…) it holds all 3.
const lost = outputOf(unclosed, 'wc -l data/journal.csv')
const kept = outputOf(session, 'wc -l data/journal.csv')

export const saveTryWithResources: SceneModel = ideFrame2({
  model: 'try-with-resources always closes',
  tree: saveTree('Journal.java'),
  editor: { file: 'Journal.java', code, show: [[lineOf(code, 'implements AutoCloseable'), lineOf(code, 'private final BufferedWriter')], [lineOf(code, 'Files.newBufferedWriter'), lineOf(code, 'StandardOpenOption.CREATE')], [lineOf(code, '@Override'), lineOf(code, 'out.close()')]], highlight: [lineOf(code, 'implements AutoCloseable'), lineOf(code, 'Files.newBufferedWriter'), lineOf(code, 'out.close()')] },
  session,
  side: [
    {
      type: 'group', id: 'buffer', title: 'out.write(line)', icon: 'memory', tone: 'ingest', children: [
        { type: 'item', id: 'b-write', title: 'write()', sub: 'fast: no disk yet', icon: 'zap' },
        { type: 'item', id: 'b-buf', title: 'an 8 KB buffer', sub: 'in memory', icon: 'memory' },
        { type: 'item', id: 'b-disk', title: 'the file', sub: 'when full, or on close()', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'wc -l journal.csv, one run', tone: 'ingest', columns: ['main()', 'journal'], rows: [
        { id: 'lost', cells: ['never closes (lab)', lost], tone: 'consume' },
        { id: 'kept', cells: ['try (Journal j = …)', kept], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'why', title: 'Why buffer at all', tone: 'ingest', columns: ['each append', 'costs'], rows: [
        ['writeString (8.1)', 'open, write, close'],
        { id: 'buffered', cells: ['BufferedWriter', 'a memory copy'], tone: 'store' },
      ],
    },
  ],
  edges: [
    { from: 'buffer', to: 'runs' },
    { from: 'b-write', to: 'b-buf' },
    { from: 'b-buf', to: 'b-disk' },
  ],
})
