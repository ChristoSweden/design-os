import { describe, it, expect } from 'vitest'
import {
  parseProductOverview,
  parseProductRoadmap,
  slugify,
  disambiguateSlugs,
} from './product-loader'

describe('parseProductOverview', () => {
  it('returns null for empty input', () => {
    expect(parseProductOverview('')).toBeNull()
    expect(parseProductOverview('   \n  ')).toBeNull()
  })

  it('returns null when nothing meaningful is parseable', () => {
    expect(parseProductOverview('# Just a title')).toBeNull()
  })

  it('extracts name, description, problems, and features', () => {
    const md = `# Acme Widgets

## Description
A really cool widget shop for very serious people.

## Problems & Solutions

### Problem 1: Widgets are hard to find
We solve it by showing them.

### Problem 2: Widgets are expensive
We solve it with discounts.

## Key Features
- Fast checkout
- Global shipping
- Live chat
`
    const result = parseProductOverview(md)
    expect(result).not.toBeNull()
    expect(result?.name).toBe('Acme Widgets')
    expect(result?.description).toContain('widget shop')
    expect(result?.problems).toHaveLength(2)
    expect(result?.problems[0]).toEqual({
      title: 'Widgets are hard to find',
      solution: 'We solve it by showing them.',
    })
    expect(result?.features).toEqual(['Fast checkout', 'Global shipping', 'Live chat'])
  })

  it('falls back to a default name when no heading is present', () => {
    const md = `## Description
Something useful here.
`
    const result = parseProductOverview(md)
    expect(result?.name).toBe('Product Overview')
    expect(result?.description).toBe('Something useful here.')
  })
})

describe('parseProductRoadmap', () => {
  it('returns null for empty input', () => {
    expect(parseProductRoadmap('')).toBeNull()
    expect(parseProductRoadmap('# Roadmap with no sections')).toBeNull()
  })

  it('parses numbered sections with titles and descriptions', () => {
    const md = `# Product Roadmap

## Sections

### 1. Onboarding
The first experience a user has.

### 2. Dashboard
The primary workspace.

### 3. Settings & Admin
Administrative tools and preferences.
`
    const result = parseProductRoadmap(md)
    expect(result).not.toBeNull()
    expect(result?.sections).toHaveLength(3)
    expect(result?.sections[0].title).toBe('Onboarding')
    expect(result?.sections[0].order).toBe(1)
    expect(result?.sections[1].id).toBe('dashboard')
  })

  it('slugifies " & " to "-and-" to preserve semantics', () => {
    const md = `### 1. Settings & Admin
Admin tools.
`
    const result = parseProductRoadmap(md)
    expect(result?.sections[0].id).toBe('settings-and-admin')
  })

  it('sorts sections by their declared order', () => {
    const md = `### 3. Third
Three.

### 1. First
One.

### 2. Second
Two.
`
    const result = parseProductRoadmap(md)
    expect(result?.sections.map((s) => s.title)).toEqual(['First', 'Second', 'Third'])
  })

  it('disambiguates duplicate slugs so IDs are unique', () => {
    const md = `### 1. Foo Bar
First.

### 2. foo bar
Second.

### 3. Foo  Bar
Third.
`
    const result = parseProductRoadmap(md)
    const ids = result?.sections.map((s) => s.id) ?? []
    expect(ids).toEqual(['foo-bar', 'foo-bar-2', 'foo-bar-3'])
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('slugify', () => {
  it('lowercases and dasherises', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('converts " & " to "-and-"', () => {
    expect(slugify('Settings & Admin')).toBe('settings-and-admin')
  })

  it('collapses runs of non-alnum characters', () => {
    expect(slugify('Foo  ---  bar!!!  baz')).toBe('foo-bar-baz')
  })

  it('trims leading and trailing dashes', () => {
    expect(slugify('!! Foo !!')).toBe('foo')
  })
})

describe('disambiguateSlugs', () => {
  it('leaves unique slugs alone', () => {
    expect(disambiguateSlugs(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('suffixes duplicates with -2, -3, ...', () => {
    expect(disambiguateSlugs(['x', 'x', 'x'])).toEqual(['x', 'x-2', 'x-3'])
  })

  it('skips suffixes already claimed by earlier unique slugs', () => {
    // A pre-existing "x-2" forces the duplicate to jump to "x-3".
    expect(disambiguateSlugs(['x', 'x-2', 'x'])).toEqual(['x', 'x-2', 'x-3'])
  })

  it('handles interleaved duplicate groups independently', () => {
    expect(disambiguateSlugs(['a', 'b', 'a', 'b', 'a'])).toEqual([
      'a',
      'b',
      'a-2',
      'b-2',
      'a-3',
    ])
  })
})
