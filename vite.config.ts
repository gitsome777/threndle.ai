import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Pin root to this file's folder so the project builds and serves correctly
    // regardless of the working directory it is launched from.
    root: __dirname,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          // City landing pages are standalone static HTML (no React) so crawlers and
          // AI answer engines that do not execute JavaScript get the full content.
          'locations/abbotsford': path.resolve(__dirname, 'locations/abbotsford/index.html'),
          'locations/chilliwack': path.resolve(__dirname, 'locations/chilliwack/index.html'),
          'locations/langley': path.resolve(__dirname, 'locations/langley/index.html'),
        },
      },
    },
    server: {
      // Set DISABLE_HMR=true to turn off hot reload and file watching, which stops
      // the preview flickering while a tool is making rapid edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
