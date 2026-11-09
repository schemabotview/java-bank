import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf } from '../ide'
import { ideFrame2 } from '../frame'
import release from '../../../spine/start/01-jdk/captured/usr/lib/jvm/java-25-openjdk-amd64/release?raw'
import session from '../../../spine/start/01-jdk/session.txt?raw'

// §1 — install a JDK. The explorer is the JDK's own folder (its real top level); the editor is its
// `release` file, captured by the replay. MODULES (69 names, one 1,300-column line) is folded away.
// Every answer in the side pane is in the session; HotSpot is the VM the banner's third line names.
const modules = lineOf(release, 'MODULES=')

export const startJdk: SceneModel = ideFrame2({
  model: 'JDK ⊃ runtime ⊃ JVM',
  project: 'java-25-openjdk-amd64',
  cwd: '~',
  tree: [
    { name: 'bin', children: [{ name: 'jar' }, { name: 'java' }, { name: 'javac' }, { name: 'javap' }, { name: 'jshell' }, { name: '… 24 more', state: 'muted' }] },
    { name: 'conf', folder: true },
    { name: 'jmods', folder: true },
    { name: 'lib', folder: true },
    { name: 'release', state: 'active' },
  ],
  editor: { file: 'release', code: release, lang: 'text', show: [[1, modules - 1], [modules + 1, release.trim().split('\n').length]], highlight: [lineOf(release, 'JAVA_VERSION=')] },
  session,
  side: [
    { type: 'item', id: 'jdk', title: 'the JDK: what you install', sub: 'javac, jshell, javap, jar: tools for writing Java', icon: 'package', tone: 'ingest' },
    { type: 'item', id: 'runtime', title: 'the runtime: what runs a program', sub: 'the java launcher, 69 modules of class library', icon: 'layers', tone: 'store' },
    { type: 'item', id: 'jvm', title: 'the JVM: HotSpot', sub: 'interpreter, JIT compiler, garbage collector', icon: 'cpu', tone: 'source' },
    {
      type: 'table', id: 'asked', title: 'Asked in the terminal', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        { cells: ['java --version', 'openjdk 25.0.4.1'], tone: 'store' },
        { cells: ['javac --version', 'javac 25.0.4.1'], tone: 'store' },
        { cells: ['readlink -f java', '/usr/lib/jvm/…'] },
        { cells: ['mixed mode', 'interpreter + JIT'] },
        { cells: ['sharing', 'a class archive'] },
      ],
    },
  ],
  edges: [{ from: 'jdk', to: 'runtime', label: 'holds' }, { from: 'runtime', to: 'jvm', label: 'holds' }],
})
