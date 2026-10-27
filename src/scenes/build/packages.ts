import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf, linesFrom } from '../ide'
import { view } from '../fold'
import { buildTree } from './tree'
import code from '../../../spine/build/01-packages/project/src/main/java/ledger/Bank.java?raw'
import session from '../../../spine/build/01-packages/session.txt?raw'

// §1 — packages: three folders, three packages; Bank is a class now, with `import module java.base`
// in place of the compact file's automatic imports. javac -d out, java -cp out (the session).
export const buildPackages: SceneModel = ideFrame({
  tree: buildTree({ active: 'Bank.java', output: 'out' }),
  editor: { file: 'src/main/java/ledger/Bank.java', code, ...view(code, 'package ledger', 'final ZoneId', 0), highlight: [lineOf(code, 'package ledger'), lineOf(code, 'import module java.base'), ...linesFrom(code, 'import ledger.model.Account', 'import ledger.store.StatementImport'), lineOf(code, 'class Bank {')] },
  session,
  side: [
    {
      type: 'table', id: 'map', title: 'A folder is a package', tone: 'ingest', columns: ['folder under src/main/java', 'package', 'holds'], rows: [
        ['ledger/', 'ledger', 'Bank, Page'],
        { id: 'model', cells: ['ledger/model/', 'ledger.model', 'Account, Money, …'], tone: 'store' },
        ['ledger/store/', 'ledger.store', 'Journal, StatementImport'],
      ],
    },
    {
      type: 'group', id: 'uses', title: 'Across a package border', icon: 'layers', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'u-bank', title: 'ledger.Bank', sub: 'imports ledger.model.Account', icon: 'file' },
        { type: 'item', id: 'u-acct', title: 'public class Account', sub: 'and public methods', icon: 'card', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'kept', title: 'What stays package-private', tone: 'ingest', columns: ['member', 'seen from'], rows: [
        ['InsufficientFundsException(…)', 'ledger.model only'],
        ['class Bank, class Page', 'ledger only'],
      ],
    },
    { type: 'note', id: 'run', tone: 'store', text: 'A class now has a full name: ledger.Bank. java -cp out ledger.Bank says where the classes are, and which one to start.' },
  ],
  edges: [{ from: 'u-bank', to: 'u-acct', label: 'import' }],
})
