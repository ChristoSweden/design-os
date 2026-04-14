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
 * Two-step flow: 1. Design Tokens, 2. Shell Design.
 *
 * Rules:
 *  - Step 1 is "completed" once the user has a design system
 *    (colors and/or typography), otherwise it is "current".
 *  - Step 2 is "completed" once the user has a shell spec,
 *    "current" once step 1 is done but step 2 is not, and
 *    "upcoming" otherwise.
 */
export function getDesignPageStepStatuses(
  hasDesignSystem: boolean,
  hasShell: boolean
): [StepStatus, StepStatus] {
  const designTokens: StepStatus = hasDesignSystem ? 'completed' : 'current'
  let shellDesign: StepStatus
  if (hasShell) {
    shellDesign = 'completed'
  } else if (hasDesignSystem) {
    shellDesign = 'current'
  } else {
    shellDesign = 'upcoming'
  }
  return [designTokens, shellDesign]
}
