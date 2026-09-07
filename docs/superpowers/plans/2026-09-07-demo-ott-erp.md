# Demo ERP OTT ("Nébula") — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** Construir `/demo` como una mini-aplicación de gestión OTT (Dashboard, Catálogo, Suscriptores, Reproductor) con shell propio, sin el `Header`/`Footer` de kivora.dev, y reestructurar las rutas existentes en un grupo `(marketing)` para hacerlo posible.

**Arquitectura:** Grupo de rutas `(marketing)` para `/`, `/docs`, `/componentes` (con `Header`/`Footer`); `app/demo/` fuera de ese grupo, con su propio layout (sidebar oscuro fijo) y un `DemoDataProvider` que persiste datos ficticios en `localStorage`, replicando el patrón ya probado de `store-provider.tsx` en `module/example/web`.

**Tech Stack:** El mismo de la fundación (Next.js 16 App Router, `@kivora/nextjs`, Vitest + RTL, Playwright), más `recharts` (ya usado internamente por `@kivora/nextjs`, declarado explícitamente porque lo importamos directamente).

**Spec:** [docs/superpowers/specs/2026-09-07-demo-ott-erp-design.md](../specs/2026-09-07-demo-ott-erp-design.md)

## Corrección respecto al spec

El spec asumía que el póster de un título nuevo se subiría con el componente `FileUpload` real de `@kivora/nextjs`. Ese componente sube a un endpoint Tus real (`UploadController({ endpoint: '...' })`); esta demo no tiene backend (es una decisión explícita del spec), así que no hay ningún servidor Tus al que apuntar. En su lugar, el formulario de "Añadir título" usa un `<input type="file" accept="image/*">` normal (envuelto con `Field`/`FieldLabel` de Kivora para mantener el estilo) que lee el fichero localmente con `FileReader.readAsDataURL` y guarda esa data URL como `posterUrl` — cero red, cero backend, funciona igual de bien como demostración de "puedo adjuntar una imagen", aunque no ejercita el componente `FileUpload` en sí. El resto del spec no cambia.

## Global Constraints

- `recharts` añadido como dependencia directa (`^3.1.0`, misma versión que usa `@kivora/nextjs` internamente) porque `app/demo/page.tsx` la importa directamente para el gráfico.
- Ninguna página del demo usa `Math.random()` ni fechas relativas a "hoy": toda la semilla de datos es literal y determinista (mismo valor en servidor y cliente), evitando errores de hidratación.
- El sidebar del demo (`app/demo/layout.tsx`) usa clases de Tailwind fijas (p. ej. `bg-zinc-950`), no los tokens semánticos `bg-background`/`text-foreground` — es la única parte de la app que no seguirá el `ThemeToggle` global (ver "Corrección respecto al diseño aprobado" en el spec).
- Cookie/idioma siguen siendo globales (el demo hereda el idioma del sitio a través del `Providers` raíz ya existente); no se introduce i18n propio para el demo en esta iteración — sus textos van directamente en español, igual que Farmacia Oliva.
- `DemoDataProvider` sigue el patrón de `store-provider.tsx` de `module/example/web`: estado inicial = semilla (seguro para SSR), hidratación desde `localStorage` en un `useEffect`, flag `ready` que evita persistir antes de que la hidratación termine.

---

## Mapa de archivos

```
app/
  layout.tsx                          # Modificar: quita Header/Footer, solo <Providers>{children}</Providers>
  (marketing)/
    layout.tsx                         # Crear: <Header/><main>{children}</main><Footer/>
    page.tsx                            # Mover desde app/page.tsx
    docs/page.tsx                        # Mover desde app/docs/page.tsx
    componentes/page.tsx                 # Mover desde app/componentes/page.tsx
  demo/
    layout.tsx                          # Crear: DemoShell
    page.tsx                             # Crear: Dashboard
    catalogo/page.tsx                     # Crear
    suscriptores/page.tsx                 # Crear
    reproductor/page.tsx                  # Crear
lib/demo/
  types.ts                             # Crear
  seed.ts                              # Crear
  seed.test.ts                         # Crear
components/demo/
  data-provider.tsx                    # Crear: DemoDataProvider, useDemoData
  data-provider.test.tsx               # Crear
  demo-nav-link.tsx                    # Crear
  demo-nav-link.test.tsx               # Crear
  title-form.tsx                       # Crear: alta de título (con lector de imagen local)
  title-form.test.tsx                  # Crear
  subscriber-form.tsx                  # Crear: alta de suscriptor
  subscriber-form.test.tsx             # Crear
app/demo/page.test.tsx                 # Crear
app/demo/catalogo/page.test.tsx        # Crear
app/demo/suscriptores/page.test.tsx    # Crear
app/demo/reproductor/page.test.tsx     # Crear
tests/e2e/demo.spec.ts                 # Crear
package.json                          # Modificar: añadir recharts
```

---

