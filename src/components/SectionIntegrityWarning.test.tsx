import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionIntegrityWarning } from './SectionIntegrityWarning'

describe('SectionIntegrityWarning', () => {
  it('renders nothing when both lists are empty', () => {
    const { container } = render(
      <SectionIntegrityWarning
        report={{ missingOnDisk: [], orphanedOnDisk: [] }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows only the missing list when nothing is orphaned', () => {
    render(
      <SectionIntegrityWarning
        report={{ missingOnDisk: ['invoices', 'contacts'], orphanedOnDisk: [] }}
      />
    )
    expect(screen.getByTestId('section-integrity-warning')).toBeInTheDocument()
    expect(screen.getByText(/In roadmap but missing on disk/i)).toBeInTheDocument()
    expect(screen.getByText('invoices')).toBeInTheDocument()
    expect(screen.getByText('contacts')).toBeInTheDocument()
    expect(screen.queryByText(/On disk but not in roadmap/i)).not.toBeInTheDocument()
  })

  it('shows only the orphan list when nothing is missing', () => {
    render(
      <SectionIntegrityWarning
        report={{ missingOnDisk: [], orphanedOnDisk: ['legacy'] }}
      />
    )
    expect(screen.queryByText(/In roadmap but missing on disk/i)).not.toBeInTheDocument()
    expect(screen.getByText(/On disk but not in roadmap/i)).toBeInTheDocument()
    expect(screen.getByText('legacy')).toBeInTheDocument()
  })

  it('shows both lists together', () => {
    render(
      <SectionIntegrityWarning
        report={{ missingOnDisk: ['a'], orphanedOnDisk: ['b'] }}
      />
    )
    expect(screen.getByText(/In roadmap but missing on disk/i)).toBeInTheDocument()
    expect(screen.getByText(/On disk but not in roadmap/i)).toBeInTheDocument()
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })
})
