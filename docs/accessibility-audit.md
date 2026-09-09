# Revisión de accesibilidad — 9 de septiembre de 2026

**Estado tras las correcciones: los cuatro hallazgos de la revisión inicial están corregidos y las comprobaciones de regresión pasan.** Esta revisión parcial no constituye una declaración de conformidad WCAG 2.2 AA de toda la web.

## Alcance

Build local de producción en Chromium. axe-core 4.13.0 con etiquetas WCAG A/AA de 2.0, 2.1 y 2.2. Se analizaron las cuatro escenas de la home, el diálogo de invitación, la portada de documentación en sus cuatro temas, instalación y las páginas de Button, Input y Dialog. Comprobaciones adicionales de teclado del diálogo y viewport de 320 × 256 CSS px, representativo del espacio disponible al ampliar al 400 % una ventana de 1280 × 1024. No se realizó una prueba de zoom real de navegador ni una evaluación con lector de pantalla.

## Hallazgos iniciales (corregidos)

| Prioridad | Criterio | Evidencia | Corrección recomendada |
| --- | --- | --- | --- |
| Alta | 1.4.3 Contraste mínimo (AA) | Textos secundarios de documentación: claro 4,07:1, rosa 3,60:1 y verde 3,03:1; estos textos requieren 4,5:1. Ejemplo: enlace «Documentación» de la cabecera. También se detectan otros textos de navegación y API. | Ajustar los tokens de texto y revisar cada combinación de color, fondo y estado. |
| Alta | 1.4.10 Reajuste (AA) | En la home a 320 × 256, las pestañas quedan entre y=277 y y=302; la página mide 256 px y no ofrece scroll. La galería queda recortada. | Permitir crecimiento y desplazamiento vertical en ventanas pequeñas y con ampliación, manteniendo el diseño sin scroll únicamente cuando quepa. |
| Alta | 2.1.1 Teclado (A) | axe identifica el bloque de código desplazable de importación en `/docs/componentes/dialog` sin contenido enfocable ni foco propio. | Dar acceso por teclado a las regiones que requieren desplazamiento y verificar el foco visible. |
| Media | 4.1.2 Nombre, función, valor (A) | `Person` en la home usa un `span` genérico con `aria-label="En línea"`, atributo no permitido en ese rol implícito. Aparece en Analytics, Studio y Commerce. | Exponer texto accesible y ocultar el punto decorativo, o utilizar una semántica adecuada para el indicador. |

Ubicaciones principales: `app/kivora-theme.css`, `app/(public)/page.module.css`, `app/(public)/page.tsx` y `app/docs/_components/code-block.tsx` / componente Code de Kivora.

## Comprobaciones favorables y límites

- El diálogo de invitación mantiene el foco dentro durante 12 pulsaciones de Tab, se cierra con Escape y devuelve el foco a Invitar.
- Un aviso de contraste del botón del diálogo desapareció al repetir el análisis después de terminar la transición; no se incluye como incumplimiento confirmado.
- La portada de documentación en oscuro no produjo infracciones automáticas en el estado examinado. Esto no demuestra conformidad del tema completo.
- La home devuelve numerosas comprobaciones de contraste pendientes de evaluación manual; un escaneo sin infracciones de contraste no equivale a contraste correcto.
- Existen controles de teclado para pestañas, nombres accesibles en controles, un enlace de salto al contenido en documentación y estilos de foco y movimiento reducido. Su presencia no demuestra que todos los flujos cumplan.
- La auditoría inicial fue de solo lectura. La corrección posterior incorpora `@axe-core/playwright` como dependencia de desarrollo para repetir las comprobaciones.

Quedan por evaluar los 64 grupos de componentes con todos sus estados, lector de pantalla (por ejemplo VoiceOver y NVDA), orden de lectura, foco visible y no oculto, zoom real al 200/400 %, espaciado de texto, contraste no textual, tamaños y separación de objetivos, errores de formularios y alternativas de los reproductores y gráficos. Las pruebas funcionales anteriores no sustituyen esa evaluación.

## Referencias

- [Conformidad WCAG 2.2: cumplir todos los criterios A y AA aplicables](https://www.w3.org/WAI/WCAG22/Understanding/conformance.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Correcciones y validación posterior

- Se oscurecieron los textos secundarios de los temas claro, rosa y verde y los acentos claro/verde para mantener contraste sobre sus fondos. Se ajustaron los colores de sintaxis y se retiraron opacidades de textos auxiliares que reducían su legibilidad.
- Los indicadores «En línea» tienen ahora rol de imagen y nombre accesible.
- Los contenedores de código reciben foco, nombre de región y un contorno visible interior. Las tablas de API también admiten foco para desplazarse con teclado. El ajuste del contenedor de Code se aplica en el adaptador local; no modifica node_modules.
- En ventanas de hasta 600 px de altura o 360 px de anchura, la home pasa a flujo vertical y muestra todas las tarjetas del ejemplo activo. No se oculta contenido por el carrusel ni por la segunda columna. El diseño habitual conserva su altura de pantalla.
- La home a 320 × 256 pasa de una página recortada de 256 px a una página desplazable de 1806 px, con anchura de 320 px. Se comprobó que se puede llegar a las cuatro pestañas y que solo el panel activo queda expuesto.

Pruebas reproducibles en `tests/e2e/accessibility.spec.ts`: cinco páginas de documentación (portada, instalación, Button, Input y Dialog) × cuatro temas, cuatro escenas de home y diálogo de invitación, foco/retorno de foco, reajuste y desplazamiento de código mediante ArrowRight. No hay infracciones automáticas A/AA en esos estados. Se esperan las transiciones antes del análisis para evitar resultados transitorios.

Las comprobaciones incompletas de axe y el alcance manual pendiente descrito arriba siguen requiriendo evaluación humana. Estas correcciones no equivalen a una certificación de los 64 grupos de componentes ni de todos sus estados.
