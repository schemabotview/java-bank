import type { TreeEntry } from '@graphlearning/graphl-flow'
import { buildTree, MODEL } from '../build/tree'

// Course 11's explorer: the Maven project, its tests collapsed into the layout, and labs/.
export function concurrentTree(active: string, labs: string[], fresh: string[] = [], transfer = false, closed = false): TreeEntry[] {
  return buildTree({
    active, fresh, pom: true, output: 'target', labs, closed,
    model: [...MODEL, 'BankCalendar.java'],
    ledger: ['Bank.java', 'Page.java', ...(transfer ? ['TransferService.java'] : [])],
  })
}
