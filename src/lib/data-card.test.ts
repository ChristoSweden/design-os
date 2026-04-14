import { describe, it, expect } from 'vitest'
import { extractMeta, getDataWithoutMeta, countRecords } from './data-card'

describe('extractMeta', () => {
  it('returns null when _meta is absent', () => {
    expect(extractMeta({ users: [] })).toBeNull()
  })

  it('returns null when _meta is not an object', () => {
    expect(extractMeta({ _meta: 'bad' })).toBeNull()
    expect(extractMeta({ _meta: 42 })).toBeNull()
    expect(extractMeta({ _meta: null })).toBeNull()
  })

  it('returns null when _meta is missing required fields', () => {
    expect(extractMeta({ _meta: {} })).toBeNull()
    expect(extractMeta({ _meta: { models: {} } })).toBeNull()
    expect(extractMeta({ _meta: { relationships: [] } })).toBeNull()
  })

  it('returns null when models is an array (objects only)', () => {
    expect(
      extractMeta({ _meta: { models: [], relationships: [] } })
    ).toBeNull()
  })

  it('returns the meta object when both fields are well-formed', () => {
    const meta = extractMeta({
      _meta: {
        models: { User: 'People', Post: 'Content' },
        relationships: ['User has many Posts'],
      },
      users: [],
    })
    expect(meta).toEqual({
      models: { User: 'People', Post: 'Content' },
      relationships: ['User has many Posts'],
    })
  })

  it('ignores extra fields on the meta object', () => {
    const meta = extractMeta({
      _meta: {
        models: { A: 'a' },
        relationships: [],
        extra: 'nope',
      },
    })
    expect(meta).not.toBeNull()
    expect(meta && 'extra' in meta).toBe(false)
  })
})

describe('getDataWithoutMeta', () => {
  it('returns a shallow clone with _meta removed', () => {
    const input = { _meta: { models: {}, relationships: [] }, users: [1, 2] }
    const result = getDataWithoutMeta(input)
    expect(result).toEqual({ users: [1, 2] })
    // Should not mutate the input
    expect(input._meta).toBeDefined()
  })

  it('leaves inputs without _meta untouched (structurally)', () => {
    const input = { a: 1, b: 2 }
    expect(getDataWithoutMeta(input)).toEqual({ a: 1, b: 2 })
  })
})

describe('countRecords', () => {
  it('returns 0 when no top-level arrays are present', () => {
    expect(countRecords({ a: 1, b: 'hi', c: { nested: [1, 2] } })).toBe(0)
  })

  it('sums the lengths of top-level arrays', () => {
    expect(countRecords({ users: [1, 2, 3], posts: [1, 2] })).toBe(5)
  })

  it('ignores the _meta array (if somehow present)', () => {
    expect(
      countRecords({
        _meta: { models: {}, relationships: ['a', 'b'] },
        users: [1, 2, 3],
      })
    ).toBe(3)
  })

  it('returns 0 for an empty object', () => {
    expect(countRecords({})).toBe(0)
  })
})
