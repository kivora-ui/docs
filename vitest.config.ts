import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // tests/e2e uses @playwright/test's own test runner, not Vitest's.
    exclude: ["**/node_modules/**", "tests/e2e/**"],
    server: {
      // Vitest externalizes node_modules by default (loaded via Node's own
      // resolver, bypassing Vite). @kivora/nextjs needs to go through Vite's
      // pipeline instead so the react-syntax-highlighter alias above (and
      // any future one) actually applies.
      deps: {
        inline: ["@kivora/nextjs"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      // @kivora/nextjs bundles every component into a single dist/index.js,
      // so importing anything from it (e.g. ThemeToggle) evaluates the whole
      // module graph, including Code's dependency on this react-syntax-
      // highlighter subpath. That subpath is a directory import without an
      // explicit /index.js, which Vite's strict ESM resolver rejects (Next's
      // Turbopack resolves it fine, so the app itself is unaffected).
      "react-syntax-highlighter/dist/esm/styles/hljs":
        "react-syntax-highlighter/dist/esm/styles/hljs/index.js",
    },
  },
});
