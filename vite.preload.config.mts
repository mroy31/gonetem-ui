import { defineConfig } from 'vite';
import { editionDefine } from './vite.edition.mjs';

// https://vitejs.dev/config
export default defineConfig({
  define: editionDefine(),
});
