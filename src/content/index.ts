import { intro } from './intro'
import { start } from './start'
import { hold } from './hold'
import { decide } from './decide'
import { model } from './model'
import { collect } from './collect'
import { stream } from './stream'
import { save } from './save'
import { build } from './build'
import { trust } from './trust'
import type { Course, Section } from './types'

// Course registry, in syllabus order. One course per chapter of COURSE-PLAN.md; a course is
// registered here only once it is authored (scenes, spine, narration), never as scaffolding.
export const COURSES: Record<string, Course> = {
  [intro.id]: intro,
  [start.id]: start,
  [hold.id]: hold,
  [decide.id]: decide,
  [model.id]: model,
  [collect.id]: collect,
  [stream.id]: stream,
  [save.id]: save,
  [build.id]: build,
  [trust.id]: trust,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
