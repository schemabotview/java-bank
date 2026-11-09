import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { buildTree } from '../build/tree'
import code from '../../../spine/trust/03-parameterized/project/src/test/java/ledger/model/MoneyTest.java?raw'
import session from '../../../spine/trust/03-parameterized/session.txt?raw'

// §3 — a parameterized test: one method, a row per case, three of them ties that HALF_EVEN rounds
// to the even cent. The rows are the file's own @CsvSource.
const rows = [...code.matchAll(/^\s+"([\d.]+), ([\d.]+), ([\d.]+)",(?:\s+\/\/ (.*))?$/gm)].map(([, b, r, p, note], i) =>
  ({ id: `c${i}`, cells: [b, r, p, note ? note.replace(/: .*/, '') : ''], tone: note ? 'store' as const : undefined }))

export const trustParameterized: SceneModel = ideFrame2({
  model: 'One test, a table of cases',
  tree: buildTree({ active: 'MoneyTest.java', fresh: ['MoneyTest.java'], pom: true, output: 'target', tests: ['AccountTest.java', 'MoneyTest.java'] }),
  editor: { file: 'src/test/java/ledger/model/MoneyTest.java', code, ...view(code, 'class MoneyTest', undefined, 0), highlight: linesFrom(code, '@ParameterizedTest', '})') },
  session,
  side: [
    { type: 'table', id: 'cases', title: '@CsvSource: one row, one run', tone: 'ingest', columns: ['balance', 'rate', 'paid', ''], rows },
    {
      type: 'group', id: 'how', title: 'For each row', icon: 'workflow', tone: 'ingest', children: [
        { type: 'item', id: 'h-row', title: 'a CSV row', sub: '"0.05, 0.5, 0.02"', icon: 'table' },
        { type: 'item', id: 'h-args', title: 'three arguments', sub: 'balance, rate, paid', icon: 'key' },
        { type: 'item', id: 'h-run', title: 'one test run', sub: '5 rows: Tests run: 5', icon: 'check', tone: 'store' },
      ],
    },
  ],
  edges: [
    { from: 'h-row', to: 'h-args' },
    { from: 'h-args', to: 'h-run' },
  ],
})
