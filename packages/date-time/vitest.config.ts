/// <reference types="vitest" />
import { defineProject } from "vitest/config"

export default defineProject({
  test: {
    environment: "node",
    globalSetup: "./vitest.global-setup.ts"
  },
})
