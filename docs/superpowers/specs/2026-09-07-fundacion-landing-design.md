# Fundación + Landing de kivora.dev

- **Fecha:** 2026-09-07
- **Estado:** Aprobado, pendiente de plan de implementación
- **Sub-proyecto:** 1 de 3 (Fundación + Landing → Documentación + Galería → Demo ERP OTT)

## Contexto

`web` es un repositorio Next.js independiente (Create Next App, prácticamente vacío) que se convertirá en la web pública de la librería de componentes Kivora. Kivora es una librería de componentes multiplataforma (web vía `@kivora/nextjs` y React Native vía `@kivora/native`) que comparte tema y lenguaje visual a través de `@kivora/theme`, con un catálogo real de 60 familias web / 56 nativas, y piezas orientadas a producto audiovisual (`Player` con DRM/HLS/DASH/ads, `FileUpload` avanzado con Tus/Uppy).

La petición original ("una web que muestre los componentes, documentación y una demo de un ERP de una OTT") se decompuso en tres sub-proyectos independientes porque cada uno tiene objetivo y ciclo de vida propios:

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

## Decisiones de diseño

Todas las decisiones siguientes fueron validadas con el usuario (brainstorming con compañero visual para las decisiones de estilo):

| Decisión | Elegido | Alternativas descartadas |
| --- | --- | --- |
| Construcción del propio sitio | Dogfooding: el shell y la landing usan componentes reales de `@kivora/nextjs` | Diseño de marketing a medida con Tailwind puro; híbrido |
| Idioma del sitio | Bilingüe (en/es) | Solo inglés; solo español |
| Identidad de marca | Se define en este proyecto (no existía previamente) | — |
| Dirección visual | **Systematic Clean**: base clara, mucho blanco, estructura técnica | Studio Dark (oscuro, violeta, cinematográfico); Warm Technical (crema/terracota) |
| Acento de marca | **Índigo** (`#4f46e5` como referencia), asumiendo la cercanía visual con Mantine/shadcn como decisión consciente | Teal, Violeta, Coral |
| Estructura de la home | **B: Hero con espacio para comparación Web/Native** (el toggle en vivo se pospone, ver No-objetivos) | A: clásica dev-tool (features primero); C: prueba primero con captura de la demo |
| Consumo de los paquetes Kivora | **npm publicado** (`@kivora/nextjs`, `@kivora/theme` como dependencias normales) | Enlazar al monorepo `module` vía workspace/pnpm link |
| Enrutado bilingüe | **Selector sin cambiar la URL** (cookie, sin prefijo `/en`/`/es`) | Prefijo de idioma en la URL (mejor SEO, descartado por simplicidad) |
| Lado "Native" del hero | **Pospuesto**: el hero de este sub-proyecto solo muestra el lado Web en vivo | Captura real de la app Android existente (Farmacia Oliva) enmarcada en mockup; mockup estilizado no real |

## Arquitectura

### Dependencias e integración con la librería

- Añadir como dependencias de producción: `@kivora/nextjs`, `@kivora/theme` (paquetes npm publicados, versión estable más reciente en el momento de implementar).
- Ajustar `tailwindcss`/`@tailwindcss/postcss` a `^4.1` si la versión actual del proyecto es inferior (requisito del README de `@kivora/nextjs`).
- `next.config.ts`: añadir `transpilePackages: ['@kivora/nextjs', '@kivora/theme']`.
- `app/globals.css`: añadir `@import "@kivora/nextjs/styles.css";` y `@source "../node_modules/@kivora/nextjs/dist";`, conservando el resto de estilos base existentes (fuentes Geist, reset).
- `app/providers.tsx` (nuevo, `'use client'`): monta `KivoraProvider colorMode="system"` envolviendo `LocaleProvider` (ver abajo). `app/layout.tsx` pasa a ser un Server Component que solo monta `<Providers>`.

### Tema (claro/oscuro/sistema)

