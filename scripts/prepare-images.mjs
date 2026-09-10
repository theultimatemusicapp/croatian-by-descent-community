import { readdir } from 'node:fs/promises';
import sharp from 'sharp';
for (const file of await readdir('public/images')) {
  if (file.endsWith('.webp') && !file.endsWith('-small.webp')) {
    await sharp('public/images/' + file)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile('public/images/' + file.replace('.webp', '-small.webp'));
  }
}
