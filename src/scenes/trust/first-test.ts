import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import { buildTree } from '../build/tree'
import code from '../../../spine/trust/01-first-test/project/src/test/java/ledger/model/AccountTest.java?raw'
import session from '../../../spine/trust/01-first-test/session.txt?raw'
import failing from '../../../spine/trust/01b-failing/session.txt?raw'

// §1 — a first JUnit test: arrange, act, assert. The failing lab expects 125.00; JUnit's message is
// read from it, never typed.
const message = failing.match(/AssertionFailedError: (.*)$/m)?.[1] ?? ''

export const trustFirstTest: SceneModel = ideFrame2({
  model: 'Arrange, act, assert',
  tree: buildTree({ active: 'AccountTest.java', fresh: ['AccountTest.java'], pom: true, output: 'target', tests: ['AccountTest.java'] }),
  editor: { file: 'src/test/java/ledger/model/AccountTest.java', code, highlight: [lineOf(code, '@Test'), lineOf(code, 'var ana'), lineOf(code, 'ana.deposit'), lineOf(code, 'assertEquals(')] },
  session,
  side: [
    {
      type: 'group', id: 'aaa', title: 'Every test has three parts', icon: 'check', tone: 'ingest', children: [
        { type: 'item', id: 'a-arrange', title: 'Arrange', sub: 'an account with 100.00', icon: 'settings' },
        { type: 'item', id: 'a-act', title: 'Act', sub: 'deposit 25.10', icon: 'zap' },
        { type: 'item', id: 'a-assert', title: 'Assert', sub: 'the balance is 125.10', icon: 'check', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'runs', title: 'mvn test', tone: 'ingest', columns: ['the test expects', 'outcome'], rows: [
        { id: 'pass', cells: ['125.10 EUR', 'pass'], tone: 'store' },
        { id: 'fail', cells: ['125.00 (a lab)', 'BUILD FAILURE'], tone: 'consume' },
      ],
    },
    { type: 'item', id: 'msg', title: 'JUnit says how it failed', sub: message, icon: 'bell', tone: 'consume' },
  ],
  edges: [
    { from: 'runs', to: 'msg' },
    { from: 'a-arrange', to: 'a-act' },
    { from: 'a-act', to: 'a-assert' },
  ],
})
