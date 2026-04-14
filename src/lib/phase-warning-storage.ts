/**
 * Storage helpers for the phase-warning dismissal state.
 *
 * Extracted from PhaseWarningBanner so the key-derivation and the
 * localStorage access can be unit-tested without mounting the
 * component.
 *
 * Keyed per product so that switching products doesn't inherit a
 * prior product's "dismissed" state.
 */

const STORAGE_PREFIX = 'design-os-phase-warning-dismissed-'
const DEFAULT_PRODUCT = 'default-product'

/**
 * Build a localStorage key for the dismissal flag of a given product
 * name. The name is lowercased, `" & "` is mapped to `"-and-"` first
 * (to preserve semantics), and all other non-alphanumerics are
 * collapsed to dashes.
 */
export function getPhaseWarningStorageKey(
  productName: string | null | undefined
): string {
  const name = productName && productName.trim() ? productName : DEFAULT_PRODUCT
  const sanitized = name
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
  return `${STORAGE_PREFIX}${sanitized}`
}

/**
 * Read the dismissal flag from localStorage. Returns `true` (as if
 * dismissed) when:
 *  - `window` is undefined (SSR)
 *  - localStorage throws (Safari private mode / storage quota)
 *
 * Erring on the side of "dismissed" avoids a warning flash on first
 * render while a real value is still loading.
 */
export function readPhaseWarningDismissed(storageKey: string): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(storageKey) === 'true'
  } catch {
    return true
  }
}

/**
 * Write the dismissal flag to localStorage. Silently swallows
 * storage errors (same private-mode concern as above) — the UI
 * still transitions based on its in-memory state, and a failed
 * write just means the dismissal won't persist across reloads.
 */
export function writePhaseWarningDismissed(storageKey: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, 'true')
  } catch {
    /* ignore */
  }
}
