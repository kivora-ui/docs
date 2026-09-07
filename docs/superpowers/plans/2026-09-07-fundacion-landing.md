# Fundación + Landing de kivora.dev — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** Convertir el repo `web` (Create Next App vacío) en la fundación de kivora.dev: integración real de `@kivora/nextjs`/`@kivora/theme`, sistema de preferencias (idioma sin prefijo de URL + tema claro/oscuro/sistema) persistido en cookies, shell de navegación (Header/Footer) y una home funcional, con páginas placeholder para `/docs`, `/componentes` y `/demo`.

**Arquitectura:** Next.js 16 App Router, un único árbol de rutas sin locale en la URL. Un componente cliente `Providers` (en `app/providers.tsx`) envuelve `KivoraProvider` y expone un contexto propio `usePreferences()` (idioma + modo de color), inicializado desde cookies leídas en el layout raíz (Server Component) y persistido mediante Server Actions. Todo el shell y la home se construyen con componentes reales de `@kivora/nextjs` (dogfooding).

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind CSS 4.1, `@kivora/nextjs`/`@kivora/theme` (npm, `0.0.0`), Vitest + React Testing Library (unitarios), Playwright (e2e).

**Spec:** [docs/superpowers/specs/2026-09-07-fundacion-landing-design.md](../specs/2026-09-07-fundacion-landing-design.md)

## Corrección respecto al spec

El spec asumía que `useKivoraTheme()` expondría un setter para cambiar `colorMode`. Al inspeccionar `packages/nextjs/src/provider.tsx` del monorepo `module`, `KivoraProvider` solo **lee** `colorMode` de su prop (no hay setter expuesto): el modo de color debe gestionarse fuera de la librería y pasarse como prop. Este plan corrige esa parte del spec fusionando la gestión de idioma y modo de color en un único contexto propio `usePreferences()` en `app/providers.tsx`, que persiste ambos valores en cookies con el mismo patrón (Server Action + `router.refresh()`). El resto del spec (decisiones de diseño, alcance, riesgos) no cambia.

## Global Constraints

- `@kivora/nextjs` y `@kivora/theme` fijados en `0.0.0` exacto (versión publicada actual; son paquetes `0.0.x` en desarrollo activo).
- `tailwindcss` y `@tailwindcss/postcss` en `^4.1` (peer dependency de `@kivora/nextjs`).
- `lucide-react` en `^1.40.0` (misma versión que usa `@kivora/nextjs` internamente; se declara explícitamente en `package.json` porque nuestros propios componentes la importan directamente, en vez de depender de que quede resuelta como dependencia transitiva).
- Todo el shell y la home usan componentes de `@kivora/nextjs`; no se introduce una librería de UI paralela.
- Idioma sin prefijo de URL: cookie `kivora-locale` (`en` | `es`, por defecto `en`).
- Modo de color persistido en cookie `kivora-color-mode` (`light` | `dark` | `system`, por defecto `system`).
- Sin toggle Web/Native en el hero en este sub-proyecto (pospuesto).
- Sin enlace a GitHub en el footer: no existe todavía una URL de repositorio pública. Solo se enlazan los 4 paquetes npm reales (`@kivora/nextjs`, `@kivora/native`, `@kivora/theme`, `@kivora/init`).
- Acento de marca: índigo. Light: `--color-primary: oklch(51.1% 0.262 276.966)` / `--color-primary-foreground: oklch(1 0 0)`. Dark: `--color-primary: oklch(67.3% 0.182 276.935)` / `--color-primary-foreground: oklch(0.205 0 0)` (mismos valores que Tailwind `indigo-600`/`indigo-400`).

---

## Mapa de archivos

```
package.json                        # Modificar: dependencias + scripts de test
next.config.ts                      # Modificar: transpilePackages
app/globals.css                     # Modificar: import de estilos Kivora + acento índigo
app/layout.tsx                      # Modificar: lee cookies, monta Providers/Header/Footer
app/providers.tsx                   # Crear: PreferencesProvider + KivoraProvider + usePreferences()
app/page.tsx                        # Modificar: composición de la home
app/docs/page.tsx                   # Crear: placeholder
app/componentes/page.tsx            # Crear: placeholder
app/demo/page.tsx                   # Crear: placeholder
lib/i18n/types.ts                   # Crear: Locale, Dictionary
lib/i18n/en.ts                      # Crear: diccionario inglés
lib/i18n/es.ts                      # Crear: diccionario español
lib/i18n/index.ts                   # Crear: dictionaries map + re-exports
lib/i18n/dictionaries.test.ts       # Crear: test de paridad de claves
lib/preferences.ts                  # Crear: nombres de cookie + resolveInitialPreferences()
lib/preferences.test.ts             # Crear
lib/preferences-actions.ts          # Crear: Server Actions setLocaleCookie/setColorModeCookie
lib/preferences-actions.test.ts     # Crear
components/shell/nav-link.tsx       # Crear
components/shell/nav-link.test.tsx  # Crear
components/shell/theme-toggle.tsx   # Crear
components/shell/theme-toggle.test.tsx # Crear
components/shell/locale-toggle.tsx  # Crear
components/shell/locale-toggle.test.tsx # Crear
components/shell/header.tsx         # Crear
components/shell/header.test.tsx    # Crear
components/shell/footer.tsx         # Crear
components/shell/footer.test.tsx    # Crear
components/home/hero.tsx            # Crear
components/home/hero.test.tsx       # Crear
components/home/stats-bar.tsx       # Crear
components/home/stats-bar.test.tsx  # Crear
components/home/feature-grid.tsx    # Crear
components/home/feature-grid.test.tsx # Crear
components/home/install-snippet.tsx # Crear
components/home/install-snippet.test.tsx # Crear
components/home/gallery-teaser.tsx  # Crear
components/home/gallery-teaser.test.tsx # Crear
components/placeholder-page.tsx     # Crear
components/placeholder-page.test.tsx # Crear
vitest.config.ts                    # Crear
vitest.setup.ts                     # Crear
playwright.config.ts                # Crear
tests/e2e/home.spec.ts              # Crear
```

