/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Puerto exclusivo 5174: convive con el worktree paralelo en 5173.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true, host: 'localhost' },
  preview: { port: 5174, strictPort: true, host: 'localhost' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
