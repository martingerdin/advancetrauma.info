import { participatingSites, type ParticipatingSite } from '../data/sites'
import { personNameKey } from './people-names'

/** Participating sites where this person is listed as PI or coordinator. */
export function sitesForMember(name: string): ParticipatingSite[] {
  const key = personNameKey(name)
  if (!key) return []

  return participatingSites.filter((site) => {
    const people = [...site.investigatorNames, ...site.coordinatorNames]
    return people.some((person) => personNameKey(person) === key)
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
export function linkedPeopleHtml(names: string[], className: string): string {
  if (names.length === 0) return ''

  return names
    .map((name) => {
      const safe = escapeHtmlAttr(name)
      return `<button type="button" class="${className}" data-member="${safe}">${safe}</button>`
    })
    .join('<span class="sites-map-popup__sep">, </span>')
}
