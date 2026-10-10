// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: confirm production domain with client
  site: 'https://www.azurecontracting.ie',
  // Pages stay static. The adapter is only needed for the Keystatic admin (/keystatic) and its API,
  // which Keystatic marks as on-demand routes.
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(), // Keystatic's admin UI is a React app
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
  vite: {
    // Cast: @tailwindcss/vite and Astro can ship different Vite type versions (type-only mismatch)
    plugins: [/** @type {any} */ (tailwindcss())],
    // Keystatic's API route imports Astro's virtual `astro:env/server` module, which Vite's dev-time dependency
    // pre-bundler (esbuild) can't resolve — keep the package out of pre-bundling so Astro handles it.
    optimizeDeps: {
      exclude: ['@keystatic/astro'],
    },
  },
});
