import { Component } from '@geajs/core'
import { batchColorTokens, getBatchStatus, participatingSites, siteBatches } from '../data/sites'
import { cssVar } from '../lib/css-var'
import { loadGoogleMaps } from '../lib/load-google-maps'
import sitesMapStore from '../stores/sites-map-store'

type SiteMarker = {
  name: string
  marker: google.maps.marker.AdvancedMarkerElement
  infoWindow: google.maps.InfoWindow
}

function markerPosition(
  marker: google.maps.marker.AdvancedMarkerElement,
): google.maps.LatLngLiteral | null {
  const position = marker.position
  if (!position) return null
  if (typeof (position as google.maps.LatLng).lat === 'function') {
    const latLng = position as google.maps.LatLng
    return { lat: latLng.lat(), lng: latLng.lng() }
  }
  const literal = position as google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral
  return { lat: literal.lat, lng: literal.lng }
}

function createMarkerContent(color: string, stroke: string): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="${stroke}" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="${stroke}"/>
    </svg>
  `
  return root.firstElementChild as HTMLElement
}

/** Interactive Google Map — only mounted after cookie consent is accepted. */
export default class SitesMapCanvas extends Component {
  private mapInstance: google.maps.Map | null = null
  private siteMarkers: SiteMarker[] = []
  private openInfoWindow: google.maps.InfoWindow | null = null
  private mapInitStarted = false
  private readonly focusSite = (name: string) => {
    this.openSite(name)
  }
  loadError = ''

  async onAfterRender() {
    if (this.mapInitStarted || this.mapInstance) return

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const mapId = (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? '').trim() || 'DEMO_MAP_ID'
    const container = this.el?.querySelector<HTMLElement>('[data-map]')
    if (!container) return

    if (!apiKey) {
      this.loadError = 'Map is not configured. Set VITE_GOOGLE_MAPS_API_KEY.'
      return
    }

    this.mapInitStarted = true

    try {
      await loadGoogleMaps(apiKey)
      this.initMap(container, mapId)
      sitesMapStore.register(this.focusSite)
    } catch {
      this.mapInitStarted = false
      this.loadError = 'Unable to load the map.'
    }
  }

  dispose() {
    sitesMapStore.unregister(this.focusSite)
    this.openInfoWindow?.close()
    this.openInfoWindow = null
    for (const entry of this.siteMarkers) {
      entry.marker.map = null
    }
    this.siteMarkers = []
    this.mapInstance = null
    this.mapInitStarted = false
    super.dispose()
  }

  private openSite(name: string) {
    const entry = this.siteMarkers.find((item) => item.name === name)
    const map = this.mapInstance
    if (!entry || !map) return

    const position = markerPosition(entry.marker)
    if (!position) return

    this.openInfoWindow?.close()
    map.panTo(position)
    if ((map.getZoom() ?? 0) < 8) {
      map.setZoom(8)
    }
    entry.infoWindow.open({ map, anchor: entry.marker })
    this.openInfoWindow = entry.infoWindow
  }

  private initMap(container: HTMLElement, mapId: string) {
    const brand = cssVar('--brand')
    const text = cssVar('--text')
    const textMuted = cssVar('--text-muted')
    const textInverse = cssVar('--text-inverse')

    const map = new google.maps.Map(container, {
      zoom: 5,
      center: { lat: 20.5937, lng: 78.9629 },
      mapId,
      // Advanced markers require a map ID; cloud styles replace MapOptions.styles.
    })

    const bounds = new google.maps.LatLngBounds()

    this.siteMarkers = participatingSites.map((site) => {
      const markerColor = cssVar(batchColorTokens[site.batch])
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: site.location,
        title: site.name,
        content: createMarkerContent(markerColor, textInverse),
        gmpClickable: true,
      })

      const batch = siteBatches.find((b) => b.id === site.batch)!
      const batchStatus = getBatchStatus(batch)

      let statusPillStyle = ''
      let statusPillText = ''
      if (batchStatus === 'ongoing') {
        const statusLive = cssVar('--status-live')
        statusPillStyle = `background: ${statusLive}; color: ${textInverse};`
        statusPillText = 'Including Patients'
      } else if (batchStatus === 'completed') {
        const border = cssVar('--border')
        statusPillStyle = `background: ${border}; color: ${textMuted};`
        statusPillText = 'Completed'
      } else if (batchStatus === 'starting') {
        const brandColor = cssVar('--brand')
        statusPillStyle = `background: ${brandColor}; color: ${textInverse};`
        statusPillText = 'Starting'
      } else if (batchStatus === 'screening') {
        const lightBlue = cssVar('--light-blue')
        const brandDeep = cssVar('--brand-deep')
        statusPillStyle = `background: ${lightBlue}; color: ${brandDeep};`
        statusPillText = 'Screening clusters'
      } else {
        const lightBlue = cssVar('--light-blue')
        const brandDeep = cssVar('--brand-deep')
        statusPillStyle = `background: ${lightBlue}; color: ${brandDeep};`
        statusPillText = 'Not Yet Including Patients'
      }

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: ${brand}; font-size: 16px; font-weight: 600; line-height: 1.3;">${site.name}</h3>  
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
              <span style="background: ${markerColor}; color: ${textInverse}; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Batch ${site.batch}</span>
              <span style="${statusPillStyle} display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${statusPillText}</span>
            </div>
            <p style="margin: 0 0 8px 0; color: ${text}; font-size: 14px; font-weight: 400; line-height: 1.4;">
              <span style="display: block; margin-bottom: 2px; font-size: 10px; font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase; color: ${textMuted};">Investigator</span>
              ${site.pi}
            </p>
            ${
              site.coordinators
                ? `<p style="margin: 0 0 8px 0; color: ${text}; font-size: 14px; font-weight: 400; line-height: 1.4;">
              <span style="display: block; margin-bottom: 2px; font-size: 10px; font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase; color: ${textMuted};">Clinical research coordinator</span>
              ${site.coordinators}
            </p>`
                : ''
            }
            <p style="margin: 0 0 8px 0; color: ${text}; font-size: 14px; font-weight: 400;">
              <span style="display: block; margin-bottom: 2px; font-size: 10px; font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase; color: ${textMuted};">Location</span>
              ${site.city}
            </p>
            <a href="${site.website}" target="_blank" rel="noopener noreferrer" style="color: ${brand}; font-size: 14px; text-decoration: none; font-weight: 500; border-bottom: 1px solid ${brand};">
              Visit Website →
            </a>
          </div>
        `,
      })

      marker.addEventListener('gmp-click', () => {
        this.openInfoWindow?.close()
        infoWindow.open({ map, anchor: marker })
        this.openInfoWindow = infoWindow
      })

      bounds.extend(site.location)
      return { name: site.name, marker, infoWindow }
    })

    map.fitBounds(bounds, 10)
    this.mapInstance = map
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
