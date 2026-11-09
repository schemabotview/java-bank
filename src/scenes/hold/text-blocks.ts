import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { project } from '../start/tree'
import code from '../../../spine/hold/07-text-blocks/project/Bank.java?raw'
import session from '../../../spine/hold/07-text-blocks/session.txt?raw'

// §7 — a text block: the statement header as one literal. The compiler strips the common indent and
// keeps the line breaks; the closing """ on the last line means no trailing newline.
export const holdTextBlocks: SceneModel = ideFrame2({
  model: 'A text block, written as it prints',
  tree: project('active'),
  editor: { file: 'Bank.java', code, ...view(code, 'void main'), highlight: linesFrom(code, 'String header', '.formatted(bank') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'From literal to header', icon: 'file', tone: 'ingest', children: [
        { type: 'item', id: 'f-block', title: 'the text block', sub: 'between """ and """', icon: 'code' },
        { type: 'item', id: 'f-strip', title: 'the compiler strips the indent', sub: 'the 12 spaces every line shares', icon: 'filter' },
        { type: 'item', id: 'f-format', title: '.formatted(bank, holder, account)', sub: 'each %s filled in order', icon: 'zap', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'lines', title: 'The header, line by line', tone: 'store', columns: ['in the source', 'printed'], rows: [
        ['%s', 'Syndica Bank'],
        ['Statement for %s,', 'Statement for Ana,'],
        ['  account %s', '  account SB-0001'],
        ['---…"""', 'the rule, no newline'],
      ],
    },
  ],
  edges: [
    { from: 'f-block', to: 'f-strip' },
    { from: 'f-strip', to: 'f-format' },
  ],
})
