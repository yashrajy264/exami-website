import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    cssMinify: true,
    rollupOptions: {
      input: {
        'about-hero': './src/about-hero-entry.tsx'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Use fixed name for CSS to make it easier to reference in HTML
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/about-hero.css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        format: 'es'
      }
    }
  },
  publicDir: 'public',
  base: '/',
  server: {
    port: 3000,
    open: false
  }
});

