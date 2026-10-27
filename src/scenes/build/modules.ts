import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame } from '../ide'
import { outputOf } from '../lab'
import { buildTree } from './tree'
import code from '../../../spine/build/06-modules/project/src/main/java/module-info.java?raw'
import session from '../../../spine/build/06-modules/session.txt?raw'

// §6 — modules: module-info.java exports ledger.model only; ledger and ledger.store are inside the
// module, invisible to every other module. The description is jar's own (the session).
const described = outputOf(session, 'jar --describe-module --file target/ledger-1.0.jar').split('\n').slice(1).map((l) => l.split(' '))

export const buildModules: SceneModel = ideFrame({
  tree: buildTree({ active: 'module-info.java', fresh: ['module-info.java'], pom: true, output: 'target', module: true }),
  editor: { file: 'src/main/java/module-info.java', code, highlight: [3] },
  session,
  side: [
    {
      type: 'group', id: 'mod', title: 'module ledger', icon: 'package', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'm-model', title: 'ledger.model', sub: 'exported: other modules may use it', icon: 'card', tone: 'store' },
        { type: 'item', id: 'm-inside', title: 'ledger, ledger.store', sub: 'contained: nobody outside sees them', icon: 'lock' },
      ],
    },
    { type: 'table', id: 'desc', title: 'jar --describe-module', tone: 'ingest', columns: ['says', 'about'], rows: described.map(([word, ...rest], i) => ({ id: `m${i}`, cells: [word, rest.join(' ')], tone: word === 'exports' ? 'store' as const : undefined })) },
    {
      type: 'table', id: 'levels', title: 'Two borders now', tone: 'ingest', columns: ['marked', 'seen by'], rows: [
        ['public, package not exported', 'this module only'],
        { id: 'pubexp', cells: ['public, package exported', 'every module'], tone: 'store' },
      ],
    },
  ],
})
