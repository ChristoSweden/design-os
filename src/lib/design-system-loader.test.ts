import { describe, it, expect } from 'vitest'
import {
  parseColorTokens,
  parseTypographyTokens,
} from './design-system-loader'

describe('parseColorTokens', () => {
  it('returns null for nullish / non-object input', () => {
    expect(parseColorTokens(null)).toBeNull()
    expect(parseColorTokens(undefined)).toBeNull()
    expect(parseColorTokens('hello')).toBeNull()
    expect(parseColorTokens(42)).toBeNull()
  })

  it('returns null when required fields are missing', () => {
    expect(parseColorTokens({})).toBeNull()
    expect(parseColorTokens({ primary: 'lime' })).toBeNull()
    expect(parseColorTokens({ primary: 'lime', secondary: 'teal' })).toBeNull()
  })

  it('returns null when fields are the wrong type', () => {
    expect(
      parseColorTokens({ primary: 123, secondary: 'teal', neutral: 'stone' })
    ).toBeNull()
  })

  it('returns null when a required field is the empty string', () => {
    expect(
      parseColorTokens({ primary: '', secondary: 'teal', neutral: 'stone' })
    ).toBeNull()
  })

  it('returns a well-formed object for valid input', () => {
    expect(
      parseColorTokens({ primary: 'lime', secondary: 'teal', neutral: 'stone' })
    ).toEqual({ primary: 'lime', secondary: 'teal', neutral: 'stone' })
  })

  it('drops extra fields from the input', () => {
    const result = parseColorTokens({
      primary: 'lime',
      secondary: 'teal',
      neutral: 'stone',
      extra: 'nope',
    })
    expect(result).toEqual({ primary: 'lime', secondary: 'teal', neutral: 'stone' })
    expect(result && 'extra' in result).toBe(false)
  })
})

describe('parseTypographyTokens', () => {
  it('returns null for nullish / non-object input', () => {
    expect(parseTypographyTokens(null)).toBeNull()
    expect(parseTypographyTokens(undefined)).toBeNull()
    expect(parseTypographyTokens(123)).toBeNull()
  })

  it('returns null when heading or body is missing', () => {
    expect(parseTypographyTokens({ heading: 'DM Sans' })).toBeNull()
    expect(parseTypographyTokens({ body: 'DM Sans' })).toBeNull()
  })

  it('returns null when heading or body is empty', () => {
    expect(parseTypographyTokens({ heading: '', body: 'DM Sans' })).toBeNull()
    expect(parseTypographyTokens({ heading: 'DM Sans', body: '' })).toBeNull()
  })

  it('defaults mono to IBM Plex Mono when missing', () => {
    expect(parseTypographyTokens({ heading: 'DM Sans', body: 'DM Sans' })).toEqual({
      heading: 'DM Sans',
      body: 'DM Sans',
      mono: 'IBM Plex Mono',
    })
  })

  it('defaults mono to IBM Plex Mono when empty or wrong type', () => {
    expect(
      parseTypographyTokens({ heading: 'DM Sans', body: 'DM Sans', mono: '' })
    ).toEqual({ heading: 'DM Sans', body: 'DM Sans', mono: 'IBM Plex Mono' })
    expect(
      parseTypographyTokens({ heading: 'DM Sans', body: 'DM Sans', mono: 42 })
    ).toEqual({ heading: 'DM Sans', body: 'DM Sans', mono: 'IBM Plex Mono' })
  })

  it('honours a valid mono override', () => {
    expect(
      parseTypographyTokens({
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono',
      })
    ).toEqual({ heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' })
  })
})
