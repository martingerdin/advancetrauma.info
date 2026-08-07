import { participatingSites, type ParticipatingSite } from '../data/sites'
import { splitPeopleNames } from './people-names'

function nameKey(name: string): string {
  return name.trim().toLowerCase()
}

/** Participating sites where this person is listed as PI or coordinator. */
export function sitesForMember(name: string): ParticipatingSite[] {
  const key = nameKey(name)
  if (!key) return []

  return participatingSites.filter((site) => {
    const people = [...site.investigatorNames, ...site.coordinatorNames]
    return people.some((person) => nameKey(person) === key)
  })
}

/** Escape a value for use in an HTML attribute / text node. */
export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Linked person names as popup buttons (comma-separated). */
export function linkedPeopleHtml(value: string | undefined, className: string): string {
  const names = splitPeopleNames(value)
  if (names.length === 0) return ''

  return names
    .map((name) => {
      const safe = escapeHtmlAttr(name)
      return `<button type="button" class="${className}" data-member="${safe}">${safe}</button>`
    })
    .join('<span class="sites-map-popup__sep">, </span>')
}
