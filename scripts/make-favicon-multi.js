// Generate a multi-size favicon.ico from public/nebula-icon.jpg
// Requires: sharp and png-to-ico
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// png-to-ico is ESM; import dynamically
async function importPngToIco() {
  try {
    const mod = await import('png-to-ico');
    return mod.default || mod;
  } catch (err) {
    console.error('Failed to import png-to-ico:', err);
    process.exit(1);
  }
}

async function makeMultiIco() {
  const src = path.resolve(__dirname, '..', 'public', 'nebula-icon.jpg');
  const out = path.resolve(__dirname, '..', 'public', 'favicon.ico');

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  try {
    const sizes = [16, 32, 48, 64];
    const buffers = await Promise.all(
      sizes.map((s) => sharp(src).resize(s, s, { fit: 'cover' }).png().toBuffer())
    );

    const pngToIco = await importPngToIco();
    const ico = await pngToIco(buffers);
    fs.writeFileSync(out, ico);
    console.log('Wrote', out);
  } catch (err) {
    console.error('Failed to generate multi ICO:', err);
    process.exit(1);
  }
}

makeMultiIco();
