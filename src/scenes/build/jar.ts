import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { outputOf } from '../lab'
import { buildTree } from './tree'
import code from '../../../spine/build/05-jar/project/pom.xml?raw'
import session from '../../../spine/build/05-jar/session.txt?raw'

// §5 — a runnable jar: the jar plugin writes Main-Class into the manifest, so java -jar needs no
// classpath and no class name. The manifest rows are the session's.
const manifest = outputOf(session, 'unzip -p target/ledger-1.0.jar META-INF/MANIFEST.MF').split('\n').filter(Boolean).map((l) => l.split(': '))

export const buildJar: SceneModel = ideFrame({
  tree: buildTree({ active: 'pom.xml', pom: true, output: 'target' }),
  editor: { file: 'pom.xml', code, lang: 'text', ...view(code, '<artifactId>maven-jar-plugin', '</configuration>', 0), highlight: linesFrom(code, '<manifest>', '</manifest>') },
  session,
  side: [
    {
      type: 'group', id: 'jar', bare: true, dir: 'row', children: [
        {
          type: 'group', id: 'inside', title: 'target/ledger-1.0.jar', icon: 'package', tone: 'store', children: [
            { type: 'item', id: 'j-classes', title: 'ledger/**/*.class', sub: 'the compiled bank', icon: 'boxes' },
            { type: 'item', id: 'j-manifest', title: 'META-INF/MANIFEST.MF', sub: 'how to run it', icon: 'file' },
          ],
        },
        { type: 'item', id: 'run', title: 'java -jar', sub: 'reads Main-Class', icon: 'terminal' },
      ],
    },
    { type: 'table', id: 'mf', title: 'MANIFEST.MF', tone: 'ingest', columns: ['header', 'value'], rows: manifest.map(([k, v]) => ({ id: k, cells: [k, v], tone: k === 'Main-Class' ? 'store' as const : undefined })) },
    { type: 'note', id: 'zip', tone: 'ingest', text: 'A jar is a zip file with a manifest. unzip can read it, and java -jar runs it on any machine with Java 25.' },
  ],
  edges: [{ from: 'run', to: 'inside' }],
})
