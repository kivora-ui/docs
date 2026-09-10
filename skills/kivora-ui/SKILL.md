---
name: kivora-ui
description: Build, configure, and troubleshoot React web and Next.js interfaces using Kivora (@kivora/nextjs), including installation, component composition, forms, and CSS themes. Use when a task requests Kivora or edits an existing Kivora web integration. For React Native, consult the native documentation instead of applying web APIs.
---

# Kivora UI

Implement the requested interface using the project's installed Kivora version and existing conventions. The website currently installs @kivora/nextjs 0.3.0; animation exports require 0.3.0 or later. Do not treat the checkout as proof of what is published or installed.

## Workflow

1. Inspect package.json, the lockfile, framework, root styles, and existing providers. Keep the project's package manager and unrelated configuration.
2. For initial setup or missing styles, read [installation](references/installation.md). For component work, read [components](references/components.md). For colors or dark mode, read [theming](references/theming.md).
   For DataTable or date selection, read [tables and dates](references/data-and-dates.md). For upload or playback sessions, read [uploads and media](references/uploads-and-media.md). For entrances, animated text, SVG drawing, or loading indicators, read [animations](references/animations.md). Load only references relevant to the task.
3. Confirm exports, prop types, and callbacks in the installed package before implementing. Kivora's API is not interchangeable with similarly named shadcn/Radix components.
4. Compose the requested UI, preserving accessible labels, keyboard operation, and the application's data flow. Use client boundaries for interactive Next.js components; keep server layouts on the server.
5. Run the project's relevant typecheck/build checks and exercise the changed interaction. Report any unavailable backend or validation that could not be performed.

## Source and version policy

Use the consumer's installed package README, exports, and declarations first. When a module checkout is available, consult its matching version's `packages/nextjs/README.md`, `packages/theme/README.md`, and focused `docs/` guides. Generated `docs/components/*.md` mixes web and native sections: select the correct platform. Design proposals under `docs/superpowers/` are not a published API contract.

These references were reviewed against `kivora-ui/module` commit `377828476a6f1006d638255c0b9613062885010e`. Local checkout paths are optional development resources, not dependencies for consumers. If documentation and installed behavior differ, reproduce the relevant behavior or inspect the installed implementation before applying a newer pattern; do not silently upgrade.

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
