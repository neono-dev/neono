/// <reference types="vitest" />
import { defineProject } from "vitest/config"
import * as path from "node:path";

export default defineProject({
  test: {
    environment: "node",
    globalSetup: "./vitest.global-setup.ts"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
