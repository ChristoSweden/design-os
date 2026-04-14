import { Suspense, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Maximize2, GripVertical, Layout, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getLazyScreenDesign, getLazyAppShell } from '@/lib/lazy-cache'
import { loadProductData } from '@/lib/product-loader'
import { useResponsiveResize } from '@/lib/hooks/useResponsiveResize'
import { LazyLoadErrorBoundary } from '@/components/LazyLoadErrorBoundary'

const MIN_WIDTH = 320

export function ScreenDesignPage() {
  const { sectionId, screenDesignName } = useParams<{ sectionId: string; screenDesignName: string }>()
  const navigate = useNavigate()
  const { containerRef, widthPercent, setWidthPercent, handleMouseDown } =
    useResponsiveResize({ minWidth: MIN_WIDTH })

  // Load product data to get section title
  const productData = useMemo(() => loadProductData(), [])
  const section = productData.roadmap?.sections.find((s) => s.id === sectionId)

  const previewWidth = `${widthPercent}%`

  return (
    <div className="h-screen bg-stone-100 dark:bg-stone-900 animate-fade-in flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 z-50">
        <div className="px-4 py-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/sections/${sectionId}`)}
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Back
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
          <div className="flex items-center gap-2 min-w-0">
            <Layout className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.5} />
            {section && (
              <span className="text-sm text-stone-500 dark:text-stone-400 truncate">
                {section.title}
              </span>
            )}
            <span className="text-stone-300 dark:text-stone-600">/</span>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
              {screenDesignName}
            </span>
          </div>

          {/* Width indicator and device presets */}
          <div className="ml-auto flex items-center gap-4">
            {/* Device size presets */}
            <div className="flex items-center gap-1 border-r border-stone-200 dark:border-stone-700 pr-4">
              <button
                onClick={() => setWidthPercent(30)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent <= 40
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Mobile (30%)"
              >
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(60)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 40 && widthPercent <= 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Tablet (60%)"
              >
                <Tablet className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(100)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Desktop (100%)"
              >
                <Monitor className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono w-10 text-right">
              {Math.round(widthPercent)}%
            </span>
            <ThemeToggle />
            <a
              href={`/sections/${sectionId}/screen-designs/${screenDesignName}/fullscreen`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Fullscreen
            </a>
          </div>
        </div>
      </header>

      {/* Preview area with resizable container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-stretch justify-center p-6"
      >
        {/* Left resize handle */}
        <div
          className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </div>
        </div>

        {/* Preview container using iframe for true isolation */}
        <div
          className="bg-white dark:bg-stone-950 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
          style={{ width: previewWidth, minWidth: MIN_WIDTH, maxWidth: '100%' }}
        >
          <iframe
            src={`/sections/${sectionId}/screen-designs/${screenDesignName}/fullscreen`}
            className="w-full h-full border-0"
            title="Screen Design Preview"
          />
        </div>

        {/* Right resize handle */}
        <div
          className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Fullscreen version of a screen design (for screenshots)
 * Syncs theme with parent window via localStorage
 * Wraps screen design in AppShell if shell components exist
 */
export function ScreenDesignFullscreen() {
  const { sectionId, screenDesignName } = useParams<{ sectionId: string; screenDesignName: string }>()

  // Resolve cached lazy components (see src/lib/lazy-cache.tsx). These
  // helpers are idempotent: calling them from render returns the same
  // LazyExoticComponent instance for a given key.
  const ScreenDesignComponent =
    sectionId && screenDesignName
      ? getLazyScreenDesign(sectionId, screenDesignName)
      : null

  const AppShellComponent = getLazyAppShell(sectionId)

  // Sync theme with parent window
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'system'
      const root = document.documentElement

      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      } else {
        root.classList.toggle('dark', theme === 'dark')
      }
    }

    // Apply on mount
    applyTheme()

    // Listen for storage changes (from parent window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        applyTheme()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Also poll for changes since storage event doesn't fire in same window
    const interval = setInterval(applyTheme, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (!ScreenDesignComponent) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-stone-600 dark:text-stone-400">Screen design not found.</p>
      </div>
    )
  }

  // NOTE on the eslint-disables below:
  // `ScreenDesignComponent` and `AppShellComponent` are LazyExoticComponents
  // returned from a module-level cache in `@/lib/lazy-cache`. They are
  // idempotent per key, so they do NOT get recreated on re-render — the
  // concern behind `react-hooks/static-components` does not apply. The
  // rule's static analysis can't see through the cache, hence the local
  // suppressions.

  const screenDesignLabel = `screen design "${screenDesignName ?? ''}"`

  // If shell exists, wrap screen design in AppShell
  if (AppShellComponent) {
    return (
      <LazyLoadErrorBoundary label={screenDesignLabel}>
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center bg-background">
              <div className="text-stone-500 dark:text-stone-400">Loading...</div>
            </div>
          }
        >
          {/* eslint-disable-next-line react-hooks/static-components */}
          <AppShellComponent>
            {/* eslint-disable-next-line react-hooks/static-components */}
            <ScreenDesignComponent />
          </AppShellComponent>
        </Suspense>
      </LazyLoadErrorBoundary>
    )
  }

  // No shell, render screen design directly
  return (
    <LazyLoadErrorBoundary label={screenDesignLabel}>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center bg-background">
            <div className="text-stone-500 dark:text-stone-400">Loading...</div>
          </div>
        }
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <ScreenDesignComponent />
      </Suspense>
    </LazyLoadErrorBoundary>
  )
}
