import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { loadProductData } from '@/lib/product-loader'
import {
  getPhaseWarningStorageKey,
  readPhaseWarningDismissed,
  writePhaseWarningDismissed,
} from '@/lib/phase-warning-storage'

export function PhaseWarningBanner() {
  const productData = useMemo(() => loadProductData(), [])

  const hasDataModel = !!productData.dataModel
  const hasDesignSystem = !!(productData.designSystem?.colors || productData.designSystem?.typography)
  const hasShell = !!productData.shell?.spec
  const hasDesign = hasDesignSystem || hasShell

  const storageKey = getPhaseWarningStorageKey(productData.overview?.name)

  // Lazy initial state avoids a synchronous setState inside an effect
  // (react-hooks/set-state-in-effect).
  const [isDismissed, setIsDismissed] = useState<boolean>(() =>
    readPhaseWarningDismissed(storageKey)
  )

  const handleDismiss = () => {
    writePhaseWarningDismissed(storageKey)
    setIsDismissed(true)
  }

  // Don't show if both phases are complete or if dismissed
  if ((hasDataModel && hasDesign) || isDismissed) {
    return null
  }

  // Build the warning message
  const missingPhases: { name: string; path: string }[] = []
  if (!hasDataModel) {
    missingPhases.push({ name: 'Data Model', path: '/data-model' })
  }
  if (!hasDesign) {
    missingPhases.push({ name: 'Design', path: '/design' })
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Consider completing{' '}
            {missingPhases.map((phase, index) => (
              <span key={phase.path}>
                {index > 0 && ' and '}
                <Link
                  to={phase.path}
                  className="font-medium underline hover:no-underline"
                >
                  {phase.name}
                </Link>
              </span>
            ))}{' '}
            before designing sections.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
