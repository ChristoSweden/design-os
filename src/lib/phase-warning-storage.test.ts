import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getPhaseWarningStorageKey,
  readPhaseWarningDismissed,
  writePhaseWarningDismissed,
} from './phase-warning-storage'

describe('getPhaseWarningStorageKey', () => {
  it('prefixes with the design-os phase-warning namespace', () => {
    expect(getPhaseWarningStorageKey('Widgets')).toMatch(
      /^design-os-phase-warning-dismissed-/
    )
  })

  it('lowercases the product name', () => {
    expect(getPhaseWarningStorageKey('ACME')).toBe(
      'design-os-phase-warning-dismissed-acme'
    )
  })

  it('preserves " & " semantics by mapping to "-and-"', () => {
    expect(getPhaseWarningStorageKey('Gears & Widgets')).toBe(
      'design-os-phase-warning-dismissed-gears-and-widgets'
    )
  })

  it('collapses non-alphanumeric runs to single dashes', () => {
    expect(getPhaseWarningStorageKey('Foo!!  Bar  --  Baz')).toBe(
      'design-os-phase-warning-dismissed-foo-bar-baz'
    )
  })

  it('falls back to "default-product" for null / undefined / empty', () => {
    const base = 'design-os-phase-warning-dismissed-default-product'
    expect(getPhaseWarningStorageKey(null)).toBe(base)
    expect(getPhaseWarningStorageKey(undefined)).toBe(base)
    expect(getPhaseWarningStorageKey('')).toBe(base)
    expect(getPhaseWarningStorageKey('   ')).toBe(base)
  })
})

describe('readPhaseWarningDismissed / writePhaseWarningDismissed', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns false when the key is absent', () => {
    expect(readPhaseWarningDismissed('test-key')).toBe(false)
  })

  it('round-trips through write and read', () => {
    writePhaseWarningDismissed('test-key')
    expect(readPhaseWarningDismissed('test-key')).toBe(true)
  })

  it('returns false for an arbitrary non-"true" value', () => {
    window.localStorage.setItem('test-key', 'nope')
    expect(readPhaseWarningDismissed('test-key')).toBe(false)
  })

  it('returns true when localStorage throws on read (quota/private mode)', () => {
    const original = window.localStorage
    const throwingStorage = {
      getItem: () => {
        throw new Error('QuotaExceeded')
      },
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    }
    Object.defineProperty(window, 'localStorage', {
      value: throwingStorage,
      configurable: true,
    })
    try {
      expect(readPhaseWarningDismissed('test-key')).toBe(true)
    } finally {
      Object.defineProperty(window, 'localStorage', {
        value: original,
        configurable: true,
      })
    }
  })

  it('write silently swallows localStorage errors', () => {
    const original = window.localStorage
    const throwingStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceeded')
      },
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    }
    Object.defineProperty(window, 'localStorage', {
      value: throwingStorage,
      configurable: true,
    })
    try {
      expect(() => writePhaseWarningDismissed('test-key')).not.toThrow()
    } finally {
      Object.defineProperty(window, 'localStorage', {
        value: original,
        configurable: true,
      })
    }
  })
})

// Test the SSR branch by temporarily pretending window is undefined.
describe('readPhaseWarningDismissed under SSR', () => {
  let originalWindow: typeof globalThis.window
  beforeEach(() => {
    originalWindow = globalThis.window
    // @ts-expect-error -- deliberately remove window for this test
    delete globalThis.window
  })
  afterEach(() => {
    globalThis.window = originalWindow
  })

  it('returns true when window is undefined', () => {
    expect(readPhaseWarningDismissed('any-key')).toBe(true)
  })
})
