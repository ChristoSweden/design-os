import { AlertTriangle } from 'lucide-react'
import type { SectionIntegrityReport } from '@/lib/product-loader'

interface Props {
  report: SectionIntegrityReport
}

/**
 * Warning banner that surfaces drift between the roadmap and the
 * on-disk sections directories. Shown on pages that enumerate
 * sections (Sections list, Export) so users can notice typos,
 * renames, and stray artifacts instead of silently losing them.
 */
export function SectionIntegrityWarning({ report }: Props) {
  const { missingOnDisk, orphanedOnDisk } = report
  if (missingOnDisk.length === 0 && orphanedOnDisk.length === 0) return null

  return (
    <div
      role="status"
      data-testid="section-integrity-warning"
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
          strokeWidth={2}
        />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Section integrity check
          </p>
          {missingOnDisk.length > 0 && (
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-medium">In roadmap but missing on disk:</span>{' '}
              {missingOnDisk.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <code className="font-mono text-[0.8em] bg-amber-100 dark:bg-amber-900/40 px-1 rounded">
                    {id}
                  </code>
                </span>
              ))}
            </p>
          )}
          {orphanedOnDisk.length > 0 && (
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-medium">On disk but not in roadmap:</span>{' '}
              {orphanedOnDisk.map((id, i) => (
                <span key={id}>
                  {i > 0 && ', '}
                  <code className="font-mono text-[0.8em] bg-amber-100 dark:bg-amber-900/40 px-1 rounded">
                    {id}
                  </code>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
