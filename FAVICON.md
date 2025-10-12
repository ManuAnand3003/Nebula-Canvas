Favicon generation and troubleshooting

Overview
--------
This repository ships `public/nebula-icon.jpg` and the app-level layout already includes a fallback link to that image. Many browsers (and some integrations) still expect a `public/favicon.ico` file in the root for best compatibility.

What we added
--------------
- `scripts/make-favicon.js` — simple Node script that uses `sharp` (recommended) to generate a favicon from `public/nebula-icon.jpg`.
- `package.json` script `make:favicon` so you can run `npm run make:favicon`.

Quick start (Windows PowerShell)
--------------------------------
1. Install native dependency (sharp):

```powershell
npm install sharp
```

2. Generate `public/favicon.ico` from the project's nebula image:

```powershell
npm run make:favicon
```

3. Verify in browser:
- Open the site, do a hard refresh (Ctrl+F5) or open in a private/incognito window to avoid cached favicons.

Caching and cache-busting tips
-----------------------------
- Browsers aggressively cache favicons. If you update `favicon.ico` but don't see changes, try:
	- Hard-refresh (Ctrl+F5) or open a private window.
	- Rename the favicon to `favicon-<hash>.ico` and update the link tag in `src/app/layout.tsx` or `metadata.icons` so the URL changes.

Next.js app-router metadata
---------------------------
We set `metadata.icons` in `src/app/layout.tsx` so Next handles metadata where supported — this will generate metadata links for the app router. We also left an explicit `<link rel="icon" href="/nebula-icon.jpg" />` in the head as a fallback.

Advanced: true multi-size ICO
----------------------------
The current `scripts/make-favicon.js` writes a single PNG into `public/favicon.ico`. If you need a proper multi-resolution ICO (16/32/48/64), use `png-to-ico` or `icotool`:

Using `png-to-ico`:

```powershell
npm install png-to-ico sharp
node -e "(async()=>{const sharp=require('sharp'), pngToIco=require('png-to-ico'), fs=require('fs'); const src='public/nebula-icon.jpg'; const sizes=[16,32,48,64]; const buffs=await Promise.all(sizes.map(s=>sharp(src).resize(s,s).png().toBuffer())); const ico=await pngToIco(buffs); fs.writeFileSync('public/favicon.ico', ico); console.log('wrote public/favicon.ico')})()"
```

Verification checklist
----------------------
- Ensure `public/favicon.ico` exists after running the script.
- Confirm `src/app/layout.tsx` contains either a link to `/favicon.ico` or `metadata.icons` referencing the file.
- Hard refresh / private window to check the new icon.

If it still doesn't change
--------------------------
1. Confirm the file is in the built `.next`/public output (if running production build).
2. Restart the dev server — Next can serve static files at `/favicon.ico` automatically on dev.
3. Try a different browser or device to see if caching is local.
4. If your hosting provider uses a CDN, purge the CDN cache for `/favicon.ico`.

Want me to run it here?
----------------------
If you want I can run the generator in this environment (install `sharp` and run the script). Say "run favicon generator" and I'll execute it and report results.

