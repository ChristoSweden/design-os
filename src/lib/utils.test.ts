import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('filters out falsy values', () => {
    const skip: false | string = false
    expect(cn('a', skip && 'b', null, undefined, 'c')).toBe('a c')
  })

  it('resolves conflicting tailwind classes to the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('preserves non-conflicting tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('handles arrays and objects from clsx', () => {
    expect(cn(['a', { b: true, c: false }], 'd')).toBe('a b d')
  })
})
