import { describe, it, expect } from 'vitest'
import {
  phaseFromPathname,
  buildPhaseStatuses,
  PHASE_ORDER,
  type PhaseCompleteness,
} from './phase-nav'

const completeAll: PhaseCompleteness = {
  product: true,
  'data-model': true,
  design: true,
  sections: true,
  export: true,
}

const completeNone: PhaseCompleteness = {
  product: false,
  'data-model': false,
  design: false,
  sections: false,
  export: false,
}

describe('PHASE_ORDER', () => {
  it('declares the canonical 5-phase order', () => {
    expect(PHASE_ORDER).toEqual([
      'product',
      'data-model',
      'design',
      'sections',
      'export',
    ])
  })
})

describe('phaseFromPathname', () => {
  it('maps the root path to "product"', () => {
    expect(phaseFromPathname('/')).toBe('product')
    expect(phaseFromPathname('/product')).toBe('product')
  })

  it('maps /data-model', () => {
    expect(phaseFromPathname('/data-model')).toBe('data-model')
  })

  it('maps /design, /design-system, and /shell/** to "design"', () => {
    expect(phaseFromPathname('/design')).toBe('design')
    expect(phaseFromPathname('/design-system')).toBe('design')
    expect(phaseFromPathname('/shell')).toBe('design')
    expect(phaseFromPathname('/shell/design/fullscreen')).toBe('design')
  })

  it('maps /sections and /sections/** to "sections"', () => {
    expect(phaseFromPathname('/sections')).toBe('sections')
    expect(phaseFromPathname('/sections/invoices')).toBe('sections')
    expect(phaseFromPathname('/sections/invoices/InvoiceList')).toBe('sections')
  })

  it('maps /export', () => {
    expect(phaseFromPathname('/export')).toBe('export')
  })

  it('falls back to "product" for unknown paths', () => {
    expect(phaseFromPathname('/nowhere')).toBe('product')
    expect(phaseFromPathname('')).toBe('product')
  })
})

describe('buildPhaseStatuses', () => {
  it('returns infos in canonical order', () => {
    const infos = buildPhaseStatuses('product', completeNone)
    expect(infos.map((i) => i.id)).toEqual(PHASE_ORDER)
  })

  it('marks the current phase as "current" even when complete', () => {
    const infos = buildPhaseStatuses('product', completeAll)
    const product = infos.find((i) => i.id === 'product')
    expect(product?.status).toBe('current')
    expect(product?.isComplete).toBe(true)
  })

  it('marks non-current complete phases as "completed"', () => {
    const infos = buildPhaseStatuses('sections', completeAll)
    const product = infos.find((i) => i.id === 'product')
    expect(product?.status).toBe('completed')
  })

  it('marks incomplete, non-current phases as "upcoming"', () => {
    const infos = buildPhaseStatuses('product', completeNone)
    const design = infos.find((i) => i.id === 'design')
    expect(design?.status).toBe('upcoming')
    expect(design?.isComplete).toBe(false)
  })

  it('tracks isComplete independently of status', () => {
    // A mixed completeness set: design done, nothing else
    const completeness: PhaseCompleteness = {
      ...completeNone,
      design: true,
    }
    const infos = buildPhaseStatuses('design', completeness)
    const design = infos.find((i) => i.id === 'design')!
    expect(design.status).toBe('current')
    expect(design.isComplete).toBe(true)
  })
})
