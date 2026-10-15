# Pulse — Gym Admin Dashboard

> An operations dashboard for a three-branch strength club in Casablanca (Maarif, Anfa, Ain Diab): revenue, check-ins, members and the weekly class schedule. Calm, precise and fast to scan, in the spirit of Linear, Vercel and Stripe dashboards.

![Pulse dashboard desktop screenshot](docs/screenshot.png)

<p align="center"><img src="docs/mobile.png" alt="Pulse dashboard on mobile" width="300" /></p>

Live demo: deploy on Vercel

## What changed in the redesign

The first version used a neon-purple theme, glowing gradients, glass cards and a procedural 3D dumbbell. It looked like a template. This version is rebuilt as a real product UI:

- **Neutral system, one accent.** Zinc greys for surfaces and text, a single burnt-orange accent used only for the primary data series, the current week and active states. Green and red appear only as signals (deltas, overdue).
- **Data first.** A bordered KPI strip with tabular figures and quiet sparklines, a single-series revenue chart with a readout, a plan-mix bar plus table, and check-ins by hour with today's forecast hatched.
- **Real photography, used lightly.** One photo of the free-weights rack sits in a sidebar card about an equipment audit, with its credit right under it. No illustrations, no 3D.
- **Three.js removed.** `three`, `@react-three/fiber` and `@react-three/drei` are gone, along with the lazy-loaded 3D chunk they shipped.

## Features

- **Overview**: KPI strip, revenue chart (6M / 12M), plan mix with renewals, upgrades and cancellations, check-ins by hour, newest members and the next classes at Maarif.
- **Revenue chart**: hand-built SVG with a hover crosshair and a live readout (value, month, change month over month). It is focusable: the left and right arrow keys step through the months.
- **Members**: search by name, ID or branch, a status filter with counts, a plan filter and sortable columns. Rows reorder with layout animations, and the table becomes a list on mobile. The empty state offers to clear the filters.
- **Member panel**: slide-over with key facts, an 8-week attendance chart and contextual actions. It moves focus in and restores it on close, and Esc closes it. Deep-linkable with `/members?id=M-1042`.
- **Schedule**: week strip with each day's load, a timeline table (start and end times, room, booking bar that turns accent above 80% and red when full) and a day summary.
- **Keyboard**: `/` focuses search (Enter jumps to filtered members), `G` then `O` / `M` / `S` switches page, arrow keys move through segmented controls and day tabs, plus a skip link.
- **Light and dark themes**: follows the system by default, can be toggled, is saved in `localStorage` and is applied before first paint (no flash).
- Responsive at 375, 768 and 1440 px. Honours `prefers-reduced-motion`.

## Design system

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg` | `#FAFAFA` | `#0A0A0B` | canvas |
| `surface` | `#FFFFFF` | `#121214` | panels |
| `line` | `#E5E5E8` | `#27272B` | 1px borders, dividers |
| `fg` / `muted` | `#18181B` / `#696973` | `#EDEDEF` / `#9696A0` | text (≥ 4.5:1) |
| `accent` | `#C2410C` | `#F97316` | primary series, focus, current state |

- **Type**: [Inter](https://rsms.me/inter/) (variable, self-hosted via Fontsource) with `cv11`/`ss01` and tabular figures for every number; JetBrains Mono for IDs and class times. A tight scale of 11 / 13 / 14 / 22 / 26 px.
- **Shape**: 6–8 px radii, 1px borders, no drop shadows except on the slide-over.
- **Motion**: short and functional. Charts draw in once (≤ 0.9 s), pages crossfade in 140 ms, and segmented controls and nav use a spring-damped shared `layoutId` indicator. Nothing loops or bounces.

## Tech stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

`vercel.json` rewrites every path to `index.html` so client-side routes like `/members` work on refresh.

## Project structure

```
src/
├── components/
│   ├── Layout.jsx        # sidebar, mobile drawer, top bar, route crossfade
│   ├── Sidebar.jsx       # workspace, nav, equipment-audit photo card + credit
│   ├── Topbar.jsx        # breadcrumb, global search, theme, notifications
│   ├── Segmented.jsx     # keyboard-friendly segmented control
│   ├── KpiCard.jsx       # KPI cell + sparkline
│   ├── AreaChart.jsx     # SVG revenue chart with readout
│   ├── PlanMix.jsx       # stacked bar + table
│   ├── PeakBars.jsx      # check-ins by hour with forecast
│   ├── MemberPanel.jsx   # slide-over detail panel
│   └── ui.jsx            # avatar, status badge, page header, formatters
├── pages/                # Overview, Members, Schedule
├── hooks/                # useTheme, useShortcuts
└── data/                 # mock members, stats and schedule
```

## Photo credits

The photo is from Wikimedia Commons and is credited in the app's sidebar. Source data: [`public/photos/credits.json`](public/photos/credits.json).

| Photo | Author | Licence | Source |
| --- | --- | --- | --- |
| Colorful pile of dumbbells at the gym | Ser Amantio di Nicolao | CC BY-SA 4.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Colorful_pile_of_dumbbells_at_the_gym.jpg) |

## Author

**Zakaria Dabella**, UI/UX designer and web developer based in Casablanca, Morocco.

- Portfolio: [zakaria-dabella-portfolio.vercel.app](https://zakaria-dabella-portfolio.vercel.app/)
- GitHub: [@zakaria10-dabella](https://github.com/zakaria10-dabella)

## License

[MIT](LICENSE) © 2026 Zakaria Dabella
