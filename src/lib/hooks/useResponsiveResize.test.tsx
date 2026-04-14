import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useResponsiveResize } from './useResponsiveResize'

function stubContainerRect(el: HTMLElement, rect: Partial<DOMRect>) {
  const full: DOMRect = {
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    toJSON() {
      return this
    },
    ...rect,
  } as DOMRect
  el.getBoundingClientRect = () => full
}

describe('useResponsiveResize', () => {
  let originalBodyCursor: string
  let originalUserSelect: string

  beforeEach(() => {
    originalBodyCursor = document.body.style.cursor
    originalUserSelect = document.body.style.userSelect
  })

  afterEach(() => {
    document.body.style.cursor = originalBodyCursor
    document.body.style.userSelect = originalUserSelect
  })

  it('initialises with the default width percentage', () => {
    const { result } = renderHook(() => useResponsiveResize())
    expect(result.current.widthPercent).toBe(100)
  })

  it('honours the initialWidthPercent option', () => {
    const { result } = renderHook(() =>
      useResponsiveResize({ initialWidthPercent: 60 })
    )
    expect(result.current.widthPercent).toBe(60)
  })

  it('setWidthPercent updates the width', () => {
    const { result } = renderHook(() => useResponsiveResize())
    act(() => {
      result.current.setWidthPercent(42)
    })
    expect(result.current.widthPercent).toBe(42)
  })

  it('mouse drag updates widthPercent based on distance from centre', () => {
    const { result } = renderHook(() => useResponsiveResize({ minWidth: 0 }))

    // Pretend the container is 1000px wide, centered at x = 500.
    const container = document.createElement('div')
    stubContainerRect(container, { left: 0, width: 1000 })
    ;(result.current.containerRef as { current: HTMLElement | null }).current =
      container

    act(() => {
      result.current.handleMouseDown()
    })

    // Move 300px right of centre -> |distance| / (width/2) = 300/500 = 60%.
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 800 }))
    })

    expect(result.current.widthPercent).toBeCloseTo(60, 3)

    // Drop the drag; further moves should be ignored.
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup'))
    })
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }))
    })
    expect(result.current.widthPercent).toBeCloseTo(60, 3)
  })

  it('clamps below minWidth percentage and above 100', () => {
    const { result } = renderHook(() =>
      useResponsiveResize({ minWidth: 200 })
    )
    const container = document.createElement('div')
    stubContainerRect(container, { left: 0, width: 1000 })
    ;(result.current.containerRef as { current: HTMLElement | null }).current =
      container

    act(() => {
      result.current.handleMouseDown()
    })

    // Mouse at centre -> raw percent would be 0, clamp to minPercent = 20%.
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }))
    })
    expect(result.current.widthPercent).toBeCloseTo(20, 3)

    // Mouse way off to the right -> raw percent > 100, clamp to 100%.
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 9999 }))
    })
    expect(result.current.widthPercent).toBe(100)

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup'))
    })
  })

  it('cleans up document-level listeners + body styles on mouseup', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { result } = renderHook(() => useResponsiveResize())
    const container = document.createElement('div')
    stubContainerRect(container, { left: 0, width: 1000 })
    ;(result.current.containerRef as { current: HTMLElement | null }).current =
      container

    act(() => {
      result.current.handleMouseDown()
    })
    expect(document.body.style.cursor).toBe('ew-resize')
    expect(document.body.style.userSelect).toBe('none')

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup'))
    })

    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')

    removeSpy.mockRestore()
  })
})
