import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  /** Human-readable label for logs and the default fallback message. */
  label?: string
  /** Content to render when nothing has gone wrong. */
  children: ReactNode
  /** Optional custom fallback. Receives the caught error + a retry fn. */
  fallback?: (args: { error: Error; retry: () => void }) => ReactNode
  /** Called when an error is caught. Useful for test assertions / telemetry. */
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  error: Error | null
}

/**
 * Error boundary for dynamically imported (React.lazy) components.
 *
 * Catches both load failures (network, bad export) and render errors from
 * the lazily-loaded module. Re-mounting via `retry()` clears the error
 * state and lets Suspense re-attempt the import.
 */
export class LazyLoadErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { label, onError } = this.props
    console.error(
      `[LazyLoadErrorBoundary${label ? ` · ${label}` : ''}] caught:`,
      error,
      info
    )
    onError?.(error, info)
  }

  retry = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const { fallback, label } = this.props
    if (fallback) return fallback({ error, retry: this.retry })

    return (
      <div
        role="alert"
        className="h-full min-h-[200px] flex items-center justify-center p-6"
      >
        <div className="max-w-md text-center">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">
            Failed to load{label ? ` ${label}` : ''}.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
            {error.message || 'An unknown error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.retry}
            className="text-xs font-medium text-stone-700 dark:text-stone-200 underline underline-offset-2 hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
