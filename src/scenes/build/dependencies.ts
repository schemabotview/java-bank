import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { buildTree } from './tree'
import code from '../../../spine/build/04-dependencies/project/pom.xml?raw'
import session from '../../../spine/build/04-dependencies/session.txt?raw'

// §4 — a dependency: junit-jupiter, test scope; Maven fetches it AND what it needs. The tree is the
// session's dependency:tree, one row per artifact.
const tree = session.split('\n').filter((l) => /:jar:/.test(l)).map((l) => {
  const [group, artifact, , version] = l.replace(/^[\s|+\\-]*/, '').split(':')
  return { depth: (l.match(/^[\s|+\\-]*/)?.[0].length ?? 0) / 3, group, artifact, version }
})

export const buildDependencies: SceneModel = ideFrame2({
  model: 'TODO',
  tree: buildTree({ active: 'pom.xml', pom: true, output: 'target' }),
  editor: { file: 'pom.xml', code, lang: 'text', ...view(code, '<dependencies>', '</dependencies>', 0), highlight: linesFrom(code, '<dependency>', '</dependency>') },
  session,
  side: [
    {
      type: 'table', id: 'deps', title: 'One line in the pom, nine jars', tone: 'ingest', columns: ['artifact', 'version'], rows: tree.map((d, i) => ({
        id: `d${i}`, cells: [`${'  '.repeat(d.depth)}${d.artifact}`, d.version], tone: d.depth === 1 ? 'store' : undefined,
      })),
    },
    {
      type: 'group', id: 'fetch', title: 'Where they come from', icon: 'globe', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'f-central', title: 'Maven Central', sub: 'repo.maven.apache.org', icon: 'globe' },
        { type: 'item', id: 'f-local', title: '~/.m2/repository', sub: 'downloaded once', icon: 'disk', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'scopes', title: 'Scopes', tone: 'ingest', columns: ['scope', 'on the classpath for'], rows: [
        ['compile (the default)', 'the code, the tests, the jar'],
        { id: 'test', cells: ['test', 'the tests only'], tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'f-central', to: 'f-local' }],
})
