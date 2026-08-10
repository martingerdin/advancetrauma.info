import {
  batchColorTokens,
  batchStatusLabels,
  batchStatusPillClass,
  getBatchStatus,
  siteBatches,
  type ParticipatingSite,
} from '../data/sites'
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

  return `
    <div class="sites-map-popup__body">
      <h3 class="sites-map-popup__title">${site.name}</h3>
      <div class="sites-map-popup__pills">
        <span class="sites-map-popup__pill sites-map-popup__pill--batch" style="background: var(${batchColorTokens[site.batch]});">Batch ${site.batch}</span>
        <span class="${batchStatusPillClass[status]}">${batchStatusLabels[status]}</span>
      </div>
      <p class="sites-map-popup__row">
        <span class="sites-map-popup__label">Investigator</span>
        ${investigators}
      </p>
      ${coordinators}
      <p class="sites-map-popup__row">
        <span class="sites-map-popup__label">Location</span>
        ${site.city}
      </p>
      <a class="sites-map-popup__link" href="${site.website}" target="_blank" rel="noopener noreferrer">
        Visit website
      </a>
    </div>
  `
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
  popup.addEventListener('click', (event) => event.stopPropagation())

  return popup
}
