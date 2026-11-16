import { readEditionEnv } from './scripts/edition-env.js';

// Build-time edition constants, injected as `define` in every Vite target
// (main, preload, renderer). readEditionEnv() throws on an invalid edition or
// a student build without a server URI, failing the build at config load.
export function editionDefine(): Record<string, string> {
  const { edition, studentServerUri } = readEditionEnv();
  return {
    __APP_EDITION__: JSON.stringify(edition),
    __STUDENT_SERVER_URI__: JSON.stringify(studentServerUri),
  };
}
