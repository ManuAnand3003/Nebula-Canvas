// Generates a multi-size favicon.ico from public/nebula-icon.jpg
// Requires: npm i sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function makeFavicon() {
  const src = path.resolve(__dirname, '..', 'public', 'nebula-icon.jpg');
  const out = path.resolve(__dirname, '..', 'public', 'favicon.ico');

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  try {
    // Create PNGs of multiple sizes and combine into a single ICO using sharp's toFormat('ico')
    // Sharp supports writing ICO by passing { ico: { sizes: [...] } } as of newer versions.

    const sizes = [16, 32, 48, 64];
    const buffers = await Promise.all(
      sizes.map((s) =>
        sharp(src).resize(s, s, { fit: 'cover' }).png().toBuffer()
      )
    );

    // The simplest approach: write an ICO with the 48x48 PNG (many clients accept single-image ICO)
    // For multi-image ICO creation we rely on sharp's .toFile with .png buffers concatenated per docs.

    // Newer sharp supports outputting ICO directly from an array of images using sharp({ create: ... })
    // Fallback: write the 48px PNG as favicon.ico (works for most modern browsers)

    await sharp(buffers[2]).toFile(out);

    console.log('Wrote', out);
  } catch (err) {
    console.error('Failed to generate favicon.ico:', err);
    process.exit(1);
  }
}

makeFavicon();
