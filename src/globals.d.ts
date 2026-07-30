/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_WEB3FORMS_ACCESS_KEY: string
  readonly VITE_MUX_PLAYBACK_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace google.maps {
  class Map {
    constructor(el: HTMLElement, opts?: object)
    fitBounds(bounds: LatLngBounds, padding?: number | object): void
  }
  class Marker {
    constructor(opts?: object)
    addListener(event: string, handler: () => void): void
  }
  class InfoWindow {
    constructor(opts?: object)
    open(map: Map, marker: Marker): void
  }
  class LatLngBounds {
    extend(point: { lat: number; lng: number }): void
  }
  class Size {
    constructor(width: number, height: number)
  }
  class Point {
    constructor(x: number, y: number)
  }
  enum MapTypeId {
    ROADMAP = 'roadmap',
  }
}

declare const google: {
  maps: typeof google.maps
}

interface Window {
  google?: typeof google
}
