import { participatingSites, type ParticipatingSite } from '../data/sites'
import { escapeHtml } from './escape-html'
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

/** Linked person names as popup buttons (comma-separated). */
export function linkedPeopleHtml(names: string[], className: string): string {
  if (names.length === 0) return ''

  return names
    .map((name) => {
      const safe = escapeHtml(name)
      return `<button type="button" class="${className}" data-member="${safe}">${safe}</button>`
    })
    .join('<span class="sites-map-popup__sep">, </span>')
}
