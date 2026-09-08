# Fundación + Landing de kivora.dev — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir el shell de navegación, el tema/idioma y la home pública de kivora.dev sobre la convención de carpetas `src/` ya adoptada, dejando `/docs`, `/componentes` y `/demo` como placeholders navegables.

**Architecture:** Next.js App Router con `app/` en la raíz (obligatorio: Next.js ignora `src/app` si `app/` ya existe en la raíz) y el resto del código de aplicación (`components`, `providers`, `lib`) bajo `src/`. Dogfooding total: el shell y la home usan componentes reales de `@kivora/nextjs`/`@kivora/theme` (ya instalados como tarballs locales del monorepo `module`), sin CSS de marca a medida más allá de utilidades Tailwind. Preferencias (idioma y modo de color) viven en cookies leídas en el layout raíz (Server Component) y expuestas a los Client Components vía un contexto React (`Providers`/`usePreferences`) que actualiza el estado de forma optimista y persiste con Server Actions.

**Tech Stack:** Next.js 16.3.4 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS 4.3.3, `@kivora/nextjs`/`@kivora/theme` 0.0.0 (tarballs locales), Vitest 5 + React Testing Library + `@testing-library/user-event` (unit/component), Playwright 1.63 (e2e), ESLint (`eslint-config-next`).

**Spec:** `docs/superpowers/specs/2026-09-08-fundacion-landing-design.md`

## Global Constraints

- Alias `@/*` debe apuntar a `./src/*` en `tsconfig.json` (requisito documentado en `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md` al usar una carpeta `src/`).
- El router de la aplicación vive en `app/` en la raíz del proyecto (no en `src/app/`): Next.js ignora `src/app` si `app/` ya existe en la raíz, y `app/` ya contiene `favicon.ico`, `globals.css` y `not-found.tsx`.
- No se añade ninguna dependencia nueva a `package.json`. Todo se construye con lo ya instalado (`@kivora/nextjs`, `@kivora/theme`, `lucide-react`, `next/font/google`).
- Bilingüe (en/es) sin prefijo de URL: cookie `kivora-locale` (ya implementada en `src/lib/preferences.ts` / `src/lib/preferences-actions.ts`, sin cambios).
- Modo de color vía cookie `kivora-color-mode` + prop controlada `colorMode` de `KivoraProvider` (ya implementado en `src/lib/preferences.ts` / `src/lib/preferences-actions.ts`, sin cambios).
- `Providers`/`usePreferences` viven en `src/providers/app-providers.tsx` (no en `app/providers.tsx`), para que todo el código de aplicación resuelva con el único alias `@/*` → `src/*`.
- Todo componente que consuma texto lo hace a través de `usePreferences().dictionary`, nunca hardcodeado (ver `src/lib/i18n/`, ya migrado íntegro).
- TDD estricto en todo lo que sea lógicamente testable con Vitest + RTL (test primero, implementación mínima, refactor). Los layouts/páginas de solo composición (sin lógica propia) no llevan test unitario dedicado, siguiendo el mismo criterio que el resto del proyecto; quedan cubiertos por el smoke e2e de Playwright al final del plan.
- Cada tarea termina con un commit siguiendo Conventional Commits, en español, igual que el resto del historial del repositorio.

---

### Task 1: Apuntar el alias `@/*` a `src/`

**Files:**
- Modify: `tsconfig.json`

**Interfaces:**
- Consumes: nada.
- Produces: el alias `@/*` resuelto contra `src/`, que usan todas las tareas siguientes (`@/lib/...`, `@/providers/...`, `@/components/...`).

- [ ] **Step 1: Comprobar el error actual de resolución**

Run: `npm run typecheck`
Expected: incluye, entre otros, estos dos errores (los que arregla esta tarea):

```
src/lib/preferences-actions.ts(5,29): error TS2307: Cannot find module '@/lib/i18n' or its corresponding type declarations.
src/lib/preferences.ts(2,29): error TS2307: Cannot find module '@/lib/i18n' or its corresponding type declarations.
```

