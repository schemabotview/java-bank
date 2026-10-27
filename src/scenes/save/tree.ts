import type { TreeEntry } from '@graphlearning/graphl-flow'
import { files } from '../model/tree'
import { WITH_PAGE } from '../collect/files'

// Course 8's explorer: data/ (the journal the bank writes; the statement it imports, 8.4 on), then
// the .java files — Journal from 8.1, StatementImport from 8.4.
export function saveTree(active: string, fresh: string[] = [], imports = false): TreeEntry[] {
  const java = [...WITH_PAGE, 'Journal.java', ...(imports ? ['StatementImport.java'] : [])]
  const mark = (name: string): TreeEntry => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined })
  return [
    { name: 'data', children: [...(imports ? [{ name: 'import', children: [mark('statement-2026-10.csv')] }] : []), mark('journal.csv')] },
    ...files(java, active, fresh),
  ]
}
