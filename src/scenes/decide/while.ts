import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from '../start/tree'
import code from '../../../spine/decide/06-while/project/Bank.java?raw'
import session from '../../../spine/decide/06-while/session.txt?raw'

// §6 — while and IO.readln: the teller loop. It runs until `quit` breaks out; withdraw is not a
// command yet, so it falls to the last else (the session).
export const decideWhile: SceneModel = ideFrame2({
  model: 'Loop until quit; branch on each line',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: linesFrom(code, 'while (true)', 'unknown command') },
  session,
  side: [
    {
      type: 'group', id: 'loop', title: 'while (true): one line per pass', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'l-read', title: 'IO.readln("teller> ")', sub: 'waits for a line', icon: 'terminal' },
        { type: 'item', id: 'l-match', title: 'if / else if / else', sub: 'the first test that is true wins', icon: 'filter' },
        { type: 'item', id: 'l-exit', title: 'quit: break', sub: 'the only way out of the loop', icon: 'bell', tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'commands', title: 'Typed at teller>', tone: 'ingest', columns: ['typed', 'branch'], rows: [
        ['balance', 'equals("balance")'],
        { id: 'dep', cells: ['deposit 25.10', 'startsWith("deposit ")'], tone: 'store' },
        { id: 'wd', cells: ['withdraw 10', 'else'], tone: 'consume' },
        ['quit', 'equals("quit")'],
      ],
    },
  ],
  edges: [
    { from: 'l-read', to: 'l-match' },
    { from: 'l-match', to: 'l-exit' },
  ],
})
