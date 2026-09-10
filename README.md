This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Kivora agent skill

This repository distributes [`kivora-ui`](skills/kivora-ui/SKILL.md), a skill for building React web and Next.js interfaces with Kivora. It bundles installation, component, and theme references. Installing the skill supplies agent instructions; it does not install the UI library.

Once `skills/kivora-ui` is published on the repository's default branch, users can run from their own project:

```bash
npx skills add kivora-ui/docs --skill kivora-ui
```

Choose agents interactively, add `-a codex` or `-a claude-code` to target one, or add `-g` for a global installation. Private repositories require repository access. Discover available skills with `npx skills add kivora-ui/docs --list`; update installed skills with `npx skills update`.

Before publishing, discover the local skill from this checkout without installing it:

```bash
npx skills add ./skills/kivora-ui --list
```

To install the local version, omit `--list`. Start an agent session that discovers the skill and ask it to use `kivora-ui` for a concrete Kivora task. Automatic invocation depends on the agent. See the website guide at `/docs/agentes` (English and Spanish), also exposed through `/docs-markdown/agentes.md` and `/llms.txt`.

### Maintaining the skill

- Keep `skills/kivora-ui/SKILL.md` concise; put task-specific detail in its linked `references/` files. Those files travel with the installed skill; other repository files do not.
- Check instructions against the published package README/types and `app/docs/catalog.ts` / `app/docs/content.ts` when updating Kivora. The website installs `@kivora/nextjs` 0.3.0; the animation reference covers its four new animation components. Follow the skill’s source/version policy instead of assuming repository changes are already published.
- Update the website guide and its English translations in `app/_lib/i18n/en.json` when installation or usage changes.
- Verify local discovery with the command above, run `npm run typecheck` and the documentation translation tests, and try a real consumer task when changing behavioral guidance.
- Publish by merging the skill folder and documentation into the default branch. No npm release or website deployment is needed for Git-based installation; deploy the website to publish the guide. Installed copies require an explicit update.
- Add another `skills/<name>/SKILL.md` only for a distinct workflow. Users can select multiple names with `--skill`.

CLI reference: [vercel-labs/skills](https://github.com/vercel-labs/skills).

Production documentation lives at https://www.kivora.pro/docs/agentes. Set `SITE_URL=https://www.kivora.pro` in production (also the default canonical origin). The skill installs from GitHub and reads documentation from this website.

The skill also includes focused table/date and upload/media references, reviewed against `kivora-ui/module` commit `377828476a6f1006d638255c0b9613062885010e`. Consumers do not need a local module checkout.

## Animation documentation

Kivora 0.3.0 adds `Animation`, `AnimatedText`, `AnimatedPath`, and `AnimatedLoader`. The bilingual guide at `/docs/animaciones` links to each interactive component page; Markdown, API tables, the sitemap, and `llms.txt` are generated from the same catalog. The agent skill includes a focused animation reference.
