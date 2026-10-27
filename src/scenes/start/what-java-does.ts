import type { SceneModel } from '@graphlearning/graphl-flow'
import { lineOf, linesFrom } from '../ide'
import { outputOf } from '../lab'
import code from '../../../spine/start/03-what-java-does/project/Bank.java?raw'
import session from '../../../spine/start/03-what-java-does/session.txt?raw'

// §3 — ◆ full scene: what `java Bank.java` does, done as its two halves by hand (javac, then java)
// so each stage shows its REAL output from the lab: the class file, the bytecode, the classes
// loaded. A serpentine: compile along the top, run back along the bottom; every arrow crosses one
// gap. The class count is read from the session (it is the JDK build's, not ours to type).
const files = outputOf(session, 'ls')
// javap pads its columns for a terminal 100+ wide; runs of spaces inside a line are closed up (the
// text is javap's, only the padding goes) so the bytecode fits beside the other stages at 24px.
const bytecode = outputOf(session, 'javap -c Bank').split('\n').map((l) => l.replace(/(\S) {2,}/g, '$1  ')).join('\n')
const run = outputOf(session, 'java Bank')
const count = outputOf(session, 'java -Xlog:class+load:stdout:none Bank | grep -c source:')
const loaded = outputOf(session, "java -Xlog:class+load:stdout:none Bank | grep -E '^(Bank|java.lang.IO) '")
const main = linesFrom(bytecode, 'void main();', '10: return')

export const startWhatJavaDoes: SceneModel = {
  title: 'What java Bank.java does',
  sub: 'OpenJDK 25: compile the whole file to bytecode, then the JVM runs it',
  nodes: [
    {
      type: 'group', id: 'stages', bare: true, dir: 'grid', cols: 3, children: [
        {
          type: 'group', id: 'source', badge: 1, title: 'Source', sub: 'the text you wrote', icon: 'file', tone: 'ingest', children: [
            { type: 'code', id: 'src', filename: 'Bank.java', lang: 'java', code, highlight: [lineOf(code, 'balance')] },
          ],
        },
        {
          type: 'group', id: 'javac', badge: 2, title: 'Compile', sub: 'javac Bank.java', icon: 'code', tone: 'ingest', children: [
            { type: 'code', id: 'ls', terminal: true, filename: 'terminal', code: `$ javac Bank.java\n$ ls\n${files}` },
            { type: 'note', id: 'memory', text: 'java Bank.java does this in memory: no Bank.class left behind.' },
          ],
        },
        {
          type: 'group', id: 'bytecode', badge: 3, title: 'Bytecode', sub: 'javap -c Bank', icon: 'layers', tone: 'ingest', children: [
            { type: 'code', id: 'javap', lang: 'text', code: bytecode, show: [[main[0], main.at(-1)!]], highlight: [lineOf(bytecode, "Ana\\'s balance")] },
            { type: 'note', id: 'folded', tone: 'consume', text: 'javac already joined the text and 120.50 into one string: the zero was gone before the program ran.' },
          ],
        },
        {
          type: 'group', id: 'output', badge: 6, title: 'Output', sub: 'what IO.println wrote', icon: 'screen', tone: 'store', children: [
            { type: 'code', id: 'out', terminal: true, filename: 'terminal', code: `$ java Bank\n${run}` },
          ],
        },
        {
          type: 'group', id: 'jvm', badge: 5, title: 'The JVM runs it', sub: 'HotSpot', icon: 'cpu', tone: 'store', children: [
            {
              type: 'table', id: 'engines', columns: ['part', 'its job'], rows: [
                { id: 'interp', cells: ['interpreter', 'runs bytecode, one step at a time'], tone: 'store' },
                ['JIT compiler', 'hot methods → machine code'],
                ['garbage collector', 'frees unused objects'],
              ],
            },
          ],
        },
        {
          type: 'group', id: 'loader', badge: 4, title: 'Class loading', sub: 'java Bank', icon: 'boxes', tone: 'store', children: [
            {
              type: 'table', id: 'loaded', columns: ['class', 'loaded from'], rows: [
                ...loaded.split('\n').map((l) => l.split(' source: ')),
                { id: 'count', cells: [`${count} classes in all`, 'to run this one file'], tone: 'store' },
              ],
            },
          ],
        },
      ],
    },
  ],
  edges: [
    { from: 'source', to: 'javac', label: 'compile' },
    { from: 'javac', to: 'bytecode', label: 'inside' },
    { from: 'bytecode', to: 'loader', label: 'java Bank' },
    { from: 'loader', to: 'jvm', label: 'run' },
    { from: 'jvm', to: 'output', label: 'print' },
  ],
}
