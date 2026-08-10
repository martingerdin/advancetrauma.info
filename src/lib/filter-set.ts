/** Toggle membership of a value in a Set and return a new Set (for reactive state). */
export function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

/** Count selected filter chips plus an optional non-empty search query. */
export function countActiveFilters(
  selectedSizes: number[],
  searchQuery: string,
): number {
  let count = selectedSizes.reduce((sum, size) => sum + size, 0)
  if (searchQuery) count += 1
  return count
}

/** Reset a search input and all checkboxes inside a filter root element. */
export function resetFilterControls(root: ParentNode | null | undefined) {
  const searchInput = root?.querySelector<HTMLInputElement>('.filters__search')
  if (searchInput) searchInput.value = ''
  root?.querySelectorAll<HTMLInputElement>('.filters__checkbox').forEach((checkbox) => {
    checkbox.checked = false
  })
}
