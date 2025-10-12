# Nebula Canvas

Nebula Canvas is a small Next.js app that combines notes, tasks and drawing into a single, lightweight productivity canvas.

Quick start
-----------

1. Install dependencies:

```powershell
npm install
```

2. Start the dev server (default port 9002):

```powershell
npm run dev
```

Open http://localhost:9002 in your browser. The front page includes an interactive Hero canvas and a "Dive In" button that leads to the dashboard sections.

What changed recently
---------------------
- Project title updated to "Nebula Canvas" (was "Firebase Studio").
- Interactive `Hero` component added at `src/components/hero.tsx` and rendered on the front page (`src/app/page.tsx`).
- Sorting UI added to Notes, Tasks and Canvas sections. Preferences are persisted using the `useLocalStorage` hook.
- Favicon generation scripts added — see `FAVICON.md` for details.

Where to look in the code
-------------------------
- Front page: `src/app/page.tsx`
- App layout and metadata (icons/favicons): `src/app/layout.tsx`
- Hero: `src/components/hero.tsx`
- Notes/Tasks/Canvas UI: `src/components/*-section.tsx`

If you'd like, I can run the favicon generation and show the server response for `/favicon.ico` (or open the site in a browser and verify visually).
