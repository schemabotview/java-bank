import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { project } from './tree'
import code from '../../../spine/start/04-jshell/project/Bank.java?raw'
import session from '../../../spine/start/04-jshell/session.txt?raw'

// §4 — jshell beside the editor: try a line, then write it down. Every answer is the session's.
export const startJshell: SceneModel = ideFrame2({
  model: 'jshell reads, evaluates, prints',
  tree: project('active'),
  editor: { file: 'Bank.java', code, highlight: [lineOf(code, 'Interest')] },
  session,
  side: [
    {
      type: 'group', id: 'loop', title: 'jshell: try a line', icon: 'terminal', tone: 'ingest', children: [
        { type: 'item', id: 'read', title: 'Read', sub: 'the snippet you type', icon: 'file' },
        { type: 'item', id: 'eval', title: 'Evaluate', sub: 'compiled and run at once', icon: 'cpu' },
        { type: 'item', id: 'print', title: 'Print', sub: 'its value, named $1, $2 …', icon: 'screen' },
      ],
    },
    {
      type: 'table', id: 'typed', title: 'Typed at jshell>', tone: 'ingest', columns: ['typed', 'jshell answers'], rows: [
        ['120.50', '120.5'],
        ['120.50 + 25.10', '145.6'],
        { id: 'interest', cells: ['120.50 * 0.015', '1.8074999999999999'], tone: 'consume' },
      ],
    },
    {
      type: 'table', id: 'versus', title: 'jshell and the file', tone: 'ingest', columns: ['', 'jshell', 'Bank.java'], rows: [
        ['runs', 'a snippet', 'main()'],
        ['shows', 'every value', 'what it prints'],
        ['keeps', 'nothing', 'every line'],
        ['for', 'trying a line', 'the bank'],
      ],
    },
  ],
  edges: [
    { from: 'read', to: 'eval' },
    { from: 'eval', to: 'print' },
    { from: 'loop', to: 'typed' },
  ],
})
