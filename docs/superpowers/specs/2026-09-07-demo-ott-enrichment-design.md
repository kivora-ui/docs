# Ampliación de la demo ERP OTT: Biblioteca de medios + enriquecimiento

- **Fecha:** 2026-09-07
- **Estado:** Aprobado, pendiente de plan de implementación
- **Depende de:** [docs/superpowers/specs/2026-09-07-demo-ott-erp-design.md](2026-09-07-demo-ott-erp-design.md) (ya implementado y cerrado)

## Contexto

El usuario compartió dos capturas de un panel de administración de una plataforma de streaming real (biblioteca de medios con tabs Vídeo/Audio/Imágenes y un dashboard con métricas, geomapa y análisis de canal) y pidió: (1) usar iconos de Lucide para dar personalidad — ya hecho en un ciclo anterior — y (2) ampliar la demo ERP OTT para que se apoye en muchas más familias de componentes de Kivora ("al menos el 80%"), con imágenes reales en pósteres/avatares, y con foco explícito en responsive y accesibilidad.

Se acordó con el usuario:
- **Imágenes**: servicios públicos deterministas, sin backend — `picsum.photos/seed/<id>/W/H` para pósteres/miniaturas, `api.dicebear.com` para avatares.
- **Alcance**: no una auditoría literal del 80% del catálogo (48 de 60 familias), sino una página nueva (Biblioteca de medios, inspirada en la primera captura) más un enriquecimiento deliberado de las 4 páginas existentes, sin forzar componentes donde no aportan.

Las capturas se usan solo como inspiración de arquitectura de información (qué tipo de tabla, qué tipo de tarjetas de métricas), nunca de marca visual: la demo sigue la identidad de Kivora (paleta oscura fija del sidebar ya establecida, tokens semánticos en el contenido).

## Objetivo

Añadir una quinta sección al demo (Biblioteca de medios) y enriquecer Dashboard, Catálogo, Suscriptores y Reproductor con ~13 familias de componentes de `@kivora/nextjs` no usadas todavía en la demo (`Tabs`, `Badge`, `DropdownMenu`, `Skeleton`, `Empty`, `Card`, `Avatar`, `Breadcrumb`, `Sheet`, `Accordion`, `Command`/`CommandDialog`, `Kbd`, `Tooltip`), imágenes reales deterministas, y una pasada explícita de accesibilidad y responsive.

## No-objetivos

- No se implementa subida real de ficheros a la Biblioteca de medios (sigue sin backend); los activos son semilla fija, con una acción de eliminar para demostrar un mutador más del `DemoDataProvider`.
- No se reproduce el geomapa literal de la captura: Kivora no tiene un componente de mapa, y construir uno a medida en SVG no demuestra ningún componente de la librería. Se sustituye por una tarjeta "Top países" con `Chart` (barras horizontales) — mismo espíritu analítico.
- No se persiguen las demás secciones del sidebar de la captura (Content, Storefront, Live Streams, Marketing, Monetization, etc.) — quedan fuera de alcance, tal como se acordó.
- No se completa el rediseño responsive de los formularios en esta iteración más allá de Sheet-en-móvil/Dialog-en-escritorio para Catálogo y Suscriptores (el arreglo mínimo del plan anterior — scroll horizontal en tablas, sidebar colapsable — ya cubría el mínimo funcional).

## Arquitectura

### Quinta sección: Biblioteca de medios (`/demo/biblioteca`)

Representa los **ficheros de origen** subidos (vídeo/audio/imagen) con su estado de procesado — complementa a Catálogo (que muestra los **títulos publicados**), no lo duplica.

- `lib/demo/media.ts`: tipos `MediaKind` (`"video" | "audio" | "image"`), `MediaStatus` (`"initialized" | "pending" | "failed" | "completed"`), `MediaAsset` (`id, name, kind, tags: string[], createdAt, createdBy, durationSeconds?, status`); semilla fija de ~16 activos (8 vídeo, 4 audio, 4 imagen) — sin `Math.random()` ni fechas relativas a "hoy".
- `DemoDataProvider` se amplía con `mediaAssets: MediaAsset[]` y `removeMediaAsset(id: string): void` (mismo patrón hidratación/persistencia ya existente; un mutador de borrado, no solo altas, amplía la cobertura de lo que el provider demuestra).
- Página: `Tabs` (Vídeos/Audio/Imágenes) filtran la tabla por `kind`. `DataTable` con: miniatura (`AspectRatio` + `picsum.photos` para vídeo; icono Lucide de música/imagen para audio/imagen, ya que no tienen "fotograma" real), `name`, `tags` (lista de `Badge` `variant="outline"`), `kind`, `createdAt`, `createdBy` (con `Avatar` DiceBear), `durationSeconds` formateado, `status` (`Badge` con color semántico por estado), y una columna de acciones con `DropdownMenu` (Ver detalle / Eliminar). Al entrar, se muestran `Skeleton` de fila durante ~400 ms simulando una carga; si una pestaña no tiene activos, se muestra `Empty` con icono, título y descripción en vez de una tabla vacía.

