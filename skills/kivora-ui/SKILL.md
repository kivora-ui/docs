---
name: kivora-ui
description: Build, configure, and troubleshoot React web and Next.js interfaces using Kivora (@kivora/nextjs), including installation, component composition, forms, and CSS themes. Use when a task requests Kivora or edits an existing Kivora web integration. For React Native, consult the native documentation instead of applying web APIs.
---

# Kivora UI

Implement the requested interface using the project's installed Kivora version and existing conventions. These references describe @kivora/nextjs 0.2.0; check the installed package's exports and declarations when versions differ.

## Workflow

1. Inspect package.json, the lockfile, framework, root styles, and existing providers. Keep the project's package manager and unrelated configuration.
2. For initial setup or missing styles, read [installation](references/installation.md). For component work, read [components](references/components.md). For colors or dark mode, read [theming](references/theming.md).
3. Confirm exports, prop types, and callbacks in the installed package before implementing. Kivora's API is not interchangeable with similarly named shadcn/Radix components.
4. Compose the requested UI, preserving accessible labels, keyboard operation, and the application's data flow. Use client boundaries for interactive Next.js components; keep server layouts on the server.
5. Run the project's relevant typecheck/build checks and exercise the changed interaction. Report any unavailable backend or validation that could not be performed.

## Documentation lookup

- Start with https://www.kivora.pro/llms.txt to discover specific Markdown pages. Fetch only the pages needed for the task; https://www.kivora.pro/llms-full.txt is the full fallback.
- Web setup: https://www.kivora.pro/docs-markdown/instalacion.md and https://www.kivora.pro/docs-markdown/instalacion-react.md.
- Component reference: https://www.kivora.pro/docs-markdown/componentes/select.md (replace `select` with a slug discovered in the index).
- In the documentation repository, source examples live in `app/docs/catalog.ts`, guides in `app/docs/content.ts`, and generated declarations in `app/docs/api.generated.json`. These repository files are not bundled with this skill.
- If online docs cannot be fetched, use these bundled references and the installed package README/types. Do not invent missing APIs.

## Boundaries

- React web, including non-Next.js projects, uses `@kivora/nextjs`. React Native uses `@kivora/native` and different events, providers, and dependencies. For native tasks consult https://www.kivora.pro/docs-markdown/instalacion-react-native.md and the installed native README; do not copy web setup or HTML components.
- UI components do not provide authentication, persistence, payments, or an upload server. Connect existing services or identify demo behavior explicitly.
- Do not migrate frameworks or replace an existing design system unless requested. Installing this skill does not install Kivora packages or authorize publishing an application.
