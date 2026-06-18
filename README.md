# Figment Studio

> **Premium Architectural Visualization** — Nigeria's leading 3D rendering, cinematic animation, and AI-guided design studio.

![Figment Studio](./public/logo.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 19 + TypeScript |
| Styling | TailwindCSS (CDN config) + custom design system |
| State | Zustand (persisted) |
| AI | Google Gemini 2.5 Flash/Pro via backend proxy |
| Backend | Express + Node.js |
| Fonts | Cormorant Garamond (display) + Inter (body) |

---

## Getting Started (Localhost)

### Prerequisites
- Node.js 18+
- npm

### 1. Frontend

```bash
# Install dependencies
npm install

# Set up environment
# Create .env.local:
# VITE_BACKEND_URL=http://localhost:8787

# Start dev server (port 3005)
npm run dev
```

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
# Edit .env:
# PORT=8787
# GEMINI_API_KEY=your_key_here
# FX_USD_NGN=1600
# PAYSTACK_CHECKOUT_URL=
# FLUTTERWAVE_CHECKOUT_URL=

# Start backend (port 8787)
npm run dev
```

### Open the app
- **Frontend:** http://localhost:3005
- **Backend API:** http://localhost:8787/api/health

---

## Project Structure

```
figment-studio/
├── components/          # 33 React UI components
│   ├── Logo.tsx         # Brand logo (uses /public/logo.png)
│   ├── Header.tsx       # Sticky nav with mobile drawer
│   ├── Footer.tsx       # Dark footer with nav columns
│   ├── Hero.tsx         # Full-bleed hero with stats bar
│   ├── LandingPage.tsx  # Landing + pricing + CTA
│   ├── ArcVizPage.tsx   # AI Studio workspace
│   ├── PaymentPortal.tsx# Paystack/Flutterwave checkout
│   ├── AdminDashboard.tsx
│   ├── ClientDashboard.tsx
│   └── ...
├── services/
│   └── geminiService.ts # Gemini AI streaming service
├── store.ts             # Zustand global state
├── types.ts             # TypeScript interfaces
├── constants.ts         # Images, mock data
├── public/
│   └── logo.png         # Official Figment Studio logo
├── backend/
│   ├── server.js        # Express API server
│   ├── .env             # Backend environment variables
│   └── .env.example     # Template for env setup
└── index.html           # Global design system (Tailwind config)
```

---

## Roadmap (7-Phase Plan)

- **Phase 1** — Config hygiene, server-side AI proxy, telemetry
- **Phase 2** — Real auth (JWT), Postgres DB, protected routes
- **Phase 3** — Live payment infrastructure (webhooks + reconciliation)
- **Phase 4** — AI Studio v1 (presets, history, structured outputs)
- **Phase 5** — Sketch preservation + quality gates
- **Phase 6** — Premium plans, AI credits, concierge delivery
- **Phase 7** — Security hardening, E2E tests, launch

---

## Design System

Color palette anchored to the official brand orange:

| Token | Value | Use |
|---|---|---|
| `primary` | `#F07A3A` | Brand orange, CTAs, accents |
| `canvas-dark` | `#100D0A` | Dark panels, footer |
| `text-main` | `#0F0D0B` | Primary text |
| `surface` | `#FFFFFF` | Card backgrounds |
| `background` | `#F9F6F2` | Page background |

Fonts: **Cormorant Garamond** (display/headlines) + **Inter** (body/UI)

---

© 2025 Figment Studio Ltd. Abuja, Nigeria.
