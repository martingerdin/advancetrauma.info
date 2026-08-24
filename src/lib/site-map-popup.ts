import {
  batchColorTokens,
  batchStatusLabels,
  batchStatusPillClass,
  getBatchStatus,
  siteBatches,
  type ParticipatingSite,
} from '../data/sites'
import { escapeHtml, safeHttpUrl } from './escape-html'
import { openTeamMemberCard } from './focus-card'
import { linkedPeopleHtml } from './site-team-links'

/** Shared site popup markup for map markers. */
export function buildSitePopupHtml(site: ParticipatingSite): string {
  const batch = siteBatches.find((item) => item.id === site.batch)!
  const status = getBatchStatus(batch)
  const investigators = linkedPeopleHtml(site.investigatorNames, 'sites-map-popup__person')
  const coordinators =
    site.coordinatorNames.length > 0
      ? `<p class="sites-map-popup__row">
        <span class="sites-map-popup__label">Clinical research coordinator</span>
        ${linkedPeopleHtml(site.coordinatorNames, 'sites-map-popup__person')}
      </p>`
      : ''
  const websiteHref = safeHttpUrl(site.website)
  const websiteLink = websiteHref
    ? `<a class="sites-map-popup__link" href="${escapeHtml(websiteHref)}" target="_blank" rel="noopener noreferrer">
        Visit website
      </a>`
    : ''

  return `
    <div class="sites-map-popup__body">
      <h3 class="sites-map-popup__title">${escapeHtml(site.name)}</h3>
      <div class="sites-map-popup__pills">
        <span class="sites-map-popup__pill sites-map-popup__pill--batch" style="background: var(${batchColorTokens[site.batch]});">Batch ${escapeHtml(site.batch)}</span>
        <span class="${batchStatusPillClass[status]}">${escapeHtml(batchStatusLabels[status])}</span>
      </div>
      <p class="sites-map-popup__row">
        <span class="sites-map-popup__label">Investigator</span>
        ${investigators}
      </p>
      ${coordinators}
      <p class="sites-map-popup__row">
        <span class="sites-map-popup__label">Location</span>
        ${escapeHtml(site.city)}
      </p>
      ${websiteLink}
    </div>
  `
}

function onPopupMemberClick(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return
  const button = target.closest<HTMLElement>('[data-member]')
  if (!button || !button.classList.contains('sites-map-popup__person')) return
  event.preventDefault()
  const name = button.getAttribute('data-member')
  if (name) openTeamMemberCard(name)
}

/** Shared popup shell (custom close control + body) for map site popups. */
export function createSitePopupElement(bodyHtml: string, onClose: () => void): HTMLElement {
  const popup = document.createElement('div')
  popup.className = 'sites-map__popup'
  popup.setAttribute('role', 'dialog')
  popup.innerHTML = `
    <button type="button" class="sites-map__popup-close" aria-label="Close">×</button>
    ${bodyHtml}
  `

  const closeBtn = popup.querySelector('.sites-map__popup-close')
  closeBtn?.addEventListener('click', (event) => {
    event.stopPropagation()
    onClose()
  })
  // Handle member links here: stopPropagation must not block them (clicks never
  // reach the map container listener when stopped on the popup).
  popup.addEventListener('click', (event) => {
    onPopupMemberClick(event)
    event.stopPropagation()
  })

  return popup
}