---

### Task 1: Instalación, configuración base y acento de marca

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx` (metadata provisional; el wiring completo de cookies llega en la Task 6)
- Create: `app/providers.tsx` (versión mínima: solo `KivoraProvider`, sin preferencias todavía)
- Modify: `app/page.tsx` (contenido temporal, se reemplaza en la Task 10)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

**Interfaces:**
- Produces: `app/providers.tsx` exporta `Providers({ children }: { children: React.ReactNode })` (firma provisional; la Task 5 la reemplaza por la firma final `{ children, locale, colorMode }`).

- [ ] **Step 1: Instalar dependencias**

```bash
npm install @kivora/nextjs@0.0.0 @kivora/theme@0.0.0 lucide-react@^1.40.0
npm install -D tailwindcss@^4.1 @tailwindcss/postcss@^4.1 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

- [ ] **Step 2: Configurar `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kivora/nextjs", "@kivora/theme"],
};

export default nextConfig;
```

- [ ] **Step 3: Reemplazar `app/globals.css`**

```css
@import "@kivora/nextjs/styles.css";
@source "../node_modules/@kivora/nextjs/dist";

:root {
  --color-primary: oklch(51.1% 0.262 276.966);
  --color-primary-foreground: oklch(1 0 0);
}

.dark {
  --color-primary: oklch(67.3% 0.182 276.935);
  --color-primary-foreground: oklch(0.205 0 0);
}
```

- [ ] **Step 4: Crear `app/providers.tsx` (versión mínima)**

```tsx
"use client";

import type { ReactNode } from "react";
import { KivoraProvider } from "@kivora/nextjs";

export function Providers({ children }: { children: ReactNode }) {
  return <KivoraProvider colorMode="system">{children}</KivoraProvider>;
}
```

- [ ] **Step 5: Actualizar `app/layout.tsx` (metadata y montaje provisional de Providers)**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kivora",
  description: "Componentes multiplataforma para Web y React Native.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Reemplazar `app/page.tsx` por un smoke temporal**

```tsx
import { Button } from "@kivora/nextjs";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Button>Kivora</Button>
    </main>
  );
}
```

- [ ] **Step 7: Crear `vitest.config.ts`**

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 8: Crear `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 9: Añadir scripts de test a `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "next build && playwright test"
  }
}
```

- [ ] **Step 10: Verificar que el proyecto compila y arranca**

Run: `npm run build`
Expected: compila sin errores; `app/page.tsx` renderiza un botón "Kivora" con estilos de `@kivora/nextjs` aplicados (acento índigo visible en modo claro).

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json next.config.ts app/globals.css app/layout.tsx app/providers.tsx app/page.tsx vitest.config.ts vitest.setup.ts
git commit -m "feat: integrar @kivora/nextjs y configurar Vitest

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Diccionarios de idioma (en/es)

**Files:**
- Create: `lib/i18n/types.ts`
- Create: `lib/i18n/en.ts`
- Create: `lib/i18n/es.ts`
- Create: `lib/i18n/index.ts`
- Test: `lib/i18n/dictionaries.test.ts`

**Interfaces:**
- Produces: `Locale = "en" | "es"`, `Dictionary` (interfaz completa, ver Step 3), `dictionaries: Record<Locale, Dictionary>`, `en: Dictionary`, `es: Dictionary` — todos importables desde `@/lib/i18n`.

- [ ] **Step 1: Escribir el test de paridad de claves (falla: los módulos no existen)**

`lib/i18n/dictionaries.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { es } from "./es";

function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
    collectKeyPaths(nested, prefix ? `${prefix}.${key}` : key)
  );
}

