import { describe, it, expect } from 'vitest'
import { parseSpec } from './section-loader'

describe('parseSpec', () => {
  it('returns null for empty / whitespace-only input', () => {
    expect(parseSpec('')).toBeNull()
    expect(parseSpec('   \n  \n')).toBeNull()
  })

  it('falls back to a default title when no # heading is present', () => {
    const result = parseSpec('## Overview\nA thing.\n')
    expect(result?.title).toBe('Section Specification')
    expect(result?.overview).toBe('A thing.')
  })

  it('extracts title, overview, user flows, and UI requirements', () => {
    const md = `# Invoices

## Overview
Manage customer invoices end-to-end.

## User Flows
- Create a new invoice
- Send invoice to customer
- Mark as paid

## UI Requirements
- Searchable invoice list
- PDF preview modal
`
    const result = parseSpec(md)
    expect(result).not.toBeNull()
    expect(result?.title).toBe('Invoices')
    expect(result?.overview).toBe('Manage customer invoices end-to-end.')
    expect(result?.userFlows).toEqual([
      'Create a new invoice',
      'Send invoice to customer',
      'Mark as paid',
    ])
    expect(result?.uiRequirements).toEqual([
      'Searchable invoice list',
      'PDF preview modal',
    ])
    // useShell defaults to true when no shell: false is present
    expect(result?.useShell).toBe(true)
  })

  it('defaults useShell to true when no configuration block exists', () => {
    expect(parseSpec('# Foo\n## Overview\nbar\n')?.useShell).toBe(true)
  })

  it('honours "shell: false" as a bullet', () => {
    const md = `# Foo

## Overview
Bar.

## Configuration
- shell: false
`
    expect(parseSpec(md)?.useShell).toBe(false)
  })

  it('honours "shell: false" without a leading dash', () => {
    const md = `# Foo

## Overview
Bar.

shell: false
`
    expect(parseSpec(md)?.useShell).toBe(false)
  })

  it('is case-insensitive on "shell:" and tolerates extra whitespace', () => {
    const md = `# Foo

## Overview
Bar.

- SHELL :  FALSE
`
    expect(parseSpec(md)?.useShell).toBe(false)
  })

  it('does not confuse "shell: true" for a disable directive', () => {
    const md = `# Foo

## Overview
Bar.

- shell: true
`
    expect(parseSpec(md)?.useShell).toBe(true)
  })

  it('ignores non-bullet lines inside the User Flows block', () => {
    const md = `# Foo

## User Flows
Heading-ish line without a dash
- Real flow one
   - Real flow two
Another prose line
`
    const flows = parseSpec(md)?.userFlows ?? []
    expect(flows).toContain('Real flow one')
    expect(flows).toContain('Real flow two')
    expect(flows).not.toContain('Heading-ish line without a dash')
    expect(flows).not.toContain('Another prose line')
  })

  it('returns an empty array when User Flows section is absent', () => {
    const result = parseSpec('# Foo\n## Overview\nbar\n')
    expect(result?.userFlows).toEqual([])
    expect(result?.uiRequirements).toEqual([])
  })
})
