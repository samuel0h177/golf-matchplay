# Golf Matchplay (Ryder‑style)

[![Deploy to GitHub Pages](https://github.com/OWNER/REPO/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/deploy-pages.yml)

Matchplay scorekeeper modeled after the official Ryder Cup scoring UI. Built with Vue 3, Vuetify 3, Vite, and Pinia, with Faker data and PWA support.

## Highlights

- Ryder‑style scoreboard layout with match cards and hole indicators
- Clickable hole balls to record winners (USA → Vietnam → halved)
- Player drawer with Faker profiles and avatars
- Admin page for assigning players and editing match states
- LocalStorage persistence (auto‑saved)
- PWA manifest + service worker enabled

## Tech Stack

- Vue 3 + Vite
- Vuetify 3
- Pinia
- Vue Router
- Vite PWA plugin
- Faker.js

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Local Network + QR

Run the dev server on your LAN and generate a QR code for your phone:

```bash
npm run dev:host
npm run qr:local
```

Find your local IP (example: `192.168.1.50`), then:

```bash
npm run qr -- --url http://192.168.1.50:5173/
```

Open `http://192.168.1.50:5173/` on your phone or scan `public/qr.png`.

## Routes

- `/` — Scoreboard
- `/admin` — Admin controls (match status, player assignments, hole results)

## Scorekeeping

- Click a hole ball to cycle results: USA → Vietnam → halved.
- The win bar on each match shows who is leading.
- A “Final” label appears next to the match score when a match is played thru 18.

## Data Model (Seeded)

Seed data lives in `src/data/seed.js`. Each match includes:

```json
{
  "id": "match-1",
  "sessionId": "fri-foursomes",
  "status": "in_progress",
  "score": {
    "leader": "usa",
    "holesUp": 1,
    "thru": 12,
    "holes": ["usa", null, "vietnam", "..."]
  }
}
```

## Persistence

State auto‑saves to localStorage. Use the “Reseed data” button in the Admin page to reset.

## PWA

PWA support is enabled in `vite.config.js`.

### Install Without Browser Chrome

To get a full-screen, app-like experience you must install the PWA:

- Android (Chrome): open the site and tap “Install app”.
- iOS (Safari): Share → “Add to Home Screen”.

The PWA icon is defined in `public/icons/app-icon.svg`.

## Staging on GitHub Pages

Push to `main` to deploy automatically. The build uses a base path of `/<repo>/` so the app works from GitHub Pages.

Staging URL: `https://OWNER.github.io/REPO/`

Update the badge and URL once you know the repo name.

## Notes

- Flags are stored under `public/flags/`.
- Team colors: USA (red) vs Vietnam (blue).
