/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  /** Cloud Console Map ID (vector map) required for Advanced Markers */
  readonly VITE_GOOGLE_MAPS_MAP_ID: string
  readonly VITE_WEB3FORMS_ACCESS_KEY: string
  readonly VITE_MUX_PLAYBACK_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
