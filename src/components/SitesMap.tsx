import { Component } from '@geajs/core'
import { batchColors, participatingSites } from '../data/sites'
import { loadGoogleMaps } from '../lib/load-google-maps'

export default class SitesMap extends Component {
  private mapInstance: google.maps.Map | null = null
  private markers: google.maps.Marker[] = []
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
    } catch {
      this.loadError = 'Unable to load the map.'
    }
  }

  dispose() {
    this.markers = []
    this.mapInstance = null
    super.dispose()
  }

  private initMap(container: HTMLElement) {
    const map = new google.maps.Map(container, {
      zoom: 5,
      center: { lat: 20.5937, lng: 78.9629 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#333333' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#1a9dbb' }],
        },
      ],
    })

    const bounds = new google.maps.LatLngBounds()

    this.markers = participatingSites.map((site) => {
      const markerColor = batchColors[site.batch]
      const marker = new google.maps.Marker({
        position: site.location,
        map,
        title: site.name,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="${markerColor}" stroke="#ffffff" stroke-width="2"/>
                <circle cx="16" cy="16" r="6" fill="#ffffff"/>
              </svg>
            `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1a9dbb; font-size: 16px;">${site.name}</h3>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;"><strong>Location:</strong> ${site.city}</p>
            <p style="margin: 0; color: #666; font-size: 13px;"><a href="${site.website}" target="_blank" rel="noopener noreferrer">${site.website}</a></p>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      bounds.extend(site.location)
      return marker
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
