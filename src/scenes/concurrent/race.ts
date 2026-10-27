import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { concurrentTree } from './tree'
import code from '../../../spine/concurrent/02-race/project/labs/Tellers.java?raw'
import session from '../../../spine/concurrent/02-race/session.txt?raw'

// §2 — the race: 100 threads × 1000 one-cent deposits should add 1000.00; every run loses a
// different amount (a volatile step: the balances are read from the session, never typed).
const balances = [...session.matchAll(/^balance\s+(.*)$/gm)].map(([, b]) => b)

export const concurrentRace: SceneModel = ideFrame({
  tree: concurrentTree('Tellers.java', ['Tellers.java']),
  editor: { file: 'labs/Tellers.java', code, highlight: linesFrom(code, 'for (int n = 0', 'ana.deposit') },
  session,
  side: [
    {
      type: 'table', id: 'steps', title: 'balance = balance.plus(amount), in two threads', tone: 'consume', columns: ['', 'teller A', 'teller B', 'balance'], rows: [
        ['1', 'reads 5.00', '', '5.00'],
        ['2', '', 'reads 5.00', '5.00'],
        ['3', 'writes 5.01', '', '5.01'],
        { id: 'lost', cells: ['4', '', 'writes 5.01', '5.01: a cent lost'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'Two runs of the same program', tone: 'consume', columns: ['run', 'expected', 'balance'], rows:
        balances.map((b, i) => ({ id: `r${i}`, cells: [`${i + 1}`, '1000.00 EUR', b], tone: 'consume' as const })),
    },
    { type: 'note', id: 'why', tone: 'consume', text: 'Read, add, write is three steps, and another thread can run between any two. No error, no exception: the money is just gone, a different amount each time.' },
  ],
})
