# Demo ERP OTT ("Nébula")

- **Fecha:** 2026-09-07
- **Estado:** Aprobado, pendiente de plan de implementación
- **Sub-proyecto:** 3 de 3 (Fundación + Landing → Documentación + Galería → **Demo ERP OTT**)

## Contexto

Sub-proyectos 1 (Fundación + Landing) y 2 (Documentación + Galería, pendiente de abordar) sientan la base de kivora.dev. Este documento cubre el tercero: una aplicación de demostración —un ERP ficticio de una plataforma OTT llamada **Nébula**— que muestra los componentes de `@kivora/nextjs` en un dominio real, del mismo modo que `module/example/web` (Farmacia Oliva) lo hace para el monorepo de componentes.

A diferencia de Farmacia Oliva, esta demo vive dentro de **kivora.dev** (bajo `/demo`), no en un repo aparte, y el usuario pidió explícitamente que **no comparta el header ni el footer de la web de marketing** y que se sienta como una aplicación independiente.

## Objetivo

Construir `/demo` y sus sub-rutas como una mini-aplicación de gestión (dashboard, catálogo de contenidos, suscriptores, reproductor) con su propio shell de navegación, demostrando en contexto real las piezas más diferenciales de la librería: `DataTable`, `Chart`, `FileUpload` y, sobre todo, `Player` con contenido real reproducible (no una maqueta).

## No-objetivos

- No hay backend ni sincronización entre pestañas/dispositivos: los datos son ficticios y persisten en `localStorage`, igual que Farmacia Oliva.
- No se implementa un módulo de Facturación separado (descartado en el brainstorming: poco valor diferencial sobre Suscriptores).
- No se soporta deep-linking de un título concreto del Reproductor por segmento de ruta (`/demo/reproductor/[id]`); se usa un parámetro de consulta opcional (`?title=`) para preseleccionar, mantenido simple a propósito.
- No se implementan altas/bajas de suscripción con lógica de facturación real, ni autenticación: cualquiera que visite `/demo` ve y edita los mismos datos de demostración de su navegador.

## Corrección respecto al diseño aprobado

Durante la preparación del spec aparecieron dos restricciones técnicas reales que matizan el diseño aprobado en el chat:

1. **Header/Footer no se pueden "quitar" desde un layout anidado.** En Next.js App Router, un layout anidado (`app/demo/layout.tsx`) solo *añade* contenido dentro de lo que ya renderiza su layout padre — no puede excluir lo que el layout raíz ya puso en la página. Como el `Header`/`Footer` del sub-proyecto 1 se renderizan directamente en `app/layout.tsx` (el layout raíz), hace falta reestructurar: el layout raíz deja de renderizar `Header`/`Footer` directamente, y estos se mueven a un nuevo layout del grupo de rutas `(marketing)`, que envuelve `/`, `/docs` y `/componentes`. `/demo` y sus sub-rutas quedan fuera de ese grupo, con su propio layout, y por tanto sin Header/Footer. Los paréntesis de `(marketing)` son solo organizativos: no aparecen en la URL.
2. **El modo claro/oscuro es una clase global (`dark` en `<html>`), no se puede anidar por sección.** `KivoraProvider` alterna una clase en `document.documentElement`; dos providers anidados con `colorMode` distinto pelearían por esa misma clase global, no producirían "marketing en claro, demo en oscuro" simultáneos. En vez de forzar un `colorMode="dark"` en el demo (como se sugirió en el chat), el shell del demo usa una paleta oscura **fija con clases de Tailwind propias** (no los tokens semánticos `bg-background`/`text-foreground`) solo para su cromado (sidebar, barra superior) — la sensación "sala de control" se consigue así sin pelear con el sistema de temas. Los componentes de Kivora renderizados dentro (DataTable, Chart, formularios) siguen respetando el `ThemeToggle` global normalmente.

El resto del diseño aprobado (rutas reales, `DemoDataProvider` con `localStorage`, contenido real de vídeo público) se mantiene sin cambios.

## Arquitectura

### Reestructuración de rutas (afecta al sub-proyecto 1 ya construido)

```
app/
  layout.tsx                    # MODIFICAR: ya no renderiza Header/Footer, solo <Providers>{children}</Providers>
  (marketing)/
    layout.tsx                   # CREAR: <Header/><main>{children}</main><Footer/>
    page.tsx                      # MOVER desde app/page.tsx (home)
    docs/page.tsx                  # MOVER
    componentes/page.tsx           # MOVER
  demo/
    layout.tsx                    # CREAR: DemoShell (sidebar oscuro + DemoDataProvider)
    page.tsx                       # CREAR: Dashboard
    catalogo/page.tsx               # CREAR
    suscriptores/page.tsx           # CREAR
    reproductor/page.tsx            # CREAR
```

Los paréntesis de `(marketing)` no cambian ninguna URL: `/`, `/docs` y `/componentes` siguen igual. `/demo/*` queda fuera de ese grupo, así que no hereda `Header`/`Footer`. Sigue existiendo un único layout raíz real (`app/layout.tsx`), por lo que la navegación entre marketing y demo no provoca una recarga completa de página — solo cambia la parte del árbol que difiere.

