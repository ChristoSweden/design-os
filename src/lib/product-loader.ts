/**
 * Product data loading and markdown parsing utilities
 */

import type { ProductOverview, ProductRoadmap, Problem, Section, ProductData } from '@/types/product'
import { loadDataModel, hasDataModel } from './data-model-loader'
import { loadDesignSystem, hasDesignSystem } from './design-system-loader'
import { loadShellInfo, hasShell } from './shell-loader'

// Load markdown files from /product/ directory at build time
const productFiles = import.meta.glob('/product/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load zip files from root directory at build time
const exportZipFiles = import.meta.glob('/product-plan.zip', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Slugify a string for use as an ID
 * Converts " & " to "-and-" to maintain semantic meaning
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-') // Convert " & " to "-and-" first
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Disambiguate a set of slugs so every ID is unique. The first
 * occurrence keeps its base slug; duplicates get `-2`, `-3`, etc.
 *
 * Exported so that call sites producing parallel ID lists (e.g. the
 * roadmap section parser) can share a single canonical strategy.
 */
export function disambiguateSlugs(slugs: readonly string[]): string[] {
  const seen = new Map<string, number>()
  return slugs.map((slug) => {
    const count = seen.get(slug) ?? 0
    seen.set(slug, count + 1)
    if (count === 0) return slug
    // Find the next suffix not already taken by an earlier unique slug.
    let suffix = count + 1
    let candidate = `${slug}-${suffix}`
    while (seen.has(candidate)) {
      suffix += 1
      candidate = `${slug}-${suffix}`
    }
    seen.set(candidate, 1)
    return candidate
  })
}

/**
 * Parse product-overview.md content into ProductOverview structure
 *
 * Expected format:
 * # [Product Name]
 *
 * ## Description
 * [1-3 sentence product description]
 *
 * ## Problems & Solutions
 *
 * ### Problem 1: [Problem Title]
 * [How the product solves it]
 *
 * ## Key Features
 * - Feature 1
 * - Feature 2
 */
export function parseProductOverview(md: string): ProductOverview | null {
  if (!md || !md.trim()) return null

  try {
    // Extract product name from first # heading
    const nameMatch = md.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() || 'Product Overview'

    // Extract description - content between ## Description and next ##
    const descMatch = md.match(/## Description\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const description = descMatch?.[1]?.trim() || ''

    // Extract problems - ### Problem N: Title pattern
    const problemsSection = md.match(/## Problems & Solutions\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const problems: Problem[] = []

    if (problemsSection?.[1]) {
      const problemMatches = [...problemsSection[1].matchAll(/### Problem \d+:\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of problemMatches) {
        problems.push({
          title: match[1].trim(),
          solution: match[2].trim(),
        })
      }
    }

    // Extract features - bullet list after ## Key Features
    const featuresSection = md.match(/## Key Features\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const features: string[] = []

    if (featuresSection?.[1]) {
      const lines = featuresSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          features.push(trimmed.slice(2).trim())
        }
      }
    }

    // Return null if we couldn't parse anything meaningful
    if (!description && problems.length === 0 && features.length === 0) {
      return null
    }

    return { name, description, problems, features }
  } catch {
    return null
  }
}

/**
 * Parse product-roadmap.md content into ProductRoadmap structure
 *
 * Expected format:
 * # Product Roadmap
 *
 * ## Sections
 *
 * ### 1. [Section Title]
 * [One sentence description]
 *
 * ### 2. [Section Title]
 * [One sentence description]
 */
export function parseProductRoadmap(md: string): ProductRoadmap | null {
  if (!md || !md.trim()) return null

  try {
    interface ParsedRow {
      title: string
      description: string
      order: number
      rawSlug: string
    }
    const rows: ParsedRow[] = []

    // Match sections with pattern ### N. Title
    const sectionMatches = [...md.matchAll(/### (\d+)\.\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |\n#[^#]|$)/g)]

    for (const match of sectionMatches) {
      const order = parseInt(match[1], 10)
      const title = match[2].trim()
      const description = match[3].trim()
      rows.push({ title, description, order, rawSlug: slugify(title) })
    }

    if (rows.length === 0) return null

    // Sort by declared order before disambiguating so slug suffixes are
    // assigned in the same order users see the sections.
    rows.sort((a, b) => a.order - b.order)

    const uniqueIds = disambiguateSlugs(rows.map((r) => r.rawSlug))
    const sections: Section[] = rows.map((row, i) => ({
      id: uniqueIds[i],
      title: row.title,
      description: row.description,
      order: row.order,
    }))

    return { sections }
  } catch {
    return null
  }
}

/**
 * Load all product data from markdown files and other sources
 */
export function loadProductData(): ProductData {
  const overviewContent = productFiles['/product/product-overview.md']
  const roadmapContent = productFiles['/product/product-roadmap.md']

  return {
    overview: overviewContent ? parseProductOverview(overviewContent) : null,
    roadmap: roadmapContent ? parseProductRoadmap(roadmapContent) : null,
    dataModel: loadDataModel(),
    designSystem: loadDesignSystem(),
    shell: loadShellInfo(),
  }
}

/**
 * Check if product overview has been defined
 */
export function hasProductOverview(): boolean {
  return '/product/product-overview.md' in productFiles
}

/**
 * Check if product roadmap has been defined
 */
export function hasProductRoadmap(): boolean {
  return '/product/product-roadmap.md' in productFiles
}

/**
 * Check if export zip file exists
 */
export function hasExportZip(): boolean {
  return '/product-plan.zip' in exportZipFiles
}

/**
 * Get the URL of the export zip file (if it exists)
 */
export function getExportZipUrl(): string | null {
  return exportZipFiles['/product-plan.zip'] || null
}

// Re-export utility functions for checking individual pieces
export { hasDataModel, hasDesignSystem, hasShell }

/**
 * Validate that every section listed in the roadmap has at least one
 * artifact on disk (spec.md, data.json, or a screen design .tsx),
 * and vice-versa. Pure-ish: takes the roadmap and the on-disk section
 * ID list as inputs so it can be unit-tested without touching globs.
 *
 * Produces two lists:
 *  - `missingOnDisk`: section IDs declared in the roadmap with no
 *    matching directory under /product/sections or /src/sections.
 *  - `orphanedOnDisk`: section IDs present on disk but not referenced
 *    by the roadmap — usually a renamed/forgotten section.
 *
 * Neither list is fatal; callers decide whether to surface a warning.
 */
export interface SectionIntegrityReport {
  missingOnDisk: string[]
  orphanedOnDisk: string[]
}

export function checkSectionIntegrity(
  roadmap: ProductRoadmap | null,
  diskSectionIds: readonly string[]
): SectionIntegrityReport {
  const roadmapIds = new Set(
    (roadmap?.sections ?? []).map((s) => s.id)
  )
  const diskIds = new Set(diskSectionIds)

  const missingOnDisk: string[] = []
  for (const id of roadmapIds) {
    if (!diskIds.has(id)) missingOnDisk.push(id)
  }

  const orphanedOnDisk: string[] = []
  for (const id of diskIds) {
    if (!roadmapIds.has(id)) orphanedOnDisk.push(id)
  }

  return { missingOnDisk, orphanedOnDisk }
}
