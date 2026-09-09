import { componentHref } from "../docs/catalog";
import { getDocs } from "../docs/localized";
import generated from "../docs/api.generated.json";
import { absoluteUrl } from "./seo";
import { translator, type Locale } from "./i18n";

const api = generated as Record<
  string,
  {
    props: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    declaration: string;
  }
>;
const code = (text: string, language = "tsx") =>
  `\n\`\`\`${language}\n${text}\n\`\`\`\n`;
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
export const markdownHref = (path: string) =>
  `/docs-markdown/${path.replace(/^\/docs\/?/, "") || "index"}.md`;

export function getDocuments(locale: Locale = "en") {
  const { guides, components, guideContent, propDescriptions } =
    getDocs(locale);
  const t = translator(locale);
  return [
    ...guides.map((guide) => ({
      path: `/docs/${guide.slug}`,
      name: guide.name,
      description: guide.description,
      text: [
        `# ${guide.name}`,
        guide.description,
        ...(guideContent[guide.slug] ?? []).map((section) =>
          [
            `## ${section.title}`,
            ...(section.paragraphs ?? []),
            ...(section.bullets ?? []).map((bullet) => `- ${bullet}`),
            ...(section.links ?? []).map(
              (link) => `- [${link.label}](${absoluteUrl(link.href)})`,
            ),
            ...(section.code
              ? [
                  code(
                    section.code,
                    /^(npm|npx|pnpm|yarn) /.test(section.code) ? "bash" : "tsx",
                  ),
                ]
              : []),
          ].join("\n\n"),
        ),
      ].join("\n\n"),
    })),
    ...components.map((component) => ({
      path: componentHref(component),
      name: component.name,
      description: component.description,
      text: [
        `# ${component.name}`,
        component.description,
        `## ${t("Cómo utilizarlo")}`,
        component.usage,
        component.note ?? "",
        `## ${t("Importación")}`,
        code(
          `import { ${component.exports.join(", ")} } from "@kivora/nextjs";`,
        ),
        locale === "es"
          ? "Los ejemplos se ejecutan en un Client Component. Importa también los hooks, iconos y dependencias utilizados. Esta API es web; consulta la guía nativa para React Native."
          : "Examples run in a Client Component. Also import the hooks, icons and dependencies used. This is the web API; consult the native guide for React Native.",
        `## ${locale === "es" ? "Ejemplo" : "Example"}`,
        code(component.code),
        ...component.stories.map(
          (story) => `## ${story.name}\n${code(story.code)}`,
        ),
        ...component.exports.flatMap((name) =>
          api[name]
            ? [
                `## API: ${name}`,
                code(api[name].declaration, "typescript"),
                [
                  `| ${t("Propiedad")} | ${t("Tipo")} | ${t("Requerida")} | ${t("Descripción")} |\n| --- | --- | --- | --- |`,
                  ...api[name].props.map(
                    (prop) =>
                      `| ${cell(prop.name)} | ${cell(prop.type)} | ${prop.required ? (locale === "es" ? "Sí" : "Yes") : "No"} | ${cell(propDescriptions[prop.name] || t(prop.description) || (locale === "es" ? "Consulta el tipo publicado." : "See the published type."))} |`,
                  ),
                ].join("\n"),
              ]
            : [],
        ),
      ].join("\n\n"),
    })),
  ];
}
export const documents = getDocuments();
const links = (items: typeof documents) =>
  items
    .map(
      (doc) =>
        `- [${doc.name}](${absoluteUrl(markdownHref(doc.path))}): ${doc.description}`,
    )
    .join("\n");
export function llmsIndex(locale: Locale = "en") {
  const docs = getDocuments(locale);
  const es = locale === "es";
  return `# Kivora\n\n> ${es ? "Componentes para React y React Native con un lenguaje visual compartido." : "React and React Native components with a shared visual language."}\n\n${es ? "Esta documentación describe @kivora/nextjs y su API web publicada. La guía multiplataforma explica las diferencias con React Native. Ejecuta npx @kivora/init desde una aplicación Next.js o React Native Community CLI compatible. React web sin Next.js requiere instalación manual. El asistente no crea ni migra el framework. Los ejemplos son demostraciones: el equipo se guarda en sessionStorage y no envía correos." : "This documentation covers @kivora/nextjs and its published web API. The cross-platform guide explains differences from React Native. Run npx @kivora/init inside a compatible Next.js or React Native Community CLI application. React web without Next.js requires manual installation. The assistant does not create or migrate the framework. Examples are demos: the team is stored in sessionStorage and sends no emails."}\n\n${es ? "Idioma: español. Las mismas URL sirven inglés o español según Accept-Language; inglés es el idioma predeterminado." : "Language: English. The same URLs serve English or Spanish based on Accept-Language; English is the default."}\n\n## ${es ? "Guías" : "Guides"}\n\n${links(docs.filter((doc) => !doc.path.includes("/componentes/")))}\n\n## ${es ? "Componentes" : "Components"}\n\n${links(docs.filter((doc) => doc.path.includes("/componentes/")))}\n\n## ${es ? "Otros recursos" : "Other resources"}\n\n- [${es ? "Documentación completa" : "Full documentation"}](${absoluteUrl("/llms-full.txt")})\n- [${es ? "Documentación interactiva" : "Interactive documentation"}](${absoluteUrl("/docs")})\n- [@kivora/init](https://www.npmjs.com/package/@kivora/init): npx @kivora/init\n- [@kivora/nextjs](https://www.npmjs.com/package/@kivora/nextjs): React web\n- [@kivora/native](https://www.npmjs.com/package/@kivora/native): React Native\n`;
}
export function documentText(
  doc: (typeof documents)[number],
  locale: Locale = "en",
) {
  return `${doc.text}\n\n${locale === "es" ? "Fuente" : "Source"}: ${absoluteUrl(doc.path)}\n`;
}
export function textResponse(
  text: string,
  canonical?: string,
  locale: Locale = "en",
) {
  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": locale,
      "Cache-Control": "private, no-store",
      Vary: "Accept-Language, Cookie",
      "X-Content-Type-Options": "nosniff",
      Link: `</llms.txt>; rel="describedby"${canonical ? `, <${absoluteUrl(canonical)}>; rel="canonical"` : ""}`,
    },
  });
}
