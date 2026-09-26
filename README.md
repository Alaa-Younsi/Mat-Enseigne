# Mat Enseigne — site vitrine

Site vitrine de **Mat Enseigne** (enseignes, adhésifs & marquage véhicules — Paris).
Home page + before/after **portfolio** (`/portfolio`) + quote-wizard **contact** page (`/contact`) + legal page, with animated page transitions. Built for speed, accessibility and a premium feel.

## Stack

| Concern         | Choice                                                         |
| --------------- | -------------------------------------------------------------- |
| Runtime / PM    | [Bun](https://bun.sh)                                          |
| Build           | Vite 8                                                         |
| UI              | React 19 + TypeScript (strict, `exactOptionalPropertyTypes`)   |
| Styling         | Tailwind CSS v4 (design tokens in `src/styles/globals.css`)    |
| Motion          | Motion (`motion/react`) + Lenis smooth scroll                  |
| Routing         | React Router (data router, lazy legal page)                    |
| Forms           | react-hook-form + zod → pre-filled WhatsApp message            |
| Lint / format   | Biome                                                          |
| Tests           | Vitest                                                         |
| Hosting         | Vercel (SPA rewrites, immutable asset caching, security headers) |

## Getting started

```bash
bun install
bun run dev        # http://localhost:5173
```

| Script              | What it does                            |
| ------------------- | --------------------------------------- |
| `bun run dev`       | Dev server with HMR                     |
| `bun run build`     | Type-check + production build → `dist/` |
| `bun run preview`   | Serve the production build locally      |
| `bun run typecheck` | TypeScript only                         |
| `bun run lint`      | Biome lint + format check               |
| `bun run lint:fix`  | Apply safe Biome fixes                  |
| `bun run format`    | Format with Biome                       |
| `bun run test`      | Unit tests (Vitest)                     |
| `bun run images`    | Optimise portfolio before/after photos  |

## Project structure

```
src/
├─ config/site.ts        ← business info (name, phone, WhatsApp, Instagram, zone)
├─ data/                 ← all page copy: services, projects, process, FAQ
├─ components/
│  ├─ layout/            ← Header, Footer, Preloader, SmoothScroll, WhatsApp button…
│  └─ ui/                ← Buttons, Img, Reveal, Marquee, Lightbox, shapes…
├─ sections/             ← one file per home-page section
├─ pages/                ← Home, Portfolio, Contact, Mentions légales, 404
├─ hooks/                ← useScrollTo, useSiteLink, usePageMeta, useScrollRange, useMediaQuery
├─ lib/                  ← cn, image helpers, WhatsApp link builder (+ tests)
└─ styles/globals.css    ← Tailwind v4 theme: palette, fonts, utilities
scripts/portfolio-images.ts ← `bun run images` pipeline
portfolio-originals/     ← raw before/after photos (git-ignored)
public/
├─ images/               ← optimised WebP, two widths each (800 / 1600)
│  └─ portfolio/         ← generated before/after pairs
├─ og-image.jpg          ← 1200×630 social share card
└─ favicon.svg, icons, site.webmanifest
```

## Portfolio (avant / après)

1. Create one folder per project in **`portfolio-originals/`**, named in lowercase-with-dashes, containing
   exactly two photos: `avant.jpg` and `apres.jpg` (jpg, png, webp, avif or tif — any size, straight from the phone):

   ```
   portfolio-originals/
   └─ boulangerie-paris-11/
      ├─ avant.jpg
      └─ apres.jpg
   ```

2. Run **`bun run images`**. It fixes phone orientation, crops the "avant" photo to the exact framing of the
   "après" photo so both line up in the slider, and writes optimised WebP files to `public/images/portfolio/`
   plus their dimensions to `src/data/portfolio-images.generated.ts`.
3. Describe the project in **`src/data/portfolio.ts`** (same `slug` as the folder; newest first).
   The first project also appears in the home-page teaser. Delete the four `demo-…` entries (and their folders) once real projects exist.

Tip: shoot "avant" and "après" from the same spot and angle — the slider looks best when the façade lines up.
Originals are git-ignored; only the optimised files are committed.

## Contact forms

Both forms (home page and the `/contact` wizard) validate the request, then open **WhatsApp** with a
pre-written message addressed to Mat Enseigne — the visitor just presses "Envoyer". No server, no API keys.

Built-in protections (`src/lib/spam-guard.ts`, `src/lib/whatsapp.ts`):
- strict validation (zod) with length caps on every field
- input sanitising — invisible / bidi / control characters stripped, whitespace collapsed
- off-screen honeypot field (bots fill it; nothing opens)
- minimum fill time (3 s) and link-spam filter
- per-browser limit: 3 requests / 10 min
- strict Content-Security-Policy and security headers (`vercel.json`)

Because the message is sent from the visitor's own WhatsApp account, bots cannot deliver spam through the site.

## Editing content

- **Phone / WhatsApp / Instagram** → `src/config/site.ts`
- **Services, gallery, process steps, FAQ** → `src/data/*.ts`
- **Before/after projects** → `src/data/portfolio.ts` (see above)
- **Photos** → drop `name-800.webp` and `name-1600.webp` into `public/images/`, then reference `name` in the data files.
  Tip: `cwebp -q 72 -resize 1600 0 photo.jpg -o name-1600.webp`

Colours come from the brand moodboard (Pantone P 15-2 C crème, P 95-16 C aubergine, P 30-8 C ember) and live as tokens (`cream-*`, `plum-*`, `ember-*`) in `globals.css`.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Vercel detects Bun from `bun.lock`; build settings come from `vercel.json`.
3. Add the environment variable **`VITE_SITE_URL`** (e.g. `https://www.mat-enseigne.fr`, no trailing slash) for Production. It feeds the canonical URL, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt`.
4. Deploy, then attach the custom domain under **Settings → Domains**.

## Before going live — client checklist

- [ ] Replace the text wordmark with the official logo (`src/components/ui/Wordmark.tsx`, `public/favicon.svg`, icons).
- [ ] Replace the 4 demo before/after projects with real ones (`portfolio-originals/` → `bun run images` → `src/data/portfolio.ts`).
- [ ] Replace the reference photos in the gallery with Mat Enseigne's own projects (`src/data/projects.ts`).
- [ ] Complete the bracketed company details in `src/pages/LegalPage.tsx` (SIRET, address, publication director…).
- [ ] Confirm the copy and claims in `src/data/content.ts` (delays, zone, commitments).
- [ ] Add a contact e-mail to `src/config/site.ts` if the client wants one displayed.
- [ ] Set `VITE_SITE_URL` in Vercel once the domain is known.

## Image credits

Reference photography from [Unsplash](https://unsplash.com) (Unsplash License — free for commercial use).