### Shell del demo (`app/demo/layout.tsx`)

- Envuelve `children` en `DemoDataProvider` (ver más abajo).
- Renderiza un sidebar fijo con paleta oscura fija (clases Tailwind directas, p. ej. `bg-zinc-950 text-zinc-50`, no tokens semánticos): logo "Nébula", enlaces a Dashboard/Catálogo/Suscriptores/Reproductor (activos vía `usePathname`, mismo patrón que `NavLink`), y un enlace discreto "← kivora.dev" al final que vuelve a `/`.
- El área de contenido principal sí usa los tokens semánticos de Kivora (`bg-background`, `text-foreground`) para que `DataTable`, `Chart`, formularios, etc. respeten el `ThemeToggle` global; el propio `ThemeToggle`/`LocaleToggle` se muestran en una barra superior discreta dentro del área de contenido.

### Datos de demostración

- `lib/demo/types.ts`: `Title`, `Subscriber`, `Plan`.
- `lib/demo/seed.ts`: ~12 títulos (5 con `playerSource` real reutilizando las fuentes públicas de `module/example/web/src/components/player-demo-sources.ts` — Sintel, Angel One HLS, Flower, Angel One Widevine, Tears of Steel; 7 títulos ficticios sin `playerSource`, para poblar la tabla) y ~20 suscriptores ficticios.
- `components/demo/data-provider.tsx` (`DemoDataProvider`, `'use client'`): replica el patrón ya probado de `store-provider.tsx` en Farmacia Oliva — `useState` inicializado con la semilla (seguro para SSR), `useEffect` que lee `localStorage["kivora-demo-ott-v1"]` tras montar, valida su forma antes de aceptarlo, y solo entonces sustituye el estado; un flag `ready` evita persistir el estado inicial antes de que la lectura haya terminado. Expone `titles`, `subscribers`, `addTitle`, `updateTitle`, `addSubscriber`, `updateSubscriber`.
- Ninguna cifra del dashboard se deriva de fechas relativas a "hoy": el gráfico de altas usa una serie fija de 6 valores (últimos 6 meses ilustrativos), evitando cualquier riesgo de discrepancia servidor/cliente.

### Páginas

- **`/demo` (Dashboard):** stats derivadas (suscriptores activos, MRR simulado a partir del precio de los planes activos, visualizaciones últimos 30 días sumando `viewsLast30Days` de los títulos), un `Chart` de altas de los últimos 6 meses (serie fija) y una tabla de los 5 títulos más vistos.
- **`/demo/catalogo`:** `DataTable` de títulos con búsqueda y filtro por género/tipo; botón "Añadir título" abre un formulario con `FileUpload` (simple) para el póster.
- **`/demo/suscriptores`:** `DataTable` de suscriptores (plan, estado, fecha de alta); alta/edición con un formulario simple.
- **`/demo/reproductor`:** selector de título (solo los que tienen `playerSource`) + `Player` real de `@kivora/nextjs` reproduciendo la fuente elegida; acepta `?title=<id>` para preseleccionar (usado por los enlaces del catálogo), con el primer título reproducible como valor por defecto si no hay parámetro o no es válido.

## Testing

Mismo enfoque que el resto del proyecto — TDD, Vitest + RTL para lógica y componentes, Playwright para el flujo completo:

- `DemoDataProvider`: altas de título/suscriptor, persistencia (mockeando `localStorage`), que el estado inicial de SSR sea siempre la semilla.
- Cada página: que renderiza sus datos (RTL, con el provider real envolviendo).
- Playwright (ampliando `tests/e2e/`): entrar en `/demo`, navegar los 4 módulos por el sidebar, comprobar que **no** aparece el `Header`/`Footer` de la web en ninguna de las rutas de `/demo/*` (y que sí aparecen en `/`, `/docs`, `/componentes`), añadir un título y verificar que aparece en la tabla, y que el Reproductor carga y reproduce sin errores de consola.

## Riesgos

- Las URLs de vídeo público (Shaka demo assets, Axinom test DRM) son de terceros: pueden cambiar o dejar de estar disponibles sin aviso. Se documenta la atribución igual que hace `module/example/web`.
- El DRM de prueba (Widevine/PlayReady) depende de HTTPS y del navegador; puede no funcionar en todos los entornos de despliegue o localmente sin HTTPS.
- La reestructuración de rutas modifica archivos ya construidos y probados en el sub-proyecto 1 (mueve páginas, cambia `app/layout.tsx`); el plan debe re-verificar que los tests existentes (unitarios y e2e) del sub-proyecto 1 siguen pasando después del movimiento.
- El look "sala de control" del sidebar usa colores fijos en vez de tokens del tema: si Kivora añade soporte de temas por-sección en el futuro, esta parte debería revisarse.

## Siguientes pasos

Este spec pasa a `writing-plans`. El sub-proyecto 2 (Documentación + Galería) queda pendiente de su propio ciclo de brainstorming → spec → plan.
