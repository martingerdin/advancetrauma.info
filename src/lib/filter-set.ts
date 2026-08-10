/** Toggle membership of a value in a reactive array (Gea-friendly mutate-in-place). */
export function toggleInArray<T>(items: T[], value: T) {
  const index = items.indexOf(value)
  if (index >= 0) items.splice(index, 1)
  else items.push(value)
}

/** Count selected filter values plus an optional non-empty search query. */
export function countActiveFilters(
  selectedLengths: number[],
  searchQuery: string,
): number {
  let count = selectedLengths.reduce((sum, length) => sum + length, 0)
  if (searchQuery) count += 1
  return count
}
