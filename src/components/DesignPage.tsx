import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import { getTailwindSwatch } from '@/lib/tailwind-colors'
import { getDesignPageStepStatuses } from '@/lib/step-statuses'
import { ChevronRight, Layout } from 'lucide-react'

export function DesignPage() {
  const productData = useMemo(() => loadProductData(), [])
  const designSystem = productData.designSystem
  const shell = productData.shell

  const hasDesignSystem = !!(designSystem?.colors || designSystem?.typography)
  const hasShell = !!shell?.spec
  const allStepsComplete = hasDesignSystem && hasShell

  const stepStatuses = getDesignPageStepStatuses(hasDesignSystem, hasShell)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Design System
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Define the visual foundation and application shell for your product.
          </p>
        </div>

        {/* Step 1: Design Tokens */}
        <StepIndicator step={1} status={stepStatuses[0]}>
          {!designSystem?.colors && !designSystem?.typography ? (
            <EmptyState type="design-system" />
          ) : (
            <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Design Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Colors */}
                {designSystem?.colors && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
                      Colors
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                      <ColorSwatch
                        label="Primary"
                        colorName={designSystem.colors.primary}
                      />
                      <ColorSwatch
                        label="Secondary"
                        colorName={designSystem.colors.secondary}
                      />
                      <ColorSwatch
                        label="Neutral"
                        colorName={designSystem.colors.neutral}
                      />
                    </div>
                  </div>
                )}

                {/* Typography */}
                {designSystem?.typography && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
                      Typography
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Heading</p>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          {designSystem.typography.heading}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Body</p>
                        <p className="text-stone-900 dark:text-stone-100">
                          {designSystem.typography.body}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Mono</p>
                        <p className="font-mono text-stone-900 dark:text-stone-100">
                          {designSystem.typography.mono}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit hint */}
                <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Run <code className="font-mono text-stone-700 dark:text-stone-300">/design-tokens</code> to update
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </StepIndicator>

        {/* Step 2: Application Shell */}
        <StepIndicator step={2} status={stepStatuses[1]} isLast={!allStepsComplete}>
          {!shell?.spec ? (
            <EmptyState type="shell" />
          ) : (
            <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Application Shell
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overview */}
                {shell.spec.overview && (
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {shell.spec.overview}
                  </p>
                )}

                {/* Navigation items */}
                {shell.spec.navigationItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
                      Navigation
                    </h4>
                    <ul className="space-y-1">
                      {shell.spec.navigationItems.map((item, index) => {
                        // Parse markdown-style bold: **text** → <strong>text</strong>
                        const parts = item.split(/\*\*([^*]+)\*\*/)
                        return (
                          <li key={index} className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                            {parts.map((part, i) =>
                              i % 2 === 1 ? (
                                <strong key={i} className="font-semibold">{part}</strong>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {/* View Shell Design Link */}
                {shell.hasComponents && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <Link
                      to="/shell/design"
                      className="flex items-center justify-between gap-4 py-2 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                          <Layout className="w-4 h-4 text-stone-600 dark:text-stone-300" strokeWidth={1.5} />
                        </div>
                        <span className="font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                          View Shell Design
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500" strokeWidth={1.5} />
                    </Link>
                  </div>
                )}

                {/* Edit hint */}
                <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Run <code className="font-mono text-stone-700 dark:text-stone-300">/design-shell</code> to update
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </StepIndicator>

        {/* Next Phase Button - shown when all steps complete */}
        {allStepsComplete && (
          <StepIndicator step={3} status="current" isLast>
            <NextPhaseButton nextPhase="sections" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}

interface ColorSwatchProps {
  label: string
  colorName: string
}

function ColorSwatch({ label, colorName }: ColorSwatchProps) {
  const colors = getTailwindSwatch(colorName)

  return (
    <div>
      <div className="flex gap-0.5 mb-2">
        <div
          className="flex-1 h-14 rounded-l-md"
          style={{ backgroundColor: colors.light }}
          title={`${colorName}-300`}
        />
        <div
          className="flex-[2] h-14"
          style={{ backgroundColor: colors.base }}
          title={`${colorName}-500`}
        />
        <div
          className="flex-1 h-14 rounded-r-md"
          style={{ backgroundColor: colors.dark }}
          title={`${colorName}-600`}
        />
      </div>
      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{label}</p>
      <p className="text-xs text-stone-500 dark:text-stone-400">{colorName}</p>
    </div>
  )
}
