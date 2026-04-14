import { describe, it, expect } from 'vitest'
import {
  FALLBACK_SWATCH,
  TAILWIND_COLOR_SWATCHES,
  getTailwindSwatch,
} from './tailwind-colors'

describe('tailwind-colors', () => {
  it('includes all 22 Tailwind color families', () => {
    expect(Object.keys(TAILWIND_COLOR_SWATCHES)).toHaveLength(22)
  })

  it('every swatch has well-formed hex colors', () => {
    for (const [name, swatch] of Object.entries(TAILWIND_COLOR_SWATCHES)) {
      for (const stop of ['light', 'base', 'dark'] as const) {
        expect(
          swatch[stop],
          `${name}.${stop}`
        ).toMatch(/^#[0-9a-f]{6}$/i)
      }
    }
  })

  it('light / base / dark are monotonic for a handful of well-known colors', () => {
    // Tailwind's 300 < 500 < 600 by luminance; a cheap proxy is that the
    // hex string value at the 300 stop sorts lexicographically after the
    // 600 stop for these hand-picked known-good entries.
    const lime = TAILWIND_COLOR_SWATCHES.lime
    expect(lime.light > lime.dark).toBe(true)
    const blue = TAILWIND_COLOR_SWATCHES.blue
    expect(blue.light > blue.dark).toBe(true)
  })

  it('FALLBACK_SWATCH equals the stone family', () => {
    expect(FALLBACK_SWATCH).toEqual(TAILWIND_COLOR_SWATCHES.stone)
  })

  describe('getTailwindSwatch', () => {
    it('returns the known swatch for a valid name', () => {
      expect(getTailwindSwatch('lime')).toEqual(TAILWIND_COLOR_SWATCHES.lime)
      expect(getTailwindSwatch('blue')).toEqual(TAILWIND_COLOR_SWATCHES.blue)
    })

    it('falls back to stone for unknown names', () => {
      expect(getTailwindSwatch('cerulean')).toEqual(FALLBACK_SWATCH)
    })

    it('falls back to stone for null / undefined / empty string', () => {
      expect(getTailwindSwatch(null)).toEqual(FALLBACK_SWATCH)
      expect(getTailwindSwatch(undefined)).toEqual(FALLBACK_SWATCH)
      expect(getTailwindSwatch('')).toEqual(FALLBACK_SWATCH)
    })

    it('is case sensitive (Tailwind family names are lowercase)', () => {
      // Documenting current behaviour -- if we ever want case-insensitive
      // lookup, this test will flag the change.
      expect(getTailwindSwatch('LIME')).toEqual(FALLBACK_SWATCH)
    })
  })
})
