import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { files } from '../model/tree'
import { WITH_PAGE } from './files'
import code from '../../../spine/collect/07-optional/project/Bank.java?raw'
import session from '../../../spine/collect/07-optional/session.txt?raw'

// §7 — Optional: find() returns a box that holds an Account or is empty, so "not found" is in the
// type. orElseThrow on an empty one throws NoSuchElementException (the session).
export const collectOptional: SceneModel = ideFrame2({
  model: 'Optional: a box, full or empty',
  tree: files(WITH_PAGE, 'Bank.java'),
  editor: { file: 'Bank.java', code, ...view(code, 'void main', 'Optional.ofNullable', 0), highlight: linesFrom(code, 'Optional<Account> find', 'Optional.ofNullable') },
  session,
  side: [
    { type: 'item', id: 'find', title: 'find(number): Optional<Account>', sub: 'never null', icon: 'search', tone: 'ingest' },
    {
      type: 'group', id: 'boxes', bare: true, dir: 'row', children: [
        { type: 'table', id: 'full', title: 'find("SB-0002")', tone: 'store', rows: [['Optional[…]'], ['holds Ben\'s Account']] },
        { type: 'table', id: 'empty', title: 'find("SB-0009")', tone: 'consume', rows: [['Optional.empty'], ['holds nothing']] },
      ],
    },
    {
      type: 'table', id: 'ops', title: 'Opening the box', tone: 'ingest', columns: ['call', 'full', 'empty'], rows: [
        ['isPresent()', 'true', 'false'],
        ['get()', 'Account', 'throws'],
        { id: 'oet', cells: ['orElseThrow()', 'Account', 'NoSuchElement…'], tone: 'consume' },
      ],
    },
  ],
  edges: [
    { from: 'find', to: 'full' },
    { from: 'find', to: 'empty' },
  ],
})
