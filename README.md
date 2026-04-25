# StadiumOps · Gujarat Titans demo

Real-time stadium crowd & incident operations dashboard. On-ground **stewards** report incidents from their phones (congestion, medical, spills, security), and **ops admins** watch them appear live on a sector-by-sector stadium map and resolve them in real time.

Built in ~1 hour as part of **Google Cloud APL (Agentic Premier League)**.

**Live demo:** https://stadiumops-demo.web.app

---

## Demo flow (2 minutes)

1. Open the URL on a laptop → pick **Ops Admin** → empty live dashboard loads
2. Open the same URL on a phone → pick **Steward** → tap a sector on the stadium map, choose incident type + severity, hit **Submit**
3. The laptop dashboard updates in real time — sector lights up, incident appears in the live feed, threat level + stats refresh
4. Click **Resolve** on the laptop → sector returns to clear, the incident moves to the **History** tab, average resolution time updates
5. Click **Inject Signal** to fire random incidents and demonstrate burst handling

---

## Features

### Steward (mobile-first)
- Tap-to-select sector on a 16-sector stadium map (per-sector resolution: A–P)
- 4 incident types · 3 severity levels · optional note
- Live "My recent reports" feed

### Ops Admin (desktop)
- 16-sector animated stadium map with severity color-coding (green/amber/red), per-ring shading, count badges, animated alerts on high severity
- Live telemetry feed with **Live** / **History** tabs (resolved incidents persist)
- Stats strip: active incidents, last-15-min volume, average resolution time
- Threat-level pill (NOMINAL → GUARDED → ELEVATED → CRITICAL)
- Zone ledger summarizing every sector's status
- "Inject Signal" button to simulate incidents during demos

### Realtime
- Firestore `onSnapshot` listeners keep both surfaces in sync within ~1 second
- No manual refresh, ever

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Vite · React 18 · TypeScript · Tailwind CSS v3 · React Router |
| Backend | Firebase Firestore (realtime listeners) |
| Auth | Mock role picker (no real authentication — demo only) |
| Hosting | Firebase Hosting |
| Icons | lucide-react |

---

## Run locally

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore enabled (any free-tier project works)

### Setup

```bash
# 1. Clone
git clone https://github.com/sah1l/stadiumops-demo.git
cd stadiumops-demo

# 2. Install
npm install

# 3. Configure Firebase
cp .env.example .env.local
# Then open .env.local and paste your Firebase web config
# (Firebase Console → Project settings → Your apps → SDK setup)

# 4. Run
npm run dev
```

Open http://localhost:5173 — the role picker appears. Choose **Ops Admin** in one window and **Steward** in another (e.g., a phone viewport in DevTools) to see the realtime sync.

### Firestore rules

This is demo software — `firestore.rules` is fully open (`allow read, write: if true`). **Do not use in production.** Tighten rules before exposing real users.

---

## Deploy

```bash
# Build
npm run build

# Deploy to Firebase Hosting
npx firebase-tools deploy --only hosting

# (Optional) push Firestore rules / indexes
npx firebase-tools deploy --only firestore
```

You'll need to be logged into the Firebase CLI (`npx firebase-tools login`) and have your project ID set in `.firebaserc`.

---

## Project layout

```
src/
├── pages/
│   ├── Login.tsx           # role picker (Steward / Admin)
│   ├── StewardView.tsx     # mobile incident report form + map picker
│   └── AdminView.tsx       # live dashboard
├── components/
│   ├── StadiumMap.tsx      # admin's read-only stadium map
│   ├── StadiumMapPicker.tsx# steward's clickable map for zone selection
│   ├── stadiumGeometry.ts  # shared SVG geometry (sectors, rings, helpers)
│   ├── IncidentFeed.tsx    # live + history tabs, click-to-resolve
│   ├── StatsStrip.tsx      # active / last-15-min / avg-resolution cards
│   ├── ZoneLedger.tsx      # tabular zone status grid
│   ├── LiveClock.tsx       # IST clock for the header
│   └── SimulateButton.tsx  # "Inject Signal" demo helper
├── lib/
│   ├── firebase.ts         # Firestore initialization
│   ├── session.ts          # localStorage role persistence
│   ├── incidents.ts        # report/resolve helpers + severity utils
│   └── types.ts            # shared TS types
└── data/
    └── zones.ts            # 20 zones (16 ring sectors + concourses + facilities)
```

---

## Scope (deliberately out)

- Real SMS/OTP auth (mocked role picker only)
- Firebase Auth integration (custom localStorage session)
- Steward dispatch / assignment workflows
- Photo uploads, GPS, routing
- Historical analytics beyond the live stats strip

---

## Branding

Gujarat Titans (IPL) — navy `#1B2133` + gold `#C9A449` palette. Display font Syne, telemetry mono IBM Plex Mono. Header reads `OPS COMMAND · GUJARAT TITANS`.

---

## License

Demo project — no license claimed. Fork it, learn from it, ship your own.

Built for **Google Cloud APL (Agentic Premier League)**.
