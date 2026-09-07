import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kivora/nextjs", "@kivora/theme"],
  // TEMPORARY: @kivora/nextjs and @kivora/theme are installed as `file:` deps
  // pointing at the sibling `module` repo while its npm-published build is
  // being fixed (see docs/superpowers/plans/2026-09-07-fundacion-landing.md).
  // Turbopack refuses to resolve linked packages outside the project root
  // unless told otherwise. Revert this once we switch back to the published
  // npm packages.
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
