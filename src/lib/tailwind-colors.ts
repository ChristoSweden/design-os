/**
 * Preview swatch values for Tailwind's default palette.
 *
 * Keyed by the Tailwind color family name used in `colors.json`
 * (`primary: "lime"` etc.) and mapped to the three shade stops the
 * Design page previews: 300 (light), 500 (base), 600 (dark).
 *
 * Extracted from DesignPage so that non-UI code (and tests) can look
 * up swatch values without pulling the whole page module.
 */

export interface TailwindColorSwatch {
  /** Roughly Tailwind's 300 stop. */
  light: string
  /** Roughly Tailwind's 500 stop. */
  base: string
  /** Roughly Tailwind's 600 stop. */
  dark: string
}

export type TailwindColorName =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'

export const TAILWIND_COLOR_SWATCHES: Record<
  TailwindColorName,
  TailwindColorSwatch
> = {
  red: { light: '#fca5a5', base: '#ef4444', dark: '#dc2626' },
  orange: { light: '#fdba74', base: '#f97316', dark: '#ea580c' },
  amber: { light: '#fcd34d', base: '#f59e0b', dark: '#d97706' },
  yellow: { light: '#fde047', base: '#eab308', dark: '#ca8a04' },
  lime: { light: '#bef264', base: '#84cc16', dark: '#65a30d' },
  green: { light: '#86efac', base: '#22c55e', dark: '#16a34a' },
  emerald: { light: '#6ee7b7', base: '#10b981', dark: '#059669' },
  teal: { light: '#5eead4', base: '#14b8a6', dark: '#0d9488' },
  cyan: { light: '#67e8f9', base: '#06b6d4', dark: '#0891b2' },
  sky: { light: '#7dd3fc', base: '#0ea5e9', dark: '#0284c7' },
  blue: { light: '#93c5fd', base: '#3b82f6', dark: '#2563eb' },
  indigo: { light: '#a5b4fc', base: '#6366f1', dark: '#4f46e5' },
  violet: { light: '#c4b5fd', base: '#8b5cf6', dark: '#7c3aed' },
  purple: { light: '#d8b4fe', base: '#a855f7', dark: '#9333ea' },
  fuchsia: { light: '#f0abfc', base: '#d946ef', dark: '#c026d3' },
  pink: { light: '#f9a8d4', base: '#ec4899', dark: '#db2777' },
  rose: { light: '#fda4af', base: '#f43f5e', dark: '#e11d48' },
  slate: { light: '#cbd5e1', base: '#64748b', dark: '#475569' },
  gray: { light: '#d1d5db', base: '#6b7280', dark: '#4b5563' },
  zinc: { light: '#d4d4d8', base: '#71717a', dark: '#52525b' },
  neutral: { light: '#d4d4d4', base: '#737373', dark: '#525252' },
  stone: { light: '#d6d3d1', base: '#78716c', dark: '#57534e' },
}

/** Fallback used when a `colors.json` value isn't a known Tailwind family. */
export const FALLBACK_SWATCH = TAILWIND_COLOR_SWATCHES.stone

/**
 * Look up the preview swatch for a Tailwind color family name, falling
 * back to the neutral `stone` swatch for unknown or malformed inputs.
 */
export function getTailwindSwatch(name: string | null | undefined): TailwindColorSwatch {
  if (!name) return FALLBACK_SWATCH
  return (
    TAILWIND_COLOR_SWATCHES[name as TailwindColorName] ?? FALLBACK_SWATCH
  )
}
