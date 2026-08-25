/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY: string
  readonly VITE_MUX_PLAYBACK_ID: string
  readonly VITE_TMG_PASSWORD_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
