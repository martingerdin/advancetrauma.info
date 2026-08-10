/** Split a comma-separated people field into trimmed names. */
export function splitPeopleNames(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

/** Normalize a person name for lookups and deduplication. */
export function personNameKey(name: string): string {
  return name.trim().toLowerCase()
}
