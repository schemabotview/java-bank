import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { buildTree } from './tree'
import code from '../../../spine/build/01-packages/project/src/main/java/ledger/Bank.java?raw'
import session from '../../../spine/build/01-packages/session.txt?raw'

// §1 — packages: three folders, three packages; Bank is a class now, with `import module java.base`
// in place of the compact file's automatic imports. javac -d out, java -cp out (the session).
export const buildPackages: SceneModel = ideFrame2({
  model: 'A folder is a package',
  tree: buildTree({ active: 'Bank.java', output: 'out' }),
  editor: { file: 'src/main/java/ledger/Bank.java', code, ...view(code, 'package ledger', 'final ZoneId', 0), highlight: [lineOf(code, 'package ledger'), lineOf(code, 'import module java.base'), ...linesFrom(code, 'import ledger.model.Account', 'import ledger.store.StatementImport'), lineOf(code, 'class Bank {')] },
  session,
  side: [
    {
      type: 'table', id: 'map', title: 'A folder is a package', tone: 'ingest', columns: ['src/main/java/…', 'package'], rows: [
        ['ledger/', 'ledger'],
        { id: 'model', cells: ['ledger/model/', 'ledger.model'], tone: 'store' },
        ['ledger/store/', 'ledger.store'],
      ],
    },
    {
      type: 'group', id: 'uses', title: 'Across a package border', icon: 'layers', tone: 'ingest', children: [
        { type: 'item', id: 'u-bank', title: 'ledger.Bank', sub: 'imports ledger.model.Account', icon: 'file' },
        { type: 'item', id: 'u-acct', title: 'public class Account', sub: 'and public methods', icon: 'card', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'kept', title: 'What stays package-private', tone: 'ingest', columns: ['member', 'seen from'], rows: [
        ['InsufficientFunds…(…)', 'ledger.model'],
        ['class Bank, Page', 'ledger'],
      ],
    },
  ],
  edges: [{ from: 'map', to: 'uses' }, { from: 'u-bank', to: 'u-acct', label: 'import' }],
})
