import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { files } from './tree'
import code from '../../../spine/model/03-constructors/project/Account.java?raw'
import session from '../../../spine/model/03-constructors/session.txt?raw'

// §3 — constructors: the checks run BEFORE the fields are set, so an invalid Account never exists;
// the short constructor hands over to the long one with this(…).
export const modelConstructors: SceneModel = ideFrame({
  tree: files(['Account.java', 'Bank.java'], 'Account.java'),
  editor: { file: 'Account.java', code, ...view(code, 'Account(String holder, BigDecimal opening)', 'this(holder, BigDecimal.ZERO)', 0), highlight: linesFrom(code, 'if (holder == null', 'opening balance below') },
  session,
  side: [
    {
      type: 'group', id: 'flow', title: 'new Account("Chen", -50.00)', icon: 'workflow', tone: 'consume', children: [
        { type: 'item', id: 'f-check', title: 'opening.signum() < 0', sub: 'checked before any field is set', icon: 'filter' },
        { type: 'item', id: 'f-throw', title: 'throw IllegalArgumentException', sub: 'the constructor never finishes', icon: 'bell', tone: 'consume' },
        { type: 'item', id: 'f-none', title: 'no Account exists', sub: 'nothing invalid to find later', icon: 'shield', tone: 'store' },
      ],
    },
    {
      type: 'table', id: 'two', title: 'Two constructors', tone: 'ingest', columns: ['called as', 'does'], rows: [
        ['new Account("Ana", 120.50)', 'checks, then sets the fields'],
        { id: 'short', cells: ['new Account("Ben")', 'this("Ben", BigDecimal.ZERO)'], tone: 'store' },
      ],
    },
    { type: 'note', id: 'this', tone: 'ingest', text: 'this.holder is the field; holder alone is the parameter. this(…) calls the other constructor, so the checks live in one place.' },
  ],
  edges: [
    { from: 'f-check', to: 'f-throw' },
    { from: 'f-throw', to: 'f-none' },
  ],
})
