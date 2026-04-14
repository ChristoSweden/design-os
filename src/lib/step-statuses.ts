/**
 * Pure helpers that compute the per-step status lists used by the
 * wizard-style pages (Design, Section). Extracted from the page
 * components so they can be unit-tested without React.
 */

import type { StepStatus } from '@/components/StepIndicator'

/** Flags describing how far a section has progressed through its step list. */
export interface SectionStepFlags {
  hasSpec: boolean
  hasData: boolean
  hasScreenDesigns: boolean
  hasScreenshots: boolean
}

/**
 * Four-step section flow: 1. Spec, 2. Data, 3. Screen Designs, 4. Screenshots.
 *
 * Rules:
 *  - A done step is "completed".
 *  - The FIRST not-done step is "current".
 *  - All subsequent not-done steps are "upcoming".
 */
export function getSectionStepStatuses(
  flags: SectionStepFlags
): [StepStatus, StepStatus, StepStatus, StepStatus] {
  const steps: readonly boolean[] = [
    flags.hasSpec,
    flags.hasData,
    flags.hasScreenDesigns,
    flags.hasScreenshots,
  ]
  const firstIncomplete = steps.findIndex((done) => !done)
  const result = steps.map((done, index) => {
    if (done) return 'completed' as StepStatus
    if (index === firstIncomplete) return 'current' as StepStatus
    return 'upcoming' as StepStatus
  })
  return [result[0], result[1], result[2], result[3]]
}

/**
 * A section is "complete" once its spec, sample data, and screen
 * designs are all present. Screenshots are optional.
 */
export function areRequiredSectionStepsComplete(
  flags: SectionStepFlags
): boolean {
  return flags.hasSpec && flags.hasData && flags.hasScreenDesigns
}

/**
 * Generic two-step linear flow used by the Design and Product pages.
 *
 * Rules:
 *  - Step 1 is "completed" once `firstDone`, otherwise "current".
 *  - Step 2 is "completed" once `secondDone`, "current" when step 1
 *    is done but step 2 is not, and "upcoming" otherwise.
 */
export function getTwoStepStatuses(
  firstDone: boolean,
  secondDone: boolean
): [StepStatus, StepStatus] {
  const first: StepStatus = firstDone ? 'completed' : 'current'
  let second: StepStatus
  if (secondDone) {
    second = 'completed'
  } else if (firstDone) {
    second = 'current'
  } else {
    second = 'upcoming'
  }
  return [first, second]
}

