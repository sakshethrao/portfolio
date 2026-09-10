# Saksheth Rao — portfolio

Next.js (App Router) · TypeScript · Tailwind v4 · Framer Motion. Static, deploys to Vercel with zero config.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where the content lives

Everything editable is in [`content/`](content/). You should rarely need to touch `components/`.

| File | Holds | Add more by |
|---|---|---|
| `content/site.ts` | Name, socials, email, résumé path, nav, accent colours, hero copy | editing fields |
| `content/projects.ts` | The **Work** index + `/work/[slug]` detail pages | appending a `Project` object (there's a template at the bottom) |
| `content/experiments.ts` | **The Lab** sticky notes | appending an `Experiment` object |
| `content/gallery.ts` | **Travel** gallery | dropping images in `public/gallery/` and appending a `Photo` |
| `content/experience.ts` | About copy + Experience / résumé timeline | editing `about` and `roles` |

Search the repo for `TODO` — every placeholder is marked.

### Adding a project

```ts
{
  slug: "my-thing",              // becomes /work/my-thing
  title: "My Thing",
  tagline: "One line on what it is.",
  status: "LIVE",                // LIVE | BUILDING | EXPERIMENT | ARCHIVED
  category: "Web app",
  period: "2025",
  layout: "panel",              // feature | device | panel | terminal | compact
  tech: ["React", "Supabase"],
  liveUrl: "https://…",
  githubUrl: "https://github.com/…",   // omit if private
  image: "/projects/my-thing.jpg",     // put the file in public/projects/
  caseStudy: { problem: "…", approach: "…", outcome: "…" },
}
```

**Layouts** (the grid is intentionally not uniform):
- `feature` — full-width, custom visual + expandable pipeline (QuantumSight)
- `device` — full-width split: an iOS phone frame beside the copy (Nurture). Put screenshots in `public/<slug>/` and list them in `screens: []`
- `panel` — half-width card with an image
- `terminal` — half-width card whose visual is a monospace block (`terminal: []`)
- `compact` — single-line row, for archived / minor work

Set `private: true` to hide a project without deleting it.

### Adding travel photos

1. Drop files in `public/gallery/`
2. Append to `photos` in `content/gallery.ts`:

```ts
{ src: "/gallery/kyoto-01.jpg", place: "Fushimi Inari at dawn",
  location: "Kyoto, Japan", date: "Nov 2024", span: 1, width: 1600, height: 1067 }
```

`span: 2` promotes a photo to a wide feature cell. `width`/`height` are the real pixel dims so the grid reserves space and nothing shifts on load.

### Résumé

Drop the PDF at `public/saksheth-rao-resume.pdf` (or change `site.resume.file`). `/resume` gives view + download.

## Design notes

Tokens live at the top of `app/globals.css` (`--ink`, `--paper`, `--accent`, …). The accent colour is a live picker (hero swatches, persisted to `localStorage`); it drives `--accent` everywhere.

Fonts: **Sora** (display), **JetBrains Mono** (labels/meta), system sans (body).

## Deploy

Push to GitHub, import in Vercel, done. No env vars. Set the real domain in `app/layout.tsx` (`url`) for correct SEO metadata.
