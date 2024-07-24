/// <reference types="vitest" />
import * as path from "node:path";
import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
