import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { saveTree } from './tree'
import code from '../../../spine/save/05-java-time/project/Bank.java?raw'
import session from '../../../spine/save/05-java-time/session.txt?raw'

// §5 — java.time: interest booked on YearMonth.atEndOfMonth(); a calendar day (LocalDate) is not a
// point in time (Instant). jshell's answers are the session's.
export const saveJavaTime: SceneModel = ideFrame2({
  model: 'Let java.time do the calendar',
  tree: saveTree('Bank.java', [], true),
  editor: { file: 'Bank.java', code, ...view(code, '// Interest is paid', undefined, 0), highlight: linesFrom(code, 'void payInterest', 'LocalDate day') },
  session,
  side: [
    {
      type: 'table', id: 'types', title: 'Four kinds of time', tone: 'ingest', columns: ['type', 'is', 'example'], rows: [
        { id: 'ld', cells: ['LocalDate', 'a day', '2026-10-31'], tone: 'store' },
        { id: 'ym', cells: ['YearMonth', 'a month', '2026-10'], tone: 'store' },
        ['Instant', 'a moment', '…T23:30:00Z'],
        ['ZonedDateTime', 'a wall clock', 'next']
      ],
    },
    {
      type: 'group', id: 'clamp', title: 'The calendar does the work', icon: 'clock', tone: 'ingest', children: [
        { type: 'item', id: 'c-jan', title: '31 January', sub: 'LocalDate', icon: 'clock' },
        { type: 'item', id: 'c-feb', title: '2026-02-28: clamped', sub: 'never a 31 February', icon: 'check', tone: 'store' },
      ],
    },
  ],
  edges: [{ from: 'c-jan', to: 'c-feb', label: '.plusMonths(1)' }],
})
