import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["scripts/neon/**/*.test.ts"],
    restoreMocks: true,
  },
});
