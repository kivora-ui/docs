import { notFound, redirect } from "next/navigation";
import { getLocale } from "../../../_lib/i18n/server";
import { translator } from "../../../_lib/i18n";
import { pageMetadata } from "../../../_lib/seo";
import { ChatApp, IssuesApp, SpacecraftApp, CrmApp } from "../../../(public)/showcase/applications";
import { showcaseCases } from "../../../(public)/showcase/catalog";
import styles from "../../../(public)/showcase/applications.module.css";

const scenes = { chat: ChatApp, incidencias: IssuesApp, nave: SpacecraftApp, crm: CrmApp };
export function generateStaticParams() { return showcaseCases.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "tienda") redirect("/showcase/crm");
  if (slug === "satelites") redirect("/showcase/nave");
  const item = showcaseCases.find(item => item.slug === slug);
  if (!item) notFound();
  const locale = await getLocale();
  const title = translator(locale)(item.name);
  return { ...pageMetadata(title, translator(locale)(item.description), `/showcase/${slug}`, locale), title: { absolute: title } };
}
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "tienda") redirect("/showcase/crm");
  if (slug === "satelites") redirect("/showcase/nave");
  const item = showcaseCases.find(item => item.slug === slug);
  if (!item) notFound();
  const t = translator(await getLocale());
  const Scene = scenes[item.slug];
  return (
    <main className={`kivora-theme ${styles.application}`} data-theme={item.theme} aria-label={t(item.name)}>
      <Scene />
    </main>
  );
}
