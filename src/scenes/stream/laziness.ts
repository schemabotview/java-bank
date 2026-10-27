import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'
import code from '../../../spine/stream/05-laziness/project/Bank.java?raw'
import session from '../../../spine/stream/05-laziness/session.txt?raw'

// §5 — laziness: building the stream runs nothing; anyMatch pulls entries one at a time and stops
// at the first match, the 5th — the last two are never looked at (the session's peek lines).
export const streamLaziness: SceneModel = ideFrame({
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'Predicate<Entry> large', 'Account open', 0), highlight: linesFrom(code, 'Stream<Entry> checked', 'checked.anyMatch') },
  session,
  side: [
    {
      type: 'table', id: 'pulled', title: 'checked.anyMatch(large)', tone: 'ingest', columns: ['entry', 'looked at?'], rows: [
        ['1  Deposit 1200.00', 'yes: no match'],
        ['2  Deposit 300.00', 'yes: no match'],
        ['3  Withdrawal 80.00', 'yes: no match'],
        ['4  Deposit 2500.00', 'yes: no match'],
        { id: 'hit', cells: ['5  Withdrawal 1500.00', 'yes: a match, stop'], tone: 'store' },
        { id: 'skip6', cells: ['6  Withdrawal 120.00', 'never'], tone: 'consume' },
        { id: 'skip7', cells: ['7  Deposit 64.20', 'never'], tone: 'consume' },
      ],
    },
    {
      type: 'group', id: 'two', title: 'Two kinds of step', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 't-mid', title: 'filter, map, peek', sub: 'describe the work: run nothing', icon: 'file' },
        { type: 'item', id: 't-end', title: 'anyMatch, reduce, count', sub: 'pull the elements through', icon: 'zap', tone: 'store' },
      ],
    },
    { type: 'note', id: 'first', tone: 'store', text: '"built the stream; nothing checked yet" printed BEFORE any checking line: peek only ran when anyMatch asked for an entry.' },
  ],
  edges: [{ from: 't-mid', to: 't-end', label: 'waits for' }],
})
