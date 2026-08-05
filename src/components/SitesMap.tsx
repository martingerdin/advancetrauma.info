import { Component } from '@geajs/core'
import { batchColorTokens, getBatchStatus, participatingSites, siteBatches } from '../data/sites'
import type { ParticipatingSite } from '../data/sites'
import { cssVar } from '../lib/css-var'
import { loadGoogleMaps } from '../lib/load-google-maps'
import {
  buildSitePopupHtml,
  buildStaticMapUrl,
  fitViewport,
  latLngToPixel,
  loadStaticMapImage,
  staticMapSize,
} from '../lib/static-map'
import sitesMapStore from '../stores/sites-map-store'

type InteractiveSiteMarker = {
  name: string
  marker: google.maps.Marker
  infoWindow: google.maps.InfoWindow
}

type StaticSiteMarker = {
  name: string
  button: HTMLButtonElement
  popupHtml: string
}

export default class SitesMap extends Component {
  private mapInstance: google.maps.Map | null = null
  private siteMarkers: InteractiveSiteMarker[] = []
  private openInfoWindow: google.maps.InfoWindow | null = null
  private staticMarkers: StaticSiteMarker[] = []
  private staticPopup: HTMLElement | null = null
  private staticLayer: HTMLElement | null = null
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
      try {
        await this.initStaticFallback(container, apiKey)
        sitesMapStore.register(this.focusSite)
      } catch {
        this.loadError = 'Unable to load the map.'
      }
    }
  }

  dispose() {
    sitesMapStore.unregister(this.focusSite)
    this.openInfoWindow?.close()
    this.openInfoWindow = null
    this.siteMarkers = []
    this.mapInstance = null
    this.closeStaticPopup()
    this.staticMarkers = []
    this.staticLayer = null
    this.staticPopup = null
    super.dispose()
  }

  private openSite(name: string) {
    if (this.staticLayer) {
      this.openStaticSite(name)
      return
    }

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

  private statusPill(site: ParticipatingSite): { style: string; text: string } {
    const batch = siteBatches.find((b) => b.id === site.batch)!
    const batchStatus = getBatchStatus(batch)
    const textInverse = cssVar('--text-inverse')
    const textMuted = cssVar('--text-muted')

    if (batchStatus === 'ongoing') {
      return {
        style: `background: ${cssVar('--status-live')}; color: ${textInverse};`,
        text: 'Including Patients',
      }
    }
    if (batchStatus === 'completed') {
      return {
        style: `background: ${cssVar('--border')}; color: ${textMuted};`,
        text: 'Completed',
      }
    }
    if (batchStatus === 'starting') {
      return {
        style: `background: ${cssVar('--brand')}; color: ${textInverse};`,
        text: 'Starting',
      }
    }
    if (batchStatus === 'screening') {
      return {
        style: `background: ${cssVar('--light-blue')}; color: ${cssVar('--brand-deep')};`,
        text: 'Screening clusters',
      }
    }
    return {
      style: `background: ${cssVar('--light-blue')}; color: ${cssVar('--brand-deep')};`,
      text: 'Not Yet Including Patients',
    }
  }

  private popupHtmlFor(site: ParticipatingSite): string {
    const status = this.statusPill(site)
    return buildSitePopupHtml(site, {
      brand: cssVar('--brand'),
      text: cssVar('--text'),
      textMuted: cssVar('--text-muted'),
      textInverse: cssVar('--text-inverse'),
      markerColor: cssVar(batchColorTokens[site.batch]),
      statusPillStyle: status.style,
      statusPillText: status.text,
    })
  }

  private initMap(container: HTMLElement) {
    const brand = cssVar('--brand')
    const text = cssVar('--text')
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
        content: this.popupHtmlFor(site),
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

  private async initStaticFallback(container: HTMLElement, apiKey: string) {
    const displayWidth = Math.max(container.clientWidth, 320)
    const displayHeight = Math.max(container.clientHeight, 200)
    const size = staticMapSize(displayWidth, displayHeight)
    const viewport = fitViewport(
      participatingSites.map((site) => site.location),
      size.width,
      size.height,
    )
    const url = buildStaticMapUrl(viewport, apiKey)
    const img = await loadStaticMapImage(url)
    img.className = 'sites-map__image'

    const layer = document.createElement('div')
    layer.className = 'sites-map__static'
    layer.appendChild(img)

    this.staticMarkers = participatingSites.map((site) => {
      const point = latLngToPixel(site.location, viewport)
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `sites-map__marker sites-map__marker--${site.batch}`
      button.style.left = `${(point.x / viewport.width) * 100}%`
      button.style.top = `${(point.y / viewport.height) * 100}%`
      button.setAttribute('aria-label', site.name)
      button.title = site.name

      const popupHtml = this.popupHtmlFor(site)
      button.addEventListener('click', (event) => {
        event.stopPropagation()
        this.openStaticPopup(button, popupHtml)
      })

      layer.appendChild(button)
      return { name: site.name, button, popupHtml }
    })

    layer.addEventListener('click', () => this.closeStaticPopup())

    container.replaceChildren(layer)
    container.classList.add('sites-map--static')
    this.staticLayer = layer
  }

  private openStaticSite(name: string) {
    const entry = this.staticMarkers.find((item) => item.name === name)
    if (!entry) return
    this.openStaticPopup(entry.button, entry.popupHtml)
  }

  private openStaticPopup(anchor: HTMLButtonElement, html: string) {
    this.closeStaticPopup()
    if (!this.staticLayer) return

    const popup = document.createElement('div')
    popup.className = 'sites-map__popup'
    popup.setAttribute('role', 'dialog')
    popup.innerHTML = `
      <button type="button" class="sites-map__popup-close" aria-label="Close">×</button>
      ${html}
    `

    const closeBtn = popup.querySelector('.sites-map__popup-close')
    closeBtn?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.closeStaticPopup()
    })
    popup.addEventListener('click', (event) => event.stopPropagation())

    this.staticLayer.appendChild(popup)
    this.staticPopup = popup
    anchor.classList.add('sites-map__marker--active')

    const layerRect = this.staticLayer.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()

    let left = anchorRect.left - layerRect.left + anchorRect.width / 2 - popupRect.width / 2
    let top = anchorRect.top - layerRect.top - popupRect.height - 12

    left = Math.min(Math.max(8, left), layerRect.width - popupRect.width - 8)
    if (top < 8) {
      top = anchorRect.bottom - layerRect.top + 12
    }

    popup.style.left = `${left}px`
    popup.style.top = `${top}px`
  }

  private closeStaticPopup() {
    this.staticPopup?.remove()
    this.staticPopup = null
    for (const entry of this.staticMarkers) {
      entry.button.classList.remove('sites-map__marker--active')
    }
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
