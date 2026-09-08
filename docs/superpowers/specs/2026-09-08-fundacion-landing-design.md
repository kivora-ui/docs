# Fundación + Landing de kivora.dev

- **Fecha:** 2026-09-08
- **Estado:** Aprobado, pendiente de plan de implementación
- **Sub-proyecto:** 1 de 3 (Fundación + Landing → Documentación + Galería → Demo ERP OTT)
- **Reemplaza a:** `2026-09-07-fundacion-landing-design.md` (mismas decisiones de diseño, adapta la estructura de carpetas a `src/` y confirma el estado real del repo tras la reestructuración)

## Contexto

`web` es el repositorio Next.js que se convertirá en la web pública de la librería de componentes Kivora. Kivora es una librería de componentes multiplataforma (web vía `@kivora/nextjs` y React Native vía `@kivora/native`) que comparte tema y lenguaje visual a través de `@kivora/theme`, con un catálogo real de familias de componentes web/nativas, y piezas orientadas a producto audiovisual (`Player` con DRM/HLS/DASH/ads, `FileUpload` avanzado con Tus/Uppy).

El 2026-09-07 se aprobó y se implementó una primera versión de este sub-proyecto (landing + shell) junto con los sub-proyectos 2 y 3 (documentación/galería embrionaria y demo ERP OTT). El 2026-09-08 el árbol de trabajo se reestructuró intencionadamente: el código de aplicación se mueve a `src/` (patrón habitual de Next.js App Router con carpeta `src/`), y como parte de esa reestructuración se eliminaron las páginas, componentes, tests e2e y los documentos de spec/plan anteriores, dejando el repositorio sin páginas reales (`app/` solo conserva `favicon.ico`, `globals.css` y `not-found.tsx`). `src/lib/` sí se migró íntegro desde `lib/` (verificado, contenido idéntico). `next.config.ts` (con `transpilePackages`) y el `@import`/tokens de color índigo en `app/globals.css` tampoco se tocaron y siguen vigentes.

Este documento re-confirma el diseño ya validado del sub-proyecto 1 sobre la base del repo reestructurado, para reconstruirlo desde cero siguiendo la convención `src/`.

La petición original ("una web que muestre los componentes, documentación y una demo de un ERP de una OTT") se mantiene decompuesta en tres sub-proyectos independientes:

1. **Fundación + Landing** (este documento): shell de navegación, identidad visual, tema, home.
2. **Documentación + Galería interactiva**: página por familia de componente con preview en vivo, props y snippet.
3. **Demo ERP de OTT multimedia**: aplicación de ejemplo mostrando los componentes en un dominio real (catálogo, suscriptores, facturación, analíticas).

Este documento cubre solo el sub-proyecto 1.

## Objetivo

Establecer la base técnica y visual de `kivora.dev`: el shell de navegación (header, footer, tema, idioma), la identidad visual de marca, y una home que comunique la propuesta de valor de la librería. Las páginas `/docs`, `/componentes` y `/demo` quedan como placeholders navegables para que el shell quede completo, pero su contenido real es objeto de los sub-proyectos 2 y 3.

## No-objetivos

- No se implementa el contenido real de documentación, galería de componentes ni demo ERP.
- No se implementa el toggle interactivo Web/React Native en el hero (pospuesto: React Native no puede ejecutarse en el navegador y no se dispone aún de capturas reales de un contexto OTT; se revisará cuando exista contenido de la demo).
- No se automatiza el recuento de familias de componentes mostrado en las stats (se documenta como deuda técnica).
- No se decide todavía el dominio/hosting de despliegue.
- No se relitigan las decisiones de diseño ya aprobadas el 2026-09-07 (ver tabla siguiente); solo se adapta la ubicación de los archivos.

## Decisiones de diseño

Reconfirmadas sin cambios respecto al 2026-09-07 (brainstorming con compañero visual para las decisiones de estilo, y esta vez usando además como referencia de estructura/composición las capturas de radix-ui.com/primitives y /themes aportadas por el usuario):

