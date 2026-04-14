import { describe, it, expect } from 'vitest'
import { parseDataModel } from './data-model-loader'

describe('parseDataModel', () => {
  it('returns null for empty input', () => {
    expect(parseDataModel('')).toBeNull()
    expect(parseDataModel('   \n ')).toBeNull()
  })

  it('returns null when no entities or relationships are parseable', () => {
    expect(parseDataModel('# Just a title\n')).toBeNull()
  })

  it('parses entities with multi-line descriptions', () => {
    const md = `# Data Model

## Entities

### User
A person who uses the product.
They can create and manage invoices.

### Invoice
A billable document.
`
    const result = parseDataModel(md)
    expect(result).not.toBeNull()
    expect(result?.entities).toHaveLength(2)
    expect(result?.entities[0].name).toBe('User')
    expect(result?.entities[0].description).toContain('person who uses')
    expect(result?.entities[0].description).toContain('manage invoices')
    expect(result?.entities[1].name).toBe('Invoice')
  })

  it('parses relationship bullets', () => {
    const md = `# Data Model

## Relationships

- User has many Invoices
- Invoice belongs to User
- Invoice has many LineItems
`
    const result = parseDataModel(md)
    expect(result?.relationships).toEqual([
      'User has many Invoices',
      'Invoice belongs to User',
      'Invoice has many LineItems',
    ])
  })

  it('parses a full data model with both sections', () => {
    const md = `# Data Model

## Entities

### User
Account holder.

### Invoice
Billable doc.

## Relationships

- User has many Invoices
- Invoice belongs to User
`
    const result = parseDataModel(md)
    expect(result?.entities.map((e) => e.name)).toEqual(['User', 'Invoice'])
    expect(result?.relationships).toHaveLength(2)
  })

  it('ignores non-bullet lines inside Relationships', () => {
    const md = `## Relationships

Prose about relationships follows.
- One to one: User <-> Profile
Not a bullet.
- One to many: User -> Posts
`
    const rels = parseDataModel(md)?.relationships ?? []
    expect(rels).toEqual(['One to one: User <-> Profile', 'One to many: User -> Posts'])
  })

  it('returns an empty entities array when section is absent but relationships exist', () => {
    const md = `## Relationships

- A relates to B
`
    const result = parseDataModel(md)
    expect(result?.entities).toEqual([])
    expect(result?.relationships).toEqual(['A relates to B'])
  })
})
