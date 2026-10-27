import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { buildTree } from '../build/tree'
import code from '../../../spine/trust/05-logging/project/src/main/java/ledger/Bank.java?raw'
import session from '../../../spine/trust/05-logging/session.txt?raw'

// §5 — System.Logger: an audit line per posted (INFO) and declined (WARNING) transaction; DEBUG
// lines for replays are below the default level, so they never print.
export const trustLogging: SceneModel = ideFrame({
  tree: buildTree({ active: 'Bank.java', pom: true, output: 'target', tests: ['AccountTest.java', 'BankCalendarTest.java', 'MoneyTest.java'] }),
  editor: { file: 'src/main/java/ledger/Bank.java', code, ...view(code, 'void post(', undefined, 0), highlight: [lineOf(code, 'Level.INFO, "posted'), lineOf(code, 'Level.WARNING, "declined')] },
  session,
  side: [
    {
      type: 'table', id: 'levels', title: 'System.Logger.Level', tone: 'ingest', columns: ['level', 'for', 'printed?'], rows: [
        ['ERROR', 'the bank cannot go on', 'yes'],
        { id: 'warn', cells: ['WARNING', 'a declined transaction', 'yes'], tone: 'consume' },
        { id: 'info', cells: ['INFO', 'every posted entry', 'yes'], tone: 'store' },
        ['DEBUG', 'every replayed entry', 'no: below the level'],
        ['TRACE', 'step by step', 'no'],
      ],
    },
    {
      type: 'group', id: 'path', title: 'Where a line goes', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'p-api', title: 'System.Logger', sub: 'the API, in java.base', icon: 'code' },
        { type: 'item', id: 'p-jul', title: 'java.util.logging', sub: 'the default backend', icon: 'settings' },
        { type: 'item', id: 'p-err', title: 'the console', sub: 'standard error', icon: 'terminal', tone: 'store' },
      ],
    },
    { type: 'note', id: 'why', tone: 'ingest', text: 'Not IO.println: a log line has a level, a source and a format, and where it goes is decided outside the code.' },
  ],
  edges: [
    { from: 'p-api', to: 'p-jul' },
    { from: 'p-jul', to: 'p-err' },
  ],
})
