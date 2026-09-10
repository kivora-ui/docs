"use client";
import { useT, LanguagePicker } from "../_lib/i18n/provider";

import { useSiteTheme } from "../_lib/site-theme";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@kivora/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Layers,
  Moon,
  Sun,
} from "lucide-react";
import styles from "./page.module.css";
import { Workspace, Analytics, Studio, Commerce } from "./_components/example-scenes";

const examples = [
  {
    name: "Workspace",
    category: "Equipos que conectan",
    theme: "light",
    accent: "#6558e8",
  },
  {
    name: "Analytics",
    category: "Datos con otra perspectiva",
    theme: "dark",
    accent: "#a79bff",
  },
  {
    name: "Studio",
    category: "Un poco más de imaginación",
    theme: "candy",
    accent: "#a03872",
  },
  {
    name: "Commerce",
    category: "Ideas que se convierten en marcas",
    theme: "mint",
    accent: "#287c60",
  },
] as const;

const scenes = [Workspace, Analytics, Studio, Commerce];

export default function MainPage() {
  const t = useT();
  const [active, setActive] = useState(0);
  const { theme, setTheme } = useSiteTheme();
  const dark = theme === "dark";
  const [copied, setCopied] = useState(false);
  const touchStart = useRef<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function move(index: number) {
    setActive((index + examples.length) % examples.length);
  }
  async function copyInstall() {
    try {
      await navigator.clipboard.writeText("npx @kivora/init");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <main className={`kivora-theme ${styles.page}`} data-theme={theme}>
      <div className={styles.backdrop} aria-hidden="true" />
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href="/"
          aria-label={t("Kivora, inicio")}
        >
          <span className={styles.brandMark}>
            <Layers size={23} strokeWidth={2.4} />
          </span>
          kivora
        </Link>
        <nav className={styles.nav} aria-label={t("Navegación principal")}>
          <Link className={styles.navActive} href="/docs/componentes">
            {t("Componentes")}
          </Link>
          <Link href="/docs">{t("Documentación")}</Link>
          <Link href="/showcase">Showcase</Link>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.mobileDocs} href="/showcase">Showcase</Link>
          <Link className={styles.mobileDocs} href="/docs">
            Docs
          </Link>
          <a
            href="https://www.npmjs.com/package/@kivora/nextjs"
            target="_blank"
            rel="noreferrer"
            aria-label={t("Kivora en npm")}
            title={t("Kivora en npm")}
            className={styles.npmLink}
          >
            <svg
              width="32"
              height="14"
              viewBox="0 0 18 7"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M0 0v6h5v1h4V6h9V0H0z M1 1h4v4H4V2H3v3H1V1z M6 1h4v4H9v1H6V1z M7 2v2h1V2H7z M11 1h6v4h-1V2h-1v3h-1V2h-1v3h-2V1z"
              />
            </svg>
          </a>
          <LanguagePicker />
          <button
            aria-label={
              dark ? t("Activar tema claro") : t("Activar tema oscuro")
            }
            aria-pressed={dark}
            onClick={() => setTheme(dark ? "light" : "dark")}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <section className={styles.hero}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <Link className={styles.release} href="/docs/multiplataforma">
              <span /> React + React Native <ArrowRight size={13} />
            </Link>
            <h1>
              <span className={styles.headlineLead}>
                {t("Tu web y tu app.")}
              </span>
              <span>{t("Mismo diseño.")}</span>
            </h1>
            <p className={styles.description}>
              {t(
                "Componentes para React y React Native con un mismo lenguaje visual. Lleva tu marca de la web al móvil sin rediseñar cada pantalla. Crea más rápido. Haz que todo encaje.",
              )}
            </p>
            <div className={styles.code}>
              <div className={styles.codeHeader}>
                <span>
                  <Code2 size={14} /> {t("Empieza a construir")}
                </span>
                <span>React / Next.js</span>
              </div>
              <pre>
                <code>
                  <span className={styles.syntax}>import</span>
                  {" { Button } "}
                  <span className={styles.syntax}>from</span>{" "}
                  <span className={styles.string}>{'"@kivora/nextjs"'}</span>
                  {";\n\n"}
                  <span className={styles.syntax}>{"<Button>"}</span>
                  {t("Crear mi app")}
                  <span className={styles.syntax}>{"</Button>"}</span>
                </code>
              </pre>
            </div>
            <div className={styles.actions}>
              <Button className={styles.startButton} onClick={copyInstall}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t("Comando copiado") : "npx @kivora/init"}
              </Button>
              <Button variant="ghost" onClick={() => move(active + 1)}>
                {t("Ver ejemplos")}
                <ArrowRight size={16} />
              </Button>
            </div>
            <p className={styles.footnote}>
              {t("Una identidad. Todas tus pantallas.")}
            </p>
          </div>
          <div className={styles.sliderControls}>
            <div className={styles.sliderLabel}>
              <span>
                {t("Pruébalo en directo")}
                <span className={styles.liveDot} />
              </span>
              <span className={styles.slideCount}>
                0{active + 1} <span>/ 04</span>
              </span>
            </div>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label={t("Ejemplos de Kivora")}
            >
              {examples.map((example, index) => (
                <button
                  key={example.name}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  id={`example-tab-${index}`}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls={`example-panel-${index}`}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => move(index)}
                  onKeyDown={(event) => {
                    let next = index;
                    if (event.key === "ArrowRight") next = (index + 1) % 4;
                    else if (event.key === "ArrowLeft") next = (index + 3) % 4;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = 3;
                    else return;
                    event.preventDefault();
                    move(next);
                    tabs.current[next]?.focus();
                  }}
                >
                  <i style={{ background: example.accent }} />
                  <span>{example.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className={styles.showcase}
          role="region"
          aria-label={t("Galería de ejemplos")}
          aria-roledescription={t("carrusel")}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current !== null) {
              const delta =
                touchStart.current - event.changedTouches[0].clientX;
              if (Math.abs(delta) > 60) move(active + (delta > 0 ? 1 : -1));
            }
            touchStart.current = null;
          }}
        >
          <div className={styles.showcaseHeader}>
            <span>
              <span className={styles.previewDot} />{" "}
              {t(examples[active].category)}
            </span>
            <span className={styles.previewMeta}>
              {t("HECHO CON KIVORA")}
              <Layers size={13} />
            </span>
          </div>
          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {scenes.map((Scene, index) => (
                <section
                  key={examples[index].name}
                  id={`example-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`example-tab-${index}`}
                  aria-hidden={index !== active}
                  inert={index !== active}
                  className={styles.slide}
                >
                  <Scene />
                </section>
              ))}
            </div>
          </div>
          <div className={styles.showcaseFooter}>
            <span>
              <span className={styles.themeDot} />{" "}
              {theme === "dark"
                ? "Dark"
                : theme === "light"
                  ? "Light"
                  : theme === "candy"
                    ? "Rose"
                    : "Sage"}{" "}
              theme <span className={styles.footerDivider}>/</span>{" "}
              {t("Componentes reales. Pruébalos.")}
            </span>
            <div>
              <button
                aria-label={t("Ejemplo anterior")}
                onClick={() => move(active - 1)}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                aria-label={t("Ejemplo siguiente")}
                onClick={() => move(active + 1)}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
