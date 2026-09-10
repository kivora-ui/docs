"use client";
import { useT, useLocale, LanguagePicker } from "../../_lib/i18n/provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSiteTheme, type SiteTheme } from "../../_lib/site-theme";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Command,
  Layers,
  Menu,
  Search,
  X,
} from "lucide-react";
import { componentHref } from "../catalog";
import { getDocs } from "../localized";
import styles from "../docs.module.css";

export type DocsTheme = SiteTheme;
export const useDocsTheme = useSiteTheme;
export function ThemePicker() {
  const t = useT();
  const { theme, setTheme } = useDocsTheme();
  return (
    <div
      className={styles.themePicker}
      role="group"
      aria-label={t("Tema de la documentación")}
    >
      {(
        [
          ["light", t("Claro"), "#6558e8"],
          ["dark", t("Oscuro"), "#282534"],
          ["candy", t("Rosa"), "#bf6396"],
          ["mint", t("Verde"), "#438e71"],
        ] as const
      ).map(([value, label, color]) => (
        <button
          type="button"
          key={value}
          title={t(label)}
          aria-label={t("Tema {0}", { 0: label.toLowerCase() })}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <i style={{ background: color }} />
        </button>
      ))}
    </div>
  );
}
export function DocsShell({ children }: { children: ReactNode }) {
  const t = useT();
  const locale = useLocale();
  const { components, guides, groups } = getDocs(locale);
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useSiteTheme();
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setMobileOpen(true);
        requestAnimationFrame(() => search.current?.focus());
      }
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const matches = (name: string, description: string) =>
    `${name} ${description}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase());
  const visibleComponents = components.filter((item) =>
    matches(item.name, item.description),
  );
  const visibleGuides = guides.filter((item) =>
    matches(item.name, item.description),
  );
  function navigate() {
    setMobileOpen(false);
    setQuery("");
  }
  return (
    <>
        <div className={`kivora-theme ${styles.shell}`} data-theme={theme}>
          <a href="#docs-content" className={styles.skipLink}>
            {t("Saltar al contenido")}
          </a>
          <header className={styles.topbar}>
            <div className={styles.topbarBrand}>
              <button
                className={styles.mobileToggle}
                aria-label={
                  mobileOpen ? t("Cerrar navegación") : t("Abrir navegación")
                }
                aria-expanded={mobileOpen}
                aria-controls="docs-sidebar"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
              <Link href="/" className={styles.brand}>
                <Layers size={23} strokeWidth={2.4} />
                kivora
              </Link>
              <span className={styles.brandDivider} />
              <Link href="/docs" className={styles.handbook} onClick={navigate}>
                {t("Documentación")}
              </Link>
            </div>
            <nav
              className={styles.topNav}
              aria-label={t("Navegación principal")}
            >
              <Link href="/">{t("Ejemplos")}</Link>
              <Link href="/showcase">Showcase</Link>
              <Link
                href="/docs/componentes"
                aria-current={
                  pathname === "/docs/componentes" ? "page" : undefined
                }
              >
                {t("Componentes")}
              </Link>
              <a
                href="https://www.npmjs.com/package/@kivora/nextjs"
                target="_blank"
                rel="noreferrer"
              >
                npm <ArrowUpRight size={13} />
              </a>
              <LanguagePicker />
              <ThemePicker />
            </nav>
          </header>
          {mobileOpen && (
            <button
              className={styles.mobileBackdrop}
              aria-label={t("Cerrar menú")}
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            id="docs-sidebar"
            className={styles.sidebar}
            data-open={mobileOpen}
            aria-label={t("Navegación de documentación")}
          >
            <div className={styles.search}>
              <Search size={15} />
              <input
                ref={search}
                type="search"
                aria-label={t("Buscar en la documentación")}
                placeholder={t("Buscar documentación…")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>
                <Command size={10} /> K
              </kbd>
            </div>
            <nav>
              <Link
                className={styles.overviewLink}
                data-active={pathname === "/docs"}
                href="/docs"
                onClick={navigate}
              >
                <BookOpen size={15} />
                {t("Bienvenido a Kivora")}
              </Link>
              <Link className={styles.overviewLink} href="/showcase" onClick={navigate}>
                Showcase
              </Link>
              {visibleGuides.length > 0 && (
                <details open className={styles.navGroup}>
                  <summary>
                    {t("Primeros pasos")}
                    <ChevronDown size={13} />
                  </summary>
                  <div>
                    {visibleGuides.map((guide) => (
                      <Link
                        data-active={pathname === `/docs/${guide.slug}`}
                        key={guide.slug}
                        href={`/docs/${guide.slug}`}
                        onClick={navigate}
                      >
                        {guide.name}
                      </Link>
                    ))}
                  </div>
                </details>
              )}
              <div className={styles.navSection}>
                <span>{t("COMPONENTES")}</span>
                <span>{components.length}</span>
              </div>
              {groups.map((group) => {
                const items = visibleComponents.filter(
                  (item) => item.group === group,
                );
                return (
                  items.length > 0 && (
                    <details
                      key={`${group}-${query ? "search" : "all"}`}
                      open
                      className={styles.navGroup}
                    >
                      <summary>
                        {group}
                        <ChevronDown size={13} />
                      </summary>
                      <div>
                        {items.map((item) => (
                          <Link
                            data-active={pathname === componentHref(item)}
                            aria-current={
                              pathname === componentHref(item)
                                ? "page"
                                : undefined
                            }
                            key={item.slug}
                            href={componentHref(item)}
                            onClick={navigate}
                          >
                            {item.name}
                            <span className={styles.itemDot} />
                          </Link>
                        ))}
                      </div>
                    </details>
                  )
                );
              })}
              {query && !visibleComponents.length && !visibleGuides.length && (
                <p className={styles.noResults} role="status">
                  {t("No hay resultados para «")}
                  {query}
                  {t("». Prueba con Button, temas o formularios.")}
                </p>
              )}
            </nav>
            <div className={styles.sidebarFoot}>
              <span className={styles.versionDot} /> @kivora/nextjs{" "}
              <span>0.3.0</span>
            </div>
          </aside>
          <div className={styles.document} key={pathname}>
            {children}
            <footer className={styles.footer}>
              <span>{t("Hecho con Kivora. Pensado para crear.")}</span>
              <Link href="/">
                {t("Volver a los ejemplos")}
                <ArrowUpRight size={13} />
              </Link>
            </footer>
          </div>
        </div>
      </>
  );
}