describe("dictionaries", () => {
  it("en and es expose exactly the same set of keys", () => {
    expect(collectKeyPaths(es).sort()).toEqual(collectKeyPaths(en).sort());
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- lib/i18n/dictionaries.test.ts`
Expected: FAIL — "Cannot find module './en'" (o equivalente).

- [ ] **Step 3: Crear `lib/i18n/types.ts`**

```ts
export type Locale = "en" | "es";

export interface Dictionary {
  shell: {
    themeToggleLabel: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    localeToggleLabel: string;
  };
  nav: {
    home: string;
    docs: string;
    components: string;
    demo: string;
  };
  footer: {
    packagesHeading: string;
    copyright: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    previewLabel: string;
    previewTitle: string;
    previewButton: string;
  };
  stats: {
    componentFamiliesLabel: string;
    platformsLabel: string;
    themesLabel: string;
  };
  features: {
    heading: string;
    forms: { title: string; description: string };
    tables: { title: string; description: string };
    player: { title: string; description: string };
    uploads: { title: string; description: string };
    theming: { title: string; description: string };
  };
  install: {
    heading: string;
    description: string;
  };
  gallery: {
    heading: string;
    description: string;
    ctaLabel: string;
  };
  placeholder: {
    docsTitle: string;
    componentsTitle: string;
    demoTitle: string;
    comingSoon: string;
  };
}
```

- [ ] **Step 4: Crear `lib/i18n/en.ts`**

```ts
import type { Dictionary } from "./types";

export const en: Dictionary = {
  shell: {
    themeToggleLabel: "Color theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    localeToggleLabel: "Language",
  },
  nav: {
    home: "Home",
    docs: "Docs",
    components: "Components",
    demo: "Demo",
  },
  footer: {
    packagesHeading: "Packages",
    copyright: "Kivora — cross-platform components for Web and React Native.",
  },
  hero: {
    eyebrow: "Web + React Native",
    title: "Components that speak the same visual language, everywhere",
    subtitle:
      "116 component families, one shared theme, built for desktop, tablet and mobile.",
    ctaPrimary: "Browse components",
    ctaSecondary: "Read the docs",
    previewLabel: "Live preview",
    previewTitle: "Button, Card and friends — rendered for real",
    previewButton: "Try me",
  },
  stats: {
    componentFamiliesLabel: "component families",
    platformsLabel: "platforms",
    themesLabel: "themes",
  },
  features: {
    heading: "Everything a product needs, already themed",
    forms: {
      title: "Forms & inputs",
      description: "Input, Select, Checkbox, Switch, RadioGroup, Slider, Calendar and DatePicker.",
    },
    tables: {
      title: "Tables & data",
      description: "DataTable with search, filtering, sorting and selection.",
    },
    player: {
      title: "Video Player",
      description: "Shaka-powered playback with DRM, HLS/DASH and ad breaks.",
    },
    uploads: {
      title: "File uploads",
      description: "Tus + Uppy uploads, with a simple and an advanced dashboard mode.",
    },
    theming: {
      title: "Theming",
      description: "Light and dark modes with a shared, overridable design token set.",
    },
  },
  install: {
    heading: "Install in a minute",
    description: "The installer configures dependencies, styles and the provider for you.",
  },
  gallery: {
    heading: "Explore the catalogue",
    description: "A growing set of component families, shared between Web and React Native.",
    ctaLabel: "See all components",
  },
  placeholder: {
    docsTitle: "Documentation",
    componentsTitle: "Components",
    demoTitle: "OTT ERP demo",
    comingSoon: "This section is coming soon.",
  },
};
```

- [ ] **Step 5: Crear `lib/i18n/es.ts`**

```ts
import type { Dictionary } from "./types";

export const es: Dictionary = {
  shell: {
    themeToggleLabel: "Tema de color",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    localeToggleLabel: "Idioma",
  },
  nav: {
    home: "Inicio",
    docs: "Docs",
    components: "Componentes",
    demo: "Demo",
  },
  footer: {
    packagesHeading: "Paquetes",
    copyright: "Kivora — componentes multiplataforma para Web y React Native.",
  },
  hero: {
    eyebrow: "Web + React Native",
    title: "Componentes que hablan el mismo lenguaje visual, en cualquier plataforma",
    subtitle:
      "116 familias de componentes, un mismo tema compartido, pensado para escritorio, tablet y móvil.",
    ctaPrimary: "Ver componentes",
    ctaSecondary: "Leer la documentación",
    previewLabel: "Vista previa en vivo",
    previewTitle: "Button, Card y compañía — renderizados de verdad",
    previewButton: "Pruébame",
  },
  stats: {
    componentFamiliesLabel: "familias de componentes",
    platformsLabel: "plataformas",
    themesLabel: "temas",
  },
  features: {
    heading: "Todo lo que necesita un producto, ya con tema",
    forms: {
      title: "Formularios",
      description: "Input, Select, Checkbox, Switch, RadioGroup, Slider, Calendar y DatePicker.",
    },
    tables: {
      title: "Tablas y datos",
      description: "DataTable con búsqueda, filtros, orden y selección.",
    },
    player: {
      title: "Player de vídeo",
      description: "Reproducción con Shaka, DRM, HLS/DASH y cortes publicitarios.",
    },
    uploads: {
      title: "Subida de ficheros",
      description: "Subidas con Tus + Uppy, en modo simple o con panel avanzado.",
    },
    theming: {
      title: "Temas",
      description: "Modo claro y oscuro con un conjunto de tokens de diseño compartido y personalizable.",
    },
  },
  install: {
    heading: "Instálalo en un minuto",
    description: "El instalador configura dependencias, estilos y el provider por ti.",
  },
  gallery: {
    heading: "Explora el catálogo",
    description: "Un catálogo creciente de familias de componentes, compartido entre Web y React Native.",
    ctaLabel: "Ver todos los componentes",
  },
  placeholder: {
    docsTitle: "Documentación",
    componentsTitle: "Componentes",
    demoTitle: "Demo de ERP para OTT",
    comingSoon: "Esta sección estará disponible próximamente.",
  },
};
```

- [ ] **Step 6: Crear `lib/i18n/index.ts`**

```ts
export * from "./types";
export { en } from "./en";
export { es } from "./es";

import type { Dictionary, Locale } from "./types";
import { en } from "./en";
import { es } from "./es";

export const dictionaries: Record<Locale, Dictionary> = { en, es };
```

- [ ] **Step 7: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- lib/i18n/dictionaries.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add lib/i18n
git commit -m "feat: añadir diccionarios de idioma en/es

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Resolución de preferencias desde cookies

**Files:**
- Create: `lib/preferences.ts`
- Test: `lib/preferences.test.ts`

**Interfaces:**
- Consumes: `Locale` desde `@/lib/i18n`.
- Produces: `LOCALE_COOKIE: string`, `COLOR_MODE_COOKIE: string`, `CookieReader` (interfaz `{ get(name: string): { value: string } | undefined }`), `InitialPreferences { locale: Locale; colorMode: ColorMode }`, `resolveInitialPreferences(cookieStore: CookieReader): InitialPreferences`.

- [ ] **Step 1: Escribir los tests (fallan: el módulo no existe)**

`lib/preferences.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE, resolveInitialPreferences } from "./preferences";

function cookieStoreWith(values: Record<string, string>) {
  return {
    get(name: string) {
      const value = values[name];
      return value === undefined ? undefined : { value };
    },
  };
}

describe("resolveInitialPreferences", () => {
  it("defaults to English and system color mode when no cookies are set", () => {
    expect(resolveInitialPreferences(cookieStoreWith({}))).toEqual({
      locale: "en",
      colorMode: "system",
    });
  });

  it("reads a valid locale and color mode from cookies", () => {
    const store = cookieStoreWith({ [LOCALE_COOKIE]: "es", [COLOR_MODE_COOKIE]: "dark" });
    expect(resolveInitialPreferences(store)).toEqual({ locale: "es", colorMode: "dark" });
  });

  it("falls back to defaults for invalid cookie values", () => {
    const store = cookieStoreWith({ [LOCALE_COOKIE]: "fr", [COLOR_MODE_COOKIE]: "purple" });
    expect(resolveInitialPreferences(store)).toEqual({ locale: "en", colorMode: "system" });
  });
});
```

- [ ] **Step 2: Ejecutar los tests y comprobar que fallan**

Run: `npm run test -- lib/preferences.test.ts`
Expected: FAIL — "Cannot find module './preferences'".

- [ ] **Step 3: Implementar `lib/preferences.ts`**

```ts
import type { ColorMode } from "@kivora/theme";
import type { Locale } from "@/lib/i18n";

export const LOCALE_COOKIE = "kivora-locale";
export const COLOR_MODE_COOKIE = "kivora-color-mode";

const LOCALES: readonly Locale[] = ["en", "es"];
const COLOR_MODES: readonly ColorMode[] = ["light", "dark", "system"];

export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export interface InitialPreferences {
  locale: Locale;
  colorMode: ColorMode;
}

function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

function isColorMode(value: string | undefined): value is ColorMode {
  return (COLOR_MODES as readonly string[]).includes(value ?? "");
}

export function resolveInitialPreferences(cookieStore: CookieReader): InitialPreferences {
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const rawColorMode = cookieStore.get(COLOR_MODE_COOKIE)?.value;

  return {
    locale: isLocale(rawLocale) ? rawLocale : "en",
    colorMode: isColorMode(rawColorMode) ? rawColorMode : "system",
  };
}
```

- [ ] **Step 4: Ejecutar los tests y comprobar que pasan**

Run: `npm run test -- lib/preferences.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/preferences.ts lib/preferences.test.ts
git commit -m "feat: resolver idioma y modo de color desde cookies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Server Actions de persistencia de preferencias

**Files:**
- Create: `lib/preferences-actions.ts`
- Test: `lib/preferences-actions.test.ts`

**Interfaces:**
- Consumes: `LOCALE_COOKIE`, `COLOR_MODE_COOKIE` desde `@/lib/preferences`; `Locale` desde `@/lib/i18n`; `ColorMode` desde `@kivora/theme`.
- Produces: `setLocaleCookie(locale: Locale): Promise<void>`, `setColorModeCookie(colorMode: ColorMode): Promise<void>`.

- [ ] **Step 1: Escribir los tests (fallan: el módulo no existe)**

`lib/preferences-actions.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

const setMock = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ set: setMock })),
}));

import { setColorModeCookie, setLocaleCookie } from "./preferences-actions";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE } from "./preferences";

describe("preferences actions", () => {
  it("persists the locale cookie for one year, site-wide", async () => {
    await setLocaleCookie("es");
    expect(setMock).toHaveBeenCalledWith(LOCALE_COOKIE, "es", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  });

  it("persists the color mode cookie for one year, site-wide", async () => {
    await setColorModeCookie("dark");
    expect(setMock).toHaveBeenCalledWith(COLOR_MODE_COOKIE, "dark", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  });
});
```

- [ ] **Step 2: Ejecutar los tests y comprobar que fallan**

Run: `npm run test -- lib/preferences-actions.test.ts`
Expected: FAIL — "Cannot find module './preferences-actions'".

- [ ] **Step 3: Implementar `lib/preferences-actions.ts`**

```ts
"use server";

import { cookies } from "next/headers";
import type { ColorMode } from "@kivora/theme";
import type { Locale } from "@/lib/i18n";
import { COLOR_MODE_COOKIE, LOCALE_COOKIE } from "@/lib/preferences";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLocaleCookie(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR_IN_SECONDS });
}

export async function setColorModeCookie(colorMode: ColorMode): Promise<void> {
  const store = await cookies();
  store.set(COLOR_MODE_COOKIE, colorMode, { path: "/", maxAge: ONE_YEAR_IN_SECONDS });
}
```

- [ ] **Step 4: Ejecutar los tests y comprobar que pasan**

Run: `npm run test -- lib/preferences-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/preferences-actions.ts lib/preferences-actions.test.ts
git commit -m "feat: persistir preferencias de idioma y tema en cookies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: `PreferencesProvider` (`app/providers.tsx`) y hook `usePreferences`

**Files:**
- Modify: `app/providers.tsx` (reemplaza la versión mínima de la Task 1)
- Test: `app/providers.test.tsx`

**Interfaces:**
- Consumes: `KivoraProvider` de `@kivora/nextjs`; `dictionaries`, `Locale`, `Dictionary` de `@/lib/i18n`; `setLocaleCookie`, `setColorModeCookie` de `@/lib/preferences-actions`; `ColorMode` de `@kivora/theme`; `useRouter` de `next/navigation`.
- Produces: `Providers({ children, locale, colorMode }: { children: ReactNode; locale: Locale; colorMode: ColorMode })`; `usePreferences(): { locale: Locale; dictionary: Dictionary; setLocale: (locale: Locale) => void; colorMode: ColorMode; setColorMode: (colorMode: ColorMode) => void }`.

- [ ] **Step 1: Escribir el test (falla: la firma actual de `Providers` no acepta `locale`/`colorMode` ni existe `usePreferences`)**

`app/providers.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

const setLocaleCookie = vi.fn(async () => undefined);
const setColorModeCookie = vi.fn(async () => undefined);
vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: (...args: unknown[]) => setLocaleCookie(...args),
  setColorModeCookie: (...args: unknown[]) => setColorModeCookie(...args),
}));

