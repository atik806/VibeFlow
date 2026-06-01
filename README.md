# VibeFlow

A full-service digital agency website with AI-powered tools, client dashboard, and admin panel. Built with React 19 and deployed on Vercel.

**Live:** https://vibeflow.app

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Custom CSS with design tokens (no Tailwind/CSS-in-JS) |
| Backend (API) | Vercel serverless functions (`api/`) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI Inference | Hugging Face Inference API (Stable Diffusion 3.5, FLUX.1-dev) |
| Object Detection | Python FastAPI + YOLOv8 (separate service) |
| CI/CD | GitHub Actions → Vercel prebuilt deploys |
| Monitoring | Sentry (client + server) |

## Packages

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.5 | UI framework |
| `react-dom` | ^19.2.5 | DOM rendering |
| `react-router-dom` | ^7.14.2 | Client-side routing |

### Data & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.104.1 | Supabase client (database + auth) |
| `zod` | ^4.3.6 | Schema validation (env, forms, API) |
| `@hookform/resolvers` | ^5.2.2 | Zod resolver for react-hook-form |
| `react-hook-form` | ^7.73.1 | Form state management |

### AI & Media

| Package | Version | Purpose |
|---------|---------|---------|
| `@huggingface/inference` | ^4.13.15 | Hugging Face Inference API client |
| `jspdf` | ^4.2.1 | PDF generation |
| `maplibre-gl` | ^5.19.0 | Map rendering (Map Poster feature) |
| `react-colorful` | ^5.6.1 | Color picker component |

### UI & Animation

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | ^12.38.0 | Page/section animations |
| `lucide-react` | ^1.9.0 | Icon library |
| `react-icons` | ^5.5.0 | Extended icon set |
| `typed.js` | ^3.0.0 | Typing animation (hero section) |

### Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| `@sentry/react` | ^10.55.0 | Client-side error tracking |
| `@sentry/node` | ^10.55.0 | Server-side error tracking |

### Infrastructure

| Package | Version | Purpose |
|---------|---------|---------|
| `better-sqlite3` | ^12.9.0 | Local SQLite for object detection metadata |
| `rollup` | ^4.59.0 | Build chunks |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | Vite React integration |
| `vite` ^8.0.9 | Build tool / dev server |
| `typescript` ^5.9.3 | Type checking |
| `eslint` + plugins | Linting |
| `@playwright/test` | E2E testing |
| `@fontsource/*` | Web fonts (Bebas Neue, Lato, Merriweather, Montserrat, Noto Sans JP, Oswald, Playfair Display, Raleway, Source Sans Pro) |

## Auth Guards

The project uses two separate authentication systems with corresponding route guards:

### 1. User Guard (`UserGuard`) — Supabase Auth

**File:** `src/components/auth/UserGuard.jsx`

- Protects client-facing routes that require login (dashboard, AI tools, etc.)
- Uses **Supabase Auth** (email/password + OAuth via Google/GitHub)
- PKCE flow for secure OAuth callbacks
- Checks `user` from `AuthContext` (backed by Supabase session)
- Redirects unauthenticated users to `/login`

**Protected routes:**
- `/dashboard` — Client dashboard
- `/ai-generator`, `/play-with-ai`, `/cv-with-ai`, `/object-detection`, `/games` — AI tools
- `/map-poster` — Map poster generator

**Flow:**
```
UserGuard
 ├─ loading → <Spinner />
 ├─ !user   → redirect to /login
 └─ user    → render children / <Outlet />
```

**Auth Provider:** `src/context/AuthContext.jsx`
- Provides: `user`, `session`, `loading`, `signIn`, `signUp`, `signInWithOAuth`, `signOut`, `ensureProfileExists`
- Subscribes to `supabase.auth.onAuthStateChange`
- Handles profile creation on sign-up (upsert into `profiles` table)

### 2. Admin Guard (`AdminGuard`) — Password-based / JWT

**File:** `src/components/admin/AdminGuard.jsx`

- Protects admin dashboard routes
- Uses **sessionStorage-based auth** (password check or JWT from server)
- Default password: `admin123` (override via `VITE_ADMIN_SECRET`)
- On login: tries server-side `/api/auth` first, falls back to client-side password comparison
- JWT token is stored in sessionStorage for API requests
- Redirects unauthenticated users to `/admin/login`

**Protected routes:**
- `/admin` — Admin dashboard
- `/admin/requests` — Manage project requests
- `/admin/messages` — View contact messages
- `/admin/settings` — Panel settings

**Flow:**
```
AdminGuard
 ├─ !isAdminAuthenticated() → redirect to /admin/login
 └─ authenticated          → render children
```

**Admin Auth module:** `src/lib/adminAuth.js`
- `isAdminAuthenticated()` — checks sessionStorage flag
- `setAdminAuthenticated(value, token)` — stores/clears auth state
- `getAdminToken()` — retrieves JWT for API calls

### Guard Comparison

| Feature | UserGuard | AdminGuard |
|---------|-----------|------------|
| **Auth method** | Supabase Auth (PKCE) | Password + JWT |
| **Storage** | Supabase session (HTTP-only cookie) | sessionStorage |
| **Persistence** | Survives tab close (cookie) | Session-only |
| **Auth provider** | Supabase Auth (email/OAuth) | Vercel API route |
| **Default credentials** | User sign-up | `admin123` |
| **Rate limiting** | Supabase handles | Exponential backoff on client |
| **RLS applied** | Yes (Supabase Row Level Security) | Via service role in admin API |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `VITE_ADMIN_SECRET` | No | Admin password (default: `admin123`) |
| `VITE_BRAND` | No | Brand name (default: VibeFlow) |
| `VITE_CONTACT_EMAIL` | No | Contact email |
| `VITE_APP_URL` | No | Canonical app URL |
| `HF_TOKEN` | Server-only | Hugging Face API token |

## Local Development

```bash
npm install
cp .env.example .env   # fill in Supabase credentials
npm run dev            # starts Vite + optional Python AI services
```

## Database

Supabase PostgreSQL with Row Level Security. Key tables:
- `project_requests` — Form submissions from the site
- `client_messages` — Two-way communication (client ↔ admin)
- `request_updates` — Status change timeline
- `visitor_sessions` — Real-time visitor tracking
- `profiles` — Extended user profiles
- `requests` — Legacy AI image generation requests
- `error_logs` — Application error tracking

See `supabase-schema.sql` for full schema and RLS policies.

## Deployment

Pushes to `main` trigger GitHub Actions → Vercel prebuilt deploys.
Configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` in GitHub Secrets.
