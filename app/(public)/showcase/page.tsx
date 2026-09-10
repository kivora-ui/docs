import { ThemeSurface } from "../../_lib/site-theme";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getLocale } from "../../_lib/i18n/server";
import { translator } from "../../_lib/i18n";
import { pageMetadata } from "../../_lib/seo";
import { showcaseCases } from "./catalog";
import { ShowcaseHeader } from "./header";
import styles from "./showcase.module.css";
export async function generateMetadata() {
  const locale = await getLocale();
  return pageMetadata("Showcase", translator(locale)("Cuatro formas de construir con Kivora. Explora nuestros casos de uso."), "/showcase", locale);
}
export default async function ShowcasePage() {
  const t = translator(await getLocale());
  return <ThemeSurface className={styles.page}>
    <ShowcaseHeader />
    <main className={styles.container}>
      <section className={styles.intro}>
        <span className={styles.eyebrow}>SHOWCASE / 001—004</span>
        <h1>{t("Una librería.")}<br /><span>{t("Muchas posibilidades.")}</span></h1>
        <p>{t("Cuatro formas de construir con Kivora. Explora nuestros casos de uso.")}</p>
      </section>
      <div className={styles.grid}>
        {showcaseCases.map((item) => {
          return <Link href={`/showcase/${item.slug}`} key={item.slug} className={styles.caseCard}>
            <div className={styles.preview}>
              <Image
                src={item.image}
                alt={t("Captura de {0}", { 0: t(item.name) })}
                fill
                sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1260px) calc((100vw - 108px) / 2), 576px"
                className={styles.previewImage}
              />
            </div>
            <div className={styles.cardCopy}><div><span className={styles.eyebrow}>{item.number} / {t(item.category)}</span><h2>{t(item.name)}</h2></div><ArrowUpRight size={23} /></div>
            <p>{t(item.description)}</p>
            <span className={styles.explore}>{t("Explorar caso")} <ArrowUpRight size={14} /></span>
          </Link>;
        })}
      </div>
      <footer className={styles.footer}><span>{t("Componentes reales. Pruébalos.")}</span><Link href="/docs">{t("Empieza a construir")} <ArrowUpRight size={15} /></Link></footer>
    </main>
  </ThemeSurface>;
}
