/**
 * Design system loading utilities for colors and typography
 */

import type { DesignSystem, ColorTokens, TypographyTokens } from '@/types/product'

// Load JSON files from product/design-system at build time
const designSystemFiles = import.meta.glob('/product/design-system/*.json', {
  eager: true,
}) as Record<string, { default: Record<string, string> }>

/**
 * Pure validator: accepts an arbitrary object and returns a well-formed
 * ColorTokens value if `primary`, `secondary`, and `neutral` are all
 * non-empty strings, otherwise null. Exported for unit tests and any
 * non-file caller.
 *
 * Expected format:
 *   { "primary": "lime", "secondary": "teal", "neutral": "stone" }
 */
export function parseColorTokens(raw: unknown): ColorTokens | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const { primary, secondary, neutral } = obj
  if (
    typeof primary !== 'string' ||
    typeof secondary !== 'string' ||
    typeof neutral !== 'string' ||
    !primary ||
    !secondary ||
    !neutral
  ) {
    return null
  }
  return { primary, secondary, neutral }
}

/**
 * Load color tokens from colors.json
 */
export function loadColorTokens(): ColorTokens | null {
  const colorsModule = designSystemFiles['/product/design-system/colors.json']
  return parseColorTokens(colorsModule?.default)
}

/**
 * Pure validator for typography tokens. Requires `heading` and `body`;
 * `mono` defaults to "IBM Plex Mono" if missing.
 *
 * Expected format:
 *   { "heading": "DM Sans", "body": "DM Sans", "mono": "IBM Plex Mono" }
 */
export function parseTypographyTokens(raw: unknown): TypographyTokens | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const { heading, body, mono } = obj
  if (
    typeof heading !== 'string' ||
    typeof body !== 'string' ||
    !heading ||
    !body
  ) {
    return null
  }
  return {
    heading,
    body,
    mono: typeof mono === 'string' && mono ? mono : 'IBM Plex Mono',
  }
}

/**
 * Load typography tokens from typography.json
 */
export function loadTypographyTokens(): TypographyTokens | null {
  const typographyModule =
    designSystemFiles['/product/design-system/typography.json']
  return parseTypographyTokens(typographyModule?.default)
}

/**
 * Load the complete design system
 */
export function loadDesignSystem(): DesignSystem | null {
  const colors = loadColorTokens()
  const typography = loadTypographyTokens()

  // Return null if neither colors nor typography are defined
  if (!colors && !typography) {
    return null
  }

  return { colors, typography }
}

/**
 * Check if design system has been defined (at least colors or typography)
 */
export function hasDesignSystem(): boolean {
  return (
    '/product/design-system/colors.json' in designSystemFiles ||
    '/product/design-system/typography.json' in designSystemFiles
  )
}

/**
 * Check if colors have been defined
 */
export function hasColors(): boolean {
  return '/product/design-system/colors.json' in designSystemFiles
}

/**
 * Check if typography has been defined
 */
export function hasTypography(): boolean {
  return '/product/design-system/typography.json' in designSystemFiles
}