import { es } from "@/lib/i18n";
import { Providers, usePreferences } from "./providers";

function Consumer() {
  const { locale, dictionary, setLocale, colorMode, setColorMode } = usePreferences();
  return (
    <div>
      <p>locale:{locale}</p>
      <p>colorMode:{colorMode}</p>
      <p>title:{dictionary.hero.title}</p>
      <button onClick={() => setLocale("es")}>switch-locale</button>
      <button onClick={() => setColorMode("dark")}>switch-color-mode</button>
    </div>
  );
}

describe("Providers / usePreferences", () => {
  it("exposes the initial locale and color mode, and updates optimistically", async () => {
    const user = userEvent.setup();
    render(
      <Providers locale="en" colorMode="system">
        <Consumer />
      </Providers>
    );

    expect(screen.getByText("locale:en")).toBeInTheDocument();
    expect(screen.getByText("colorMode:system")).toBeInTheDocument();

    await user.click(screen.getByText("switch-locale"));
    expect(screen.getByText("locale:es")).toBeInTheDocument();
    expect(screen.getByText(`title:${es.hero.title}`)).toBeInTheDocument();
    expect(setLocaleCookie).toHaveBeenCalledWith("es");

    await user.click(screen.getByText("switch-color-mode"));
    expect(screen.getByText("colorMode:dark")).toBeInTheDocument();
    expect(setColorModeCookie).toHaveBeenCalledWith("dark");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- app/providers.test.tsx`
Expected: FAIL — `usePreferences` no está exportado / `Providers` no acepta `locale`/`colorMode`.

- [ ] **Step 3: Implementar `app/providers.tsx`**

```tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KivoraProvider } from "@kivora/nextjs";
import type { ColorMode } from "@kivora/theme";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";
import { setColorModeCookie, setLocaleCookie } from "@/lib/preferences-actions";

interface PreferencesContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}

const PreferencesContext = React.createContext<PreferencesContextValue | null>(null);

export function usePreferences(): PreferencesContextValue {
  const context = React.useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within Providers");
  }
  return context;
}

export interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  colorMode: ColorMode;
}

