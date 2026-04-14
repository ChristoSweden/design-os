import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepIndicator } from './StepIndicator'

describe('StepIndicator', () => {
  it('renders children', () => {
    render(
      <StepIndicator step={1} status="upcoming">
        <p>hello child</p>
      </StepIndicator>
    )
    expect(screen.getByText('hello child')).toBeInTheDocument()
  })

  it('shows the step number in the badge when status is upcoming', () => {
    render(
      <StepIndicator step={3} status="upcoming">
        <p>content</p>
      </StepIndicator>
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a connector line by default but not when isLast', () => {
    const { container, rerender } = render(
      <StepIndicator step={1} status="upcoming">
        <p>c</p>
      </StepIndicator>
    )
    // The connector is an aria-hidden div; look for it
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()

    rerender(
      <StepIndicator step={1} status="upcoming" isLast>
        <p>c</p>
      </StepIndicator>
    )
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('hides the step number when the status is "completed" (shows a check)', () => {
    render(
      <StepIndicator step={2} status="completed">
        <p>c</p>
      </StepIndicator>
    )
    expect(screen.queryByText('2')).not.toBeInTheDocument()
  })

  it('hides the step number when the status is "current" (shows arrow)', () => {
    render(
      <StepIndicator step={4} status="current">
        <p>c</p>
      </StepIndicator>
    )
    expect(screen.queryByText('4')).not.toBeInTheDocument()
  })

  it('hides the step number when the status is "skipped" (shows warning icon)', () => {
    render(
      <StepIndicator step={5} status="skipped">
        <p>c</p>
      </StepIndicator>
    )
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })
})
