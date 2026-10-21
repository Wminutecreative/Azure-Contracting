import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** A page's share image: the photo cropped to 1200 × 630 JPG (OG / Twitter card, and the WebPage's
 *  primaryImageOfPage in JSON-LD). Use a source at least 1200px wide so it isn't upscaled. */
export async function ogImageFor(src: ImageMetadata) {
  const img = await getImage({ src, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
  return img.src;
}
