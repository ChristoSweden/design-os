/**
 * Module-level caches for dynamically loaded React components.
 *
 * Exists so that `React.lazy(...)` is never called inside render, which
 * would cause the component to reset its state on every re-render
 * (and trip `react-hooks/static-components`).
 *
 * All helpers return the same `LazyExoticComponent` instance for a given
 * key, making them safe to call from render.
 */

import React, { type ComponentType, type ReactNode } from 'react'
import { loadScreenDesignComponent, sectionUsesShell } from './section-loader'
import {
  hasShellComponents,
  loadAppShell,
  loadShellInfo,
  loadShellPreview,
} from './shell-loader'

type AnyProps = Record<string, unknown>
type LazyComp<P = AnyProps> = React.LazyExoticComponent<ComponentType<P>>

const screenDesignCache = new Map<string, LazyComp>()
const shellCache = new Map<string, LazyComp<{ children?: ReactNode }>>()
let shellPreviewLazy: LazyComp | null | undefined

/** Return (and cache) the lazy screen-design component for a section+name. */
export function getLazyScreenDesign(
  sectionId: string,
  screenDesignName: string
): LazyComp | null {
  const key = `${sectionId}::${screenDesignName}`
  const existing = screenDesignCache.get(key)
  if (existing) return existing

  const loader = loadScreenDesignComponent(sectionId, screenDesignName)
  if (!loader) return null

  const Lazy = React.lazy(async () => {
    try {
      const module = (await loader()) as { default?: unknown }
      if (module && typeof module.default === 'function') {
        return module as { default: ComponentType<AnyProps> }
      }
      console.error(
        'Screen design does not have a valid default export:',
        screenDesignName
      )
      const Fallback: ComponentType<AnyProps> = () => (
        <div>Invalid screen design: {screenDesignName}</div>
      )
      return { default: Fallback }
    } catch (e) {
      console.error('Failed to load screen design:', screenDesignName, e)
      const Fallback: ComponentType<AnyProps> = () => (
        <div>Failed to load: {screenDesignName}</div>
      )
      return { default: Fallback }
    }
  }) as LazyComp

  screenDesignCache.set(key, Lazy)
  return Lazy
}

/**
 * Return (and cache) the lazy AppShell wrapper component for a section.
 *
 * Returns null if the section opts out of the shell or if no shell
 * components exist. The returned component accepts `children` and
 * internally provides default navigation/user props.
 */
export function getLazyAppShell(
  sectionId: string | undefined
): LazyComp<{ children?: ReactNode }> | null {
  if (sectionId && !sectionUsesShell(sectionId)) return null
  if (!hasShellComponents()) return null

  const key = sectionId ?? '__default__'
  const existing = shellCache.get(key)
  if (existing) return existing

  const loader = loadAppShell()
  if (!loader) return null

  const Lazy = React.lazy(async () => {
    try {
      const module = (await loader()) as Record<string, unknown>
      const ShellComponent = (module?.default ||
        module?.AppShell) as ComponentType<AnyProps> | undefined

      if (typeof ShellComponent !== 'function') {
        const Passthrough: ComponentType<{ children?: ReactNode }> = ({
          children,
        }) => <>{children}</>
        return { default: Passthrough }
      }

      const ShellWrapper: ComponentType<{ children?: ReactNode }> = ({
        children,
      }) => {
        const shellInfo = loadShellInfo()
        const specNavItems = shellInfo?.spec?.navigationItems || []

        const navigationItems =
          specNavItems.length > 0
            ? specNavItems.map((item, index) => {
                const labelMatch = item.match(/\*\*([^*]+)\*\*/)
                const label = labelMatch
                  ? labelMatch[1]
                  : item.split('→')[0]?.trim() || `Item ${index + 1}`
                return {
                  label,
                  href: `/${label.toLowerCase().replace(/\s+/g, '-')}`,
                  isActive: index === 0,
                }
              })
            : [
                { label: 'Dashboard', href: '/', isActive: true },
                { label: 'Items', href: '/items' },
                { label: 'Settings', href: '/settings' },
              ]

        const defaultUser = { name: 'Demo User' }

        return (
          <ShellComponent
            navigationItems={navigationItems}
            user={defaultUser}
            onNavigate={() => {}}
            onLogout={() => {}}
          >
            {children}
          </ShellComponent>
        )
      }

      return { default: ShellWrapper }
    } catch (e) {
      console.error('[getLazyAppShell] Failed to load AppShell:', e)
      const Passthrough: ComponentType<{ children?: ReactNode }> = ({
        children,
      }) => <>{children}</>
      return { default: Passthrough }
    }
  }) as LazyComp<{ children?: ReactNode }>

  shellCache.set(key, Lazy)
  return Lazy
}

/** Return (and cache) the lazy ShellPreview component. */
export function getLazyShellPreview(): LazyComp | null {
  if (shellPreviewLazy !== undefined) return shellPreviewLazy
  const loader = loadShellPreview()
  if (!loader) {
    shellPreviewLazy = null
    return null
  }
  shellPreviewLazy = React.lazy(loader) as LazyComp
  return shellPreviewLazy
}
