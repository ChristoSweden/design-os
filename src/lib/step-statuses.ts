/**
 * Pure helpers that compute the per-step status lists used by the
 * wizard-style pages (Design, Section). Extracted from the page
 * components so they can be unit-tested without React.
 */

import type { StepStatus } from '@/components/StepIndicator'

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
