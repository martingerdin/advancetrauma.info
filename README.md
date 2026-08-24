# ADVANCE TRAUMA

Gea + Vite rebuild of [advancetrauma.info](https://www.advancetrauma.info).

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

- `VITE_WEB3FORMS_ACCESS_KEY` — [Web3Forms](https://web3forms.com) access key
- `VITE_MUX_PLAYBACK_ID` — [Mux](https://www.mux.com) public playback ID for the hero video (optional; omit to keep the centered hero without video)
- `VITE_TMG_PASSWORD_HASH` — SHA-256 hex digest of the shared TMG area password. Generate it with `pnpm hash:tmg-password` (pass the password as an argument, or omit it to be prompted). Set the same value in Vercel for production. This is a **client-side soft gate** for `/tmg` only: the hash ships in the browser bundle, and meeting files remain public on GitHub. Do not treat it as protection for confidential documents.

The TMG page lists meetings from [`meetings/trial-management-group`](https://github.com/martingerdin/advance-trauma-trial/tree/main/meetings/trial-management-group). Only folders with a `website.json` appear, and only files named in that file’s `files` array are shown. A listed `content.md` is rendered on the page rather than shown as a download.

The participating-sites map uses [Leaflet](https://leafletjs.com/) with [CARTO Positron](https://carto.com/basemaps/) tiles (OpenStreetMap data). No map API key is required. Tile requests send the visitor’s IP to the tile host; they do not load Google Maps or typically set tracking cookies, so a cookie banner is not needed for the map alone.

Upload the subtitled 1080p master to Mux (Free plan is enough for one low-traffic asset). Do not put large video files in `public/` or commit them — `*.mp4` is gitignored.

## Scripts

```bash
pnpm dev                 # local development
pnpm build               # production build → dist/
pnpm preview             # preview the production build
pnpm hash:tmg-password   # SHA-256 hash for VITE_TMG_PASSWORD_HASH
```

Deploy by serving the `dist/` folder as static files. For client-side routing, configure the host to fall back to `index.html`.