- [ ] **Step 2: Actualizar `tsconfig.json`**

```json
    "paths": {
      "@/*": ["./src/*"]
    }
```

(sustituye la entrada `"@/*": ["./*"]` existente; el resto del fichero no cambia).

- [ ] **Step 3: Verificar que esos dos errores desaparecen**

Run: `npm run typecheck`
Expected: los dos errores de `src/lib/preferences.ts` y `src/lib/preferences-actions.ts` ya no aparecen. Seguirán apareciendo errores sobre `app/(marketing)/*`, `app/demo/*` y `app/not-found.tsx` (páginas y componentes que las tareas siguientes recrean) — eso es esperado en este punto.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json
git commit -m "fix: apuntar el alias @/* a src/ tras mover lib/ a src/lib/

Sigue la recomendación de node_modules/next/dist/docs para proyectos con
carpeta src/: el alias debe incluir src/ o los imports @/lib/... dejan de
resolver.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: `Providers` / `usePreferences`

**Files:**
- Create: `src/providers/app-providers.tsx`
- Test: `src/providers/app-providers.test.tsx`

**Interfaces:**
- Consumes: `dictionaries`, `Dictionary`, `Locale` de `@/lib/i18n`; `setColorModeCookie`, `setLocaleCookie` de `@/lib/preferences-actions`; `KivoraProvider` de `@kivora/nextjs`; `ColorMode` de `@kivora/theme`.
- Produces: `Providers` (componente, props `{ children: ReactNode; locale: Locale; colorMode: ColorMode }`) y `usePreferences()` (hook que devuelve `{ locale, dictionary, setLocale, colorMode, setColorMode }`). Todas las tareas de componentes siguientes importan `usePreferences` desde `@/providers/app-providers`.

- [ ] **Step 1: Escribir el test (falla: el módulo no existe)**

