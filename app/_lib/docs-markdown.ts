import { components, guides, componentHref } from "../docs/catalog";
import { guideContent, propDescriptions } from "../docs/content";
import generated from "../docs/api.generated.json";
import { absoluteUrl } from "./seo";

const api = generated as Record<string, { props: { name: string; type: string; required: boolean; description: string }[]; declaration: string }>;
const code = (text: string, language = "tsx") => `\n\`\`\`${language}\n${text}\n\`\`\`\n`;
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
export const markdownHref = (path: string) => `/docs-markdown/${path.replace(/^\/docs\/?/, "") || "index"}.md`;

export const documents = [
  ...guides.map(guide => ({
    path: `/docs/${guide.slug}`, name: guide.name, description: guide.description,
    text: [`# ${guide.name}`, guide.description, ...(guideContent[guide.slug] ?? []).map(section => [
      `## ${section.title}`, ...(section.paragraphs ?? []), ...(section.bullets ?? []).map(bullet => `- ${bullet}`),
      ...(section.links ?? []).map(link => `- [${link.label}](${absoluteUrl(link.href)})`),
      ...(section.code ? [code(section.code, section.label?.toLowerCase().includes("terminal") ? "bash" : "tsx")] : []),
    ].join("\n\n"))].join("\n\n"),
  })),
  ...components.map(component => ({
    path: componentHref(component), name: component.name, description: component.description,
    text: [`# ${component.name}`, component.description, "## Uso", component.usage, component.note ?? "",
      "## Importación", code(`import { ${component.exports.join(", ")} } from "@kivora/nextjs";`),
      "Los ejemplos se ejecutan en un Client Component. Los hooks de React, iconos Lucide y otras dependencias usadas en cada ejemplo también deben importarse. La API documentada es web; no asumas que estos imports o atributos funcionan en React Native.",
      "## Ejemplo", code(component.code),
      ...component.stories.map(story => `## ${story.name}\n${code(story.code)}`),
      ...component.exports.flatMap(name => api[name] ? [
        `## API: ${name}`, code(api[name].declaration, "typescript"),
        ["| Propiedad | Tipo | Requerida | Descripción |\n| --- | --- | --- | --- |",
        ...api[name].props.map(prop => `| ${cell(prop.name)} | ${cell(prop.type)} | ${prop.required ? "Sí" : "No"} | ${cell(propDescriptions[prop.name] || prop.description || "Consulta el tipo publicado.")} |`)].join("\n"),
      ] : []),
    ].join("\n\n"),
  })),
];

const links = (items: typeof documents) => items.map(doc => `- [${doc.name}](${absoluteUrl(markdownHref(doc.path))}): ${doc.description}`).join("\n");
export function llmsIndex() {
  return `# Kivora\n\n> Componentes para React y React Native con un lenguaje visual compartido.\n\nEsta documentación describe @kivora/nextjs y su API web publicada. La guía multiplataforma explica los límites y las diferencias con React Native. Para configurar una aplicación Next.js o React Native Community CLI compatible, ejecuta npx @kivora/init desde su carpeta. React web sin Next.js requiere la guía manual. El asistente no crea ni migra el framework. Los ejemplos interactivos son demostraciones; las invitaciones del equipo se guardan en sessionStorage y no envían correos.\n\n## Guías\n\n${links(documents.filter(doc => !doc.path.includes("/componentes/")))}\n\n## Componentes\n\n${links(documents.filter(doc => doc.path.includes("/componentes/")))}\n\n## Otros recursos\n\n- [Documentación completa](${absoluteUrl("/llms-full.txt")}): Guías, ejemplos y atributos en un único archivo de texto.\n- [Documentación interactiva](${absoluteUrl("/docs")}): Playground y temas.\n- [Asistente de instalación](https://www.npmjs.com/package/@kivora/init): npx @kivora/init.\n- [Paquete web](https://www.npmjs.com/package/@kivora/nextjs): Componentes React para navegador.\n- [Paquete nativo](https://www.npmjs.com/package/@kivora/native): Componentes React Native.\n`;
}

export function documentText(doc: typeof documents[number]) {
  return `${doc.text}\n\nFuente: ${absoluteUrl(doc.path)}\n`;
}

export function textResponse(text: string, canonical?: string) {
  return new Response(text, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    Link: `</llms.txt>; rel="describedby"${canonical ? `, <${absoluteUrl(canonical)}>; rel="canonical"` : ""}`,
  } });
}
