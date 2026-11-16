import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { editionDefine } from './vite.edition.mjs';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  define: editionDefine(),
});
