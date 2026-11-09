import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/06-loop-or-stream/project/Bank.java?raw'
import session from '../../../spine/stream/06-loop-or-stream/session.txt?raw'

// §6 — when a loop reads better: a running balance carries state from line to line, so it is a
// loop; a total over the whole ledger is a question about the list, so it is a stream.
export const streamLoopOrStream: SceneModel = ideFrame2({
  model: 'A loop when each line needs the last',
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, '// A running balance', 'Money signed', 0), highlight: linesFrom(code, 'Money running', 'running = running.plus') },
  session,
  side: [
    { type: 'item', id: 'entries', title: "Ana's entries, in day order", sub: 'each line needs the one before', icon: 'layers', tone: 'source' },
    {
      type: 'table', id: 'running', title: "Ana's running balance: a loop", tone: 'ingest', columns: ['day', 'change', 'running'], rows: [
        ['2026-09-01', '+1200.00', '1200.00'],
        ['2026-09-14', '-80.00', '1120.00'],
        ['2026-10-01', '+2500.00', '3620.00'],
        { id: 'last', cells: ['2026-10-03', '-1500.00', '2120.00'], tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'choose', title: 'Which reads better', tone: 'ingest', columns: ['the job', 'write'], rows: [
        ['needs the line before', 'a loop'],
        ['print, post, save', 'a loop'],
        { id: 'whole', cells: ['a question on the list', 'a stream'], tone: 'store' },
        ['filter, map, total', 'a stream'],
      ],
    },
  ],
  edges: [
    { from: 'entries', to: 'running' },
  ],
})
