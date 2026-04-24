# Vibe Flow

A premium on-demand service platform: clients submit a brief, the Vibe Flow expert team delivers. Features a public marketing site, pricing, contact, an FAQ, and a free AI image generator backed by a secure server-side proxy.

**Stack:** React 19 · Vite 7 · React Router 7 · React Hook Form · Zod · Framer Motion · Lucide · Hugging Face Inference API

---

## Quick start

```bash
npm install
cp .env.example .env           # optional — needed only for AI image gen
npm run dev                    # http://localhost:5173
```

Then open `http://localhost:5173`.

> The AI image generator will return a 503 until you set `HF_TOKEN` in `.env`. Everything else works without it.

---

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start Vite dev server + API middleware |
| `npm run build`   | Production build to `dist/`            |
| `npm run preview` | Preview the production build locally   |
| `npm run lint`    | Run ESLint                             |

---

## Project structure

```
VibeFlow/
├── api/                             # Server-side (Vercel-style) functions
│   └── generate-image.js            # Secure HF proxy (reads HF_TOKEN)
├── public/                          # Static assets (favicon, robots, sitemap)
├── src/
│   ├── main.jsx                     # Entry, mounts <App />
│   ├── App.jsx                      # Router + providers + error boundary
│   ├── routes/                      # Route components (lazy-loaded)
│   │   ├── Home.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── AIGeneratorPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── FAQPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   ├── TermsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── components/
│   │   ├── layout/                  # Navbar, MobileDrawer, Footer, Layout
│   │   ├── sections/                # Hero, Services, Pricing, FAQ, etc.
│   │   ├── forms/                   # RequestForm (react-hook-form + zod)
│   │   ├── modals/                  # RequestModal
│   │   └── ui/                      # Button, Field, Modal, Spinner, …
│   ├── context/                     # ToastContext
│   ├── hooks/                       # useDisclosure, useSEO, useCountUp, …
│   ├── icons/                       # Centralized icon exports (Lucide)
│   ├── data/                        # Services, pricing, FAQ, testimonials
│   ├── lib/
│   │   ├── api/generateImage.js     # Browser-side fetch wrapper
│   │   ├── validation/              # zod schemas
│   │   └── env.js                   # Validates VITE_* env
│   └── styles/
│       ├── index.css                # Imports everything
│       ├── tokens.css               # Design tokens (CSS vars)
│       ├── globals.css              # Reset + base typography
│       ├── animations.css           # Keyframes
│       ├── layout.css               # Navbar, Footer, page wrapper
│       ├── components.css           # Buttons, forms, modal, toast, drawer
│       └── sections.css             # Section-specific styles
├── index.html                       # Entry HTML + SEO meta
├── vite.config.js                   # Includes /api dev middleware
└── .env.example
```

---

## Features

### Core marketing site

- **Home** — hero, trust bar, how-it-works, services, AI generator, stats, why-us, testimonials, FAQ, CTA
- **Services** — dedicated page with all six service categories
- **Pricing** — Starter / Pro / Agency plans
- **About** — story, values, stats, testimonials
- **FAQ** — detailed accordion
- **Contact** — inline brief form + direct contact details
- **Privacy / Terms** — legal pages
- **404** — custom not-found page

### AI image generator (free)

- 6 preset prompts to try instantly
- Server-side Hugging Face proxy (token never reaches the browser)
- Request rate-limiting (10/min per IP)
- LocalStorage history of your last 8 generations
- Enter-to-generate, Abort on resubmit, proper loading/error states

### UX & accessibility

- Mobile drawer navigation (Esc to close, body-scroll lock, focus management)
- Request modal with focus trap, Esc-to-close, restore-focus-on-close
- Toast notifications (replacing `alert()`)
- Form validation with inline, screen-reader-friendly error messages
- Skip-to-content link, `aria-*` labels throughout, `prefers-reduced-motion`
- Semantic landmarks (`<main>`, `<nav>`, `<footer>`)

### Technical foundations

- Route-level code splitting with `React.lazy` and `Suspense`
- Runtime env validation with zod (fails loud with a helpful message)
- Global error boundary with dev-only stack trace
- Animated stat counters that respect `prefers-reduced-motion`
- Tree-shaken Lucide icons via a centralized re-export
- Stateful CSS scroll-lock that handles overlapping modals safely

### SEO

- Unique `<title>` and meta per route via `useSEO`
- Open Graph & Twitter card meta
- `robots.txt` and `sitemap.xml` in `public/`

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values you need.

### Server-only (no `VITE_` prefix — never reaches the browser)

| Variable      | Description                                   | Default                                      |
| ------------- | --------------------------------------------- | -------------------------------------------- |
| `HF_TOKEN`    | Hugging Face API token with inference access  | _none — required for AI generation_          |
| `HF_MODEL`    | Text-to-image model                           | `stabilityai/stable-diffusion-xl-base-1.0`   |
| `HF_PROVIDER` | Inference provider                            | `fal-ai`                                     |

### Public (`VITE_*` — safe to ship)

| Variable             | Description        | Default              |
| -------------------- | ------------------ | -------------------- |
| `VITE_APP_URL`       | Canonical site URL | _(optional)_         |
| `VITE_CONTACT_EMAIL` | Contact address    | `hello@vibeflow.app` |
| `VITE_BRAND`         | Brand name         | `Vibe Flow`          |

---

## Deployment

### Vercel (recommended)

`api/generate-image.js` is a standard Vercel serverless function — Vercel will pick it up automatically.

```bash
vercel
# set HF_TOKEN in the Vercel dashboard → Project → Settings → Environment Variables
```

### Netlify

Move `api/generate-image.js` to `netlify/functions/generate-image.js` and adapt the signature (`export default async (req)` with a `Response` return). Update `/api/generate-image` redirects in `netlify.toml`.

### Static hosting (no API)

The marketing site and forms work fine without an API, but the AI generator will return a 503 with a helpful "Not configured" message.

---

## Contributing / next steps

The codebase is intentionally small and readable. Likely next steps:

- Stripe Checkout integration behind the pricing CTAs
- Real submission backend (persist requests, email notifications)
- Admin dashboard for reviewing requests
- Dark/light theme toggle (tokens are already split)
- Playwright E2E tests (Playwright is already installed)

---

Built with care. Submit a request anytime.
