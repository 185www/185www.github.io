import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  root: '.',
  build: {
    outDir: '../dist/pomotodo',
    emptyOutDir: true,
  },
  plugins: [
    VitePWA({
      scope: './',
      base: './',
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,txt,json}'],
        navigateFallback: './index.html',
      },
    }),
  ],
});
