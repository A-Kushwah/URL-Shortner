# Stub — a tiny URL shortener I built

I wanted a simple project that could shorten links, keep track of clicks, and still be small enough to understand end to end. This started as a side project, and I kept the scope focused so I could actually finish it.

The app lets you:

- shorten a long URL in one step
- create an account if you want to save and manage links
- see basic click stats for your links
- edit or disable a link later
- download a QR code for a link

## What I used

- Next.js with TypeScript
- SQLite for the database
- Tailwind for styling
- JWT-based sessions for auth
- bcrypt for password hashing

I wanted to avoid setting up a separate database server or any external services for this version, so the whole thing stays pretty lightweight.

## How to run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

The first run will create the SQLite database file in the data folder automatically.

If you want a real session secret, generate one like this:

```bash
openssl rand -hex 32
```

## What’s in the app

A few things are already working:

- [x] shorten a URL without signing up
- [x] keep anonymous links around even if no account is used
- [x] optional login with email and password
- [x] a dashboard to view links and total clicks
- [x] basic analytics: clicks over time, top referrers, countries, and devices
- [x] copy link, edit destination, disable link, and QR code download
- [x] server-side redirects with click tracking

## Project structure

The project is organized pretty simply:

```text
src/
  app/                main pages and route handlers
  components/         UI pieces like the form, dashboard, and navbar
  lib/                database, auth, link logic, and helpers
```

## How the redirect flow works

When you visit a short link, the app looks up the slug in the database. If the link exists and is still active, it records a click and sends you to the destination URL. If not, it sends you to the fallback page.

That part is intentionally simple, since this version is meant to be easy to build, explain, and demo.

## What I’d improve next

If I keep working on it, the next obvious upgrades would be:

- swap SQLite for Postgres
- move the redirect logic to a faster edge setup
- add better analytics and filtering
- improve the auth flow a bit

## License

MIT.