| Decisión | Elegido | Alternativas descartadas |
| --- | --- | --- |
| Construcción del propio sitio | Dogfooding: el shell y la landing usan componentes reales de `@kivora/nextjs` | Diseño de marketing a medida con Tailwind puro; híbrido |
| Idioma del sitio | Bilingüe (en/es) | Solo inglés; solo español |
| Identidad de marca | Ya definida (tokens `--color-primary` en `app/globals.css`, sin tocar) | — |
| Dirección visual | **Systematic Clean**: base clara, mucho blanco, estructura técnica (alineado con la composición de radix-ui.com: hero + grid de tarjetas de producto + secciones nav superior) | Studio Dark (oscuro, violeta, cinematográfico); Warm Technical (crema/terracota) |
| Acento de marca | **Índigo** (`oklch(51.1% 0.262 276.966)`, ya en `globals.css`) | Teal, Violeta, Coral |
| Estructura de la home | **B: Hero con espacio para comparación Web/Native** (el toggle en vivo se pospone, ver No-objetivos) | A: clásica dev-tool (features primero); C: prueba primero con captura de la demo |
| Consumo de los paquetes Kivora | Dependencias de `@kivora/*` ya presentes en `package.json` como tarballs locales (`file:../module/packages/.../dist/*.tgz`) apuntando al monorepo `module` | Instalar como paquetes npm publicados (decisión original; se mantiene pospuesta mientras los paquetes están en `0.0.0` y en desarrollo activo en el monorepo) |
| Enrutado bilingüe | **Selector sin cambiar la URL** (cookie, sin prefijo `/en`/`/es`) | Prefijo de idioma en la URL (mejor SEO, descartado por simplicidad) |
| Lado "Native" del hero | **Pospuesto**: el hero de este sub-proyecto solo muestra el lado Web en vivo | Captura real de la app Android existente enmarcada en mockup; mockup estilizado no real |

## Arquitectura

### Dependencias e integración con la librería

- `@kivora/nextjs`, `@kivora/theme` ya están en `package.json` (tarballs locales del monorepo `module`, ver tabla de decisiones). No se cambia a npm publicado en este sub-proyecto.
- `next.config.ts` ya tiene `transpilePackages: ["@kivora/nextjs", "@kivora/theme"]`. No requiere cambios.
- `app/globals.css` ya tiene `@import "@kivora/nextjs/styles.css";`, `@source "../node_modules/@kivora/nextjs/dist";` y los tokens `--color-primary` claro/oscuro. No requiere cambios de contenido, pero pasa a convivir con el resto del CSS base (fuentes Geist, reset) si hiciera falta añadirlo.
- `app/providers.tsx` (nuevo, `'use client'`): monta `KivoraProvider colorMode="system"` envolviendo `LocaleProvider` (ver abajo). `app/layout.tsx` es un Server Component que solo monta `<Providers>`.

### Tema (claro/oscuro/sistema)

- Gestionado íntegramente por `KivoraProvider`; no se implementa lógica de tema propia. El `ThemeToggle` del shell es un componente cliente que llama al hook expuesto por `@kivora/nextjs`/`@kivora/theme` para leer y cambiar `colorMode`.

### Idioma (bilingüe sin prefijo de URL)

- Cookie `kivora-locale` (valores `en` | `es`, por defecto `en` si no existe) leída en `app/layout.tsx` (Server Component) con `cookies()` de `next/headers` para determinar el diccionario inicial sin parpadeo de hidratación.
- `src/lib/i18n/` ya existe con `dictionaries.ts` (o `types.ts`/`index.ts`), `en.ts`, `es.ts` migrados del sub-proyecto anterior; se revisan y se completan las claves que falten para el nuevo shell/home (evitando reintroducir la clave huérfana `placeholder.demoTitle` eliminada en `4292bd5`).
- `src/providers/locale-provider.tsx` (`'use client'`): contexto React que expone `{ locale, dictionary, setLocale }`. `setLocale` invoca una Server Action (`'use server'`, en `src/lib/i18n/set-locale.ts`) que fija la cookie `kivora-locale`, y a continuación llama a `router.refresh()` para que los Server Components (incluido el layout) rerendericen con el diccionario correcto. El estado en memoria del contexto se actualiza de forma optimista para que el `LocaleToggle` refleje el cambio sin esperar al refresh.
- `LocaleToggle`: componente cliente en el shell (usa un `Toggle`/`Select` de `@kivora/nextjs`) que llama a `setLocale`.
- Riesgo aceptado y documentado: sin prefijo de idioma en la URL, el contenido no es indexable por separado por idioma (peor SEO bilingüe). Aceptado explícitamente por el usuario a cambio de simplicidad.

### Estructura de carpetas (nueva/afectada, convención `src/`)