### Enriquecimiento de las páginas existentes

- **Dashboard** (`/demo`): las tres tarjetas de estadísticas y el gráfico pasan de `<div>` sueltos a `Card`/`CardHeader`/`CardTitle`/`CardContent` reales (dogfooding genuino, antes eran divs con clases). Cabecera de bienvenida con `Avatar` (DiceBear, seed fijo tipo "admin"). La tarjeta "Top países" sustituye a cualquier idea de geomapa: `Chart` de barras horizontales con 5 países fijos.
- **Catálogo / Suscriptores**: `Breadcrumb` bajo el `<h1>` (Nébula › Catálogo). `Avatar` (DiceBear, estilo `initials`, determinista por nombre) en la columna de suscriptor. El diálogo de alta usa `useBreakpoint()` (ya exportado por `@kivora/nextjs`) para decidir `Sheet` (móvil) o `Dialog` (escritorio) sin duplicar el formulario. Catálogo añade una acción "Ver detalle" que abre un `Sheet` con `Accordion` (Información general / Especificaciones técnicas) para el título seleccionado.
- **Reproductor y shell del demo**: `Tooltip` en el selector de título explicando qué significa "reproducible". En `DemoShell` (visible en todas las páginas del demo) se añade un buscador rápido global con `CommandDialog` (atajo ⌘K/Ctrl+K ya integrado en el propio componente) que lista títulos y las 5 secciones del demo; el botón que lo abre muestra el atajo con `Kbd`.

### Imágenes deterministas

- Pósteres de títulos ficticios (los 7 sin `playerSource`): `https://picsum.photos/seed/<id>/300/450`. Los 5 títulos reales conservan su poster oficial ya existente.
- Miniaturas de vídeo en Biblioteca de medios: `https://picsum.photos/seed/<id>/160/90`.
- Avatares de suscriptores y del admin del dashboard: `https://api.dicebear.com/9.x/initials/svg?seed=<nombre o id>` — estilo `initials` elegido deliberadamente (limpio, sin representar personas, coherente con la identidad "Systematic Clean" del sitio) frente a estilos ilustrados.

Todas las URLs son deterministas por *seed*: mismo id, misma imagen siempre — sin riesgo de discrepancia servidor/cliente.

## Accesibilidad y responsive (transversal)

- Todo icono decorativo lleva `aria-hidden`; todo control solo-icono lleva `aria-label`.
- `Tabs`, `Breadcrumb`, `DropdownMenu`, `Sheet`, `Command` usan primitivas Radix vía Kivora, que ya gestionan foco y roles ARIA correctamente — no hace falta reimplementar nada, solo usarlas bien (etiquetas, `aria-label` donde el texto visible no baste).
- Las tablas nuevas heredan el contenedor `overflow-x-auto` ya establecido.
- El formulario de alta en Sheet-en-móvil reutiliza el mismo componente de formulario que en Dialog-en-escritorio (sin duplicar campos ni lógica).

## Testing

Mismo enfoque de siempre — TDD, Vitest + RTL, Playwright ampliado:

- `lib/demo/media.ts`: test de la semilla (cantidades, ids únicos, determinismo).
- `DemoDataProvider`: test de `removeMediaAsset`.
- Cada componente/página nueva o modificada: test de comportamiento (cambio de tab filtra la tabla, `Empty` aparece si la pestaña está vacía, `Sheet` se abre en viewport estrecho y `Dialog` en ancho — mockeando `useBreakpoint`, el buscador `CommandDialog` abre con el atajo y filtra resultados).
- Playwright: navegar a Biblioteca de medios desde el sidebar, cambiar de tab, eliminar un activo; abrir el buscador global con el atajo de teclado; comprobar que el formulario de alta se comporta como `Sheet` en un viewport móvil real.

## Riesgos

- `picsum.photos` y `api.dicebear.com` son servicios de terceros: si dejan de estar disponibles, las imágenes rotas degradan la demo visualmente pero no la rompen funcionalmente (no son necesarias para ninguna lógica).
- `useBreakpoint()` decide Sheet/Dialog en el cliente tras el montaje; el primer render de servidor debe asumir un valor por defecto seguro (escritorio) para evitar parpadeo — documentar este detalle en el plan.
- Añadir 13 familias de componentes de golpe aumenta el tamaño del bundle de `/demo`; aceptable para una demo, pero queda como nota para una futura revisión de rendimiento si el catálogo real de kivora.dev llegara a necesitar code-splitting por sección.

## Siguientes pasos

Este spec pasa a `writing-plans` para generar el plan de implementación paso a paso.
