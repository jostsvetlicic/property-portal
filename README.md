# Estate Platform

A production-grade, **resellable luxury real-estate platform**. One codebase ships
two completely different public experiences, and the entire site re-skins from a
single config file — so it can be cloned and sold to any agency.

The live demo agency is **Adriatic Estates** (trophy properties on the Adriatic
coast), seeded with 18 listings and 4 advisors.

---

## Two things make this special

### 1. Dual mode — one switch, two front-ends

A single value flips the whole public site between two designs that share the
same backend, listings, agents and inquiries:

| | **Portal** | **Boutique** |
|---|---|---|
| Built for | Hundreds of listings | 10–30 trophy properties |
| Home | Big search hero | Cinematic CTA hero |
| Nav | Sticky → turns into a search bar on scroll | Minimal, transparent |
| Listings | Dense grid + filters + map with pins | Large cinematic arched cards |
| Detail | Gallery, specs, map, agent, inquiry | + immersive scroll storytelling |

Set it in `config/agency.config.ts` (`mode: "portal" | "boutique"`) **or** flip it
live in the admin **Settings** page — no redeploy needed.

### 2. Re-skinnable — clone, edit one file, done

Everything branding-related (name, wordmark, colors, accent, fonts, contact,
default mode) lives in **`config/agency.config.ts`**. Colors are injected as CSS
variables, so changing a hex re-skins every screen. To brand a new agency:

```bash
# 1. clone, 2. edit config/agency.config.ts, 3. reseed, 4. deploy
npm run seed
```

The admin can further override name/logo/colors/contact/mode at runtime (stored
in the DB), so live changes work even on read-only production filesystems.

---

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first theming, re-skinned via injected CSS variables)
- **Prisma** — SQLite in dev, Postgres-ready for production
- **Custom JWT auth** (`jose` + `bcryptjs`) — Edge-safe middleware, no heavy deps
- **Vercel Blob** for property photo uploads
- **Leaflet + OpenStreetMap** (CARTO tiles) for maps — no API key
- Lightweight custom **i18n** (English + Slovenian, cookie-based switch)

---

## Getting started

```bash
# 1. Install
npm install

# 2. Environment — copy the example and fill in values
cp .env.example .env
#    - set AUTH_SECRET (openssl rand -base64 32)
#    - set ADMIN_EMAIL / ADMIN_PASSWORD (your first admin login)

# 3. Create the database + seed demo data (18 listings, 4 agents, admin, settings)
npm run db:push
npm run seed

# 4. Run
npm run dev
```

Open <http://localhost:3000>. Admin console is at
<http://localhost:3000/admin> (log in with the `ADMIN_*` credentials from `.env`).

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | `file:./dev.db` locally; Postgres URL in prod |
| `AUTH_SECRET` | yes | Signs the admin session JWT. Use a long random string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed only | Creates the first admin on `npm run seed` |
| `BLOB_READ_WRITE_TOKEN` | prod uploads | Vercel Blob token for photo uploads |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical URL for sitemap/robots |

> **Photo uploads:** without `BLOB_READ_WRITE_TOKEN`, the admin image manager
> falls back to pasting image URLs (great for local demos). Set the token to
> enable file uploads to Vercel Blob.

---

## Admin console (`/admin`)

- **Dashboard** — portfolio stats, recent inquiries, quick actions
- **Properties** — list, create, edit, delete; multi-photo upload + reorder
- **Agents** — inline CRUD
- **Inquiries** — property + contact leads, read/unread, delete
- **Settings** — switch mode, edit brand name/logo/colors/contact live

All admin routes are guarded by Edge middleware; API mutations re-check the
session server-side.

---

## Re-skin checklist (per agency)

1. Edit `config/agency.config.ts` — name, `logoText`, `tagline`, `contact`,
   `theme.colors`, `theme.fonts`, `mode`, `locales`.
2. `npm run seed` (writes the config defaults into the DB Settings row and
   reseeds demo content — replace demo content via the admin afterwards).
3. Swap the seed's placeholder imagery for the agency's real photography, or
   upload through the admin.
4. Deploy.

Fonts use Google Fonts family names via `next/font` — set `display` / `body` in
the config to any Google font.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. **Database:** create a Postgres database (Vercel Postgres, Neon, Supabase…),
   then in `prisma/schema.prisma` set `datasource.provider = "postgresql"` and
   set `DATABASE_URL` in Vercel. Optionally switch the `features` field to a
   native `String[]` on Postgres (it's stored as a JSON string for SQLite
   portability).
4. **Blob:** add a Vercel Blob store — `BLOB_READ_WRITE_TOKEN` is injected
   automatically.
5. Set `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL` env vars.
6. Run migrations + seed against the production DB
   (`prisma migrate deploy` / `npm run seed`).

Build command is `prisma generate && next build` (already set). `postinstall`
runs `prisma generate`.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run seed` | Seed demo data + admin + settings from the config |
| `npm run db:push` | Push the schema to the database (dev) |
| `npm run db:migrate` | Create a dev migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset the database (destructive) |

---

## Project structure

```
config/agency.config.ts   ← the ONE re-skin file
prisma/                    schema + seed (18 listings, 4 agents)
messages/                  en + sl UI dictionaries
src/
  app/(public)/            public site (mode-routed pages)
  app/admin/               login + guarded admin console
  app/api/                 auth, inquiries, upload, CRUD routes
  components/shared|portal|boutique|admin
  lib/                     settings, theme, auth, i18n, queries, blob…
  middleware.ts            admin route guard (Edge)
```

The public pages are thin routers: each reads the effective mode and renders the
Portal or Boutique component tree, so neither design is compromised by
conditionals.