```tsx
// src/providers/app-providers.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("@/lib/preferences-actions", () => ({
  setLocaleCookie: vi.fn(async () => undefined),
  setColorModeCookie: vi.fn(async () => undefined),
}));

import { es } from "@/lib/i18n";
import { setColorModeCookie, setLocaleCookie } from "@/lib/preferences-actions";
import { Providers, usePreferences } from "./app-providers";

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

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/providers/app-providers.test.tsx`
Expected: FAIL — `Failed to resolve import "./app-providers"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/providers/app-providers.tsx
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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/providers/app-providers.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/providers/app-providers.tsx src/providers/app-providers.test.tsx
git commit -m "feat: añadir Providers/usePreferences (idioma y modo de color)

Contexto React que envuelve KivoraProvider, expone el diccionario resuelto
y persiste los cambios de idioma/tema en cookie vía Server Actions, con
actualización optimista del estado en memoria.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Layout raíz (`app/layout.tsx`)

**Files:**
- Create: `app/layout.tsx`

**Interfaces:**
- Consumes: `resolveInitialPreferences` de `@/lib/preferences`; `Providers` de `@/providers/app-providers` (Task 2).
- Produces: el `<html>`/`<body>` raíz que envuelve toda la aplicación; ninguna tarea de código depende de sus internos (solo el smoke e2e final lo ejercita en runtime).

- [ ] **Step 1: Escribir el layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { resolveInitialPreferences } from "@/lib/preferences";
import { Providers } from "@/providers/app-providers";
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

No lleva test unitario dedicado (Server Component que solo lee cookies y compone `Providers`, mismo criterio que el resto del proyecto); queda cubierto por el smoke e2e de la Task 18.

- [ ] **Step 2: Verificar que compila**

Run: `npm run typecheck`
Expected: ya no hay errores sobre `app/layout.tsx`. (Seguirá habiendo errores sobre `app/(marketing)/*`, `app/demo/*` y `app/not-found.tsx` hasta las tareas siguientes.)

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: añadir el layout raíz (idioma y tema iniciales desde cookies)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: `NavLink`

**Files:**
- Create: `src/components/shell/nav-link.tsx`
- Test: `src/components/shell/nav-link.test.tsx`

**Interfaces:**
- Consumes: `cn` de `@kivora/theme`; `usePathname` de `next/navigation`.
- Produces: `NavLink` (props `{ href: string; children: ReactNode }`), usado por `Header` (Task 7).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/shell/nav-link.test.tsx
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

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/shell/nav-link.test.tsx`
Expected: FAIL — `Failed to resolve import "./nav-link"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/shell/nav-link.tsx
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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/shell/nav-link.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/nav-link.tsx src/components/shell/nav-link.test.tsx
git commit -m "feat: añadir NavLink con estado activo según la ruta

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: `ThemeToggle`

**Files:**
- Create: `src/components/shell/theme-toggle.tsx`
- Test: `src/components/shell/theme-toggle.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers` (Task 2); `ToggleGroup`, `ToggleGroupItem` de `@kivora/nextjs`; `ColorMode` de `@kivora/theme`.
- Produces: `ThemeToggle` (sin props), usado por `Header` (Task 7).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/shell/theme-toggle.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

const setColorMode = vi.fn();
vi.mock("@/providers/app-providers", () => ({
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

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/shell/theme-toggle.test.tsx`
Expected: FAIL — `Failed to resolve import "./theme-toggle"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/shell/theme-toggle.tsx
"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { ColorMode } from "@kivora/theme";
import { usePreferences } from "@/providers/app-providers";

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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/shell/theme-toggle.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/theme-toggle.tsx src/components/shell/theme-toggle.test.tsx
git commit -m "feat: añadir ThemeToggle (claro/oscuro/sistema)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: `LocaleToggle`

**Files:**
- Create: `src/components/shell/locale-toggle.tsx`
- Test: `src/components/shell/locale-toggle.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers` (Task 2); `ToggleGroup`, `ToggleGroupItem` de `@kivora/nextjs`; `Locale` de `@/lib/i18n`.
- Produces: `LocaleToggle` (sin props), usado por `Header` (Task 7).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/shell/locale-toggle.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

const setLocale = vi.fn();
vi.mock("@/providers/app-providers", () => ({
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

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/shell/locale-toggle.test.tsx`
Expected: FAIL — `Failed to resolve import "./locale-toggle"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/shell/locale-toggle.tsx
"use client";

import { ToggleGroup, ToggleGroupItem } from "@kivora/nextjs";
import type { Locale } from "@/lib/i18n";
import { usePreferences } from "@/providers/app-providers";

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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/shell/locale-toggle.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/locale-toggle.tsx src/components/shell/locale-toggle.test.tsx
git commit -m "feat: añadir LocaleToggle (en/es)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: `Header`

**Files:**
- Create: `src/components/shell/header.tsx`
- Test: `src/components/shell/header.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; `Providers` de `@/providers/app-providers` (para el test); `NavLink` (Task 4), `ThemeToggle` (Task 5), `LocaleToggle` (Task 6); icono `Blocks` de `lucide-react`.
- Produces: `Header` (sin props), usado por el layout de marketing (Task 9) y por `app/not-found.tsx` (ya existente, Task 17).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/shell/header.test.tsx
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

import { Providers } from "@/providers/app-providers";
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

  it("shows a decorative icon next to the Kivora wordmark", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Header />
      </Providers>
    );

    const logo = screen.getByRole("link", { name: "Kivora" });
    expect(logo.querySelector("svg")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/shell/header.test.tsx`
Expected: FAIL — `Failed to resolve import "./header"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/shell/header.tsx
"use client";

import { Blocks } from "lucide-react";
import Link from "next/link";
import { usePreferences } from "@/providers/app-providers";
import { LocaleToggle } from "./locale-toggle";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { dictionary } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Blocks aria-hidden className="h-5 w-5 text-primary" />
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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/shell/header.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/header.tsx src/components/shell/header.test.tsx
git commit -m "feat: añadir Header con navegación, LocaleToggle y ThemeToggle

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: `Footer`

**Files:**
- Create: `src/components/shell/footer.tsx`
- Test: `src/components/shell/footer.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; icono `Package` de `lucide-react`.
- Produces: `Footer` (sin props), usado por el layout de marketing (Task 9) y por `app/not-found.tsx` (Task 17).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/shell/footer.test.tsx
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

import { Providers } from "@/providers/app-providers";
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

  it("shows a decorative icon next to every package link", () => {
    render(
      <Providers locale="en" colorMode="system">
        <Footer />
      </Providers>
    );

    for (const name of ["@kivora/nextjs", "@kivora/native", "@kivora/theme", "@kivora/init"]) {
      const link = screen.getByRole("link", { name });
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/shell/footer.test.tsx`
Expected: FAIL — `Failed to resolve import "./footer"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/shell/footer.tsx
"use client";

import { Package } from "lucide-react";
import { usePreferences } from "@/providers/app-providers";

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
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Package aria-hidden className="h-4 w-4" />
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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/shell/footer.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/footer.tsx src/components/shell/footer.test.tsx
git commit -m "feat: añadir Footer con enlaces a los paquetes npm de Kivora

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Grupo de rutas `(marketing)` — layout

**Files:**
- Create: `app/(marketing)/layout.tsx`

**Interfaces:**
- Consumes: `Header` (Task 7), `Footer` (Task 8).
- Produces: el cromado (`Header`/`Footer`) que envuelve `/`, `/docs`, `/componentes` (Task 10 y Task 16). `/demo` queda fuera de este grupo a propósito (ver spec: `/demo` tendrá su propio shell en el sub-proyecto 3, sin `Header`/`Footer` de marketing).

- [ ] **Step 1: Escribir el layout**

```tsx
// app/(marketing)/layout.tsx
import type { ReactNode } from "react";
import { Footer } from "@/components/shell/footer";
import { Header } from "@/components/shell/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
```

Sin test unitario dedicado (composición pura de dos componentes ya probados); cubierto por el smoke e2e de la Task 18.

- [ ] **Step 2: Verificar que compila**

Run: `npm run typecheck`
Expected: ya no hay errores sobre `app/(marketing)/layout.tsx`.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/layout.tsx"
git commit -m "feat: añadir el layout de marketing (Header + Footer)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: `Hero`

**Files:**
- Create: `src/components/home/hero.tsx`
- Test: `src/components/home/hero.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; `Button`, `Card`, `CardContent` de `@kivora/nextjs`.
- Produces: `Hero` (sin props), usado por la home (Task 15).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/home/hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/home/hero.test.tsx`
Expected: FAIL — `Failed to resolve import "./hero"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/home/hero.tsx
"use client";

import { Button, Card, CardContent } from "@kivora/nextjs";
import { usePreferences } from "@/providers/app-providers";

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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/home/hero.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/hero.tsx src/components/home/hero.test.tsx
git commit -m "feat: añadir Hero de la home con CTAs y preview en vivo

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: `StatsBar`

**Files:**
- Create: `src/components/home/stats-bar.tsx`
- Test: `src/components/home/stats-bar.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; iconos `Blocks`, `MonitorSmartphone`, `SunMoon` de `lucide-react`.
- Produces: `StatsBar` (sin props), usado por la home (Task 15).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/home/stats-bar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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
    // Platforms and themes both happen to be "2": assert the pair, not a single match.
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText(en.stats.platformsLabel)).toBeInTheDocument();
    expect(screen.getByText(en.stats.themesLabel)).toBeInTheDocument();
  });

  it("shows a decorative icon on every stat", () => {
    const { container } = render(<StatsBar />);
    expect(container.querySelectorAll("svg")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/home/stats-bar.test.tsx`
Expected: FAIL — `Failed to resolve import "./stats-bar"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/home/stats-bar.tsx
"use client";

import { Blocks, MonitorSmartphone, SunMoon } from "lucide-react";
import { usePreferences } from "@/providers/app-providers";

export function StatsBar() {
  const { dictionary } = usePreferences();

  const stats = [
    { icon: Blocks, value: "116", label: dictionary.stats.componentFamiliesLabel },
    { icon: MonitorSmartphone, value: "2", label: dictionary.stats.platformsLabel },
    { icon: SunMoon, value: "2", label: dictionary.stats.themesLabel },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <stat.icon aria-hidden className="h-5 w-5 text-primary" />
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/home/stats-bar.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/stats-bar.tsx src/components/home/stats-bar.test.tsx
git commit -m "feat: añadir StatsBar (familias de componentes, plataformas, temas)

La cifra de familias de componentes queda hardcodeada (116) por ahora; es
deuda técnica ya documentada en la spec.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: `FeatureGrid`

**Files:**
- Create: `src/components/home/feature-grid.tsx`
- Test: `src/components/home/feature-grid.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; iconos `CirclePlay`, `CloudUpload`, `Palette`, `SquarePen`, `Table2` de `lucide-react`.
- Produces: `FeatureGrid` (sin props), usado por la home (Task 15).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/home/feature-grid.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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

  it("shows a decorative icon on every feature card", () => {
    render(<FeatureGrid />);

    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles).toHaveLength(5);
    for (const title of titles) {
      expect(title.parentElement?.querySelector("svg")).not.toBeNull();
    }
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/home/feature-grid.test.tsx`
Expected: FAIL — `Failed to resolve import "./feature-grid"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/home/feature-grid.tsx
"use client";

import { CirclePlay, CloudUpload, Palette, SquarePen, Table2 } from "lucide-react";
import { usePreferences } from "@/providers/app-providers";

export function FeatureGrid() {
  const { dictionary } = usePreferences();

  const features = [
    { icon: SquarePen, ...dictionary.features.forms },
    { icon: Table2, ...dictionary.features.tables },
    { icon: CirclePlay, ...dictionary.features.player },
    { icon: CloudUpload, ...dictionary.features.uploads },
    { icon: Palette, ...dictionary.features.theming },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.features.heading}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border p-6">
            <feature.icon aria-hidden className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/home/feature-grid.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/feature-grid.tsx src/components/home/feature-grid.test.tsx
git commit -m "feat: añadir FeatureGrid con las cinco familias destacadas

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 13: `InstallSnippet`

**Files:**
- Create: `src/components/home/install-snippet.tsx`
- Test: `src/components/home/install-snippet.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; `Code` de `@kivora/nextjs`.
- Produces: `InstallSnippet` (sin props), usado por la home (Task 15).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/home/install-snippet.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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
    const { container } = render(<InstallSnippet />);

    expect(screen.getByText(en.install.heading)).toBeInTheDocument();
    // The syntax highlighter wraps the command in several nested elements
    // that all share the same textContent, so a single-element text query
    // would match more than one node; check the rendered output instead.
    expect(container.textContent).toContain("npx @kivora/init");
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/home/install-snippet.test.tsx`
Expected: FAIL — `Failed to resolve import "./install-snippet"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/home/install-snippet.tsx
"use client";

import { Code } from "@kivora/nextjs";
import { usePreferences } from "@/providers/app-providers";

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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/home/install-snippet.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/install-snippet.tsx src/components/home/install-snippet.test.tsx
git commit -m "feat: añadir InstallSnippet con el comando de instalación

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 14: `GalleryTeaser`

**Files:**
- Create: `src/components/home/gallery-teaser.tsx`
- Test: `src/components/home/gallery-teaser.test.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`; iconos de `lucide-react`.
- Produces: `GalleryTeaser` (sin props), usado por la home (Task 15).

- [ ] **Step 1: Escribir el test**

```tsx
// src/components/home/gallery-teaser.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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

  it("shows a decorative icon on every component card", () => {
    render(<GalleryTeaser />);

    const ctaLink = screen.getByRole("link", { name: en.gallery.ctaLabel });
    const cardLinks = screen.getAllByRole("link").filter((link) => link !== ctaLink);

    expect(cardLinks).toHaveLength(10);
    for (const link of cardLinks) {
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/home/gallery-teaser.test.tsx`
Expected: FAIL — `Failed to resolve import "./gallery-teaser"`.

- [ ] **Step 3: Implementación mínima**

```tsx
// src/components/home/gallery-teaser.tsx
"use client";

import {
  Calendar,
  CalendarClock,
  CirclePlay,
  CloudUpload,
  CreditCard,
  GalleryHorizontal,
  ListCollapse,
  MessageSquare,
  MousePointerClick,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { usePreferences } from "@/providers/app-providers";

const COMPONENTS: { name: string; icon: LucideIcon }[] = [
  { name: "Button", icon: MousePointerClick },
  { name: "Card", icon: CreditCard },
  { name: "Table", icon: Table2 },
  { name: "Calendar", icon: Calendar },
  { name: "DatePicker", icon: CalendarClock },
  { name: "Carousel", icon: GalleryHorizontal },
  { name: "Player", icon: CirclePlay },
  { name: "FileUpload", icon: CloudUpload },
  { name: "Dialog", icon: MessageSquare },
  { name: "Accordion", icon: ListCollapse },
];

export function GalleryTeaser() {
  const { dictionary } = usePreferences();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-foreground">{dictionary.gallery.heading}</h2>
      <p className="mt-2 text-muted-foreground">{dictionary.gallery.description}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {COMPONENTS.map(({ name, icon: Icon }) => (
          <a
            key={name}
            href="/componentes"
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            <Icon aria-hidden className="h-5 w-5 text-primary" />
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

- [ ] **Step 4: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/home/gallery-teaser.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/gallery-teaser.tsx src/components/home/gallery-teaser.test.tsx
git commit -m "feat: añadir GalleryTeaser con 10 componentes destacados

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 15: Página Home

**Files:**
- Create: `app/(marketing)/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 10), `StatsBar` (Task 11), `FeatureGrid` (Task 12), `InstallSnippet` (Task 13), `GalleryTeaser` (Task 14).
- Produces: la ruta `/`.

- [ ] **Step 1: Escribir la página**

```tsx
// app/(marketing)/page.tsx
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

Sin test unitario dedicado (composición pura de componentes ya probados); cubierto por el smoke e2e de la Task 18.

- [ ] **Step 2: Verificar que compila**

Run: `npm run typecheck`
Expected: ya no hay errores sobre `app/(marketing)/page.tsx`.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat: componer la home (Hero, StatsBar, FeatureGrid, InstallSnippet, GalleryTeaser)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 16: `PlaceholderPage` + páginas `/docs`, `/componentes`, `/demo`

**Files:**
- Modify: `src/lib/i18n/types.ts` (añadir `placeholder.demoTitle`)
- Modify: `src/lib/i18n/en.ts`, `src/lib/i18n/es.ts` (añadir el valor de `demoTitle`)
- Create: `src/components/placeholder-page.tsx`
- Test: `src/components/placeholder-page.test.tsx`
- Create: `app/(marketing)/docs/page.tsx`
- Create: `app/(marketing)/componentes/page.tsx`
- Create: `app/demo/page.tsx`

**Interfaces:**
- Consumes: `usePreferences` de `@/providers/app-providers`.
- Produces: `PlaceholderPage` (props `{ titleKey: "docsTitle" | "componentsTitle" | "demoTitle" }`), usado por las tres páginas placeholder. Cierra las rutas `/docs`, `/componentes`, `/demo` que el `Header` (Task 7) ya enlaza.

- [ ] **Step 1: Extender el diccionario (tipo + en + es)**

En `src/lib/i18n/types.ts`, dentro de `placeholder`:

```ts
  placeholder: {
    docsTitle: string;
    componentsTitle: string;
    demoTitle: string;
    comingSoon: string;
  };
```

En `src/lib/i18n/en.ts`, dentro de `placeholder`:

```ts
  placeholder: {
    docsTitle: "Documentation",
    componentsTitle: "Components",
    demoTitle: "Demo",
    comingSoon: "This section is coming soon.",
  },
```

En `src/lib/i18n/es.ts`, dentro de `placeholder`:

```ts
  placeholder: {
    docsTitle: "Documentación",
    componentsTitle: "Componentes",
    demoTitle: "Demo",
    comingSoon: "Esta sección estará disponible próximamente.",
  },
```

- [ ] **Step 2: Verificar que la paridad de claves en/es se mantiene**

Run: `npx vitest run src/lib/i18n/dictionaries.test.ts`
Expected: PASS (el test compara los conjuntos de claves de `en` y `es`; al añadir `demoTitle` a ambos, sigue en verde sin tocar el test).

- [ ] **Step 3: Escribir el test de `PlaceholderPage`**

```tsx
// src/components/placeholder-page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

vi.mock("@/providers/app-providers", () => ({
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

  it("also renders the demo placeholder title", () => {
    render(<PlaceholderPage titleKey="demoTitle" />);

    expect(screen.getByRole("heading", { name: en.placeholder.demoTitle })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Ejecutar y comprobar que falla**

Run: `npx vitest run src/components/placeholder-page.test.tsx`
Expected: FAIL — `Failed to resolve import "./placeholder-page"`.

- [ ] **Step 5: Implementación mínima**

```tsx
// src/components/placeholder-page.tsx
"use client";

import { usePreferences } from "@/providers/app-providers";

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

- [ ] **Step 6: Ejecutar y comprobar que pasa**

Run: `npx vitest run src/components/placeholder-page.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Crear las tres páginas placeholder**

```tsx
// app/(marketing)/docs/page.tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function DocsPage() {
  return <PlaceholderPage titleKey="docsTitle" />;
}
```

```tsx
// app/(marketing)/componentes/page.tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function ComponentesPage() {
  return <PlaceholderPage titleKey="componentsTitle" />;
}
```

```tsx
// app/demo/page.tsx
import { PlaceholderPage } from "@/components/placeholder-page";

export default function DemoPage() {
  return <PlaceholderPage titleKey="demoTitle" />;
}
```

`/demo` queda intencionadamente fuera del grupo `(marketing)` (no hereda `Header`/`Footer`): el sub-proyecto 3 le dará su propio shell; por ahora solo necesita no devolver 404.

- [ ] **Step 8: Verificar que compila**

Run: `npm run typecheck`
Expected: ya no hay errores sobre `app/(marketing)/docs/page.tsx`, `app/(marketing)/componentes/page.tsx` ni `app/demo/page.tsx`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/i18n/types.ts src/lib/i18n/en.ts src/lib/i18n/es.ts \
  src/components/placeholder-page.tsx src/components/placeholder-page.test.tsx \
  "app/(marketing)/docs/page.tsx" "app/(marketing)/componentes/page.tsx" app/demo/page.tsx
git commit -m "feat: añadir PlaceholderPage y las rutas /docs, /componentes, /demo

/demo queda fuera del grupo (marketing) a propósito: no hereda Header/Footer
porque tendrá su propio shell cuando se aborde el sub-proyecto 3 (demo ERP).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 17: Test de `app/not-found.tsx`

**Files:**
- Test: `app/not-found.test.tsx`

`app/not-found.tsx` ya existe en el repositorio (no se ha borrado) e importa `@/components/shell/footer` y `@/components/shell/header`; con el alias corregido (Task 1) y esos componentes ya creados (Tasks 7-8), solo falta recuperar su test.

**Interfaces:**
- Consumes: `NotFound` (default export) de `./not-found`; mockea `@/providers/app-providers`.
- Produces: nada que otras tareas consuman (es el final de la cadena).

- [ ] **Step 1: Escribir el test**

```tsx
// app/not-found.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/lib/i18n";

// Header/Footer are client components that read the preferences context,
// which normally comes from the root layout's <Providers>. The 404 page
// itself is a server component, so only its children need the stub.
vi.mock("@/providers/app-providers", () => ({
  usePreferences: () => ({
    locale: "en",
    dictionary: en,
    setLocale: vi.fn(),
    colorMode: "system",
    setColorMode: vi.fn(),
  }),
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the marketing header and footer around the message", () => {
    render(<NotFound />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
  });

  it("offers a way back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Ejecutar y comprobar que falla**

Run: `npx vitest run app/not-found.test.tsx`
Expected: FAIL — antes de esta tarea, `@/providers/app-providers` aún no existía como target de mock coherente con el resto (fallará por módulo de test inexistente, ya que el fichero no existe todavía).

- [ ] **Step 3: Verificar que pasa una vez creado el test**

Run: `npx vitest run app/not-found.test.tsx`
Expected: PASS (2 tests). No hace falta tocar `app/not-found.tsx`: ya existe y ya usa `Header`/`Footer`.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.test.tsx
git commit -m "test: cubrir el 404 con el cromado de marketing (Header/Footer)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 18: Smoke e2e y verificación final

**Files:**
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: la aplicación completa (`next build && next start`, vía `playwright.config.ts` ya existente).
- Produces: nada que otras tareas consuman; es la verificación de integración final de este plan.

- [ ] **Step 1: Escribir el smoke e2e**

```ts
// tests/e2e/home.spec.ts
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

test("una URL inexistente devuelve un 404 con el cromado de marketing", async ({ page }) => {
  const response = await page.goto("/no-existe-esta-pagina");
  expect(response?.status()).toBe(404);

  await expect(page.getByRole("heading", { level: 1, name: "Página no encontrada" })).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
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

- [ ] **Step 2: Ejecutar el smoke e2e**

Run: `npm run test:e2e`
Expected: PASS (4 tests). Este comando ejecuta `next build && playwright test`, así que también valida que el build de producción compila sin errores.

- [ ] **Step 3: Ejecutar toda la suite unitaria/componentes**

Run: `npm test`
Expected: PASS — incluye todos los tests de las Tasks 2-17 más los ya existentes de `src/lib/` (`preferences`, `preferences-actions`, `i18n/dictionaries`, `demo/constants`, `demo/seed`, que no se han tocado en este plan).

- [ ] **Step 4: Lint y typecheck completos**

Run: `npm run lint && npm run typecheck`
Expected: ambos sin errores.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/home.spec.ts
git commit -m "test: añadir smoke e2e de la home, el 404, el tema y el idioma

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review (completado durante la redacción de este plan)

- **Cobertura de la spec:** Providers/tema/idioma (Task 2-3, 5-6), Header/Footer/NavLink (Task 4, 7-8), grupo `(marketing)` (Task 9), Home con sus 5 secciones (Task 10-15), placeholders `/docs`/`/componentes`/`/demo` (Task 16), 404 (Task 17, ya existente), testing unitario + e2e (todas las tareas + Task 18). El alias `@/*` (Task 1) cubre el requisito técnico detectado durante la investigación (no estaba en la spec explícitamente, pero es necesario para que compile cualquier tarea siguiente).
- **Placeholders/TBD:** ninguno; todo el código de cada paso es completo y ejecutable.
- **Consistencia de tipos:** `usePreferences()` devuelve siempre `{ locale, dictionary, setLocale, colorMode, setColorMode }` en todas las tareas que lo consumen o mockean; `PlaceholderPage` usa el mismo `titleKey` en su definición (Task 16) y en las tres páginas que lo invocan; `Dictionary["placeholder"]` incluye `demoTitle` en el tipo, en `en` y en `es` a la vez (Task 16, Step 1).
- **Alcance:** limitado al sub-proyecto 1 (Fundación + Landing); no toca `/demo/*` más allá de un placeholder de una línea, ni crea contenido real de documentación o galería (eso son los sub-proyectos 2 y 3, fuera de este plan).