export function Providers({ children, locale: initialLocale, colorMode: initialColorMode }: ProvidersProps) {
  const router = useRouter();
  const [locale, setLocaleState] = React.useState(initialLocale);
  const [colorMode, setColorModeState] = React.useState(initialColorMode);

  const setLocale = React.useCallback(
    (next: Locale) => {
      setLocaleState(next);
      void setLocaleCookie(next).then(() => router.refresh());
    },
    [router]
  );

  const setColorMode = React.useCallback(
    (next: ColorMode) => {
      setColorModeState(next);
      void setColorModeCookie(next).then(() => router.refresh());
    },
    [router]
  );

  const value = React.useMemo<PreferencesContextValue>(
    () => ({ locale, dictionary: dictionaries[locale], setLocale, colorMode, setColorMode }),
    [locale, setLocale, colorMode, setColorMode]
  );

  return (
    <PreferencesContext.Provider value={value}>
      <KivoraProvider colorMode={colorMode}>{children}</KivoraProvider>
    </PreferencesContext.Provider>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- app/providers.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/providers.tsx app/providers.test.tsx
git commit -m "feat: gestionar idioma y modo de color en Providers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Wiring del layout raíz

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `resolveInitialPreferences` de `@/lib/preferences`; `Providers` de `./providers` (firma final de la Task 5); `Header` y `Footer` (de la Task 8 — este task deja los imports listos, ver nota).

> Nota de secuencia: `Header`/`Footer` se implementan en la Task 8. Este task monta `RootLayout` sin ellos (solo `Providers` + `children`) para no bloquearse en una dependencia futura; la Task 8 añade las dos líneas que los insertan.

- [ ] **Step 1: Actualizar `app/layout.tsx` para leer las cookies y pasarlas a `Providers`**

```tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { resolveInitialPreferences } from "@/lib/preferences";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kivora",
  description: "Componentes multiplataforma para Web y React Native.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const { locale, colorMode } = resolveInitialPreferences(cookieStore);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers locale={locale} colorMode={colorMode}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verificar que el proyecto sigue compilando**

Run: `npm run build`
Expected: compila sin errores. `next/headers`'s `cookies()` solo funciona en un contexto de servidor: al no existir todavía ninguna cookie en el navegador de pruebas, `resolveInitialPreferences` debe devolver los valores por defecto (`en`/`system`) — esto ya está cubierto por los tests de la Task 3.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: inicializar preferencias desde cookies en el layout raíz

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Primitivas interactivas del shell (`NavLink`, `ThemeToggle`, `LocaleToggle`)

**Files:**
- Create: `components/shell/nav-link.tsx`
- Test: `components/shell/nav-link.test.tsx`
- Create: `components/shell/theme-toggle.tsx`
- Test: `components/shell/theme-toggle.test.tsx`
- Create: `components/shell/locale-toggle.tsx`
- Test: `components/shell/locale-toggle.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/app/providers`; `usePathname` de `next/navigation`; `ToggleGroup`, `ToggleGroupItem` de `@kivora/nextjs`; `cn` de `@kivora/theme`.
- Produces: `NavLink({ href, children }: { href: string; children: React.ReactNode })`; `ThemeToggle()`; `LocaleToggle()`.

- [ ] **Step 1: Escribir el test de `NavLink` (falla: el módulo no existe)**

`components/shell/nav-link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/docs",
}));

import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <>
        <NavLink href="/docs">Docs</NavLink>
        <NavLink href="/componentes">Componentes</NavLink>
      </>
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Componentes" })).not.toHaveAttribute("aria-current");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/shell/nav-link.test.tsx`
Expected: FAIL — "Cannot find module './nav-link'".

- [ ] **Step 3: Implementar `components/shell/nav-link.tsx`**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kivora/theme";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/shell/nav-link.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de `ThemeToggle` (falla: el módulo no existe)**

`components/shell/theme-toggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

const setColorMode = vi.fn();
vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode,
  }),
}));

import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("switches to dark when the Dark option is selected", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(setColorMode).toHaveBeenCalledWith("dark");
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/shell/theme-toggle.test.tsx`
Expected: FAIL — "Cannot find module './theme-toggle'".

- [ ] **Step 7: Implementar `components/shell/theme-toggle.tsx`**

```tsx
"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { ColorMode } from "@kivora/theme";
import { usePreferences } from "@/app/providers";

export function ThemeToggle() {
  const { colorMode, setColorMode, dictionary } = usePreferences();

  return (
    <ToggleGroup
      type="single"
      value={colorMode}
      onValueChange={(value) => {
        if (value) setColorMode(value as ColorMode);
      }}
      aria-label={dictionary.shell.themeToggleLabel}
    >
      <ToggleGroupItem value="light" aria-label={dictionary.shell.themeLight}>
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label={dictionary.shell.themeDark}>
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label={dictionary.shell.themeSystem}>
        <Laptop className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/shell/theme-toggle.test.tsx`
