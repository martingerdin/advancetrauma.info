/** Read a CSS custom property from `:root` (tokens.css). */
export function cssVar(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!value) {
    throw new Error(`CSS custom property ${name} is not defined`)
  }
  return value
}
