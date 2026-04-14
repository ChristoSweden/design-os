import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { FileText, Boxes, Layout, LayoutList, Package } from 'lucide-react'
import { loadProductData, hasExportZip } from '@/lib/product-loader'
import { getAllSectionIds, getSectionScreenDesigns } from '@/lib/section-loader'
import {
  type Phase,
  type PhaseStatusInfo,
  type PhaseCompleteness,
  phaseFromPathname,
  buildPhaseStatuses,
} from '@/lib/phase-nav'

export type { Phase } from '@/lib/phase-nav'

interface PhaseConfig {
  id: Phase
  label: string
  icon: typeof FileText
  path: string
}

const PHASE_CONFIG: Record<Phase, PhaseConfig> = {
  product: { id: 'product', label: 'Product', icon: FileText, path: '/' },
  'data-model': { id: 'data-model', label: 'Data Model', icon: Boxes, path: '/data-model' },
  design: { id: 'design', label: 'Design', icon: Layout, path: '/design' },
  sections: { id: 'sections', label: 'Sections', icon: LayoutList, path: '/sections' },
  export: { id: 'export', label: 'Export', icon: Package, path: '/export' },
}

interface PhaseNavItem extends PhaseStatusInfo {
  config: PhaseConfig
}

function usePhaseStatuses(): PhaseNavItem[] {
  const location = useLocation()
  const productData = useMemo(() => loadProductData(), [])

  const sectionIds = useMemo(() => getAllSectionIds(), [])
  const sectionsWithScreenDesigns = useMemo(() => {
    return sectionIds.filter(id => getSectionScreenDesigns(id).length > 0).length
  }, [sectionIds])

  const completeness: PhaseCompleteness = {
    product: !!productData.overview && !!productData.roadmap,
    'data-model': !!productData.dataModel,
    design: !!productData.designSystem || !!productData.shell,
    sections: sectionsWithScreenDesigns > 0,
    export: hasExportZip(),
  }

  const currentPhase = phaseFromPathname(location.pathname)
  return buildPhaseStatuses(currentPhase, completeness).map((info) => ({
    ...info,
    config: PHASE_CONFIG[info.id],
  }))
}

export function PhaseNav() {
  const navigate = useNavigate()
  const phaseInfos = usePhaseStatuses()

  return (
    <nav className="flex items-center justify-center">
      {phaseInfos.map(({ config, status, isComplete }, index) => {
        const Icon = config.icon
        const isFirst = index === 0

        return (
          <div key={config.id} className="flex items-center">
            {/* Connector line */}
            {!isFirst && (
              <div
                className={`w-4 sm:w-8 lg:w-12 h-px transition-colors duration-200 ${
                  status === 'upcoming'
                    ? 'bg-stone-200 dark:bg-stone-700'
                    : 'bg-stone-400 dark:bg-stone-500'
                }`}
              />
            )}

            {/* Phase button */}
            <button
              onClick={() => navigate(config.path)}
              className={`
                group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                ${status === 'current'
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm'
                  : status === 'completed'
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  status === 'current' ? '' : status === 'completed' ? '' : 'opacity-60'
                }`}
                strokeWidth={1.5}
              />
              <span className={`text-sm font-medium hidden sm:inline ${
                status === 'upcoming' ? 'opacity-60' : ''
              }`}>
                {config.label}
              </span>

              {/* Completion indicator - check circle at top-left (shows even when current) */}
              {isComplete && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center shadow-sm">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
