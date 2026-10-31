import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        halo: 'projects/halo/index.html',
        ottotrade: 'projects/ottotrade/index.html',
        sense: 'projects/sense/index.html',
      },
    },
  },
});