- Gestionado íntegramente por `KivoraProvider`; no se implementa lógica de tema propia. El `ThemeToggle` del shell es un componente cliente que llama al hook expuesto por `@kivora/nextjs`/`@kivora/theme` para leer y cambiar `colorMode`.

### Idioma (bilingüe sin prefijo de URL)

- Cookie `kivora-locale` (valores `en` | `es`, por defecto `en` si no existe) leída en `app/layout.tsx` (Server Component) con `cookies()` de `next/headers` para determinar el diccionario inicial sin parpadeo de hidratación.
- `lib/i18n/`:
  - `dictionaries.ts`: tipo `Dictionary` y las cadenas usadas por el shell y la home.
  - `en.ts`, `es.ts`: diccionarios concretos.
- `components/providers/locale-provider.tsx` (`'use client'`): contexto React que expone `{ locale, dictionary, setLocale }`. `setLocale` invoca una Server Action (`'use server'`, en `lib/i18n/set-locale.ts`) que fija la cookie `kivora-locale`, y a continuación llama a `router.refresh()` para que los Server Components (incluido el layout) rerendericen con el diccionario correcto. El estado en memoria del contexto se actualiza de forma optimista para que el `LocaleToggle` refleje el cambio sin esperar al refresh.
- `LocaleToggle`: componente cliente en el shell (usa un `Toggle`/`Select` de `@kivora/nextjs`) que llama a `setLocale`.
- Riesgo aceptado y documentado: sin prefijo de idioma en la URL, el contenido no es indexable por separado por idioma (peor SEO bilingüe). Aceptado explícitamente por el usuario a cambio de simplicidad.

### Estructura de carpetas (nueva/afectada)

```
app/
  layout.tsx              # Server Component: lee cookie de idioma, monta <Providers>
  providers.tsx            # 'use client': KivoraProvider + LocaleProvider
  page.tsx                 # Home
  globals.css              # + import de estilos Kivora
  docs/page.tsx             # Placeholder
  componentes/page.tsx      # Placeholder
  demo/page.tsx             # Placeholder
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
  providers/
    locale-provider.tsx
lib/
  i18n/
    dictionaries.ts
    en.ts
    es.ts
```

### Páginas de este sub-proyecto

- **Home (`app/page.tsx`)**: composición de `hero`, `stats-bar`, `feature-grid`, `install-snippet`, `gallery-teaser`, en ese orden. El `hero` incluye titular, subtítulo, CTA a `/componentes` y `/docs`, y una vista en vivo (solo Web) de un componente representativo de `@kivora/nextjs` (p. ej. `Card` + `Button`), dejando explícitamente espacio/estructura para añadir el lado "Native" en una iteración futura sin rehacer el layout.
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

- **Cercanía de marca**: el acento índigo se solapa visualmente con Mantine/shadcn. Decisión consciente del usuario; mitigable más adelante con tipografía/iconografía propia si se detecta confusión real.
- **SEO bilingüe**: sin prefijo de idioma en la URL, Google no indexa cada idioma por separado. Aceptado por simplicidad; revisable si el tráfico orgánico bilingüe importa más adelante.
- **Promesa visual incompleta**: el hero no muestra aún el diferenciador Web/Native; el copy de esta iteración debe evitar prometer una comparación que todavía no se ve.
- **Deuda de mantenimiento**: el conteo "116 familias de componentes" en la stats-bar está hardcodeado y se desincronizará si la librería crece. Documentado, no bloqueante.
- **Compatibilidad de versiones**: `@kivora/nextjs`/`@kivora/theme` están en `0.0.x` (en desarrollo activo según el README del monorepo); hay que fijar versiones exactas al instalar y revisar el changelog antes de subir de versión.

## Siguientes pasos

Este spec pasa a `writing-plans` para generar el plan de implementación paso a paso. Los sub-proyectos 2 (Documentación + Galería) y 3 (Demo ERP OTT) tendrán su propio ciclo de brainstorming → spec → plan cuando se aborden.
