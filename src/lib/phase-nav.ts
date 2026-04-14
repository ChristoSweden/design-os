/**
 * Pure logic for the top-level phase navigation.
 *
 * Lives outside `PhaseNav.tsx` so it can be unit-tested without
 * mounting React / react-router. The component consumes these
 * helpers inside a `usePhaseStatuses()` hook.
 */

export type Phase = 'product' | 'data-model' | 'design' | 'sections' | 'export'

export type PhaseStatus = 'completed' | 'current' | 'upcoming'

export interface PhaseCompleteness {
  product: boolean
  'data-model': boolean
  design: boolean
  sections: boolean
  export: boolean
}

export interface PhaseStatusInfo {
  id: Phase
  status: PhaseStatus
  isComplete: boolean
}

export const PHASE_ORDER: readonly Phase[] = [
  'product',
  'data-model',
  'design',
  'sections',
  'export',
]

/**
 * Map a URL path (from `useLocation().pathname`) to the phase that
 * should be highlighted as "current". Unknown paths default to
 * `"product"` since the root route belongs to that phase.
 */
export function phaseFromPathname(pathname: string): Phase {
  if (pathname === '/' || pathname === '/product') return 'product'
  if (pathname === '/data-model') return 'data-model'
  if (
    pathname === '/design' ||
    pathname === '/design-system' ||
    pathname.startsWith('/shell')
  ) {
    return 'design'
  }
  if (pathname === '/sections' || pathname.startsWith('/sections/')) {
    return 'sections'
  }
  if (pathname === '/export') return 'export'
  return 'product'
}

/**
 * Produce the ordered list of phase statuses. A phase's `status` is
 * one of:
 *  - `"current"` if it matches `currentPhase`
 *  - `"completed"` if it has artifacts (`completeness[phase] === true`)
 *    and is not the current phase
 *  - `"upcoming"` otherwise
 *
 * `isComplete` is reported independently so the UI can show a check
 * badge on the current phase if it's also finished.
 */
export function buildPhaseStatuses(
  currentPhase: Phase,
  completeness: PhaseCompleteness
): PhaseStatusInfo[] {
  return PHASE_ORDER.map((id) => {
    const isComplete = completeness[id]
    let status: PhaseStatus
    if (id === currentPhase) status = 'current'
    else if (isComplete) status = 'completed'
    else status = 'upcoming'
    return { id, status, isComplete }
  })
}
