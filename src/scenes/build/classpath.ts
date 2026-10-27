import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import { view } from '../fold'
import { buildTree } from './tree'
import code from '../../../spine/build/01-packages/project/src/main/java/ledger/Bank.java?raw'
import session from '../../../spine/build/02-classpath/session.txt?raw'

// §2 — the classpath ◆ side pane: class loading. Without -cp the launcher cannot find ledger.Bank
// (ClassNotFoundException); with Money.class deleted after compiling, Account loads but cannot
// link to Money (NoClassDefFoundError) — the 02 lab.
export const buildClasspath: SceneModel = ideFrame({
  tree: buildTree({ active: 'Bank.java', output: 'out' }),
  editor: { file: 'src/main/java/ledger/Bank.java', code, ...view(code, 'package ledger', 'class Bank {', 0), highlight: [lineOf(code, 'import ledger.model.Money')] },
  session,
  side: [
    {
      type: 'group', id: 'loaders', title: 'Who loads a class', icon: 'boxes', tone: 'ingest', children: [
        { type: 'item', id: 'l-boot', title: 'the bootstrap loader', sub: 'java.base: String, List, …', icon: 'cpu' },
        { type: 'item', id: 'l-plat', title: 'the platform loader', sub: 'java.sql, java.net.http, …', icon: 'layers' },
        { type: 'item', id: 'l-app', title: 'the application loader', sub: 'the classpath: -cp out', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'errors', title: 'Two ways to go missing', tone: 'consume', columns: ['', 'ClassNotFoundException', 'NoClassDefFoundError'], rows: [
        ['when', 'asked for by name', 'needed while running'],
        ['here', 'java ledger.Bank, no -cp', 'Money.class deleted'],
        ['means', 'the classpath is wrong', 'it compiled, then vanished'],
      ],
    },
    { type: 'note', id: 'lazy', tone: 'ingest', text: 'Classes load the first time they are needed: Bank ran, and only new Account(…) went looking for Money.' },
  ],
  edges: [
    { from: 'l-boot', to: 'l-plat', label: 'parent of' },
    { from: 'l-plat', to: 'l-app', label: 'parent of' },
  ],
})
