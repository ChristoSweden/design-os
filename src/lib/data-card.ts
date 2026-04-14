/**
 * Pure helpers used by DataCard. Extracted so the shape-massaging
 * logic can be unit-tested without mounting the component.
 */

export interface DataMeta {
  models: Record<string, string>
  relationships: string[]
}

/**
 * Return the `_meta` field if it is a well-formed DataMeta object,
 * otherwise null. The field carries human-readable model descriptions
 * and relationship sentences authored alongside the sample data.
 */
export function extractMeta(data: Record<string, unknown>): DataMeta | null {
  const meta = data._meta
  if (
    meta &&
    typeof meta === 'object' &&
    meta !== null &&
    'models' in meta &&
    'relationships' in meta
  ) {
    const { models, relationships } = meta as Record<string, unknown>
    if (
      models &&
      typeof models === 'object' &&
      !Array.isArray(models) &&
      Array.isArray(relationships)
    ) {
      return {
        models: models as Record<string, string>,
        relationships: relationships as string[],
      }
    }
  }
  return null
}

/** Shallow clone of `data` with the `_meta` key removed. */
export function getDataWithoutMeta(
  data: Record<string, unknown>
): Record<string, unknown> {
  const rest = { ...data }
  delete rest._meta
  return rest
}

/**
 * Count total records across every top-level array field, ignoring
 * `_meta`. Scalars and object-valued fields don't contribute.
 */
export function countRecords(data: Record<string, unknown>): number {
  let count = 0
  for (const [key, value] of Object.entries(data)) {
    if (key !== '_meta' && Array.isArray(value)) {
      count += value.length
    }
  }
  return count
}
