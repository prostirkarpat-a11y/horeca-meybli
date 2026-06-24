import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://horeca-meybli.com',
  output: 'static',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
});
