import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, lineOf } from '../ide'
import release from '../../../spine/start/01-jdk/captured/usr/lib/jvm/java-25-openjdk-amd64/release?raw'
import session from '../../../spine/start/01-jdk/session.txt?raw'

// §1 — install a JDK. The explorer is the JDK's own folder (its real top level); the editor is its
// `release` file, captured by the replay. MODULES (69 names, one 1,300-column line) is folded away.
// Every answer in the side pane is in the session; HotSpot is the VM the banner's third line names.
const modules = lineOf(release, 'MODULES=')

export const startJdk: SceneModel = ideFrame({
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
    {
      type: 'group', id: 'jdk', title: 'The JDK: what you install', sub: 'tools for writing Java', icon: 'package', tone: 'ingest', children: [
        {
          type: 'group', id: 'tools', bare: true, dir: 'grid', cols: 2, children: [
            { type: 'item', id: 't-javac', title: 'javac', sub: 'compiles .java to .class', icon: 'code' },
            { type: 'item', id: 't-jshell', title: 'jshell', sub: 'tries one line at a time', icon: 'terminal' },
            { type: 'item', id: 't-javap', title: 'javap', sub: 'shows the bytecode', icon: 'search' },
            { type: 'item', id: 't-jar', title: 'jar', sub: 'packs classes into one file', icon: 'boxes' },
          ],
        },
        {
          type: 'group', id: 'runtime', title: 'The runtime: what runs a program', tone: 'store', dir: 'grid', cols: 2, children: [
            { type: 'item', id: 'r-java', title: 'java', sub: 'the launcher', icon: 'zap' },
            { type: 'item', id: 'r-lib', title: 'the class library', sub: '69 modules: java.base …', icon: 'layers' },
            {
              type: 'group', id: 'jvm', title: 'The JVM: HotSpot', sub: 'OpenJDK 64-Bit Server VM', tone: 'source', span: 'all', dir: 'grid', cols: 3, children: [
                { type: 'item', id: 'v-interp', title: 'interpreter', sub: 'runs bytecode', icon: 'cpu' },
                { type: 'item', id: 'v-jit', title: 'JIT compiler', sub: 'hot code → machine code', icon: 'zap' },
                { type: 'item', id: 'v-gc', title: 'garbage collector', sub: 'frees memory', icon: 'memory' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'asked', title: 'Asked in the terminal', tone: 'ingest', columns: ['asked', 'answer'], rows: [
        { cells: ['java --version', 'openjdk 25.0.4.1'], tone: 'store' },
        { cells: ['javac --version', 'javac 25.0.4.1'], tone: 'store' },
        { cells: ['which java, followed', '/usr/lib/jvm/…/bin/java'] },
        { cells: ['mixed mode', 'interpreter and JIT, both on'] },
        { cells: ['sharing', 'core classes from a shared archive'] },
      ],
    },
    { type: 'note', id: 'lts', tone: 'ingest', text: 'Java 25 is an LTS release: supported for years. The JDK holds the runtime, and the runtime holds the JVM.' },
  ],
})
