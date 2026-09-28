// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: confirm production domain with client
  site: 'https://www.azurecontracting.ie',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    // Cast: @tailwindcss/vite and Astro can ship different Vite type versions (type-only mismatch)
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
