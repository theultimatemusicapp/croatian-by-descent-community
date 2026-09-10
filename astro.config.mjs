import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
// SITE_URL is an origin, SITE_BASE is a path. Use '/' with a future custom domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://theultimatemusicapp.github.io',
  base: process.env.SITE_BASE || '/croatian-by-descent-community',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (url) =>
        !url.includes('/samples/') &&
        !url.endsWith('/404/') &&
        !url.includes('/search/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
