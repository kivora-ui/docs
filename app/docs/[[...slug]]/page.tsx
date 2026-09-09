import type { Metadata } from "next";
import { absoluteUrl, pageMetadata } from "../../_lib/seo";
import { StructuredData } from "../../_lib/structured-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Accessibility,
  BookOpen,
  Boxes,
  Braces,
  ChevronRight,
  Code2,
  Layers,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { components, componentHref, guides, groups } from "../catalog";
import { guideContent, propDescriptions } from "../content";
import generated from "../api.generated.json";
import { CodeBlock } from "../_components/code-block";
import { Playground, type PropInfo } from "../_components/playground";
import styles from "../docs.module.css";

type RouteProps = { params: Promise<{ slug?: string[] }> };
const api = generated as Record<
  string,
  { props: PropInfo[]; declaration: string }
>;
const icons = [
  Sparkles,
  Terminal,
  Palette,
  Layers,
  Accessibility,
  MonitorSmartphone,
];
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["componentes"] },
    ...guides.map((guide) => ({ slug: [guide.slug] })),
    ...components.map((component) => ({
      slug: ["componentes", component.slug],
    })),
  ];
}
export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc =
    slug[0] === "componentes"
      ? components.find((item) => item.slug === slug[1])
      : guides.find((item) => item.slug === slug[0]);
  const path = `/docs${slug.length ? `/${slug.join("/")}` : ""}`;
  const metadata = pageMetadata(
    doc?.name ?? (slug[0] === "componentes" ? "Componentes" : "Documentación"),
    doc?.description ?? "Guías, ejemplos editables y referencia de API para construir con Kivora en React y Next.js.",
    path,
  );
  metadata.alternates = {
    canonical: path,
    types: { "text/markdown": `/docs-markdown/${slug.join("/") || "index"}.md` },
  };
  return metadata;
}
function Breadcrumbs({
  name,
  component = false,
}: {
  name: string;
  component?: boolean;
}) {
  return (
    <div className={styles.breadcrumbs}>
      <Link href="/docs">Documentación</Link>
      <ChevronRight size={12} />
      {component && (
        <>
          <Link href="/docs/componentes">Componentes</Link>
          <ChevronRight size={12} />
        </>
      )}
      <span>{name}</span>
    </div>
  );
}
function Toc({ items }: { items: { id: string; title: string }[] }) {
  return (
    <aside className={styles.toc} aria-label="En esta página">
      <span>
        <BookOpen size={13} />
        En esta página
      </span>
      <nav>
        {items.map((item) => (
          <a href={`#${item.id}`} key={item.id}>
            {item.title}
          </a>
        ))}
      </nav>
      <div className={styles.tocNote}>
        <span>Una base. Tu personalidad.</span>
        <p>Prueba los cuatro temas desde la cabecera.</p>
      </div>
    </aside>
  );
}
function ApiTable({ props }: { props: PropInfo[] }) {
  return (
    <div className={styles.apiScroll} tabIndex={0} role="region" aria-label="Tabla de propiedades, desplazamiento horizontal">
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>Propiedad</th>
            <th>Tipo</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required && (
                  <span className={styles.required}>Requerida</span>
                )}
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>
                {propDescriptions[prop.name] ||
                  prop.description ||
                  (/ClassName$/.test(prop.name)
                    ? "Clases CSS del elemento indicado."
                    : /^on[A-Z]/.test(prop.name)
                      ? "Callback de este evento. La firma indica los argumentos recibidos."
                      : `Configura ${prop.name}. El tipo muestra los valores y la estructura admitidos.`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default async function DocsPage({ params }: RouteProps) {
  const { slug = [] } = await params;
  const path = `/docs${slug.length ? `/${slug.join("/")}` : ""}`;
  const metadata = await generateMetadata({ params });
  const name = String(metadata.title);
  const crumbs = [{ name: "Inicio", path: "/" }, { name: "Documentación", path: "/docs" }];
  if (slug[0] === "componentes") crumbs.push({ name: "Componentes", path: "/docs/componentes" });
  if (slug.length && path !== "/docs/componentes") crumbs.push({ name, path });
  return <>
    <StructuredData data={{ "@context": "https://schema.org", "@graph": [
      { "@type": slug.length && path !== "/docs/componentes" ? "TechArticle" : "CollectionPage", name, headline: name, description: metadata.description, url: absoluteUrl(path), inLanguage: "es", isPartOf: { "@type": "WebSite", name: "Kivora", url: absoluteUrl("/") } },
      { "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })) },
    ] }} />
    <DocsPageContent params={params} />
  </>;
}
async function DocsPageContent({ params }: RouteProps) {
  const { slug = [] } = await params;
  if (!slug.length)
    return (
      <main id="docs-content" className={styles.landing}>
        <div className={styles.heroArt} aria-hidden="true">
          <svg viewBox="0 0 1000 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave">
                <stop stopColor="#6558e8" stopOpacity=".08" />
                <stop offset=".5" stopColor="#d6a1e7" stopOpacity=".5" />
                <stop offset="1" stopColor="#6558e8" stopOpacity=".06" />
              </linearGradient>
            </defs>
            {[0, 12, 24, 36].map((offset) => (
              <path
                key={offset}
                d={`M-50 ${80 + offset} C180 ${-70 + offset}, 330 ${250 + offset}, 610 ${90 + offset} S900 ${50 + offset}, 1080 ${85 + offset}`}
                fill="none"
                stroke="url(#wave)"
                strokeWidth={offset === 12 ? 3 : 1}
              />
            ))}
          </svg>
        </div>
        <div className={styles.landingIntro}>
          <div className={styles.heroIcon}>
            <Layers size={32} />
          </div>
          <div className={styles.eyebrow}>EL MANUAL DE TUS PRÓXIMAS IDEAS</div>
          <h1>
            Construye algo <span>muy tuyo.</span>
          </h1>
          <p>
            Todo lo que necesitas para crear con Kivora.
            <br />
            Empieza por lo esencial. Explora las piezas. Dales tu personalidad.
          </p>
          <div className={styles.landingActions}>
            <Link className={styles.primaryLink} href="/docs/instalacion">
              Empieza aquí <ArrowRight size={16} />
            </Link>
            <Link href="/docs/componentes">
              Explorar componentes <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <section className={styles.featured}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>UN BUEN PUNTO DE PARTIDA</span>
              <h2>Menos dudas. Más ideas.</h2>
            </div>
            <span>01 — 06</span>
          </div>
          <div className={styles.guideGrid}>
            {guides.map((guide, index) => {
              const Icon = icons[index % icons.length];
              return (
                <Link
                  key={guide.slug}
                  href={`/docs/${guide.slug}`}
                  className={styles.guideCard}
                >
                  <div className={styles.cardRibbon} data-tone={index % 3}>
                    <span>0{index + 1}</span>
                  </div>
                  <span className={styles.guideIcon}>
                    <Icon size={20} />
                  </span>
                  <h3>
                    {guide.name}
                    <ArrowUpRight size={15} />
                  </h3>
                  <p>{guide.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
        <section className={styles.catalogBanner}>
          <div className={styles.bannerIcon}>
            <Boxes size={25} />
          </div>
          <div>
            <h2>{components.length} familias. Infinitas combinaciones.</h2>
            <p>
              Vista previa, código editable y propiedades de cada componente.
            </p>
          </div>
          <Link href="/docs/componentes">
            Encuentra tu pieza <ArrowRight size={16} />
          </Link>
        </section>
        <div className={styles.quickInstall}>
          <span>
            <Terminal size={15} />
            La primera pieza está a un comando.
          </span>
          <CodeBlock code="npx @kivora/init" />
          <Link href="/docs/inicializador">Conoce el asistente de instalación</Link>
        </div>
      </main>
    );
  if (slug.length === 1 && slug[0] === "componentes")
    return (
      <main id="docs-content" className={styles.catalogPage}>
        <Breadcrumbs name="Componentes" />
        <div className={styles.eyebrow}>ELIGE UNA PIEZA. HAZLA TUYA.</div>
        <h1>
          Un componente para
          <br />
          <span>cada nueva idea.</span>
        </h1>
        <p className={styles.lead}>
          Explora {components.length} familias de componentes reales. Edita el
          código, cambia sus propiedades y encuentra la combinación que
          necesitas.
        </p>
        <div className={styles.categoryLinks}>
          {groups.map((group) => (
            <a key={group} href={`#${group.replaceAll(" ", "-")}`}>
              {group}
            </a>
          ))}
        </div>
        {groups.map((group) => (
          <section
            key={group}
            id={group.replaceAll(" ", "-")}
            className={styles.catalogSection}
          >
            <h2>
              {group}
              <span>
                {components.filter((item) => item.group === group).length}
              </span>
            </h2>
            <div className={styles.componentGrid}>
              {components
                .filter((item) => item.group === group)
                .map((item) => (
                  <Link key={item.slug} href={componentHref(item)}>
                    <span className={styles.componentIcon}>
                      <Braces size={18} />
                    </span>
                    <h3>
                      {item.name}
                      <ArrowUpRight size={14} />
                    </h3>
                    <p>{item.description}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>
    );
  if (slug.length === 2 && slug[0] === "componentes") {
    const doc = components.find((item) => item.slug === slug[1]);
    if (!doc) notFound();
    const index = components.indexOf(doc);
    const primary = api[doc.exports[0]];
    const sections = [
      { id: "playground", title: "Playground" },
      { id: "uso", title: "Cómo utilizarlo" },
      { id: "importacion", title: "Importación" },
      { id: "api", title: "Referencia de API" },
      { id: "composicion", title: "Subcomponentes" },
    ];
    return (
      <div className={styles.articleLayout}>
        <main id="docs-content" className={styles.article}>
          <Breadcrumbs name={doc.name} component />
          <div className={styles.articleEyebrow}>
            <span>{doc.group}</span>
            <span>
              <i />
              Playground interactivo
            </span>
          </div>
          <h1>{doc.name}</h1>
          <p className={styles.lead}>{doc.description}</p>
          <section id="playground" className={styles.playgroundSection}>
            <Playground key={doc.slug} doc={doc} props={primary?.props ?? []} />
            <details className={styles.apiDetails}>
              <summary>Ejemplo en texto y Markdown</summary>
              <CodeBlock code={doc.code} label={`${doc.name} · Ejemplo`} />
              <a href={`/docs-markdown/componentes/${doc.slug}.md`}>Leer documentación en Markdown</a>
            </details>
          </section>
          <section id="uso" className={styles.proseSection}>
            <h2>Cómo utilizarlo</h2>
            <p>{doc.usage}</p>
            {doc.note && (
              <div className={styles.callout}>
                <Zap size={17} />
                <p>{doc.note}</p>
              </div>
            )}
          </section>
          <section id="importacion" className={styles.proseSection}>
            <h2>Importación</h2>
            <CodeBlock
              code={`import { ${doc.exports.join(", ")} } from "@kivora/nextjs";`}
              label="React / Next.js"
            />
            <p>
              Los ejemplos interactivos se utilizan dentro de un componente con{" "}
              <code>{'"use client"'}</code>. El botón Copiar del playground
              incluye los imports necesarios para el ejemplo actual.
            </p>
          </section>
          <section id="api" className={styles.proseSection}>
            <h2>
              Referencia de API{" "}
              <span className={styles.versionBadge}>0.2.0</span>
            </h2>
            <p>
              Tipos de la versión publicada instalada. Se incluyen las
              propiedades específicas y los atributos HTML más habituales.
              «Opcional» no implica un valor predeterminado; omitir la propiedad
              deja que el componente lo resuelva.
            </p>
            {primary ? (
              <ApiTable props={primary.props} />
            ) : (
              <p>
                Esta familia se compone mediante los exports de la siguiente
                sección.
              </p>
            )}
          </section>
          <section id="composicion" className={styles.proseSection}>
            <h2>
              {doc.exports.length > 1
                ? "Subcomponentes y composición"
                : "Definición TypeScript"}
            </h2>
            <p>
              Consulta las propiedades de cada pieza y su declaración publicada.
              Los atributos nativos y de accesibilidad se heredan del elemento
              indicado en el tipo.
            </p>
            {doc.exports.map((name) => (
              <details className={styles.apiDetails} key={name}>
                <summary>
                  <code>{name}</code>
                  <span>
                    {api[name]?.props.length ?? 0} propiedades{" "}
                    <ChevronRight size={14} />
                  </span>
                </summary>
                {api[name] ? (
                  <>
                    {name !== doc.exports[0] && (
                      <ApiTable props={api[name].props} />
                    )}
                    <CodeBlock
                      code={api[name].declaration}
                      label={`${name} · TypeScript`}
                    />
                  </>
                ) : (
                  <p>
                    Export de compatibilidad HTML. Consulta la guía de uso del
                    componente raíz.
                  </p>
                )}
              </details>
            ))}
          </section>
          <div className={styles.articleSource}>
            <Code2 size={14} />
            API generada desde @kivora/nextjs 0.2.0
            <a
              href="https://www.npmjs.com/package/@kivora/nextjs"
              target="_blank"
              rel="noreferrer"
            >
              Ver paquete <ArrowUpRight size={12} />
            </a>
          </div>
          <nav className={styles.prevNext} aria-label="Más componentes">
            {index > 0 ? (
              <Link href={componentHref(components[index - 1])}>
                <span>
                  <ArrowLeft size={13} />
                  Anterior
                </span>
                <strong>{components[index - 1].name}</strong>
              </Link>
            ) : (
              <span />
            )}
            {index < components.length - 1 && (
              <Link href={componentHref(components[index + 1])}>
                <span>
                  Siguiente
                  <ArrowRight size={13} />
                </span>
                <strong>{components[index + 1].name}</strong>
              </Link>
            )}
          </nav>
        </main>
        <Toc items={sections} />
      </div>
    );
  }
  if (slug.length === 1) {
    const guide = guides.find((item) => item.slug === slug[0]);
    if (!guide) notFound();
    const sections = guideContent[guide.slug];
    return (
      <div className={styles.articleLayout}>
        <main id="docs-content" className={styles.article}>
          <Breadcrumbs name={guide.name} />
          <div className={styles.eyebrow}>PRIMEROS PASOS</div>
          <h1>{guide.name}</h1>
          <p className={styles.lead}>{guide.description}</p>
          <div className={styles.guideHero}>
            <div>
              <Layers size={44} />
              <span>kivora</span>
              <small>
                Las piezas las ponemos nosotros.
                <br />
                La idea sigue siendo tuya.
              </small>
            </div>
          </div>
          {sections.map((section) => (
            <section
              className={styles.proseSection}
              id={section.id}
              key={section.id}
            >
              <h2>{section.title}</h2>
              {section.paragraphs?.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
              {section.links && (
                <ul>{section.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
              )}
              {section.code && (
                <CodeBlock code={section.code} label={section.label} />
              )}
            </section>
          ))}
          <div className={styles.callout}>
            <BookOpen size={18} />
            <p>
              {guide.slug === "instalacion-react-native" ? <>
                Consulta la <Link href="https://www.npmjs.com/package/@kivora/native">API nativa</Link> y
                las <Link href="/docs/multiplataforma">diferencias entre plataformas</Link>.
              </> : <>
                Continúa con <Link href="/docs/componentes/button">Button</Link> o explora el{" "}
                <Link href="/docs/componentes">catálogo de componentes web</Link>.
              </>}
            </p>
          </div>
        </main>
        <Toc items={sections} />
      </div>
    );
  }
  notFound();
}