Expected: PASS

- [ ] **Step 9: Escribir el test de `LocaleToggle` (falla: el módulo no existe)**

`components/shell/locale-toggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

const setLocale = vi.fn();
vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale,
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { LocaleToggle } from "./locale-toggle";

describe("LocaleToggle", () => {
  it("switches to Spanish when ES is selected", async () => {
    const user = userEvent.setup();
    render(<LocaleToggle />);

    await user.click(screen.getByRole("radio", { name: "ES" }));
    expect(setLocale).toHaveBeenCalledWith("es");
  });
});
```

- [ ] **Step 10: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/shell/locale-toggle.test.tsx`
Expected: FAIL — "Cannot find module './locale-toggle'".

- [ ] **Step 11: Implementar `components/shell/locale-toggle.tsx`**

```tsx
"use client";

import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { Locale } from "@/lib/i18n";
import { usePreferences } from "@/app/providers";

export function LocaleToggle() {
  const { locale, setLocale, dictionary } = usePreferences();

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={(value) => {
        if (value) setLocale(value as Locale);
      }}
      aria-label={dictionary.shell.localeToggleLabel}
    >
      <ToggleGroupItem value="en">EN</ToggleGroupItem>
      <ToggleGroupItem value="es">ES</ToggleGroupItem>
    </ToggleGroup>
  );
}
```

- [ ] **Step 12: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/shell/locale-toggle.test.tsx`
Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add components/shell/nav-link.tsx components/shell/nav-link.test.tsx components/shell/theme-toggle.tsx components/shell/theme-toggle.test.tsx components/shell/locale-toggle.tsx components/shell/locale-toggle.test.tsx
git commit -m "feat: añadir NavLink, ThemeToggle y LocaleToggle

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Composición del shell (`Header`, `Footer`) e integración en el layout

**Files:**
- Create: `components/shell/header.tsx`
- Test: `components/shell/header.test.tsx`
- Create: `components/shell/footer.tsx`
- Test: `components/shell/footer.test.tsx`
- Modify: `app/layout.tsx` (monta `Header`/`Footer` alrededor de `children`)

**Interfaces:**
- Consumes: `NavLink`, `ThemeToggle`, `LocaleToggle` (Task 7); `usePreferences` de `@/app/providers`.
- Produces: `Header()`, `Footer()`.

- [ ] **Step 1: Escribir el test de `Header` (falla: el módulo no existe)**

`components/shell/header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: vi.fn(async () => undefined),
  setColorModeCookie: vi.fn(async () => undefined),
}));

import { Providers } from "@/app/providers";
import { Header } from "./header";

describe("Header", () => {
  it("renders the four navigation links", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Header />
      </Providers>
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/componentes");
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "/demo");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/shell/header.test.tsx`
Expected: FAIL — "Cannot find module './header'".

- [ ] **Step 3: Implementar `components/shell/header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePreferences } from "@/app/providers";
import { LocaleToggle } from "./locale-toggle";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { dictionary } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="text-lg font-bold text-foreground">
          Kivora
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink href="/">{dictionary.nav.home}</NavLink>
          <NavLink href="/docs">{dictionary.nav.docs}</NavLink>
          <NavLink href="/componentes">{dictionary.nav.components}</NavLink>
          <NavLink href="/demo">{dictionary.nav.demo}</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/shell/header.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de `Footer` (falla: el módulo no existe)**

`components/shell/footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: vi.fn(async () => undefined),
  setColorModeCookie: vi.fn(async () => undefined),
}));

import { Providers } from "@/app/providers";
import { Footer } from "./footer";

