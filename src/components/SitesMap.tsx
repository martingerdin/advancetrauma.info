import { Component } from '@geajs/core'
import { batchColorTokens, participatingSites } from '../data/sites'
import { cssVar } from '../lib/css-var'
import { loadGoogleMaps } from '../lib/load-google-maps'
import sitesMapStore from '../stores/sites-map-store'

type SiteMarker = {
  name: string
  marker: google.maps.Marker
  infoWindow: google.maps.InfoWindow
}

export default class SitesMap extends Component {
  private mapInstance: google.maps.Map | null = null
  private siteMarkers: SiteMarker[] = []
  private openInfoWindow: google.maps.InfoWindow | null = null
  private readonly focusSite = (name: string) => {
    this.openSite(name)
  }
  loadError = ''

  async onAfterRender() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const container = this.el?.querySelector<HTMLElement>('[data-map]')
    if (!container) return

    if (!apiKey) {
      this.loadError = 'Map is not configured. Set VITE_GOOGLE_MAPS_API_KEY.'
      return
    }

    try {
      await loadGoogleMaps(apiKey)
      this.initMap(container)
      sitesMapStore.register(this.focusSite)
    } catch {
      this.loadError = 'Unable to load the map.'
    }
  }

  dispose() {
    sitesMapStore.unregister(this.focusSite)
    this.openInfoWindow?.close()
    this.openInfoWindow = null
    this.siteMarkers = []
    this.mapInstance = null
    super.dispose()
  }

  private openSite(name: string) {
    const entry = this.siteMarkers.find((item) => item.name === name)
    const map = this.mapInstance
    if (!entry || !map) return

    this.openInfoWindow?.close()
    map.panTo(entry.marker.getPosition()!)
    if ((map.getZoom() ?? 0) < 8) {
      map.setZoom(8)
    }
    entry.infoWindow.open(map, entry.marker)
    this.openInfoWindow = entry.infoWindow
  }

  private initMap(container: HTMLElement) {
    const brand = cssVar('--brand')
    const text = cssVar('--text')
    const textMuted = cssVar('--text-muted')
    const textInverse = cssVar('--text-inverse')

    const map = new google.maps.Map(container, {
      zoom: 5,
      center: { lat: 20.5937, lng: 78.9629 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: text }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: brand }],
        },
      ],
    })

    const bounds = new google.maps.LatLngBounds()

    this.siteMarkers = participatingSites.map((site) => {
      const markerColor = cssVar(batchColorTokens[site.batch])
      const marker = new google.maps.Marker({
        position: site.location,
        map,
        title: site.name,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="${markerColor}" stroke="${textInverse}" stroke-width="2"/>
                <circle cx="16" cy="16" r="6" fill="${textInverse}"/>
              </svg>
            `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: ${brand}; font-size: 16px;">${site.name}</h3>
            <p style="margin: 0 0 5px 0; color: ${textMuted}; font-size: 14px;"><strong>Location:</strong> ${site.city}</p>
            <p style="margin: 0; color: ${textMuted}; font-size: 13px;"><a href="${site.website}" target="_blank" rel="noopener noreferrer">${site.website}</a></p>
          </div>
        `,
      })

      marker.addListener('click', () => {
        this.openInfoWindow?.close()
        infoWindow.open(map, marker)
        this.openInfoWindow = infoWindow
      })

      bounds.extend(site.location)
      return { name: site.name, marker, infoWindow }
    })

    map.fitBounds(bounds, { padding: 10 })
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
