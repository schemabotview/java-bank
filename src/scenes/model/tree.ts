import type { TreeEntry } from '@graphlearning/graphl-flow'

// The explorer through Course 8: the ledger folder's .java files, as an explorer sorts them.
// `active` is the file in the editor; `fresh` marks files the step adds.
export const files = (names: string[], active: string, fresh: string[] = []): TreeEntry[] =>
  [...names].sort().map((name) => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined }))