describe("Footer", () => {
  it("links to the four published npm packages", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Footer />
      </Providers>
    );

    expect(screen.getByRole("link", { name: "@kivora/nextjs" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/nextjs"
    );
    expect(screen.getByRole("link", { name: "@kivora/native" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/native"
    );
    expect(screen.getByRole("link", { name: "@kivora/theme" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/theme"
    );
    expect(screen.getByRole("link", { name: "@kivora/init" })).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/@kivora/init"
    );
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/shell/footer.test.tsx`
Expected: FAIL — "Cannot find module './footer'".

- [ ] **Step 7: Implementar `components/shell/footer.tsx`**

```tsx
"use client";

import { usePreferences } from "@/app/providers";

const PACKAGES = [
  { name: "@kivora/nextjs", href: "https://www.npmjs.com/package/@kivora/nextjs" },
  { name: "@kivora/native", href: "https://www.npmjs.com/package/@kivora/native" },
  { name: "@kivora/theme", href: "https://www.npmjs.com/package/@kivora/theme" },
  { name: "@kivora/init", href: "https://www.npmjs.com/package/@kivora/init" },
] as const;

export function Footer() {
  const { dictionary } = usePreferences();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10">
        <p className="text-sm font-semibold text-foreground">{dictionary.footer.packagesHeading}</p>
        <ul className="flex flex-wrap gap-4">
          {PACKAGES.map((pkg) => (
            <li key={pkg.name}>
              <a
                href={pkg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {pkg.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{dictionary.footer.copyright}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/shell/footer.test.tsx`
Expected: PASS

- [ ] **Step 9: Montar `Header`/`Footer` en `app/layout.tsx`**

Modificar el `return` de `RootLayout` (`app/layout.tsx`) para que quede así:

```tsx
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers locale={locale} colorMode={colorMode}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
```

Y añadir los imports correspondientes al principio del archivo:

```tsx
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
```

- [ ] **Step 10: Verificar que el proyecto sigue compilando**

Run: `npm run build`
Expected: compila sin errores; la home muestra el header con navegación y el footer con los 4 enlaces a npm.

- [ ] **Step 11: Commit**

```bash
git add components/shell/header.tsx components/shell/header.test.tsx components/shell/footer.tsx components/shell/footer.test.tsx app/layout.tsx
git commit -m "feat: montar Header y Footer en el layout raíz

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Home — `Hero` y `StatsBar`

**Files:**
- Create: `components/home/hero.tsx`
- Test: `components/home/hero.test.tsx`
- Create: `components/home/stats-bar.tsx`
- Test: `components/home/stats-bar.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/app/providers`; `Button`, `Card`, `CardContent` de `@kivora/nextjs`.
- Produces: `Hero()`, `StatsBar()`.

- [ ] **Step 1: Escribir el test de `Hero` (falla: el módulo no existe)**

`components/home/hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline and both calls to action", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1, name: en.hero.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: en.hero.ctaPrimary })).toHaveAttribute(
      "href",
      "/componentes"
    );
    expect(screen.getByRole("link", { name: en.hero.ctaSecondary })).toHaveAttribute("href", "/docs");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/home/hero.test.tsx`
Expected: FAIL — "Cannot find module './hero'".

- [ ] **Step 3: Implementar `components/home/hero.tsx`**

```tsx
"use client";

import { Button, Card, CardContent } from "@kivora/nextjs";
import { usePreferences } from "@/app/providers";

export function Hero() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {dictionary.hero.eyebrow}
      </p>
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {dictionary.hero.title}
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">{dictionary.hero.subtitle}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <a href="/componentes">{dictionary.hero.ctaPrimary}</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="/docs">{dictionary.hero.ctaSecondary}</a>
        </Button>
      </div>
      <Card className="mt-6 w-full max-w-sm text-left">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{dictionary.hero.previewLabel}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{dictionary.hero.previewTitle}</p>
          <Button className="mt-4" size="sm">
            {dictionary.hero.previewButton}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/home/hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de `StatsBar` (falla: el módulo no existe)**

`components/home/stats-bar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { StatsBar } from "./stats-bar";

describe("StatsBar", () => {
  it("shows the component families, platforms and themes stats", () => {
    render(<StatsBar />);

    expect(screen.getByText("116")).toBeInTheDocument();
    expect(screen.getByText(en.stats.componentFamiliesLabel)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(en.stats.platformsLabel)).toBeInTheDocument();
    expect(screen.getByText(en.stats.themesLabel)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/home/stats-bar.test.tsx`
Expected: FAIL — "Cannot find module './stats-bar'".

- [ ] **Step 7: Implementar `components/home/stats-bar.tsx`**

```tsx
"use client";

import { usePreferences } from "@/app/providers";

export function StatsBar() {
  const { dictionary } = usePreferences();

  const stats = [
    { value: "116", label: dictionary.stats.componentFamiliesLabel },
    { value: "2", label: dictionary.stats.platformsLabel },
    { value: "2", label: dictionary.stats.themesLabel },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/home/stats-bar.test.tsx`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add components/home/hero.tsx components/home/hero.test.tsx components/home/stats-bar.tsx components/home/stats-bar.test.tsx
git commit -m "feat: añadir Hero y StatsBar de la home

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Home — `FeatureGrid`, `InstallSnippet`, `GalleryTeaser` y composición de la página

**Files:**
- Create: `components/home/feature-grid.tsx`
- Test: `components/home/feature-grid.test.tsx`
- Create: `components/home/install-snippet.tsx`
- Test: `components/home/install-snippet.test.tsx`
- Create: `components/home/gallery-teaser.tsx`
- Test: `components/home/gallery-teaser.test.tsx`
- Modify: `app/page.tsx` (reemplaza el smoke temporal de la Task 1)

**Interfaces:**
- Consumes: `usePreferences` de `@/app/providers`; `Code` de `@kivora/nextjs`.
- Produces: `FeatureGrid()`, `InstallSnippet()`, `GalleryTeaser()`.

- [ ] **Step 1: Escribir el test de `FeatureGrid` (falla: el módulo no existe)**

`components/home/feature-grid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { FeatureGrid } from "./feature-grid";

describe("FeatureGrid", () => {
  it("renders the five feature cards", () => {
    render(<FeatureGrid />);

    expect(screen.getByText(en.features.forms.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.tables.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.player.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.uploads.title)).toBeInTheDocument();
    expect(screen.getByText(en.features.theming.title)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/home/feature-grid.test.tsx`
Expected: FAIL — "Cannot find module './feature-grid'".

- [ ] **Step 3: Implementar `components/home/feature-grid.tsx`**

```tsx
"use client";

import { usePreferences } from "@/app/providers";

export function FeatureGrid() {
  const { dictionary } = usePreferences();

  const features = [
    dictionary.features.forms,
    dictionary.features.tables,
    dictionary.features.player,
    dictionary.features.uploads,
    dictionary.features.theming,
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.features.heading}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/home/feature-grid.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de `InstallSnippet` (falla: el módulo no existe)**

`components/home/install-snippet.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { InstallSnippet } from "./install-snippet";

describe("InstallSnippet", () => {
  it("shows the install heading and the init command", () => {
    render(<InstallSnippet />);

    expect(screen.getByText(en.install.heading)).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === "npx @kivora/init")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/home/install-snippet.test.tsx`
Expected: FAIL — "Cannot find module './install-snippet'".

- [ ] **Step 7: Implementar `components/home/install-snippet.tsx`**

```tsx
"use client";

import { Code } from "@kivora/nextjs";
import { usePreferences } from "@/app/providers";

export function InstallSnippet() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.install.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.install.description}</p>
      <div className="mt-6 text-left">
        <Code language="bash" copyable filename="terminal">
          {"npx @kivora/init"}
        </Code>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/home/install-snippet.test.tsx`
Expected: PASS

- [ ] **Step 9: Escribir el test de `GalleryTeaser` (falla: el módulo no existe)**

`components/home/gallery-teaser.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { GalleryTeaser } from "./gallery-teaser";

describe("GalleryTeaser", () => {
  it("renders every teaser card and a closing CTA, all linking to /componentes", () => {
    render(<GalleryTeaser />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(11); // 10 tarjetas + el CTA "ver todos"
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/componentes");
    }
    expect(screen.getByRole("link", { name: en.gallery.ctaLabel })).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/home/gallery-teaser.test.tsx`
Expected: FAIL — "Cannot find module './gallery-teaser'".

- [ ] **Step 11: Implementar `components/home/gallery-teaser.tsx`**

```tsx
"use client";

import { usePreferences } from "@/app/providers";

const COMPONENT_NAMES = [
  "Button",
  "Card",
  "Table",
  "Calendar",
  "DatePicker",
  "Carousel",
  "Player",
  "FileUpload",
  "Dialog",
  "Accordion",
] as const;

export function GalleryTeaser() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.gallery.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.gallery.description}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COMPONENT_NAMES.map((name) => (
          <a
            key={name}
            href="/componentes"
            className="rounded-lg border border-border p-4 text-center text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            {name}
          </a>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="/componentes" className="text-sm font-semibold text-primary hover:underline">
          {dictionary.gallery.ctaLabel}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 12: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/home/gallery-teaser.test.tsx`
Expected: PASS

- [ ] **Step 13: Componer la home en `app/page.tsx`**

```tsx
import { FeatureGrid } from "@/components/home/feature-grid";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { Hero } from "@/components/home/hero";
import { InstallSnippet } from "@/components/home/install-snippet";
import { StatsBar } from "@/components/home/stats-bar";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <InstallSnippet />
      <GalleryTeaser />
    </>
  );
}
```

- [ ] **Step 14: Verificar que el proyecto compila**

Run: `npm run build`
Expected: compila sin errores; la home muestra las cinco secciones en orden.

- [ ] **Step 15: Commit**

```bash
git add components/home/feature-grid.tsx components/home/feature-grid.test.tsx components/home/install-snippet.tsx components/home/install-snippet.test.tsx components/home/gallery-teaser.tsx components/home/gallery-teaser.test.tsx app/page.tsx
git commit -m "feat: completar la composición de la home

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Páginas placeholder (`/docs`, `/componentes`, `/demo`)

**Files:**
- Create: `components/placeholder-page.tsx`
- Test: `components/placeholder-page.test.tsx`
- Create: `app/docs/page.tsx`
- Create: `app/componentes/page.tsx`
- Create: `app/demo/page.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/app/providers`.
- Produces: `PlaceholderPage({ titleKey }: { titleKey: "docsTitle" | "componentsTitle" | "demoTitle" })`.

- [ ] **Step 1: Escribir el test (falla: el módulo no existe)**

`components/placeholder-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/app/providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import { PlaceholderPage } from "./placeholder-page";

describe("PlaceholderPage", () => {
  it("renders the title for the given key and the coming-soon message", () => {
    render(<PlaceholderPage titleKey="docsTitle" />);

    expect(screen.getByRole("heading", { name: en.placeholder.docsTitle })).toBeInTheDocument();
    expect(screen.getByText(en.placeholder.comingSoon)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/placeholder-page.test.tsx`
Expected: FAIL — "Cannot find module './placeholder-page'".

- [ ] **Step 3: Implementar `components/placeholder-page.tsx`**

```tsx
"use client";

import { usePreferences } from "@/app/providers";

export interface PlaceholderPageProps {
  titleKey: "docsTitle" | "componentsTitle" | "demoTitle";
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground">{dictionary.placeholder[titleKey]}</h1>
      <p className="text-muted-foreground">{dictionary.placeholder.comingSoon}</p>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/placeholder-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Crear las tres rutas placeholder**

`app/docs/page.tsx`:

```tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function DocsPage() {
  return <PlaceholderPage titleKey="docsTitle" />;
}
```

`app/componentes/page.tsx`:

```tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function ComponentesPage() {
  return <PlaceholderPage titleKey="componentsTitle" />;
}
```

`app/demo/page.tsx`:

```tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function DemoPage() {
  return <PlaceholderPage titleKey="demoTitle" />;
}
```

- [ ] **Step 6: Verificar que el proyecto compila**

Run: `npm run build`
Expected: compila sin errores; `/docs`, `/componentes` y `/demo` responden 200.

- [ ] **Step 7: Commit**

```bash
git add components/placeholder-page.tsx components/placeholder-page.test.tsx app/docs/page.tsx app/componentes/page.tsx app/demo/page.tsx
git commit -m "feat: añadir páginas placeholder para docs, componentes y demo

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Playwright — configuración y smoke e2e

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: la aplicación construida (`npm run build` + `npm run start -- -p 3100`), a través de `test:e2e` (definido en la Task 1).

- [ ] **Step 1: Crear `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3100",
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Instalar el navegador de Playwright (una sola vez)**

Run: `npx playwright install chromium`

- [ ] **Step 3: Escribir el smoke e2e**

`tests/e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("la home carga y el nav no da 404", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const homeResponse = await page.goto("/");
  expect(homeResponse?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  for (const path of ["/docs", "/componentes", "/demo"]) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
  }

  expect(consoleErrors).toEqual([]);
});

test("el selector de tema aplica la clase dark al elemento html", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(html).toHaveClass(/dark/);
});

test("el selector de idioma cambia el titular visible", async ({ page }) => {
  await page.goto("/");
  const englishHeading = await page.getByRole("heading", { level: 1 }).textContent();

  await page.getByRole("radio", { name: "ES" }).click();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(englishHeading ?? "");
});
```

- [ ] **Step 4: Ejecutar el smoke e2e**

Run: `npm run test:e2e`
Expected: los 3 tests pasan contra la build de producción.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/home.spec.ts
git commit -m "test: añadir smoke e2e de Playwright para la fundación

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Verificación final

- [ ] `npm run lint` sin errores.
- [ ] `npm run test` — toda la suite de Vitest pasa.
- [ ] `npm run test:e2e` — el smoke de Playwright pasa contra la build de producción.
- [ ] Revisión manual en el navegador: home, `/docs`, `/componentes`, `/demo`, toggle de tema (claro/oscuro/sistema) y toggle de idioma (en/es), en escritorio y en un viewport móvil.
