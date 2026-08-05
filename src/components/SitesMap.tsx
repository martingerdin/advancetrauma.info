import { Component } from '@geajs/core'
import { batchColorTokens, getBatchStatus, participatingSites, siteBatches } from '../data/sites'
import type { ParticipatingSite } from '../data/sites'
import { cssVar } from '../lib/css-var'
import { loadGoogleMaps, mapContainerHasGoogleError } from '../lib/load-google-maps'
import {
  buildSitePopupHtml,
  buildStaticMapUrl,
  createSitePopupElement,
  fitViewport,
  latLngToPixel,
  loadStaticMapImage,
  staticMapSize,
} from '../lib/static-map'
import sitesMapStore from '../stores/sites-map-store'

type InteractiveSiteMarker = {
  name: string
  marker: google.maps.marker.AdvancedMarkerElement
  popupHtml: string
  position: google.maps.LatLngLiteral
}

type StaticSiteMarker = {
  name: string
  button: HTMLButtonElement
  popupHtml: string
}

/** Positions the shared `.sites-map__popup` shell over an interactive map marker. */
function createSitePopupOverlay(
  position: google.maps.LatLngLiteral,
  popup: HTMLElement,
): google.maps.OverlayView {
  const overlay = new google.maps.OverlayView()
  let anchor: HTMLDivElement | null = null

  overlay.onAdd = () => {
    anchor = document.createElement('div')
    anchor.className = 'sites-map__popup-anchor'
    anchor.appendChild(popup)
    overlay.getPanes()?.floatPane.appendChild(anchor)
  }

  overlay.draw = () => {
    if (!anchor) return
    const projection = overlay.getProjection()
    const point = projection.fromLatLngToDivPixel(
      new google.maps.LatLng(position.lat, position.lng),
    )
    if (!point) return

    anchor.style.left = `${point.x}px`
    anchor.style.top = `${point.y}px`

    // Prefer above the marker; flip below when there isn't room (same idea as static).
    const map = overlay.getMap()
    if (!(map instanceof google.maps.Map)) return
    const popupHeight = popup.offsetHeight
    // Match `.sites-map__popup-anchor` gap (`--space-s` = 0.75rem ≈ 12px).
    const gap = 12
    const spaceAbove = point.y - gap
    const spaceBelow = map.getDiv().clientHeight - point.y - gap
    anchor.classList.toggle(
      'sites-map__popup-anchor--below',
      spaceAbove < popupHeight && spaceBelow >= popupHeight,
    )
  }

  overlay.onRemove = () => {
    anchor?.remove()
    anchor = null
  }

  return overlay
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

export default class SitesMap extends Component {
  private mapInstance: google.maps.Map | null = null
  private siteMarkers: InteractiveSiteMarker[] = []
  private interactivePopupOverlay: google.maps.OverlayView | null = null
  private mapClickListener: google.maps.MapsEventListener | null = null
  private staticMarkers: StaticSiteMarker[] = []
  private staticPopup: HTMLElement | null = null
  private staticLayer: HTMLElement | null = null
  private fallbackNotice: HTMLElement | null = null
  private mapWatchCleanup: (() => void) | null = null
  private readonly focusSite = (name: string) => {
    this.openSite(name)
  }
  loadError = ''

  async onAfterRender() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const mapId = (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? '').trim() || 'DEMO_MAP_ID'
    const container = this.el?.querySelector<HTMLElement>('[data-map]')
    if (!container) return

    if (!apiKey) {
      this.loadError = 'Map is not configured. Set VITE_GOOGLE_MAPS_API_KEY.'
      return
    }

    try {
      // TEMP: uncomment to force static fallback for local testing.
      // throw new Error('force static fallback')
      await loadGoogleMaps(apiKey)
      this.initMap(container, mapId)
      sitesMapStore.register(this.focusSite)
      // Libraries can load while the map still paints Google's error overlay
      // (invalid key, referrer, billing, Map ID). Fall back when that happens.
      void this.watchInteractiveMapOrFallback(container, apiKey)
    } catch {
      await this.useStaticFallback(container, apiKey)
    }
  }

  dispose() {
    this.mapWatchCleanup?.()
    this.mapWatchCleanup = null
    sitesMapStore.unregister(this.focusSite)
    this.teardownInteractiveMap()
    this.closeStaticPopup()
    this.clearFallbackNotice()
    this.staticMarkers = []
    this.staticLayer = null
    this.staticPopup = null
    super.dispose()
  }

  private async useStaticFallback(container: HTMLElement, apiKey: string) {
    try {
      // Detach the node Google Maps owns so its error UI cannot repaint over the fallback.
      const fresh = container.cloneNode(false) as HTMLElement
      container.replaceWith(fresh)
      await this.initStaticFallback(fresh, apiKey)
      this.showFallbackNotice(fresh)
      sitesMapStore.register(this.focusSite)
    } catch {
      this.clearFallbackNotice()
      this.loadError = 'Unable to load the map.'
    }
  }

  private showFallbackNotice(mapContainer: HTMLElement) {
    this.clearFallbackNotice()

    const notice = document.createElement('p')
    notice.className = 'sites-map__fallback-notice'
    notice.setAttribute('role', 'status')

    notice.append(
      document.createTextNode(
        'Showing a static map because the interactive map could not load. ',
      ),
    )

    const reload = document.createElement('button')
    reload.type = 'button'
    reload.className = 'sites-map__fallback-reload'
    reload.textContent = 'Reload the page'
    reload.addEventListener('click', () => {
      window.location.reload()
    })
    notice.append(reload)

    notice.append(document.createTextNode(' to try the interactive map again.'))

    mapContainer.before(notice)
    this.fallbackNotice = notice
  }

  private clearFallbackNotice() {
    this.fallbackNotice?.remove()
    this.fallbackNotice = null
  }

  private async watchInteractiveMapOrFallback(container: HTMLElement, apiKey: string) {
    try {
      await this.waitForInteractiveMapHealthy(container)
    } catch {
      if (this.staticLayer || !this.el?.contains(container)) return
      this.mapWatchCleanup?.()
      this.mapWatchCleanup = null
      this.teardownInteractiveMap()
      await this.useStaticFallback(container, apiKey)
    }
  }

  /**
   * Resolves once the map looks healthy; rejects if Google shows its error UI
   * or calls gm_authFailure.
   */
  private waitForInteractiveMapHealthy(container: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false

      const finish = (error?: Error) => {
        if (settled) return
        settled = true
        this.mapWatchCleanup?.()
        this.mapWatchCleanup = null
        if (error) reject(error)
        else resolve()
      }

      const fail = () => finish(new Error('Google Maps failed to render'))

      if (mapContainerHasGoogleError(container)) {
        fail()
        return
      }

      const previousAuthFailure = window.gm_authFailure
      window.gm_authFailure = () => {
        previousAuthFailure?.()
        fail()
      }

      const observer = new MutationObserver(() => {
        if (mapContainerHasGoogleError(container)) fail()
      })
      observer.observe(container, { childList: true, subtree: true, characterData: true })

      const poll = window.setInterval(() => {
        if (mapContainerHasGoogleError(container)) fail()
      }, 250)

      // Watch long enough for Google's error overlay / auth failure to appear.
      // Do not treat an early `idle` as success — Oops often paints after first layout.
      const healthyTimer = window.setTimeout(() => {
        if (mapContainerHasGoogleError(container)) {
          fail()
          return
        }
        finish()
      }, 6000)

      this.mapWatchCleanup = () => {
        observer.disconnect()
        window.clearInterval(poll)
        window.clearTimeout(healthyTimer)
        if (window.gm_authFailure) {
          window.gm_authFailure = previousAuthFailure
        }
      }
    })
  }

  private teardownInteractiveMap() {
    this.closeInteractivePopup()
    this.mapClickListener?.remove()
    this.mapClickListener = null
    for (const entry of this.siteMarkers) {
      entry.marker.map = null
    }
    this.siteMarkers = []
    this.mapInstance = null
  }

  private openSite(name: string) {
    if (this.staticLayer) {
      this.openStaticSite(name)
      return
    }

    const entry = this.siteMarkers.find((item) => item.name === name)
    const map = this.mapInstance
    if (!entry || !map) return

    const position = markerPosition(entry.marker) ?? entry.position
    map.panTo(position)
    if ((map.getZoom() ?? 0) < 8) {
      map.setZoom(8)
    }
    this.openInteractivePopup(position, entry.popupHtml)
  }

  private openInteractivePopup(position: google.maps.LatLngLiteral, html: string) {
    this.closeInteractivePopup()
    const map = this.mapInstance
    if (!map) return

    const popup = createSitePopupElement(html, () => this.closeInteractivePopup())
    const overlay = createSitePopupOverlay(position, popup)
    overlay.setMap(map)
    this.interactivePopupOverlay = overlay
  }

  private closeInteractivePopup() {
    this.interactivePopupOverlay?.setMap(null)
    this.interactivePopupOverlay = null
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

  private initMap(container: HTMLElement, mapId: string) {
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

      const popupHtml = this.popupHtmlFor(site)
      marker.addEventListener('gmp-click', () => {
        this.openInteractivePopup(site.location, popupHtml)
      })

      bounds.extend(site.location)
      return { name: site.name, marker, popupHtml, position: site.location }
    })

    this.mapClickListener = map.addListener('click', () => this.closeInteractivePopup())
    map.fitBounds(bounds, 10)
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

    const popup = createSitePopupElement(html, () => this.closeStaticPopup())

    this.staticLayer.appendChild(popup)
    this.staticPopup = popup
    anchor.classList.add('sites-map__marker--active')

    const layerRect = this.staticLayer.getBoundingClientRect()
    const anchorRect = anchor.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()

    // Prefer above the marker; allow the popup to spill outside the map bounds.
    let left = anchorRect.left - layerRect.left + anchorRect.width / 2 - popupRect.width / 2
    let top = anchorRect.top - layerRect.top - popupRect.height - 12

    if (top < -popupRect.height + 24) {
      top = anchorRect.bottom - layerRect.top + 12
    }

    const minLeft = 8 - popupRect.width * 0.4
    const maxLeft = layerRect.width - popupRect.width * 0.6
    left = Math.min(Math.max(minLeft, left), maxLeft)

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
