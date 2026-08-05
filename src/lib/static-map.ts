import type { ParticipatingSite } from '../data/sites'

export type LatLng = { lat: number; lng: number }

export type MapViewport = {
  center: LatLng
  zoom: number
  width: number
  height: number
}

const TILE_SIZE = 256
const MAX_STATIC_SIZE = 640
const MAX_ZOOM = 15
const FIT_PADDING_PX = 40

/** Mercator world point in tile units at zoom 0 (0…256). */
function project(lat: number, lng: number): { x: number; y: number } {
  const siny = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999)
  return {
    x: TILE_SIZE * ((lng + 180) / 360),
    y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
  }
}

export function boundsOf(points: LatLng[]): { sw: LatLng; ne: LatLng } {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const point of points) {
    minLat = Math.min(minLat, point.lat)
    maxLat = Math.max(maxLat, point.lat)
    minLng = Math.min(minLng, point.lng)
    maxLng = Math.max(maxLng, point.lng)
  }
  return {
    sw: { lat: minLat, lng: minLng },
    ne: { lat: maxLat, lng: maxLng },
  }
}

/** Choose center/zoom so all points fit inside the map with padding. */
export function fitViewport(points: LatLng[], width: number, height: number): MapViewport {
  const { sw, ne } = boundsOf(points)
  const center = {
    lat: (sw.lat + ne.lat) / 2,
    lng: (sw.lng + ne.lng) / 2,
  }

  if (sw.lat === ne.lat && sw.lng === ne.lng) {
    return { center, zoom: 8, width, height }
  }

  const swProj = project(sw.lat, sw.lng)
  const neProj = project(ne.lat, ne.lng)
  const worldWidth = Math.abs(neProj.x - swProj.x) || 1
  const worldHeight = Math.abs(swProj.y - neProj.y) || 1
  const usableW = Math.max(width - FIT_PADDING_PX * 2, 1)
  const usableH = Math.max(height - FIT_PADDING_PX * 2, 1)
  const zoom = Math.min(
    MAX_ZOOM,
    Math.floor(Math.min(Math.log2(usableW / worldWidth), Math.log2(usableH / worldHeight))),
  )

  return { center, zoom: Math.max(zoom, 1), width, height }
}

/** Pixel position of a lat/lng within a Static Maps viewport (top-left origin). */
export function latLngToPixel(point: LatLng, viewport: MapViewport): { x: number; y: number } {
  const scale = 2 ** viewport.zoom
  const world = project(point.lat, point.lng)
  const center = project(viewport.center.lat, viewport.center.lng)
  return {
    x: (world.x - center.x) * scale + viewport.width / 2,
    y: (world.y - center.y) * scale + viewport.height / 2,
  }
}

/** Cap dimensions for the Static Maps API while preserving aspect ratio. */
export function staticMapSize(displayWidth: number, displayHeight: number): { width: number; height: number } {
  const w = Math.max(1, Math.round(displayWidth))
  const h = Math.max(1, Math.round(displayHeight))
  const scale = Math.min(MAX_STATIC_SIZE / w, MAX_STATIC_SIZE / h, 1)
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  }
}

export function buildStaticMapUrl(viewport: MapViewport, apiKey: string): string {
  const params = new URLSearchParams({
    size: `${viewport.width}x${viewport.height}`,
    scale: '2',
    maptype: 'roadmap',
    center: `${viewport.center.lat},${viewport.center.lng}`,
    zoom: String(viewport.zoom),
    key: apiKey,
  })

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`
}

export function loadStaticMapImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.alt = 'Map of participating trial sites'
    img.onload = () => {
      // Static Maps error payloads are usually small placeholder bitmaps.
      if (img.naturalWidth < 10 || img.naturalHeight < 10) {
        reject(new Error('Static map returned an empty image'))
        return
      }
      resolve(img)
    }
    img.onerror = () => reject(new Error('Failed to load static map image'))
    img.src = url
  })
}

export type SitePopupColors = {
  brand: string
  text: string
  textMuted: string
  textInverse: string
  markerColor: string
  statusPillStyle: string
  statusPillText: string
}

/** Shared site popup body markup for interactive and static map popups. */
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

/** Shared popup shell (close control + body) used by interactive and static maps. */
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
