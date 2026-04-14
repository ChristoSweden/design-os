import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LazyLoadErrorBoundary } from './LazyLoadErrorBoundary'
import { useState } from 'react'

function Boom({ when }: { when: boolean }) {
  if (when) throw new Error('kaboom')
  return <p>happy</p>
}

describe('LazyLoadErrorBoundary', () => {
  // Silence the React-internal error log so the test output stays clean.
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('renders children when nothing throws', () => {
    render(
      <LazyLoadErrorBoundary>
        <p>hello</p>
      </LazyLoadErrorBoundary>
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders the default fallback with the label + error message on throw', () => {
    render(
      <LazyLoadErrorBoundary label="the widget">
        <Boom when />
      </LazyLoadErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Failed to load the widget/i)).toBeInTheDocument()
    expect(screen.getByText('kaboom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('calls onError with the caught error', () => {
    const onError = vi.fn()
    render(
      <LazyLoadErrorBoundary onError={onError}>
        <Boom when />
      </LazyLoadErrorBoundary>
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect((onError.mock.calls[0][0] as Error).message).toBe('kaboom')
  })

  it('renders a custom fallback when provided', () => {
    render(
      <LazyLoadErrorBoundary
        fallback={({ error }) => <p>custom: {error.message}</p>}
      >
        <Boom when />
      </LazyLoadErrorBoundary>
    )
    expect(screen.getByText('custom: kaboom')).toBeInTheDocument()
  })

  it('retry clears the error state, letting children recover', () => {
    function Harness() {
      const [shouldThrow, setShouldThrow] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setShouldThrow(false)}>
            fix
          </button>
          <LazyLoadErrorBoundary>
            <Boom when={shouldThrow} />
          </LazyLoadErrorBoundary>
        </>
      )
    }

    render(<Harness />)
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Fix the underlying state so the next render succeeds.
    fireEvent.click(screen.getByRole('button', { name: 'fix' }))
    // Then hit retry to clear the boundary's error.
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText('happy')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
