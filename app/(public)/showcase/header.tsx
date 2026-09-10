"use client";
import Link from "next/link";
import { useSiteTheme } from "../../_lib/site-theme";
import { Layers, Moon, Sun } from "lucide-react";
import { LanguagePicker, useT } from "../../_lib/i18n/provider";
import styles from "./showcase.module.css";
export function ShowcaseHeader() {
  const t = useT();
  const { theme, setTheme } = useSiteTheme();
  return <header className={styles.header}>
    <Link href="/" className={styles.brand} aria-label={t("Kivora, inicio")}><Layers size={24} /> kivora</Link>
    <nav aria-label={t("Navegación principal")}>
      <Link href="/docs/componentes">{t("Componentes")}</Link>
      <Link href="/docs">{t("Documentación")}</Link>
      <Link href="/showcase" aria-current="location">Showcase</Link>
    </nav>
    <LanguagePicker />
    <button type="button" aria-label={t(theme === "dark" ? "Activar tema claro" : "Activar tema oscuro")} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "transparent", color: "var(--ink)", border: 0, cursor: "pointer", padding: 6 }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
  </header>;
}
