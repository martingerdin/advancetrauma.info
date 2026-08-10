import { Component } from '@geajs/core'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import { batchColorTokens, participatingSites } from '../data/sites'
import type { ParticipatingSite } from '../data/sites'
import { cssVar } from '../lib/css-var'
import { openTeamMemberCard } from '../lib/focus-card'
import { buildSitePopupHtml, createSitePopupElement } from '../lib/site-map-popup'
import sitesMapStore from '../stores/sites-map-store'

type SiteMarker = {
  name: string
  marker: LeafletMarker
}

/**
 * CARTO Positron tiles (OSM data) — free for low-traffic public sites with
 * attribution. Avoids Google Maps cookies/API keys; tile requests still send
 * the visitor IP to the tile host (disclose in a privacy policy if needed).
 * OSMF’s public tile servers discourage heavy production use, so we do not
 * point Leaflet at tile.openstreetmap.org.
 */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function onPopupClick(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return
  const button = target.closest<HTMLElement>('[data-member]')
  if (!button || !button.classList.contains('sites-map-popup__person')) return
  event.preventDefault()
  const name = button.getAttribute('data-member')
  if (name) openTeamMemberCard(name)
}

export default class SitesMap extends Component {
  private mapInstance: LeafletMap | null = null
  private siteMarkers: SiteMarker[] = []
  private mapInitStarted = false
  private mapContainer: HTMLElement | null = null
  private readonly focusSite = (name: string) => {
    this.openSite(name)
  }
  loadError = ''

  async onAfterRender() {
    if (this.mapInitStarted || this.mapInstance) return

    const container = this.el?.querySelector<HTMLElement>('[data-map]')
    if (!container) return

    this.mapInitStarted = true

    try {
      await this.initMap(container)
      sitesMapStore.register(this.focusSite)
    } catch {
      this.mapInitStarted = false
      this.loadError = 'Unable to load the map.'
    }
  }

  dispose() {
    sitesMapStore.unregister(this.focusSite)
    this.mapContainer?.removeEventListener('click', onPopupClick)
    this.mapContainer = null
    this.mapInstance?.remove()
    this.mapInstance = null
    this.siteMarkers = []
    this.mapInitStarted = false
    super.dispose()
  }

  private openSite(name: string) {
    const entry = this.siteMarkers.find((item) => item.name === name)
    const map = this.mapInstance
    if (!entry || !map) return

    const latLng = entry.marker.getLatLng()
    map.setView(latLng, Math.max(map.getZoom(), 8), { animate: true })
    entry.marker.openPopup()
  }

  private async initMap(container: HTMLElement) {
    const [{ default: L }] = await Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ])
    const textInverse = cssVar('--text-inverse')
    const markerSize = Number.parseFloat(cssVar('--map-marker-size-px')) || 28
    const popupWidth = Number.parseFloat(cssVar('--map-popup-width-px')) || 280
    const mapPad = Number.parseFloat(cssVar('--map-fit-padding-px')) || 16

    const map = L.map(container, {
      scrollWheelZoom: false,
      attributionControl: true,
    })

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    const bounds = L.latLngBounds([])

    this.siteMarkers = participatingSites.map((site: ParticipatingSite) => {
      const markerColor = cssVar(batchColorTokens[site.batch])
      const icon = L.divIcon({
        className: 'sites-map__leaflet-marker',
        html: `
          <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="16" cy="16" r="12" fill="${markerColor}" stroke="${textInverse}" stroke-width="2"/>
            <circle cx="16" cy="16" r="6" fill="${textInverse}"/>
          </svg>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -(markerSize / 2 - 2)],
      })
      const popupHtml = buildSitePopupHtml(site)
      const marker = L.marker([site.location.lat, site.location.lng], {
        title: site.name,
        icon,
      })
        .bindPopup(
          () => createSitePopupElement(popupHtml, () => marker.closePopup()),
          {
            maxWidth: popupWidth,
            className: 'sites-map__leaflet-popup',
            closeButton: false,
          },
        )
        .addTo(map)

      bounds.extend([site.location.lat, site.location.lng])
      return { name: site.name, marker }
    })

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [mapPad, mapPad] })
    } else {
      map.setView([20.5937, 78.9629], 5)
    }

    this.mapInstance = map
    this.mapContainer = container
    container.addEventListener('click', onPopupClick)

    // Leaflet measures the container after paint; fix size once layout settles.
    requestAnimationFrame(() => {
      map.invalidateSize()
    })
  }

  template() {
    return (
      <div>
        {this.loadError ? <p class="contact-form__status--error">{this.loadError}</p> : null}
        <div class="sites-map" data-map role="region" aria-label="Participating sites map" />
      </div>
    )
  }
}
