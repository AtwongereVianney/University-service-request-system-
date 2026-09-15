import { defineConfig } from 'vite';

// Relative base so the built site works from a GitHub Pages project URL
// (https://<user>.github.io/<repo>/) as well as from Netlify or Vercel.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        about: 'pages/about.html',
        services: 'pages/services.html',
        updates: 'pages/updates.html',
        request: 'pages/request.html',
        contact: 'pages/contact.html',
      },
    },
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
  },
});
