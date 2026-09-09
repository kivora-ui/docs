# Errores del modal de subida

La distribución npm @kivora/nextjs 0.2.0 mostraba `String(file.error)` en la tarjeta del archivo. Tus incorpora la respuesta del servidor en ese error; una respuesta HTML 404 producía un mensaje enorme. Uppy añadía además detalles técnicos al informer y escribía errores de transporte gestionados en console.error.

`scripts/patch-kivora-upload.mjs` aplica una corrección local, idempotente y específica para esa versión después de instalar y antes de arrancar desarrollo o compilar. La dependencia sigue viniendo de npm; no se enlaza al repositorio de la biblioteca. Se comprueba que todos los fragmentos esperados coincidan antes de escribir. Al actualizar Kivora hay que revisar el parche y retirarlo cuando la distribución incluya la solución.

La tarjeta y el aviso general de subida presentan un texto breve en español o inglés, con role=alert. El informer conserva su mensaje traducido pero omite los detalles de transporte. Los fallos gestionados del motor usan un aviso de depuración sin respuesta técnica en lugar de alimentar el overlay de desarrollo. No se alteran los estados de éxito/error ni se simulan subidas: reintentar y eliminar siguen usando Uppy.

Verificación: build, lint y las cinco pruebas de `tests/e2e/file-upload.spec.ts`. Incluyen selección/edición local, las cuatro fuentes del modal, errores 400/413/500 y red interrumpida, ausencia de HTML/detalles de Tus, anchura móvil, cierre/reapertura, retorno del foco y recuperación mediante reintento con un servidor Tus simulado.

Si ya había un proceso de desarrollo arrancado antes de aplicar el parche, reiniciar `npm run dev` para recargar el módulo de la dependencia.
