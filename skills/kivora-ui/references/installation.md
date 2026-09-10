# Web installation

Based on @kivora/nextjs 0.2.0. React and React DOM 18+ are required; check the installed package's peer dependencies for the version in use.

## Manual setup

Install `@kivora/nextjs` using the project's package manager. Add `@kivora/theme` directly only if application code imports it.

Import one stylesheet once at the application root:

```css
@import "@kivora/nextjs/styles.css";
```

This is compiled CSS and does not require Tailwind, PostCSS, or `@source`. New application Tailwind utilities still need a compiler. If the application already compiles Tailwind 4.1+, use `@kivora/nextjs/tailwind.css` instead; never import both entries.

For Next.js, merge `@kivora/nextjs` and `@kivora/theme` into `transpilePackages` without replacing existing settings. Mount the provider in a client component:

```tsx
"use client";

import type { ReactNode } from "react";
import { KivoraProvider } from "@kivora/nextjs";

export default function Providers({ children }: { children: ReactNode }) {
  return <KivoraProvider colorMode="system">{children}</KivoraProvider>;
}
```

Import root CSS and wrap children with this provider in the existing App Router layout. Keep the layout a Server Component. The documented root uses `<html lang="en" suppressHydrationWarning>` for the document color class; retain the application's language. For Pages Router, integrate CSS and the provider in `pages/_app.tsx`.

For React web without Next.js, import the stylesheet in the browser entry and wrap `App` with `KivoraProvider`. Do not add Next.js configuration or a `use client` directive to a client-only React application.

## Assisted setup

`npx @kivora/init --framework nextjs --dry-run` previews changes in an existing Next.js application. Inspect the plan, then apply within the user's authorized scope. Use the CLI's `--help` and published README for current options.

The documented initializer version 0.1.1 requires Node 20.19+, Next.js 13+, and Tailwind >=4.1 <5. It configures Tailwind, unlike the manual compiled-CSS path. It does not create or migrate frameworks and has no React/Vite option. Do not select Next.js for a Vite application.

## Verify

Check that CSS is loaded once, existing providers still work, buttons have styles, and interactive components work without hydration errors. Use the project's existing checks; do not upgrade dependencies merely to match this reference.
