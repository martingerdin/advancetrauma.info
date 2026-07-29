# ADVANCE TRAUMA

Gea + Vite rebuild of [advancetrauma.info](https://www.advancetrauma.info).

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps JavaScript API key
- `VITE_WEB3FORMS_ACCESS_KEY` — [Web3Forms](https://web3forms.com) access key

## Scripts

```bash
pnpm dev       # local development
pnpm build     # production build → dist/
pnpm preview   # preview the production build
```

Deploy by serving the `dist/` folder as static files. For client-side routing, configure the host to fall back to `index.html`.
