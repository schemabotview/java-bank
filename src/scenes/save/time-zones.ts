import type { SceneModel } from '@graphlearning/graphl-flow'
import { ideFrame, linesFrom } from '../ide'
import { view } from '../fold'
import { saveTree } from './tree'
import code from '../../../spine/save/06-time-zones/project/Bank.java?raw'
import session from '../../../spine/save/06-time-zones/session.txt?raw'

// §6 — time zones: one card payment, one Instant, three wall clocks. 23:30 on 31 October in New York
// is 1 November in UTC and in Berlin, where the bank books it. Berlin's 25 October is 25 hours long.
export const saveTimeZones: SceneModel = ideFrame({
  tree: saveTree('Bank.java', [], true),
  editor: { file: 'Bank.java', code, ...view(code, '// Ana pays by card', 'IO.println("booked', 0), highlight: linesFrom(code, 'ZonedDateTime paid', 'LocalDate booked') },
  session,
  side: [
    {
      type: 'table', id: 'clocks', title: 'One instant, three clocks', tone: 'ingest', columns: ['where', 'wall clock', 'day'], rows: [
        { id: 'ny', cells: ['New York, -04:00', '23:30', '31 October'], tone: 'consume' },
        ['UTC', '03:30', '1 November'],
        { id: 'berlin', cells: ['Berlin, +01:00', '04:30', '1 November: booked'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'convert', title: 'From a wall clock to a booking day', icon: 'globe', tone: 'ingest', dir: 'row', children: [
        { type: 'item', id: 'z-ny', title: 'ZonedDateTime', sub: 'where it happened', icon: 'clock' },
        { type: 'item', id: 'z-inst', title: 'toInstant()', sub: 'the same moment, anywhere', icon: 'globe' },
        { type: 'item', id: 'z-day', title: 'LocalDate.ofInstant(at, BANK_ZONE)', sub: 'its day, in Berlin', icon: 'check', tone: 'store' },
      ],
    },
    { type: 'note', id: 'dst', tone: 'consume', text: "On 25 October 2026 Berlin's clocks went back an hour: Duration.between its two midnights is PT25H. A day is not always 24 hours." },
  ],
  edges: [
    { from: 'z-ny', to: 'z-inst' },
    { from: 'z-inst', to: 'z-day' },
  ],
})
