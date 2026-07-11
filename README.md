# Stub — a URL shortener with real analytics

A small, full-stack URL shortener: paste a long link, get a short one back,
optionally create an account to see click analytics (trend, referrers,
countries, devices), edit or disable links, and download a QR code.

Built as a portfolio project — scoped deliberately small so the whole thing
fits in your head and is easy to explain in an interview.

## Stack

- **Next.js 14 (App Router) + TypeScript** — one app serves the marketing
  page, the dashboard, the JSON API, and the redirect route itself.
- **SQLite via `better-sqlite3`** — a single file database (`data/app.db`),
  zero setup, synchronous queries (no async/await ceremony for simple reads).
- **Tailwind CSS** for styling.
- **JWT session cookie** for auth (email + password, `bcryptjs` for hashing).
- **`qrcode`** for QR generation, **`recharts`** for the click chart.

No external services required to run it: no database server, no email
provider, no cloud account. `npm install && npm run dev` is the whole setup.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit SESSION_SECRET
npm run dev
```

Open http://localhost:3000. The SQLite file is created automatically at
`data/app.db` on first run.

To generate a real secret:
```bash
openssl rand -hex 32
```

## What's implemented (MVP scope)

Matches the "must-have" list from the PRD, minus the items explicitly
deferred below:

- [x] Shorten a URL, no sign-up required
- [x] Anonymous links persist (stored regardless of who created them)
- [x] Optional account (email + password)
- [x] Link dashboard (list, total clicks per link)
- [x] Click analytics: total clicks, 30-day trend, top referrers, top
      countries, device breakdown
- [x] Copy-to-clipboard
- [x] QR code generation + download
- [x] Edit destination URL
- [x] Disable / re-enable a link (soft delete — history is preserved)
- [x] Basic open-redirect / malware protection (scheme allowlist + denylist)
- [x] Redirects handled server-side with click tracking

**Deliberately out of scope for this pass** (same cuts the PRD makes for v1,
plus a couple more to keep the project explainable):
- Custom back-halves, team workspaces, custom domains, public API, bulk
  shortening, webhooks, bio pages, A/B testing — all listed as "v2" in the
  PRD's own scope-cut section.
- Magic-link email auth — replaced with email + password so the project
  runs with zero external accounts. Swapping this in later only touches
  `src/lib/auth.ts` and the two auth routes.
- Edge caching / global sub-100ms redirects, Kafka click ingestion,
  ClickHouse analytics warehouse — the PRD's target architecture for
  10M+ redirects/month. This build reads/writes SQLite directly on every
  request, which is the right trade for a portfolio project's traffic and
  a much shorter story to tell an interviewer.

## Project structure

```
src/
  app/
    page.tsx                 marketing/landing page + shorten form
    [slug]/route.ts           the redirect route (the "hot path")
    login/, signup/           auth pages
    dashboard/                link list
    dashboard/[id]/           link detail + analytics + QR
    gone/                     shown for disabled/missing links
    api/
      shorten/                 create a link (anonymous or authed)
      auth/{signup,login,logout,me}/
      links/                   list (GET)
      links/[id]/               detail+analytics (GET), edit (PATCH), disable (DELETE)
      links/[id]/qr/             QR code PNG
  components/                 UI: Dashboard, LinkRow, LinkDetail, ClicksChart, etc.
  lib/
    db.ts                     SQLite connection + schema (source of truth for the data model)
    auth.ts                   password hashing, JWT session cookie
    links.ts / users.ts       all SQL queries live here
    urlSafety.ts              scheme allowlist + denylist check
    slug.ts                   short code generation
    rateLimit.ts               in-memory per-IP rate limit on /api/shorten
```

## How a redirect works

1. `GET /:slug` hits `src/app/[slug]/route.ts`.
2. It looks up the slug in SQLite. If missing or disabled, redirect to `/gone`.
3. Otherwise it records a `click` row (referrer host, coarse device type
   from the user agent, country from a platform geo header if present) and
   issues a `302` redirect to the destination.
4. Analytics reads later aggregate straight from the `clicks` table with
   `GROUP BY` queries — no separate rollup job, since SQLite handles this
   volume of clicks without one.

## Data model

Three tables: `users`, `links`, `clicks`. See `src/lib/db.ts` for the exact
schema — it's short enough to read end to end in under a minute, which is
useful when you're describing the project live.

## Talking points for an interview

- **Why SQLite over Postgres?** For a single-instance demo project, it
  removes a whole category of setup (connection strings, a hosted DB, migrations
  tooling) with no user-facing downside. The data-access layer
  (`src/lib/links.ts`) is the only place that would need to change to swap
  in Postgres — the SQL is close to standard, and the rest of the app talks
  to those functions, not to the database directly.
- **Why 302 instead of 301 redirects?** 301s get cached by the visitor's
  browser, which is great for latency but means an edited or disabled link
  can stay broken in a return visitor's cache. I chose the more forgiving
  302 for this build; a production system serving billions of redirects
  would likely default to 301 with cache-busting on edit.
- **Where's the biggest simplification vs. a "real" v1?** The redirect path.
  Production-scale shorteners put this behind an edge cache (Cloudflare
  Workers + KV in the original spec) so the origin database is barely
  touched. Here every redirect is a direct SQLite read — completely fine at
  demo scale, and it's an easy, concrete thing to point at when asked "how
  would this scale to 10M links?"
- **Security basics covered:** password hashing (bcrypt), httpOnly signed
  session cookies, scheme allowlisting on submitted URLs (blocks
  `javascript:`/`data:` payloads), a small denylist for private/local
  addresses, and per-IP rate limiting on link creation.

## Scaling this up

If you want to extend this toward the full PRD, the natural next steps in
order of effort are: (1) swap SQLite for Postgres, since the query layer is
already isolated in `src/lib/`; (2) move the redirect route to an edge
runtime with a KV-style cache in front of it; (3) replace inline click
writes with a queue + async aggregation job once write volume matters;
(4) add magic-link auth via an email provider like Resend.

## License

MIT — do whatever you'd like with it.
