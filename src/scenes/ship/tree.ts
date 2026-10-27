import type { TreeEntry } from '@graphlearning/graphl-flow'
import { buildTree, MODEL } from '../build/tree'

// Course 12's explorer: the finished project — bin/serve, labs/, Server and TransferService.
export function shipTree(active: string, fresh: string[] = [], labs: string[] = [], module = false): TreeEntry[] {
  const tree = buildTree({
    active, fresh, pom: true, output: 'target', labs, module,
    model: [...MODEL, 'BankCalendar.java'],
    ledger: ['Bank.java', 'Page.java', 'Server.java', 'TransferService.java'],
  })
  return [{ name: 'bin', children: [{ name: 'serve', state: fresh.includes('serve') ? 'new' : undefined }] }, ...tree]
}
