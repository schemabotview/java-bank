import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { buildTree, MODEL } from '../build/tree'
import code from '../../../spine/trust/04-clock/project/src/test/java/ledger/model/BankCalendarTest.java?raw'
import session from '../../../spine/trust/04-clock/session.txt?raw'

// §4 — testing time: BankCalendar reads a Clock; tests stop the clock at chosen instants, one of them
// an hour that is still October in Berlin and another that is already November.
export const trustClock: SceneModel = ideFrame2({
  model: 'Inject a Clock; stop time in a test',
  tree: buildTree({ active: 'BankCalendarTest.java', fresh: ['BankCalendar.java', 'BankCalendarTest.java'], pom: true, output: 'target', tests: ['AccountTest.java', 'BankCalendarTest.java', 'MoneyTest.java'], model: [...MODEL, 'BankCalendar.java'] }),
  editor: { file: 'src/test/java/ledger/model/BankCalendarTest.java', code, ...view(code, 'class BankCalendarTest', 'calendar.today()', 0), highlight: linesFrom(code, 'static BankCalendar at', 'Clock.fixed') },
  session,
  side: [
    {
      type: 'group', id: 'clocks', bare: true, children: [
        { type: 'item', id: 'cal', title: 'BankCalendar', sub: 'today(), isMonthEnd()', icon: 'clock' },
        {
          type: 'group', id: 'which', title: 'reads a Clock', tone: 'ingest', children: [
            { type: 'item', id: 'c-sys', title: 'Clock.system(BERLIN)', sub: 'in the bank: now', icon: 'globe' },
            { type: 'item', id: 'c-fixed', title: 'Clock.fixed(instant, BERLIN)', sub: 'in a test: stopped', icon: 'check', tone: 'store' },
          ],
        },
      ],
    },
    {
      type: 'table', id: 'cases', title: 'The instants the tests choose', tone: 'ingest', columns: ['UTC', 'Berlin', 'end?'], rows: [
        { id: 'oct', cells: ['10-31T22:30Z', '31 Oct 23:30', 'yes'], tone: 'store' },
        { id: 'nov', cells: ['10-31T23:30Z', '1 Nov 00:30', 'no'], tone: 'consume' },
        ['2028-02-28T12Z', '28 Feb 2028', 'no: leap'],
        ['2028-02-29T12Z', '29 Feb 2028', 'yes'],
      ],
    },
  ],
  edges: [{ from: 'cal', to: 'which' }],
})
