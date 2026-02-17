import { readdir } from 'node:fs/promises';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COVERS_DIR = join(__dirname, '..', 'public', 'covers');
const MAX_SIZE = 800;
const QUALITY = 80;

async function optimizeCovers() {
  const files = await readdir(COVERS_DIR);
  const jpgs = files.filter(f => /\.jpe?g$/i.test(f));

  if (jpgs.length === 0) {
    console.log('No JPG files found in public/covers/');
    return;
  }

  console.log(`Converting ${jpgs.length} JPG covers to WebP…`);

  let converted = 0;
  let skipped = 0;

  for (const file of jpgs) {
    const input = join(COVERS_DIR, file);
    const output = join(COVERS_DIR, basename(file, extname(file)) + '.webp');

    try {
      await sharp(input)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(output);
      converted++;
    } catch (err) {
      console.error(`  Failed: ${file} — ${err.message}`);
      skipped++;
    }
  }

  console.log(`Done: ${converted} converted, ${skipped} failed`);
}

optimizeCovers();
