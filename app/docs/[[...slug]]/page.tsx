import { getT, getLocale } from "../../_lib/i18n/server";
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
import {
  components as sourceComponents,
  componentHref,
  guides as sourceGuides,
  groups as sourceGroups,
} from "../catalog";
import { getDocs } from "../localized";

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
    ...sourceGuides.map((guide) => ({ slug: [guide.slug] })),
    ...sourceComponents.map((component) => ({
      slug: ["componentes", component.slug],
    })),
  ];
}
export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const t = await getT();
  const locale = await getLocale();
  const { components, guides } = getDocs(locale);
  const { slug = [] } = await params;
  const doc =
    slug[0] === "componentes"
      ? components.find((item) => item.slug === slug[1])
      : guides.find((item) => item.slug === slug[0]);
  const path = `/docs${slug.length ? `/${slug.join("/")}` : ""}`;
  const metadata = pageMetadata(
    doc?.name ??
      (slug[0] === "componentes" ? t("Componentes") : t("Documentación")),
    doc?.description ??
      t(
        "Guías, ejemplos editables y referencia de API para construir con Kivora en React y Next.js.",
      ),
    path,
    locale,
  );
  metadata.alternates = {
    canonical: path,
    types: {
      "text/markdown": `/docs-markdown/${slug.join("/") || "index"}.md`,
    },
  };
  return metadata;
}
async function Breadcrumbs({
  name,
  component = false,
}: {
  name: string;
  component?: boolean;
}) {
  const t = await getT();

  return (
    <div className={styles.breadcrumbs}>
      <Link href="/docs">{t("Documentación")}</Link>
      <ChevronRight size={12} />
      {component && (
        <>
          <Link href="/docs/componentes">{t("Componentes")}</Link>
          <ChevronRight size={12} />
        </>
      )}
      <span>{name}</span>
    </div>
  );
}
async function Toc({ items }: { items: { id: string; title: string }[] }) {
  const t = await getT();

  return (
    <aside className={styles.toc} aria-label={t("En esta página")}>
      <span>
        <BookOpen size={13} />
        {t("En esta página")}
      </span>
      <nav>
        {items.map((item) => (
          <a href={`#${item.id}`} key={item.id}>
            {item.title}
          </a>
        ))}
      </nav>
      <div className={styles.tocNote}>
        <span>{t("Una base. Tu personalidad.")}</span>
        <p>{t("Prueba los cuatro temas desde la cabecera.")}</p>
      </div>
    </aside>
  );
}
async function ApiTable({ props }: { props: PropInfo[] }) {
  const t = await getT();
  const { propDescriptions } = getDocs(await getLocale());
  return (
    <div
      className={styles.apiScroll}
      tabIndex={0}
      role="region"
      aria-label={t("Tabla de propiedades, desplazamiento horizontal")}
    >
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>{t("Propiedad")}</th>
            <th>{t("Tipo")}</th>
            <th>{t("Descripción")}</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required && (
                  <span className={styles.required}>{t("Requerida")}</span>
                )}
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>
                {propDescriptions[prop.name] ||
                  prop.description ||
                  (/ClassName$/.test(prop.name)
                    ? t("Clases CSS del elemento indicado.")
                    : /^on[A-Z]/.test(prop.name)
                      ? t(
                          "Callback de este evento. La firma indica los argumentos recibidos.",
                        )
                      : t(
                          "Configura {0}. El tipo muestra los valores y la estructura admitidos.",
                          { 0: prop.name },
                        ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default async function DocsPage({ params }: RouteProps) {
  const t = await getT();
  const locale = await getLocale();
  const { slug = [] } = await params;
  const path = `/docs${slug.length ? `/${slug.join("/")}` : ""}`;
  const metadata = await generateMetadata({ params });
  const name = String(metadata.title);
  const crumbs = [
    { name: t("Inicio"), path: "/" },
    { name: t("Documentación"), path: "/docs" },
  ];
  if (slug[0] === "componentes")
    crumbs.push({ name: t("Componentes"), path: "/docs/componentes" });
  if (slug.length && path !== "/docs/componentes") crumbs.push({ name, path });
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type":
                slug.length && path !== "/docs/componentes"
                  ? "TechArticle"
                  : "CollectionPage",
              name,
              headline: name,
              description: metadata.description,
              url: absoluteUrl(path),
              inLanguage: locale,
              isPartOf: {
                "@type": "WebSite",
                name: "Kivora",
                url: absoluteUrl("/"),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: crumb.name,
                item: absoluteUrl(crumb.path),
              })),
            },
          ],
        }}
      />
      <DocsPageContent params={params} />
    </>
  );
}
async function DocsPageContent({ params }: RouteProps) {
  const t = await getT();
  const locale = await getLocale();
  const { components, guides, groups, guideContent } = getDocs(locale);
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
          <div className={styles.eyebrow}>
            {t("EL MANUAL DE TUS PRÓXIMAS IDEAS")}
          </div>
          <h1>
            {t("Construye algo")} <span>{t("muy tuyo.")}</span>
          </h1>
          <p>
            {t("Todo lo que necesitas para crear con Kivora.")}
            <br />
            {t(
              "Empieza por lo esencial. Explora las piezas. Dales tu personalidad.",
            )}
          </p>
          <div className={styles.landingActions}>
            <Link className={styles.primaryLink} href="/docs/instalacion">
              {t("Empieza aquí")}
              <ArrowRight size={16} />
            </Link>
            <Link href="/docs/componentes">
              {t("Explorar componentes")}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <section className={styles.featured}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>
                {t("UN BUEN PUNTO DE PARTIDA")}
              </span>
              <h2>{t("Menos dudas. Más ideas.")}</h2>
            </div>
            <span>01 — {String(guides.length).padStart(2, "0")}</span>
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
            <h2>
              {components.length} {t("familias. Infinitas combinaciones.")}
            </h2>
            <p>
              {t(
                "Vista previa, código editable y propiedades de cada componente.",
              )}
            </p>
          </div>
          <Link href="/docs/componentes">
            {t("Encuentra tu pieza")}
            <ArrowRight size={16} />
          </Link>
        </section>
        <div className={styles.quickInstall}>
          <span>
            <Terminal size={15} />
            {t("La primera pieza está a un comando.")}
          </span>
          <CodeBlock code="npx @kivora/init" />
          <Link href="/docs/inicializador">
            {t("Conoce el asistente de instalación")}
          </Link>
        </div>
      </main>
    );
  if (slug.length === 1 && slug[0] === "componentes")
    return (
      <main id="docs-content" className={styles.catalogPage}>
        <Breadcrumbs name={t("Componentes")} />
        <div className={styles.eyebrow}>
          {t("ELIGE UNA PIEZA. HAZLA TUYA.")}
        </div>
        <h1>
          {t("Un componente para")}
          <br />
          <span>{t("cada nueva idea.")}</span>
        </h1>
        <p className={styles.lead}>
          {t("Explora")} {components.length}{" "}
          {t(
            "familias de componentes reales. Edita el código, cambia sus propiedades y encuentra la combinación que necesitas.",
          )}
        </p>
        <div className={styles.categoryLinks}>
          {groups.map((group, groupIndex) => (
            <a key={group} href={`#${sourceGroups[groupIndex].replaceAll(" ", "-")}`}>
              {group}
            </a>
          ))}
        </div>
        {groups.map((group, groupIndex) => (
          <section
            key={group}
            id={sourceGroups[groupIndex].replaceAll(" ", "-")}
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
      { id: "uso", title: t("Cómo utilizarlo") },
      { id: "importacion", title: t("Importación") },
      { id: "api", title: t("Referencia de API") },
      { id: "composicion", title: t("Subcomponentes") },
    ];
    return (
      <div className={styles.articleLayout}>
        <main id="docs-content" className={styles.article}>
          <Breadcrumbs name={doc.name} component />
          <div className={styles.articleEyebrow}>
            <span>{doc.group}</span>
            <span>
              <i />
              {t("Playground interactivo")}
            </span>
          </div>
          <h1>{doc.name}</h1>
          <p className={styles.lead}>{doc.description}</p>
          <section id="playground" className={styles.playgroundSection}>
            <Playground key={doc.slug} doc={doc} props={primary?.props ?? []} />
            <details className={styles.apiDetails}>
              <summary>{t("Ejemplo en texto y Markdown")}</summary>
              <CodeBlock
                code={doc.code}
                label={t("{0} · Ejemplo", { 0: doc.name })}
              />
              <a href={`/docs-markdown/componentes/${doc.slug}.md`}>
                {t("Leer documentación en Markdown")}
              </a>
            </details>
          </section>
          <section id="uso" className={styles.proseSection}>
            <h2>{t("Cómo utilizarlo")}</h2>
            <p>{doc.usage}</p>
            {doc.note && (
              <div className={styles.callout}>
                <Zap size={17} />
                <p>{doc.note}</p>
              </div>
            )}
          </section>
          <section id="importacion" className={styles.proseSection}>
            <h2>{t("Importación")}</h2>
            <CodeBlock
              code={`import { ${doc.exports.join(", ")} } from "@kivora/nextjs";`}
              label="React / Next.js"
            />
            <p>
              {t(
                "Los ejemplos interactivos se utilizan dentro de un componente con",
              )}{" "}
              <code>{'"use client"'}</code>
              {t(
                ". El botón Copiar del playground incluye los imports necesarios para el ejemplo actual.",
              )}
            </p>
          </section>
          <section id="api" className={styles.proseSection}>
            <h2>
              {t("Referencia de API")}{" "}
              <span className={styles.versionBadge}>0.2.0</span>
            </h2>
            <p>
              {t(
                "Tipos de la versión publicada instalada. Se incluyen las propiedades específicas y los atributos HTML más habituales. «Opcional» no implica un valor predeterminado; omitir la propiedad deja que el componente lo resuelva.",
              )}
            </p>
            {primary ? (
              <ApiTable props={primary.props} />
            ) : (
              <p>
                {t(
                  "Esta familia se compone mediante los exports de la siguiente sección.",
                )}
              </p>
            )}
          </section>
          <section id="composicion" className={styles.proseSection}>
            <h2>
              {doc.exports.length > 1
                ? t("Subcomponentes y composición")
                : t("Definición TypeScript")}
            </h2>
            <p>
              {t(
                "Consulta las propiedades de cada pieza y su declaración publicada. Los atributos nativos y de accesibilidad se heredan del elemento indicado en el tipo.",
              )}
            </p>
            {doc.exports.map((name) => (
              <details className={styles.apiDetails} key={name}>
                <summary>
                  <code>{name}</code>
                  <span>
                    {api[name]?.props.length ?? 0} {t("propiedades")}{" "}
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
                    {t(
                      "Export de compatibilidad HTML. Consulta la guía de uso del componente raíz.",
                    )}
                  </p>
                )}
              </details>
            ))}
          </section>
          <div className={styles.articleSource}>
            <Code2 size={14} />
            {t("API generada desde @kivora/nextjs 0.2.0")}
            <a
              href="https://www.npmjs.com/package/@kivora/nextjs"
              target="_blank"
              rel="noreferrer"
            >
              {t("Ver paquete")}
              <ArrowUpRight size={12} />
            </a>
          </div>
          <nav className={styles.prevNext} aria-label={t("Más componentes")}>
            {index > 0 ? (
              <Link href={componentHref(components[index - 1])}>
                <span>
                  <ArrowLeft size={13} />
                  {t("Anterior")}
                </span>
                <strong>{components[index - 1].name}</strong>
              </Link>
            ) : (
              <span />
            )}
            {index < components.length - 1 && (
              <Link href={componentHref(components[index + 1])}>
                <span>
                  {t("Siguiente")}
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
          <div className={styles.eyebrow}>{t("PRIMEROS PASOS")}</div>
          <h1>{guide.name}</h1>
          <p className={styles.lead}>{guide.description}</p>
          <div className={styles.guideHero}>
            <div>
              <Layers size={44} />
              <span>kivora</span>
              <small>
                {t("Las piezas las ponemos nosotros.")}
                <br />
                {t("La idea sigue siendo tuya.")}
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
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
              {section.code && (
                <CodeBlock code={section.code} label={section.label} />
              )}
            </section>
          ))}
          <div className={styles.callout}>
            <BookOpen size={18} />
            <p>
              {guide.slug === "instalacion-react-native" ? (
                <>
                  {t("Consulta la")}{" "}
                  <Link href="https://www.npmjs.com/package/@kivora/native">
                    {t("API nativa")}
                  </Link>{" "}
                  {t("y las")}{" "}
                  <Link href="/docs/multiplataforma">
                    {t("diferencias entre plataformas")}
                  </Link>
                  .
                </>
              ) : (
                <>
                  {t("Continúa con")}{" "}
                  <Link href="/docs/componentes/button">Button</Link>{" "}
                  {t("o explora el")}{" "}
                  <Link href="/docs/componentes">
                    {t("catálogo de componentes web")}
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </main>
        <Toc items={sections} />
      </div>
    );
  }
  notFound();
}
