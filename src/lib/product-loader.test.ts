import { describe, it, expect } from 'vitest'
import { parseProductOverview, parseProductRoadmap } from './product-loader'

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
})
