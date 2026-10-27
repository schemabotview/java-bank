import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { buildTree } from './tree'
import code from '../../../spine/build/03-maven/project/pom.xml?raw'
import session from '../../../spine/build/03-maven/session.txt?raw'

// §3 — Maven: one pom.xml names the project and pins its plugins; `mvn compile` builds into
// target/classes because the sources are already in the standard layout.
export const buildMaven: SceneModel = ideFrame({
  tree: buildTree({ active: 'pom.xml', fresh: ['pom.xml'], pom: true, output: 'target' }),
  editor: { file: 'pom.xml', code, lang: 'text', ...view(code, '<modelVersion>', '</properties>', 0), highlight: linesFrom(code, '<groupId>bank.syndica', '<version>1.0') },
  session,
  side: [
    {
      type: 'group', id: 'life', title: 'The lifecycle: each phase runs the ones before it', icon: 'workflow', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'p-compile', title: 'compile', sub: 'target/classes', icon: 'code', tone: 'store' },
        { type: 'item', id: 'p-test', title: 'test', sub: 'src/test/java', icon: 'check' },
        { type: 'item', id: 'p-package', title: 'package', sub: 'a .jar', icon: 'package' },
      ],
    },
    {
      type: 'table', id: 'layout', title: 'The standard layout', tone: 'ingest', columns: ['folder', 'holds'], rows: [
        { id: 'main', cells: ['src/main/java', 'the code'], tone: 'store' },
        ['src/test/java', 'the tests (Course 10)'],
        ['target', 'everything Maven builds'],
      ],
    },
    {
      type: 'table', id: 'coords', title: 'Coordinates: the project\'s name in the world', tone: 'store', columns: ['tag', 'here'], rows: [
        ['groupId', 'bank.syndica'],
        ['artifactId', 'ledger'],
        ['version', '1.0'],
      ],
    },
  ],
  edges: [
    { from: 'p-compile', to: 'p-test' },
    { from: 'p-test', to: 'p-package' },
  ],
})
