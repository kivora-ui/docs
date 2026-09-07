import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    // TEMPORARY: @kivora/nextjs is a `file:` symlink into the sibling
    // `module` repo (see next.config.ts) while its npm build is being fixed.
    // Vite resolves modules by real path, so without deduping, the symlinked
    // package's own "react" import resolves to module's separate copy of
    // React instead of this project's — two React instances, broken hooks.
    // Safe to remove once we're back on the published npm package.
    dedupe: ["react", "react-dom"],
  },
});
