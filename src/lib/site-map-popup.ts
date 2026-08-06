import type { ParticipatingSite } from '../data/sites'

export type SitePopupColors = {
  brand: string
  text: string
  textMuted: string
  textInverse: string
  markerColor: string
  statusPillStyle: string
  statusPillText: string
}

/** Shared site popup markup for map markers. */
export function buildSitePopupHtml(site: ParticipatingSite, colors: SitePopupColors): string {
  const coordinators = site.coordinators
    ? `<p class="sites-map-popup__row" style="color: ${colors.text};">
        <span class="sites-map-popup__label" style="color: ${colors.textMuted};">Clinical research coordinator</span>
        ${site.coordinators}
      </p>`
    : ''

  return `
    <div class="sites-map-popup__body">
      <h3 class="sites-map-popup__title" style="color: ${colors.brand};">${site.name}</h3>
      <div class="sites-map-popup__pills">
        <span class="sites-map-popup__pill" style="background: ${colors.markerColor}; color: ${colors.textInverse};">Batch ${site.batch}</span>
        <span class="sites-map-popup__pill" style="${colors.statusPillStyle}">${colors.statusPillText}</span>
      </div>
      <p class="sites-map-popup__row" style="color: ${colors.text};">
        <span class="sites-map-popup__label" style="color: ${colors.textMuted};">Investigator</span>
        ${site.pi}
      </p>
      ${coordinators}
      <p class="sites-map-popup__row" style="color: ${colors.text};">
        <span class="sites-map-popup__label" style="color: ${colors.textMuted};">Location</span>
        ${site.city}
      </p>
      <a class="sites-map-popup__link" href="${site.website}" target="_blank" rel="noopener noreferrer" style="color: ${colors.brand}; border-bottom-color: ${colors.brand};">
        Visit Website →
      </a>
    </div>
  `
}
