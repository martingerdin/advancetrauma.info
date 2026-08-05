# ADVANCE TRAUMA

Gea + Vite rebuild of [advancetrauma.info](https://www.advancetrauma.info).

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps JavaScript API key
- `VITE_GOOGLE_MAPS_MAP_ID` — Cloud Console [Map ID](https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over) (vector map) for Advanced Markers; falls back to `DEMO_MAP_ID` if unset
- `VITE_WEB3FORMS_ACCESS_KEY` — [Web3Forms](https://web3forms.com) access key
- `VITE_MUX_PLAYBACK_ID` — [Mux](https://www.mux.com) public playback ID for the hero video (optional; omit to keep the centered hero without video)

Upload the subtitled 1080p master to Mux (Free plan is enough for one low-traffic asset). Do not put large video files in `public/` or commit them — `*.mp4` is gitignored.

## Scripts

```bash
pnpm dev       # local development
pnpm build     # production build → dist/
pnpm preview   # preview the production build
```

Deploy by serving the `dist/` folder as static files. For client-side routing, configure the host to fall back to `index.html`.
