import { Component } from '@geajs/core'
import { batchColorTokens, getBatchStatus, participatingSites, siteBatches } from '../data/sites'
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

      const batchColor = markerColor
      const batchLabel = `Batch ${site.batch}`
      
      // Get batch status to determine if site is currently including patients
      const batch = siteBatches.find((b) => b.id === site.batch)!
      const batchStatus = getBatchStatus(batch)
      
      // Status pill styling and text
      let statusPillStyle = ''
      let statusPillText = ''
      if (batchStatus === 'ongoing') {
        const statusLive = cssVar('--status-live')
        statusPillStyle = `background: ${statusLive}; color: ${textInverse};`
        statusPillText = 'Currently Including Patients'
      } else if (batchStatus === 'upcoming') {
        const lightBlue = cssVar('--light-blue')
        const brandDeep = cssVar('--brand-deep')
        statusPillStyle = `background: ${lightBlue}; color: ${brandDeep};`
        statusPillText = 'Not Yet Including Patients'
      } else {
        const border = cssVar('--border')
        statusPillStyle = `background: ${border}; color: ${textMuted};`
        statusPillText = 'Enrollment Completed'
      }

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 0; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="position: relative; height: 150px; overflow: hidden; border-radius: 8px 8px 0 0; background: ${markerColor};">
              <img src="${site.image}" alt="${site.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" onerror="this.style.display='none'" />
              <span style="position: absolute; top: 10px; right: 10px; background: ${batchColor}; color: ${textInverse}; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; z-index: 1;">${batchLabel}</span>
            </div>
            <div style="padding: 16px;">
              <h3 style="margin: 0 0 8px 0; color: ${brand}; font-size: 16px; font-weight: 600; line-height: 1.3;">${site.name}</h3>
              <div style="margin-bottom: 12px;">
                <span style="${statusPillStyle} display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${statusPillText}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <p style="margin: 0 0 6px 0; color: ${text}; font-size: 14px; line-height: 1.4;">
                  <strong style="color: ${textMuted};">PI:</strong> ${site.pi}
                </p>
                <p style="margin: 0 0 6px 0; color: ${text}; font-size: 14px;">
                  <strong style="color: ${textMuted};">Location:</strong> ${site.city}
                </p>
              </div>
              <a href="${site.website}" target="_blank" rel="noopener noreferrer" style="color: ${brand}; font-size: 14px; text-decoration: none; font-weight: 500; display: inline-block; margin-top: 8px; border-bottom: 1px solid ${brand};">
                Visit Website →
              </a>
            </div>
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
