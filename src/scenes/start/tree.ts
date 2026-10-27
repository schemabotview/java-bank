import type { TreeEntry } from '@graphlearning/graphl-flow'

// The explorer through Course 4: one compact source file in the ledger folder.
export const project = (bank: 'new' | 'active'): TreeEntry[] => [
  { name: 'Bank.java', state: bank === 'new' ? 'new' : 'active' },
]
