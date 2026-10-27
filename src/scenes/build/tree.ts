import type { TreeEntry } from '@graphlearning/graphl-flow'

// Course 9's explorer: the project as Maven lays it out. `active` is the open file's name; `fresh`
// marks what the step adds; the build output (out/ or target/) is drawn muted.
//
// The explorer is a fixed 280px, and four levels deep the longest name
// (InsufficientFundsException.java) does not fit: so src/main/java/ledger is ONE entry, and a
// package folder opens only when the open file is in it. With a module (9.6), src/main/java holds
// module-info.java beside a closed ledger/.
export interface BuildTree { active: string; fresh?: string[]; pom?: boolean; output?: 'out' | 'target'; module?: boolean }

const MODEL = ['Account.java', 'AccountType.java', 'Entry.java', 'InsufficientFundsException.java', 'InterestPolicy.java', 'Money.java', 'Promotion.java', 'Transaction.java']
const STORE = ['Journal.java', 'StatementImport.java']

export function buildTree({ active, fresh = [], pom = false, output, module = false }: BuildTree): TreeEntry[] {
  const mark = (name: string): TreeEntry => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined })
  const pkg = (name: string, files: string[]): TreeEntry =>
    files.includes(active) ? { name, children: files.map(mark) } : { name, folder: true, note: `${files.length} files` }
  const sources: TreeEntry = module
    ? { name: 'src/main/java', children: [{ name: 'ledger', folder: true, note: '3 packages' }, mark('module-info.java')] }
    : { name: 'src/main/java/ledger', children: [pkg('model', MODEL), pkg('store', STORE), mark('Bank.java'), mark('Page.java')] }
  return [
    { name: 'data', children: [{ name: 'import', folder: true }, { name: 'journal.csv' }] },
    sources,
    ...(output ? [{ name: output, folder: true, state: 'muted' as const, note: 'build output' }] : []),
    ...(pom ? [mark('pom.xml')] : []),
  ]
}
