# WoW Soulmate

Bilingual (EN/DE) landing page for the WoW Soulmate chronicle experience, built with Next.js 16, React 19 and Tailwind CSS 4.

## Local development

```bash
npm install
npm run dev
```

The app is served at http://localhost:3000 and redirects to the default locale (`/en`). Supported locales: `en`, `de`.

## Production build

```bash
npm run build
npm start
```

## Deployment (Vercel)

The project is zero-config on Vercel; [vercel.json](vercel.json) pins the framework preset and the `fra1` region.

1. Import `t3bld/wow-soulmate` at https://vercel.com/new.
2. Keep the detected settings (build: `next build`, install: `npm install`).
3. Optionally set `NEXT_PUBLIC_SITE_URL` to the production domain so absolute Open Graph URLs resolve to it; otherwise the Vercel-provided production URL is used.

Pushes to `main` deploy to production, every other branch gets a preview deployment.
