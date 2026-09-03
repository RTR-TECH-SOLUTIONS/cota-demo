import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Site-ul stă într-un subdirector pe GitHub Pages, nu în rădăcina domeniului.
// `base` face ca Astro să prefixeze asset-urile; linkurile scrise de mână trec
// prin helperul din `src/lib/cale.ts`.
export default defineConfig({
  site: 'https://rtr-tech-solutions.github.io',
  base: '/cota-demo',
  trailingSlash: 'ignore',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
