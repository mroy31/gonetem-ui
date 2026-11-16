import { defineConfig } from 'vite';
import { editionDefine } from './vite.edition.mjs';

// https://vitejs.dev/config
export default defineConfig(({ command }) => ({
  define: {
    ...editionDefine(),
    // The main process switches dev/prod resource paths on NODE_ENV; inline it
    // the way webpack's mode did.
    'process.env.NODE_ENV': JSON.stringify(
      command === 'serve' ? 'development' : 'production',
    ),
  },
  resolve: {
    // The ESM build of i18next-fs-backend uses top-level await, which cannot
    // be bundled into the CJS main-process output; take its CommonJS entry.
    alias: { 'i18next-fs-backend': 'i18next-fs-backend/cjs' },
  },
}));
