import { useCallback, useRef, useState, type RefObject } from 'react'

export interface UseResponsiveResizeOptions {
  /** Minimum absolute width in pixels. Defaults to 320. */
  minWidth?: number
  /** Initial width percentage. Defaults to 100. */
  initialWidthPercent?: number
}

export interface UseResponsiveResizeResult {
  /** Ref to attach to the container whose width is being measured. */
  containerRef: RefObject<HTMLDivElement | null>
  /** Current width of the preview as a percentage of the container (0-100). */
  widthPercent: number
  /** Imperatively set the width percentage (used by device preset buttons). */
  setWidthPercent: (next: number) => void
  /** `mousedown` handler to attach to the drag handle(s). */
  handleMouseDown: () => void
}

/**
 * Drag-to-resize state + event wiring for the centered preview panels used
 * in ShellDesignPage and ScreenDesignPage.
 *
 * The preview width is expressed as a percentage of the container so that
 * resizing adapts when the viewport itself changes size. The drag handle
 * measures distance from the horizontal center of the container and doubles
 * that distance to produce the total preview width, giving a symmetric
 * handle-on-each-side feel.
 *
 * The hook owns its event listeners: `mousemove` and `mouseup` are attached
 * to `document` on drag start and removed on drag end, so the component
 * using this hook never needs to wire that up itself.
 */
export function useResponsiveResize(
  options: UseResponsiveResizeOptions = {}
): UseResponsiveResizeResult {
  const { minWidth = 320, initialWidthPercent = 100 } = options

  const [widthPercent, setWidthPercent] = useState(initialWidthPercent)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMouseDown = useCallback(() => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      if (containerWidth <= 0) return

      const containerCenter = containerRect.left + containerWidth / 2

      // Distance-from-center, doubled, gives the symmetric preview width.
      const distanceFromCenter = Math.abs(e.clientX - containerCenter)
      const maxDistance = containerWidth / 2
      let newWidthPercent = (distanceFromCenter / maxDistance) * 100

      // Clamp: can't go below the absolute min-width (expressed as a pct of
      // the container) or above 100%.
      const minPercent = (minWidth / containerWidth) * 100
      newWidthPercent = Math.max(minPercent, Math.min(100, newWidthPercent))

      setWidthPercent(newWidthPercent)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [minWidth])

  return { containerRef, widthPercent, setWidthPercent, handleMouseDown }
}
