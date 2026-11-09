import type { SceneModel } from '@graphlearning/graphl-flow'
import { linesFrom } from '../ide'
import { ideFrame2 } from '../frame'
import { view } from '../fold'
import { saveTree } from './tree'
import code from '../../../spine/save/06-time-zones/project/Bank.java?raw'
import session from '../../../spine/save/06-time-zones/session.txt?raw'

// §6 — time zones: one card payment, one Instant, three wall clocks. 23:30 on 31 October in New York
// is 1 November in UTC and in Berlin, where the bank books it. Berlin's 25 October is 25 hours long.
export const saveTimeZones: SceneModel = ideFrame2({
  model: 'One instant, many wall clocks',
  tree: saveTree('Bank.java', [], true),
  editor: { file: 'Bank.java', code, ...view(code, '// Ana pays by card', 'IO.println("booked', 0), highlight: linesFrom(code, 'ZonedDateTime paid', 'LocalDate booked') },
  session,
  side: [
    {
      type: 'table', id: 'clocks', title: 'One instant, three clocks', tone: 'ingest', columns: ['where', 'wall clock', 'day'], rows: [
        { id: 'ny', cells: ['New York -04', '23:30', '31 Oct'], tone: 'consume' },
        ['UTC', '03:30', '1 Nov'],
        { id: 'berlin', cells: ['Berlin +01', '04:30', '1 Nov: booked'], tone: 'store' },
      ],
    },
    {
      type: 'group', id: 'convert', title: 'From a wall clock to a booking day', icon: 'globe', tone: 'ingest', children: [
        { type: 'item', id: 'z-ny', title: 'ZonedDateTime', sub: 'where it happened', icon: 'clock' },
        { type: 'item', id: 'z-inst', title: 'toInstant()', sub: 'the same moment, anywhere', icon: 'globe' },
        { type: 'item', id: 'z-day', title: 'LocalDate.ofInstant(…, BANK_ZONE)', sub: 'its day, in Berlin', icon: 'check', tone: 'store' },
      ],
    },
    { type: 'item', id: 'dst', title: '25 October 2026: Berlin’s clocks went back', sub: `Duration.between its two midnights: ${session.match(/==> (PT\d+H)/)![1]}`, icon: 'clock', tone: 'consume' },
  ],
  edges: [
    { from: 'z-ny', to: 'z-inst' },
    { from: 'z-inst', to: 'z-day' },
  ],
})
