"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { KivoraProvider } from "@kivora/nextjs";
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
import { components, componentHref, groups, guides } from "../catalog";
import styles from "../docs.module.css";

export type DocsTheme = "light" | "dark" | "candy" | "mint";
const ThemeContext = createContext<{
  theme: DocsTheme;
  setTheme: (theme: DocsTheme) => void;
}>({ theme: "light", setTheme: () => {} });
export const useDocsTheme = () => useContext(ThemeContext);
export function ThemePicker() {
  const { theme, setTheme } = useDocsTheme();
  return (
    <div
      className={styles.themePicker}
      role="group"
      aria-label="Tema de la documentación"
    >
      {(
        [
          ["light", "Claro", "#6558e8"],
          ["dark", "Oscuro", "#282534"],
          ["candy", "Rosa", "#bf6396"],
          ["mint", "Verde", "#438e71"],
        ] as const
      ).map(([value, label, color]) => (
        <button
          type="button"
          key={value}
          title={label}
          aria-label={`Tema ${label.toLowerCase()}`}
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
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<DocsTheme>("light");
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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <KivoraProvider colorMode={theme === "dark" ? "dark" : "light"}>
        <div className={`kivora-theme ${styles.shell}`} data-theme={theme}>
          <a href="#docs-content" className={styles.skipLink}>
            Saltar al contenido
          </a>
          <header className={styles.topbar}>
            <div className={styles.topbarBrand}>
              <button
                className={styles.mobileToggle}
                aria-label={
                  mobileOpen ? "Cerrar navegación" : "Abrir navegación"
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
                Documentación
              </Link>
            </div>
            <nav className={styles.topNav} aria-label="Navegación principal">
              <Link href="/">Ejemplos</Link>
              <Link
                href="/docs/componentes"
                aria-current={
                  pathname === "/docs/componentes" ? "page" : undefined
                }
              >
                Componentes
              </Link>
              <a
                href="https://www.npmjs.com/package/@kivora/nextjs"
                target="_blank"
                rel="noreferrer"
              >
                npm <ArrowUpRight size={13} />
              </a>
              <ThemePicker />
            </nav>
          </header>
          {mobileOpen && (
            <button
              className={styles.mobileBackdrop}
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            id="docs-sidebar"
            className={styles.sidebar}
            data-open={mobileOpen}
            aria-label="Navegación de documentación"
          >
            <div className={styles.search}>
              <Search size={15} />
              <input
                ref={search}
                type="search"
                aria-label="Buscar en la documentación"
                placeholder="Buscar documentación…"
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
                Bienvenido a Kivora
              </Link>
              {visibleGuides.length > 0 && (
                <details open className={styles.navGroup}>
                  <summary>
                    Primeros pasos
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
                <span>COMPONENTES</span>
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
                  No hay resultados para «{query}». Prueba con Button, temas o
                  formularios.
                </p>
              )}
            </nav>
            <div className={styles.sidebarFoot}>
              <span className={styles.versionDot} /> @kivora/nextjs{" "}
              <span>0.2.0</span>
            </div>
          </aside>
          <div className={styles.document} key={pathname}>
            {children}
            <footer className={styles.footer}>
              <span>Hecho con Kivora. Pensado para crear.</span>
              <Link href="/">
                Volver a los ejemplos <ArrowUpRight size={13} />
              </Link>
            </footer>
          </div>
        </div>
      </KivoraProvider>
    </ThemeContext.Provider>
  );
}