### Task 1: Reestructurar rutas en el grupo `(marketing)`

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/(marketing)/layout.tsx`
- Move: `app/page.tsx` → `app/(marketing)/page.tsx`
- Move: `app/docs/page.tsx` → `app/(marketing)/docs/page.tsx`
- Move: `app/componentes/page.tsx` → `app/(marketing)/componentes/page.tsx`

**Interfaces:**
- Consumes: `Header`, `Footer` (ya existentes en `@/components/shell/*`).
- Produces: ninguna interfaz nueva — solo reubica código existente. Las URLs `/`, `/docs`, `/componentes` no cambian.

- [ ] **Step 1: Crear el directorio `app/(marketing)/` y mover las tres páginas**

```bash
mkdir -p "app/(marketing)/docs" "app/(marketing)/componentes"
git mv app/page.tsx "app/(marketing)/page.tsx"
git mv app/docs/page.tsx "app/(marketing)/docs/page.tsx"
git mv app/componentes/page.tsx "app/(marketing)/componentes/page.tsx"
rmdir app/docs app/componentes
```

- [ ] **Step 2: Crear `app/(marketing)/layout.tsx`**

```tsx
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

- [ ] **Step 3: Simplificar `app/layout.tsx` para que ya no monte Header/Footer**

Editar `app/layout.tsx` (queda igual salvo el `<body>`):

```tsx
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers locale={locale} colorMode={colorMode}>
          {children}
        </Providers>
      </body>
```

Y quitar los imports de `Header`/`Footer` que ya no se usan ahí (`@/components/shell/footer`, `@/components/shell/header`).

- [ ] **Step 4: Verificar que la suite existente sigue pasando tal cual**

Run: `npm run test`
Expected: los 15 archivos / 23 tests existentes siguen en verde — ninguno depende de la ruta física de los ficheros movidos.

Run: `npm run build`
Expected: compila; `/`, `/docs`, `/componentes` siguen respondiendo en las mismas URLs.

- [ ] **Step 5: Verificar el smoke e2e existente**

Run: `npm run test:e2e`
Expected: los 3 tests de `tests/e2e/home.spec.ts` siguen en verde (mismas URLs, mismo comportamiento).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: mover la web de marketing a un grupo de rutas (marketing)

Prepara el terreno para /demo: un layout anidado no puede excluir lo
que el layout raíz ya renderiza, así que Header/Footer se mueven del
layout raíz a app/(marketing)/layout.tsx. Las URLs no cambian.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Modelo de datos y semilla determinista

**Files:**
- Create: `lib/demo/types.ts`
- Create: `lib/demo/seed.ts`
- Test: `lib/demo/seed.test.ts`

**Interfaces:**
- Consumes: `PlayerSource` de `@kivora/nextjs`.
- Produces: `Plan`, `SubscriberStatus`, `TitleGenre`, `TitleType`, `Title`, `Subscriber` (tipos); `titleSeed: Title[]`, `subscriberSeed: Subscriber[]`, `monthlySignupsSeed: { month: string; signups: number }[]`.

- [ ] **Step 1: Escribir el test de la semilla (falla: el módulo no existe)**

`lib/demo/seed.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { monthlySignupsSeed, subscriberSeed, titleSeed } from "./seed";

describe("demo seed data", () => {
  it("has unique title ids and at least five playable titles", () => {
    const ids = titleSeed.map((title) => title.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(titleSeed.filter((title) => title.playerSource).length).toBeGreaterThanOrEqual(5);
    expect(titleSeed.length).toBe(12);
  });

  it("has unique subscriber ids and emails", () => {
    const ids = subscriberSeed.map((s) => s.id);
    const emails = subscriberSeed.map((s) => s.email);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(emails).size).toBe(emails.length);
    expect(subscriberSeed.length).toBe(20);
  });

  it("has a fixed 6-point monthly signups series", () => {
    expect(monthlySignupsSeed).toHaveLength(6);
    for (const point of monthlySignupsSeed) {
      expect(typeof point.month).toBe("string");
      expect(Number.isInteger(point.signups)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- lib/demo/seed.test.ts`
Expected: FAIL — "Cannot find module './seed'".

- [ ] **Step 3: Crear `lib/demo/types.ts`**

```ts
import type { PlayerSource } from "@kivora/nextjs";

export type Plan = "Básico" | "Estándar" | "Premium";
export type SubscriberStatus = "active" | "paused" | "cancelled";
export type TitleGenre = "Acción" | "Drama" | "Documental" | "Ciencia ficción" | "Animación";
export type TitleType = "Película" | "Serie";

export interface Title {
  id: string;
  name: string;
  genre: TitleGenre;
  type: TitleType;
  releaseYear: number;
  durationMinutes: number;
  viewsLast30Days: number;
  posterUrl?: string;
  playerSource?: PlayerSource;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: SubscriberStatus;
  joinedAt: string;
  monthlyPriceCents: number;
}
```

- [ ] **Step 4: Crear `lib/demo/seed.ts`**

```ts
import type { Subscriber, Title } from "./types";

// Fuentes de vídeo público reales, reutilizadas de
// module/example/web/src/components/player-demo-sources.ts (catálogo de
// demos de Shaka Player / vectores de prueba de Axinom). Ver el riesgo de
// atribución en el spec.
const shakaIcons = "https://storage.googleapis.com/shaka-asset-icons/";
const axinomTestMessage =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA";

export const titleSeed: Title[] = [
  {
    id: "sintel",
    name: "Sintel",
    genre: "Animación",
    type: "Película",
    releaseYear: 2010,
    durationMinutes: 15,
    viewsLast30Days: 128400,
    posterUrl: `${shakaIcons}sintel.png`,
    playerSource: {
      id: "sintel",
      title: "Sintel",
      src: "https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}sintel.png`,
    },
  },
  {
    id: "angel-one-hls",
    name: "Angel One",
    genre: "Drama",
    type: "Película",
    releaseYear: 2014,
    durationMinutes: 15,
    viewsLast30Days: 98200,
    posterUrl: `${shakaIcons}angel_one.png`,
    playerSource: {
      id: "angel-one-hls",
      title: "Angel One",
      src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
      mimeType: "application/x-mpegurl",
      poster: `${shakaIcons}angel_one.png`,
    },
  },
  {
    id: "flower",
    name: "Flower",
    genre: "Documental",
    type: "Película",
    releaseYear: 2018,
    durationMinutes: 1,
    viewsLast30Days: 42100,
    playerSource: {
      id: "flower",
      title: "Flower",
      src: "https://developer.mozilla.org/shared-assets/videos/flower.mp4",
      mimeType: "video/mp4",
    },
  },
  {
    id: "angel-one-widevine",
    name: "Angel One · DRM",
    genre: "Drama",
    type: "Película",
    releaseYear: 2014,
    durationMinutes: 15,
    viewsLast30Days: 15300,
    posterUrl: `${shakaIcons}angel_one.png`,
    playerSource: {
      id: "angel-one-widevine",
      title: "Angel One · DRM",
      src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}angel_one.png`,
      drm: { servers: { "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy" } },
    },
  },
  {
    id: "tears-of-steel",
    name: "Tears of Steel",
    genre: "Ciencia ficción",
    type: "Película",
    releaseYear: 2012,
    durationMinutes: 12,
    viewsLast30Days: 76500,
    posterUrl: `${shakaIcons}tears_of_steel.png`,
    playerSource: {
      id: "tears-of-steel",
      title: "Tears of Steel",
      src: "https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}tears_of_steel.png`,
      drm: {
        servers: {
          "com.widevine.alpha": "https://drm-widevine-licensing.axtest.net/AcquireLicense",
          "com.microsoft.playready": "https://drm-playready-licensing.axtest.net/AcquireLicense",
        },
        advanced: {
          "com.widevine.alpha": { headers: { "X-AxDRM-Message": axinomTestMessage } },
          "com.microsoft.playready": { headers: { "X-AxDRM-Message": axinomTestMessage } },
        },
      },
    },
  },
  {
    id: "estacion-roja",
    name: "Estación Roja",
    genre: "Ciencia ficción",
    type: "Serie",
    releaseYear: 2023,
    durationMinutes: 45,
    viewsLast30Days: 51200,
  },
  {
    id: "cocina-nomada",
    name: "Cocina Nómada",
    genre: "Documental",
    type: "Serie",
    releaseYear: 2022,
    durationMinutes: 30,
    viewsLast30Days: 33400,
  },
  {
    id: "umbral",
    name: "Umbral",
    genre: "Drama",
    type: "Película",
    releaseYear: 2021,
    durationMinutes: 108,
    viewsLast30Days: 21000,
  },
  {
    id: "rutas-del-sur",
    name: "Rutas del Sur",
    genre: "Documental",
    type: "Serie",
    releaseYear: 2020,
    durationMinutes: 40,
    viewsLast30Days: 18700,
  },
  {
    id: "codigo-abierto",
    name: "Código Abierto",
    genre: "Ciencia ficción",
    type: "Serie",
    releaseYear: 2024,
    durationMinutes: 38,
    viewsLast30Days: 60300,
  },
  {
    id: "el-ultimo-faro",
    name: "El Último Faro",
    genre: "Drama",
    type: "Película",
    releaseYear: 2019,
    durationMinutes: 96,
    viewsLast30Days: 12400,
  },
  {
    id: "trazos",
    name: "Trazos",
    genre: "Animación",
    type: "Serie",
    releaseYear: 2023,
    durationMinutes: 22,
    viewsLast30Days: 27800,
  },
];

const FIRST_NAMES = [
  "Marta", "Diego", "Elena", "Pablo", "Lucía", "Marcos", "Sara", "Iván", "Noa", "Hugo",
  "Vera", "Bruno", "Clara", "Adrián", "Nerea", "Rubén", "Alba", "Tomás", "Julia", "Óscar",
];
const LAST_NAMES = ["Ruiz", "Molina", "Cano", "Reyes", "Ortega", "Vidal", "Campos", "Serra", "Bravo", "Nieto"];
const PLANS: Plan[] = ["Básico", "Estándar", "Premium"];
const STATUSES: SubscriberStatus[] = ["active", "active", "active", "paused", "cancelled"];
const PRICE_CENTS_BY_PLAN: Record<Plan, number> = { "Básico": 599, "Estándar": 999, "Premium": 1499 };

export const subscriberSeed: Subscriber[] = FIRST_NAMES.map((firstName, index) => {
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const plan = PLANS[index % PLANS.length];
  const status = STATUSES[index % STATUSES.length];
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 27) + 1).padStart(2, "0");

  return {
    id: `sub-${index + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    plan,
    status,
    joinedAt: `2025-${month}-${day}`,
    monthlyPriceCents: PRICE_CENTS_BY_PLAN[plan],
  };
});

export const monthlySignupsSeed = [
  { month: "Abr", signups: 120 },
  { month: "May", signups: 145 },
  { month: "Jun", signups: 160 },
  { month: "Jul", signups: 158 },
  { month: "Ago", signups: 180 },
  { month: "Sep", signups: 210 },
];
```

Nota: `import type { Plan, SubscriberStatus } from "./types"` falta arriba — añadirlo junto a `Subscriber, Title`.

- [ ] **Step 5: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- lib/demo/seed.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/demo/types.ts lib/demo/seed.ts lib/demo/seed.test.ts
git commit -m "feat: añadir modelo de datos y semilla determinista del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: `DemoDataProvider`

**Files:**
- Create: `components/demo/data-provider.tsx`
- Test: `components/demo/data-provider.test.tsx`

**Interfaces:**
- Consumes: `titleSeed`, `subscriberSeed` de `@/lib/demo/seed`; `Title`, `Subscriber` de `@/lib/demo/types`.
- Produces: `DemoDataProvider({ children })`; `useDemoData(): { titles: Title[]; subscribers: Subscriber[]; addTitle: (title: Title) => void; addSubscriber: (subscriber: Subscriber) => void }`.

- [ ] **Step 1: Escribir el test (falla: el módulo no existe)**

`components/demo/data-provider.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import type { Title } from "@/lib/demo/types";
import { DemoDataProvider, useDemoData } from "./data-provider";

const STORAGE_KEY = "kivora-demo-ott-v1";

const newTitle: Title = {
  id: "nueva-serie",
  name: "Nueva Serie",
  genre: "Drama",
  type: "Serie",
  releaseYear: 2026,
  durationMinutes: 40,
  viewsLast30Days: 0,
};

function Consumer() {
  const { titles, subscribers, addTitle } = useDemoData();
  return (
    <div>
      <p>titles:{titles.length}</p>
      <p>subscribers:{subscribers.length}</p>
      <button onClick={() => addTitle(newTitle)}>add-title</button>
    </div>
  );
}

describe("DemoDataProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts from the seed data", () => {
    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    expect(screen.getByText(`titles:${titleSeed.length}`)).toBeInTheDocument();
    expect(screen.getByText(`subscribers:${subscriberSeed.length}`)).toBeInTheDocument();
  });

  it("adds a title and persists it to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    await user.click(screen.getByText("add-title"));
    expect(screen.getByText(`titles:${titleSeed.length + 1}`)).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    expect(stored?.titles).toHaveLength(titleSeed.length + 1);
  });

  it("hydrates from a previously persisted store instead of the seed", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ titles: [newTitle], subscribers: [] })
    );

    render(
      <DemoDataProvider>
        <Consumer />
      </DemoDataProvider>
    );

    expect(screen.getByText("titles:1")).toBeInTheDocument();
    expect(screen.getByText("subscribers:0")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/demo/data-provider.test.tsx`
Expected: FAIL — "Cannot find module './data-provider'".

- [ ] **Step 3: Implementar `components/demo/data-provider.tsx`**

```tsx
"use client";

import * as React from "react";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import type { Subscriber, Title } from "@/lib/demo/types";

const STORAGE_KEY = "kivora-demo-ott-v1";

interface DemoStore {
  titles: Title[];
  subscribers: Subscriber[];
}

function isDemoStore(value: unknown): value is DemoStore {
  if (!value || typeof value !== "object") return false;
  const store = value as DemoStore;
  return Array.isArray(store.titles) && Array.isArray(store.subscribers);
}

interface DemoDataContextValue extends DemoStore {
  addTitle: (title: Title) => void;
  addSubscriber: (subscriber: Subscriber) => void;
}

const DemoDataContext = React.createContext<DemoDataContextValue | null>(null);

export function useDemoData(): DemoDataContextValue {
  const context = React.useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used within DemoDataProvider");
  }
  return context;
}

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = React.useState<DemoStore>({
    titles: titleSeed,
    subscribers: subscriberSeed,
  });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isDemoStore(parsed)) setStore(parsed);
      }
    } catch {
      // Corrupt or unavailable storage: keep the seed.
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Storage unavailable (e.g. private browsing quota): keep in-memory only.
    }
  }, [store, ready]);

  const addTitle = React.useCallback((title: Title) => {
    setStore((prev) => ({ ...prev, titles: [title, ...prev.titles] }));
  }, []);

  const addSubscriber = React.useCallback((subscriber: Subscriber) => {
    setStore((prev) => ({ ...prev, subscribers: [subscriber, ...prev.subscribers] }));
  }, []);

  const value = React.useMemo<DemoDataContextValue>(
    () => ({ ...store, addTitle, addSubscriber }),
    [store, addTitle, addSubscriber]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/demo/data-provider.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/demo/data-provider.tsx components/demo/data-provider.test.tsx
git commit -m "feat: añadir DemoDataProvider con persistencia en localStorage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Shell del demo (`app/demo/layout.tsx`)

**Files:**
- Create: `components/demo/demo-nav-link.tsx`
- Test: `components/demo/demo-nav-link.test.tsx`
- Create: `app/demo/layout.tsx`

**Interfaces:**
- Consumes: `DemoDataProvider` de `@/components/demo/data-provider`; `usePathname` de `next/navigation`; `cn` de `@kivora/theme`.
- Produces: `DemoNavLink({ href, children }: { href: string; children: React.ReactNode })`.

- [ ] **Step 1: Escribir el test de `DemoNavLink` (falla: el módulo no existe)**

`components/demo/demo-nav-link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/demo/catalogo",
}));

import { DemoNavLink } from "./demo-nav-link";

describe("DemoNavLink", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <>
        <DemoNavLink href="/demo/catalogo">Catálogo</DemoNavLink>
        <DemoNavLink href="/demo/suscriptores">Suscriptores</DemoNavLink>
      </>
    );

    expect(screen.getByRole("link", { name: "Catálogo" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Suscriptores" })).not.toHaveAttribute("aria-current");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/demo/demo-nav-link.test.tsx`
Expected: FAIL — "Cannot find module './demo-nav-link'".

- [ ] **Step 3: Implementar `components/demo/demo-nav-link.tsx`**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kivora/theme";

export interface DemoNavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function DemoNavLink({ href, children }: DemoNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50",
        isActive && "bg-white/10 text-zinc-50"
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/demo/demo-nav-link.test.tsx`
Expected: PASS

- [ ] **Step 5: Crear `app/demo/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { ArrowLeft, Gauge, LayoutList, PlaySquare, Users } from "lucide-react";
import Link from "next/link";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { DemoNavLink } from "@/components/demo/demo-nav-link";
import { LocaleToggle } from "@/components/shell/locale-toggle";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <div className="flex flex-1">
        <aside className="flex w-60 flex-col gap-1 bg-zinc-950 p-4 text-zinc-50">
          <div className="mb-4 px-3 text-lg font-bold">Nébula</div>
          <DemoNavLink href="/demo">
            <Gauge aria-hidden className="h-4 w-4" />
            Dashboard
          </DemoNavLink>
          <DemoNavLink href="/demo/catalogo">
            <LayoutList aria-hidden className="h-4 w-4" />
            Catálogo
          </DemoNavLink>
          <DemoNavLink href="/demo/suscriptores">
            <Users aria-hidden className="h-4 w-4" />
            Suscriptores
          </DemoNavLink>
          <DemoNavLink href="/demo/reproductor">
            <PlaySquare aria-hidden className="h-4 w-4" />
            Reproductor
          </DemoNavLink>
          <Link
            href="/"
            className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            kivora.dev
          </Link>
        </aside>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="flex justify-end gap-3 border-b border-border px-6 py-3">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </DemoDataProvider>
  );
}
```

- [ ] **Step 6: Crear una página temporal para que `/demo` compile (la Task 5 la sustituye)**

`app/demo/page.tsx`:

```tsx
export default function DemoPage() {
  return null;
}
```

- [ ] **Step 7: Verificar que el proyecto compila**

Run: `npm run build`
Expected: compila sin errores; `/demo` responde con el sidebar visible y contenido vacío (se rellena en la Task 5).

- [ ] **Step 8: Commit**

```bash
git add components/demo/demo-nav-link.tsx components/demo/demo-nav-link.test.tsx app/demo/layout.tsx app/demo/page.tsx
git commit -m "feat: añadir el shell del demo OTT (sidebar oscuro + DemoDataProvider)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Dashboard (`app/demo/page.tsx`)

**Files:**
- Modify: `package.json` (añadir `recharts`)
- Modify: `app/demo/page.tsx` (reemplaza la página temporal de la Task 4)
- Test: `app/demo/page.test.tsx`

**Interfaces:**
- Consumes: `useDemoData` de `@/components/demo/data-provider`; `monthlySignupsSeed` de `@/lib/demo/seed`; `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` de `@kivora/nextjs`; `BarChart`, `Bar`, `CartesianGrid`, `XAxis`, `YAxis` de `recharts`.

- [ ] **Step 1: Añadir `recharts` como dependencia directa**

```bash
npm install recharts@^3.1.0
```

- [ ] **Step 2: Escribir el test (falla: la página no existe)**

`app/demo/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { subscriberSeed, titleSeed } from "@/lib/demo/seed";
import { DemoDataProvider } from "@/components/demo/data-provider";
import DemoPage from "./page";

describe("Demo dashboard", () => {
  it("shows active subscribers, MRR and the top title", () => {
    render(
      <DemoDataProvider>
        <DemoPage />
      </DemoDataProvider>
    );

    const activeCount = subscriberSeed.filter((s) => s.status === "active").length;
    expect(screen.getByText(String(activeCount))).toBeInTheDocument();

    const topTitle = [...titleSeed].sort((a, b) => b.viewsLast30Days - a.viewsLast30Days)[0];
    expect(screen.getByText(topTitle.name)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Ejecutar el test y comprobar que falla**

Run: `npm run test -- app/demo/page.test.tsx`
Expected: FAIL — "Cannot find module './page'".

- [ ] **Step 4: Implementar `app/demo/page.tsx`**

```tsx
"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@kivora/nextjs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDemoData } from "@/components/demo/data-provider";
import { monthlySignupsSeed } from "@/lib/demo/seed";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function DemoPage() {
  const { titles, subscribers } = useDemoData();

  const activeSubscribers = subscribers.filter((s) => s.status === "active");
  const mrrCents = activeSubscribers.reduce((sum, s) => sum + s.monthlyPriceCents, 0);
  const totalViews = titles.reduce((sum, t) => sum + t.viewsLast30Days, 0);
  const topTitles = [...titles].sort((a, b) => b.viewsLast30Days - a.viewsLast30Days).slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Suscriptores activos</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{activeSubscribers.length}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Ingresos mensuales (MRR)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{formatCents(mrrCents)}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">Visualizaciones (30 días)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalViews.toLocaleString("es-ES")}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-6">
        <p className="mb-4 text-sm font-semibold text-foreground">Altas de suscriptores (últimos 6 meses)</p>
        <ChartContainer
          config={{ signups: { label: "Altas", color: "var(--color-primary)" } }}
          className="h-64 w-full"
        >
          <BarChart data={monthlySignupsSeed}>
            <CartesianGrid vertical={false} strokeDasharray="4 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="signups" name="Altas" fill="var(--color-primary)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="rounded-lg border border-border p-6">
        <p className="mb-4 text-sm font-semibold text-foreground">Contenido más visto</p>
        <ol className="flex flex-col gap-2">
          {topTitles.map((title) => (
            <li key={title.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{title.name}</span>
              <span className="text-muted-foreground">{title.viewsLast30Days.toLocaleString("es-ES")}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- app/demo/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/demo/page.tsx app/demo/page.test.tsx
git commit -m "feat: añadir el dashboard del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Catálogo (`app/demo/catalogo/page.tsx`)

**Files:**
- Create: `components/demo/title-form.tsx`
- Test: `components/demo/title-form.test.tsx`
- Create: `app/demo/catalogo/page.tsx`
- Test: `app/demo/catalogo/page.test.tsx`

**Interfaces:**
- Consumes: `useDemoData`; `Title` de `@/lib/demo/types`; `DataTable`, `DataTableColumnDef`, `Field`, `FieldLabel`, `Button`, `Input`, `Dialog`, `DialogContent`, `DialogTitle` de `@kivora/nextjs`.
- Produces: `TitleForm({ onSubmit }: { onSubmit: (title: Title) => void })`.

- [ ] **Step 1: Escribir el test de `TitleForm` (falla: el módulo no existe)**

`components/demo/title-form.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TitleForm } from "./title-form";

describe("TitleForm", () => {
  it("submits a new title with the entered name and defaults", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TitleForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Título"), "Mi nueva serie");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.name).toBe("Mi nueva serie");
    expect(submitted.viewsLast30Days).toBe(0);
    expect(typeof submitted.id).toBe("string");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/demo/title-form.test.tsx`
Expected: FAIL — "Cannot find module './title-form'".

- [ ] **Step 3: Implementar `components/demo/title-form.tsx`**

```tsx
"use client";

import * as React from "react";
import { Button, Field, FieldLabel, Input } from "@kivora/nextjs";
import type { Title, TitleGenre, TitleType } from "@/lib/demo/types";

export interface TitleFormProps {
  onSubmit: (title: Title) => void;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function TitleForm({ onSubmit }: TitleFormProps) {
  const [name, setName] = React.useState("");
  const [genre, setGenre] = React.useState<TitleGenre>("Drama");
  const [type, setType] = React.useState<TitleType>("Película");
  const [posterUrl, setPosterUrl] = React.useState<string | undefined>(undefined);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          id: `title-${Date.now()}`,
          name,
          genre,
          type,
          releaseYear: new Date().getFullYear(),
          durationMinutes: 0,
          viewsLast30Days: 0,
          posterUrl,
        });
        setName("");
        setPosterUrl(undefined);
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="title-name">Título</FieldLabel>
        <Input
          id="title-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="title-genre">Género</FieldLabel>
        <select
          id="title-genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value as TitleGenre)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Acción">Acción</option>
          <option value="Drama">Drama</option>
          <option value="Documental">Documental</option>
          <option value="Ciencia ficción">Ciencia ficción</option>
          <option value="Animación">Animación</option>
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="title-type">Tipo</FieldLabel>
        <select
          id="title-type"
          value={type}
          onChange={(event) => setType(event.target.value as TitleType)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Película">Película</option>
          <option value="Serie">Serie</option>
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="title-poster">Póster (opcional)</FieldLabel>
        <input
          id="title-poster"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) setPosterUrl(await readAsDataUrl(file));
          }}
          className="text-sm"
        />
      </Field>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/demo/title-form.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de la página de catálogo (falla: no existe)**

`app/demo/catalogo/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";
import CatalogoPage from "./page";

describe("Catálogo", () => {
  it("lists the seeded titles and adds a new one through the form", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <CatalogoPage />
      </DemoDataProvider>
    );

    expect(screen.getByText(titleSeed[0].name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Añadir título" }));
    await user.type(screen.getByLabelText("Título"), "Serie de prueba");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Serie de prueba")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- app/demo/catalogo/page.test.tsx`
Expected: FAIL — "Cannot find module './page'".

- [ ] **Step 7: Implementar `app/demo/catalogo/page.tsx`**

```tsx
"use client";

import * as React from "react";
import { Button, DataTable, Dialog, DialogContent, DialogTitle, type DataTableColumnDef } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";
import { TitleForm } from "@/components/demo/title-form";
import type { Title, TitleGenre, TitleType } from "@/lib/demo/types";

const GENRES: TitleGenre[] = ["Acción", "Drama", "Documental", "Ciencia ficción", "Animación"];
const TYPES: TitleType[] = ["Película", "Serie"];

export default function CatalogoPage() {
  const { titles, addTitle } = useDemoData();
  const [open, setOpen] = React.useState(false);

  const columns: DataTableColumnDef<Title>[] = [
    { accessorKey: "name", header: "Título" },
    { accessorKey: "type", header: "Tipo" },
    { accessorKey: "genre", header: "Género" },
    { accessorKey: "releaseYear", header: "Año" },
    {
      accessorKey: "viewsLast30Days",
      header: "Vistas (30d)",
      cell: ({ row }) => row.original.viewsLast30Days.toLocaleString("es-ES"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Catálogo</h1>
        <Button onClick={() => setOpen(true)}>Añadir título</Button>
      </div>
      <DataTable
        data={titles}
        columns={columns}
        searchable
        paginated
        pageSize={8}
        filters={[
          {
            columnId: "type",
            label: "Tipo",
            type: "select",
            options: TYPES.map((value) => ({ label: value, value })),
          },
          {
            columnId: "genre",
            label: "Género",
            type: "select",
            options: GENRES.map((value) => ({ label: value, value })),
          },
        ]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Añadir título</DialogTitle>
          <TitleForm
            onSubmit={(title) => {
              addTitle(title);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- app/demo/catalogo/page.test.tsx components/demo/title-form.test.tsx`
Expected: PASS (ambos)

- [ ] **Step 9: Commit**

```bash
git add components/demo/title-form.tsx components/demo/title-form.test.tsx app/demo/catalogo/page.tsx app/demo/catalogo/page.test.tsx
git commit -m "feat: añadir el catálogo del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Suscriptores (`app/demo/suscriptores/page.tsx`)

**Files:**
- Create: `components/demo/subscriber-form.tsx`
- Test: `components/demo/subscriber-form.test.tsx`
- Create: `app/demo/suscriptores/page.tsx`
- Test: `app/demo/suscriptores/page.test.tsx`

**Interfaces:**
- Consumes: `useDemoData`; `Subscriber` de `@/lib/demo/types`; `DataTable`, `Field`, `FieldLabel`, `Input`, `Button`, `Dialog`, `DialogContent`, `DialogTitle` de `@kivora/nextjs`.
- Produces: `SubscriberForm({ onSubmit }: { onSubmit: (subscriber: Subscriber) => void })`.

- [ ] **Step 1: Escribir el test de `SubscriberForm` (falla: el módulo no existe)**

`components/demo/subscriber-form.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubscriberForm } from "./subscriber-form";

describe("SubscriberForm", () => {
  it("submits a new active subscriber with the entered name and email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SubscriberForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nombre"), "Ana Pérez");
    await user.type(screen.getByLabelText("Email"), "ana.perez@example.com");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [submitted] = onSubmit.mock.calls[0];
    expect(submitted.name).toBe("Ana Pérez");
    expect(submitted.email).toBe("ana.perez@example.com");
    expect(submitted.status).toBe("active");
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- components/demo/subscriber-form.test.tsx`
Expected: FAIL — "Cannot find module './subscriber-form'".

- [ ] **Step 3: Implementar `components/demo/subscriber-form.tsx`**

```tsx
"use client";

import * as React from "react";
import { Button, Field, FieldLabel, Input } from "@kivora/nextjs";
import type { Plan, Subscriber } from "@/lib/demo/types";

const PRICE_CENTS_BY_PLAN: Record<Plan, number> = { "Básico": 599, "Estándar": 999, "Premium": 1499 };

export interface SubscriberFormProps {
  onSubmit: (subscriber: Subscriber) => void;
}

export function SubscriberForm({ onSubmit }: SubscriberFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [plan, setPlan] = React.useState<Plan>("Básico");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          id: `sub-${Date.now()}`,
          name,
          email,
          plan,
          status: "active",
          joinedAt: new Date().toISOString().slice(0, 10),
          monthlyPriceCents: PRICE_CENTS_BY_PLAN[plan],
        });
        setName("");
        setEmail("");
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="subscriber-name">Nombre</FieldLabel>
        <Input id="subscriber-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field>
        <FieldLabel htmlFor="subscriber-email">Email</FieldLabel>
        <Input
          id="subscriber-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="subscriber-plan">Plan</FieldLabel>
        <select
          id="subscriber-plan"
          value={plan}
          onChange={(event) => setPlan(event.target.value as Plan)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Básico">Básico</option>
          <option value="Estándar">Estándar</option>
          <option value="Premium">Premium</option>
        </select>
      </Field>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- components/demo/subscriber-form.test.tsx`
Expected: PASS

- [ ] **Step 5: Escribir el test de la página de suscriptores (falla: no existe)**

`app/demo/suscriptores/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { subscriberSeed } from "@/lib/demo/seed";
import SuscriptoresPage from "./page";

describe("Suscriptores", () => {
  it("lists the seeded subscribers and adds a new one through the form", async () => {
    const user = userEvent.setup();
    render(
      <DemoDataProvider>
        <SuscriptoresPage />
      </DemoDataProvider>
    );

    expect(screen.getByText(subscriberSeed[0].name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Añadir suscriptor" }));
    await user.type(screen.getByLabelText("Nombre"), "Cliente de prueba");
    await user.type(screen.getByLabelText("Email"), "prueba@example.com");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Cliente de prueba")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test y comprobar que falla**

Run: `npm run test -- app/demo/suscriptores/page.test.tsx`
Expected: FAIL — "Cannot find module './page'".

- [ ] **Step 7: Implementar `app/demo/suscriptores/page.tsx`**

```tsx
"use client";

import * as React from "react";
import { Button, DataTable, Dialog, DialogContent, DialogTitle, type DataTableColumnDef } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";
import { SubscriberForm } from "@/components/demo/subscriber-form";
import type { Plan, Subscriber } from "@/lib/demo/types";

const STATUS_LABEL: Record<Subscriber["status"], string> = {
  active: "Activo",
  paused: "Pausado",
  cancelled: "Cancelado",
};
const PLANS: Plan[] = ["Básico", "Estándar", "Premium"];
const STATUSES: Subscriber["status"][] = ["active", "paused", "cancelled"];

export default function SuscriptoresPage() {
  const { subscribers, addSubscriber } = useDemoData();
  const [open, setOpen] = React.useState(false);

  const columns: DataTableColumnDef<Subscriber>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "plan", header: "Plan" },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => STATUS_LABEL[row.original.status],
    },
    { accessorKey: "joinedAt", header: "Alta" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Suscriptores</h1>
        <Button onClick={() => setOpen(true)}>Añadir suscriptor</Button>
      </div>
      <DataTable
        data={subscribers}
        columns={columns}
        searchable
        paginated
        pageSize={8}
        filters={[
          {
            columnId: "plan",
            label: "Plan",
            type: "select",
            options: PLANS.map((value) => ({ label: value, value })),
          },
          {
            columnId: "status",
            label: "Estado",
            type: "select",
            options: STATUSES.map((value) => ({ label: STATUS_LABEL[value], value })),
          },
        ]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Añadir suscriptor</DialogTitle>
          <SubscriberForm
            onSubmit={(subscriber) => {
              addSubscriber(subscriber);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 8: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- app/demo/suscriptores/page.test.tsx`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add components/demo/subscriber-form.tsx components/demo/subscriber-form.test.tsx app/demo/suscriptores/page.tsx app/demo/suscriptores/page.test.tsx
git commit -m "feat: añadir la gestión de suscriptores del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Reproductor (`app/demo/reproductor/page.tsx`)

**Files:**
- Create: `app/demo/reproductor/page.tsx`
- Test: `app/demo/reproductor/page.test.tsx`

**Interfaces:**
- Consumes: `useDemoData`; `useSearchParams` de `next/navigation`; `Player` de `@kivora/nextjs`.

- [ ] **Step 1: Escribir el test (falla: la página no existe)**

`app/demo/reproductor/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoDataProvider } from "@/components/demo/data-provider";
import { titleSeed } from "@/lib/demo/seed";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

import ReproductorPage from "./page";

describe("Reproductor", () => {
  it("defaults to the first playable title and lists it as selected", () => {
    render(
      <DemoDataProvider>
        <ReproductorPage />
      </DemoDataProvider>
    );

    const firstPlayable = titleSeed.find((t) => t.playerSource);
    expect(screen.getByRole("option", { name: firstPlayable!.name, selected: true })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test y comprobar que falla**

Run: `npm run test -- app/demo/reproductor/page.test.tsx`
Expected: FAIL — "Cannot find module './page'".

- [ ] **Step 3: Implementar `app/demo/reproductor/page.tsx`**

```tsx
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";

function ReproductorView() {
  const { titles } = useDemoData();
  const searchParams = useSearchParams();
  const playableTitles = React.useMemo(() => titles.filter((t) => t.playerSource), [titles]);

  const requestedId = searchParams.get("title");
  const initialId = playableTitles.find((t) => t.id === requestedId)?.id ?? playableTitles[0]?.id;
  const [selectedId, setSelectedId] = React.useState(initialId);

  const selected = playableTitles.find((t) => t.id === selectedId);

  if (!selected?.playerSource) {
    return <p className="text-muted-foreground">No hay contenido reproducible en el catálogo.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="reproductor-select" className="text-sm font-medium text-foreground">
          Título
        </label>
        <select
          id="reproductor-select"
          value={selected.id}
          onChange={(event) => setSelectedId(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {playableTitles.map((title) => (
            <option key={title.id} value={title.id}>
              {title.name}
            </option>
          ))}
        </select>
      </div>
      <Player source={selected.playerSource} locale="es" />
    </div>
  );
}

export default function ReproductorPage() {
  return (
    <React.Suspense>
      <ReproductorView />
    </React.Suspense>
  );
}
```

- [ ] **Step 4: Ejecutar el test y comprobar que pasa**

Run: `npm run test -- app/demo/reproductor/page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/demo/reproductor/page.tsx app/demo/reproductor/page.test.tsx
git commit -m "feat: añadir el reproductor del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Smoke e2e del demo

**Files:**
- Create: `tests/e2e/demo.spec.ts`

- [ ] **Step 1: Verificar el build completo**

Run: `npm run build`
Expected: compila sin errores; `/demo`, `/demo/catalogo`, `/demo/suscriptores`, `/demo/reproductor` responden.

- [ ] **Step 2: Escribir el smoke e2e**

`tests/e2e/demo.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("el demo no muestra el header/footer de marketing y el marketing sí", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Kivora" })).toBeVisible();

  await page.goto("/demo");
  await expect(page.getByRole("link", { name: "Kivora" })).toHaveCount(0);
  await expect(page.getByText("Nébula")).toBeVisible();
});

test("el sidebar navega entre los cuatro módulos del demo", async ({ page }) => {
  await page.goto("/demo");

  await page.getByRole("link", { name: "Catálogo" }).click();
  await expect(page).toHaveURL(/\/demo\/catalogo$/);

  await page.getByRole("link", { name: "Suscriptores" }).click();
  await expect(page).toHaveURL(/\/demo\/suscriptores$/);

  await page.getByRole("link", { name: "Reproductor" }).click();
  await expect(page).toHaveURL(/\/demo\/reproductor$/);
});

test("se puede añadir un título nuevo desde el catálogo", async ({ page }) => {
  await page.goto("/demo/catalogo");

  await page.getByRole("button", { name: "Añadir título" }).click();
  await page.getByLabel("Título").fill("Título e2e");
  await page.getByRole("button", { name: "Guardar" }).click();

  await expect(page.getByText("Título e2e")).toBeVisible();
});

test("el reproductor carga y reproduce contenido real", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/demo/reproductor");
  const video = page.locator("video");
  await expect(video).toBeVisible({ timeout: 15_000 });

  expect(consoleErrors).toEqual([]);
});
```

- [ ] **Step 3: Ejecutar el smoke e2e completo**

Run: `npm run test:e2e`
Expected: los 4 tests nuevos y los 3 ya existentes de `home.spec.ts` pasan.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/demo.spec.ts
git commit -m "test: añadir smoke e2e del demo OTT

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Verificación final

- [ ] `npm run lint` sin errores.
- [ ] `npm run test` — toda la suite de Vitest pasa (fundación + demo).
- [ ] `npm run test:e2e` — smoke completo (marketing + demo) pasa contra la build de producción.
- [ ] Revisión manual: `/demo` en escritorio y móvil, los 4 módulos, alta de título y de suscriptor, reproducción de al menos un título con DRM y uno sin DRM, comprobar que `/`, `/docs`, `/componentes` siguen mostrando `Header`/`Footer` y `/demo/*` no.
