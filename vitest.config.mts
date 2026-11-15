import { defineConfig } from "vitest/config";

const fullEditionDefines = {
  __APP_EDITION__: JSON.stringify("full"),
  __STUDENT_SERVER_URI__: JSON.stringify(""),
};

export default defineConfig({
  define: fullEditionDefines,
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        define: fullEditionDefines,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        define: fullEditionDefines,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
        },
      },
    ],
  },
});
