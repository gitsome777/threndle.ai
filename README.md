# threndle.ai

The Threndle AI website. React + Vite + Tailwind, deployed as a static site on Cloudflare Pages.

## Run locally

```bash
npm install
npm run dev
```

Serves on http://localhost:3000.

## Build

```bash
npm run build
```

Output goes to `dist/`. That folder is what gets deployed.

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 or later |

`public/_redirects` holds the SPA fallback (`/* /index.html 200`). Without it, a
direct visit to `/diagnostic` returns a 404 — Pages serves static files and knows
nothing about client-side routes.

## Pages

- `/` — landing
- `/diagnostic` — the intake form

## The intake form

`src/pages/Diagnostic.tsx` posts to a **Zoho Bigin** web-to-record form. The Bigin
tokens and field ids live in the `BIGIN` constant at the top of that file.

**Those tokens change every time the webform is rebuilt in Bigin.** If submissions
stop creating records, re-copy them from the form's embed code. Zoho silently
discards values posted under an unknown field name, so a mismatch fails quietly —
there is no error to see.