```
app/
  layout.tsx              # Server Component: lee cookie de idioma, monta <Providers>
  page.tsx                 # Home
  globals.css              # ya existe, tokens índigo + import estilos Kivora
  not-found.tsx             # ya existe
  favicon.ico               # ya existe
  (marketing)/
    layout.tsx              # Header + Footer del shell
    page.tsx                 # Re-exporta la Home (o la Home vive directamente aquí)
    docs/page.tsx             # Placeholder
    componentes/page.tsx      # Placeholder
  demo/
    layout.tsx               # Placeholder del shell de demo (sub-proyecto 3 lo completa)
    page.tsx                  # Placeholder
src/
  components/
    shell/
      header.tsx
      footer.tsx
      theme-toggle.tsx
      locale-toggle.tsx
      nav-link.tsx            # Estado activo según la ruta actual
    home/
      hero.tsx
      stats-bar.tsx
      feature-grid.tsx
      install-snippet.tsx
      gallery-teaser.tsx
    placeholder-page.tsx      # Componente compartido por los placeholders de /docs, /componentes, /demo
  providers/
    locale-provider.tsx
  lib/
    i18n/                     # ya existe, se revisa/completa
      index.ts
      en.ts
      es.ts
      types.ts
    preferences.ts             # ya existe, sin cambios previstos
    preferences-actions.ts      # ya existe, sin cambios previstos
```

`app/providers.tsx` puede vivir en `app/` (co-ubicado con `layout.tsx`, patrón habitual de Next.js) o moverse a `src/providers/app-providers.tsx` si se prefiere consistencia total con el resto de `src/`; se decide en el plan de implementación según lo que resulte más legible.

### Páginas de este sub-proyecto

- **Home (`app/(marketing)/page.tsx`)**: composición de `hero`, `stats-bar`, `feature-grid`, `install-snippet`, `gallery-teaser`, en ese orden. El `hero` incluye titular, subtítulo, CTA a `/componentes` y `/docs`, y una vista en vivo (solo Web) de un componente representativo de `@kivora/nextjs` (p. ej. `Card` + `Button`), dejando explícitamente espacio/estructura para añadir el lado "Native" en una iteración futura sin rehacer el layout.
- **Placeholders (`/docs`, `/componentes`, `/demo`)**: página mínima con el shell montado, un título y un mensaje "en construcción" (bilingüe), sin contenido funcional. Su propósito único es que la navegación del header no produzca 404 durante los sub-proyectos 2 y 3.

## Testing

Sigue TDD estricto (test primero, implementación mínima después) para la lógica, y un smoke e2e para la integración:

- **Vitest + React Testing Library** (mismo stack que usa `module`), para:
  - `locale-provider`: persistencia de la cookie, valor por defecto, cambio de idioma.
  - `nav-link`: estado activo según la ruta.
  - Resolución del diccionario correcto según la cookie leída en el layout.
- **Playwright** (mismo stack que `module/example/web`), smoke e2e sobre `next build && next start`:
  - La home carga sin errores de consola/hidratación.
  - Los enlaces del header (`/docs`, `/componentes`, `/demo`) no devuelven 404.
  - El `ThemeToggle` aplica/quita la clase `dark` en `<html>`.
  - El `LocaleToggle` cambia el texto visible del hero y del nav.

No se cubre exhaustivamente el pixel-perfect de la landing (fuera del alcance de TDD); el enfoque de test es sobre comportamiento e integración, no sobre estética.

## Riesgos

- **Cercanía de marca**: el acento índigo se solapa visualmente con Mantine/shadcn/Radix (referencia de estructura usada aquí). Decisión consciente del usuario; mitigable más adelante con tipografía/iconografía propia si se detecta confusión real.
- **SEO bilingüe**: sin prefijo de idioma en la URL, Google no indexa cada idioma por separado. Aceptado por simplicidad; revisable si el tráfico orgánico bilingüe importa más adelante.
- **Promesa visual incompleta**: el hero no muestra aún el diferenciador Web/Native; el copy de esta iteración debe evitar prometer una comparación que todavía no se ve.
- **Deuda de mantenimiento**: el conteo de "familias de componentes" en la stats-bar quedará hardcodeado y se desincronizará si la librería crece. Documentado, no bloqueante.
- **Compatibilidad de versiones**: `@kivora/nextjs`/`@kivora/theme` se consumen como tarballs locales del monorepo `module` en `0.0.0`; hay que regenerar el `.tgz` si el monorepo cambia y no hay garantía de compatibilidad semver hasta que se publiquen en npm.
- **Repetir el trabajo eliminado**: este sub-proyecto reconstruye código que ya existió y fue borrado sin commitear; conviene revisar el historial de commits del 2026-09-07 (visible vía `git log`/`git show`) como referencia de implementación para no perder matices ya resueltos entonces (p. ej. las notas de desviación registradas en los specs del demo OTT).

## Siguientes pasos

Este spec pasa a `writing-plans` para generar el plan de implementación paso a paso. Los sub-proyectos 2 (Documentación + Galería) y 3 (Demo ERP OTT) tendrán su propio ciclo de brainstorming → spec → plan cuando se aborden.
