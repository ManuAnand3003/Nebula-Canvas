Generating favicon.ico from nebula-icon.jpg

This project includes `public/nebula-icon.jpg` and uses it as the site's favicon via `src/app/layout.tsx`.

To generate a proper `favicon.ico` file from the JPG (recommended for best cross-browser support), run the following on Windows PowerShell from the project root:

```powershell
# from project root
npm install sharp
node .\scripts\make-favicon.js
```

Notes:
- The script uses `sharp` to resize and write a favicon. If you need a true multi-image ICO, consider using the `png-to-ico` package instead.
- After generating `public/favicon.ico`, browsers may still use cached favicons. Do a hard refresh or open an incognito window to verify changes.
