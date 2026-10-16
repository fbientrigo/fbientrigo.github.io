import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://fbientrigo.github.io',
  base: process.env.BASE_PATH ?? '/',
  build: { format: 'directory' },
});
