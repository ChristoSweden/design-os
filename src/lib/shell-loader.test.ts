import { describe, it, expect } from 'vitest'
import { parseShellSpec } from './shell-loader'

describe('parseShellSpec', () => {
  it('returns null for empty input', () => {
    expect(parseShellSpec('')).toBeNull()
    expect(parseShellSpec('   \n ')).toBeNull()
  })

  it('returns null when no recognised sections are present', () => {
    expect(parseShellSpec('# Shell\n\nSome prose\n')).toBeNull()
  })

  it('extracts overview, navigation items, and layout pattern', () => {
    const md = `# Application Shell Specification

## Overview
A sidebar-driven layout with a top-right user menu.

## Navigation Structure
- **Dashboard** → Home with key metrics
- **Invoices** → Invoice management
- **Settings** → Account settings

## Layout Pattern
Left sidebar (240px wide), top bar (56px), main content area.
`
    const result = parseShellSpec(md)
    expect(result).not.toBeNull()
    expect(result?.overview).toContain('sidebar-driven')
    expect(result?.navigationItems).toEqual([
      '**Dashboard** → Home with key metrics',
      '**Invoices** → Invoice management',
      '**Settings** → Account settings',
    ])
    expect(result?.layoutPattern).toContain('Left sidebar')
  })

  it('preserves the raw markdown on the result', () => {
    const md = `## Overview\nHello.\n`
    const result = parseShellSpec(md)
    expect(result?.raw).toBe(md)
  })

  it('returns empty arrays / strings when sections are missing', () => {
    const md = `## Overview\nJust an overview.\n`
    const result = parseShellSpec(md)
    expect(result?.overview).toBe('Just an overview.')
    expect(result?.navigationItems).toEqual([])
    expect(result?.layoutPattern).toBe('')
  })

  it('ignores non-bullet lines inside Navigation Structure', () => {
    const md = `## Navigation Structure

Prose that should be ignored.
- **Home** → Dashboard
Another prose line.
- **Reports** → Metrics
`
    const result = parseShellSpec(md)
    expect(result?.navigationItems).toEqual(['**Home** → Dashboard', '**Reports** → Metrics'])
  })

  it('is tolerant of extra blank lines between sections', () => {
    const md = `## Overview


Overview content here.


## Navigation Structure


- **A** → X


## Layout Pattern


Layout here.
`
    const result = parseShellSpec(md)
    expect(result?.overview).toBe('Overview content here.')
    expect(result?.navigationItems).toEqual(['**A** → X'])
    expect(result?.layoutPattern).toBe('Layout here.')
  })
})
