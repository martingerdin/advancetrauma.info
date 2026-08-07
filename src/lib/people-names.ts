/** Split a comma-separated people field into trimmed names. */
export function splitPeopleNames(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}
