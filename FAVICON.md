Favicon generation and troubleshooting

Overview
--------
This repository ships `public/nebula-icon.jpg` and the app-level layout already includes a fallback link to that image. Many browsers (and some integrations) still expect a `public/favicon.ico` file in the root for best compatibility.

What we added
--------------
- `scripts/make-favicon.js` — simple Node script that uses `sharp` to generate a single-icon `favicon.ico` from `public/nebula-icon.jpg`.
- `scripts/make-favicon-multi.js` — a newer script that generates a multi-resolution ICO (16/32/48/64) using `sharp` + `png-to-ico` (handles ESM import via dynamic import).
- `scripts/favicon-hash.js` — computes a short md5 hash of `public/favicon.ico` for cache-busting.
- `package.json` scripts:
	- `make:favicon` — runs the simple generator.
	- `make:favicon:multi` — runs the multi-ICO generator.
	- `favicon:hash` — prints an 8-character hash for the generated favicon.
	- `make:favicon:all` — runs the multi generator then the hash (used to update `src/app/layout.tsx` with a cache-busting query string).

Quick start (Windows PowerShell)
--------------------------------
1. Install dependencies (if not already installed):

```powershell
npm install
```

2. Generate a multi-resolution favicon and compute a short hash:

```powershell
npm run make:favicon:multi
npm run favicon:hash
```

3. Update the link in `src/app/layout.tsx` (if you want manual control):

```tsx
// in src/app/layout.tsx head
<link rel="icon" href="/favicon.ico?v=<short-hash>" />
```

4. Verify in browser:
- Open the site, do a hard refresh (Ctrl+F5) or open in a private/incognito window to avoid cached favicons.

Cache-busting workflow (recommended)
----------------------------------
1. Run `npm run make:favicon:multi` to regenerate `public/favicon.ico`.
2. Run `npm run favicon:hash` and copy the 8-character hash it prints (for example `ce7a424d`).
3. Update `src/app/layout.tsx` to use `/favicon.ico?v=<hash>` as the icon URL or commit the new hash to the repo.
4. Restart the dev server and hard-refresh the browser (or open an incognito window).

Notes about `png-to-ico` and ESM
--------------------------------
`png-to-ico` is published as an ES module. If you attempt to `require('png-to-ico')` in a CommonJS context you'll see an error like `pngToIco is not a function` or other import-related failures. The repository includes `scripts/make-favicon-multi.js` which performs a dynamic `await import('png-to-ico')` (ESM-friendly) to avoid that problem. If you copy that script into other projects, make sure to use the dynamic import or run Node with `--experimental-specifier-resolution=node` and a proper ESM module mode.

Verification checklist
----------------------
- Ensure `public/favicon.ico` exists after running `make:favicon:multi`.
- Confirm `src/app/layout.tsx` contains a link to `/favicon.ico?v=<hash>` or `metadata.icons` referencing the file.
- Restart the dev server and hard refresh the page.

Troubleshooting
---------------
- If the generator fails with ESM import errors, open `scripts/make-favicon-multi.js` and ensure it uses `await import('png-to-ico')`.
- If the dev server still serves an old icon, restart Next (`npm run dev`) and hard refresh the browser.
- If you deploy behind a CDN, purge the CDN cache for `/favicon.ico` or use the cache-busting query string approach above.

Want me to run it here?
----------------------
I can run the generator and print the hash here in this environment. Say "run favicon generator" and I'll execute the scripts and report results (I already ran them earlier and the current short-hash in this workspace is `ce7a424d`).

