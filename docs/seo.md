# SEO y lectura por agentes

Dominio canónico: **https://kivora.pro**. Puede cambiarse con `SITE_URL` antes de ejecutar `npm run build`. El valor debe ser el origen de producción, sin rutas. No usar la URL temporal de una preview.

## Revisión y cambios

La web tenía títulos y descripciones básicos, pero carecía de sitemap, robots.txt, canónicas, datos estructurados y recursos de texto para agentes. Las guías y tablas de API ya se renderizaban en servidor. El playground necesita JavaScript; ahora cada componente ofrece también su ejemplo en un desplegable renderizado en servidor y documentación Markdown.

- `app/_lib/seo.ts`: dominio, metadatos de página y tarjeta social.
- `app/robots.ts`: acceso público permitido para todos los rastreadores, incluidos los de IA. No bloquea CSS ni JavaScript. Esta política permite también rastreadores de entrenamiento; no separa usos.
- `app/sitemap.ts`: solo las páginas HTML canónicas existentes, generadas desde el catálogo. No inventa fechas de modificación.
- `app/opengraph-image.tsx`: imagen para compartir enlaces.
- Datos JSON-LD: WebSite en la home, TechArticle/CollectionPage y BreadcrumbList en documentación. No se inventan valoraciones, autores ni fechas.
- `/llms.txt`: índice de guías y componentes para agentes.
- `/llms-full.txt`: documentación completa con ejemplos y atributos.
- `/docs-markdown/<ruta>.md`: archivos Markdown individuales. Por ejemplo `/docs-markdown/componentes/button.md`. Las páginas HTML anuncian su versión mediante `rel="alternate"`; los documentos de texto enlazan su canónica HTML mediante la cabecera Link.

Los archivos de IA se generan durante el build a partir de `catalog.ts`, `content.ts` y `api.generated.json`. Al actualizar la librería, ejecutar `npm run docs:api`, `npm run docs:check` y volver a compilar. No incluyen información introducida por visitantes ni datos de sessionStorage.

## Qué consulta cada robot

Los buscadores descubren enlaces y sitemaps, consultan robots.txt y descargan las páginas. Los agentes que soportan llms.txt pueden seguir sus enlaces de texto sin ejecutar el playground. No hay una conexión permanente con una IA ni es necesario proporcionar claves de API.

OpenAI distingue OAI-SearchBot (búsqueda), GPTBot (contenido que puede usarse para entrenamiento) y ChatGPT-User (visitas solicitadas por usuarios). Permitir un robot no garantiza indexación o citas. Robots.txt expresa preferencias de rastreo, no es control de acceso.

llms.txt es una propuesta de descubrimiento y lectura, no un requisito de Google ni una garantía de posicionamiento en IA. Para las funciones de IA de Google siguen aplicando las prácticas habituales de SEO.

## Publicación y observación

En la revisión local del 9 de septiembre de 2026, `curl https://kivora.pro` no pudo resolver el dominio desde este entorno. Por tanto, la validación de producción y del CDN queda pendiente de que el dominio sea accesible y se despliegue esta versión.

Al publicar, configurar DNS y HTTPS, redirigir permanentemente los dominios alternativos a kivora.pro, y comprobar que el CDN/WAF no presenta un desafío o bloqueo a los rastreadores. Mantener previews privadas o con noindex en la infraestructura de despliegue. Estos ajustes no se han aplicado desde este repositorio.

Después de verificar la propiedad del dominio en Google Search Console y Bing Webmaster Tools, enviar `https://kivora.pro/sitemap.xml`. El sitemap también se anuncia automáticamente en robots.txt. No se han conectado esas cuentas ni enviado datos a servicios externos.

Para saber quién visita realmente la web, consultar registros HTTP del hosting/CDN: ruta, fecha, estado y user-agent; buscar accesos a robots.txt, sitemap.xml, llms.txt y docs-markdown. Un user-agent puede falsificarse: contrastar IP/rangos publicados por cada proveedor antes de tratarlo como robot verificado. Analytics basado solo en JavaScript no refleja todas esas visitas.

## Fuentes

- [SEO de JavaScript, Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Funciones de IA y tu web, Google](https://developers.google.com/search/docs/appearance/ai-features)
- [Rastreadores de OpenAI](https://developers.openai.com/api/docs/bots)
- [Propuesta llms.txt](https://llmstxt.org/)

## Verificación

`tests/e2e/seo.spec.ts` comprueba las rutas del sitemap, las reglas públicas, canónicas y datos estructurados sin JavaScript, lectura del ejemplo, imagen social, todos los enlaces Markdown del índice y respuestas 404. Ejecutar `npm run test:e2e` para compilar y verificar junto con las pruebas de documentación y equipo.
