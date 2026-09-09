"use client";

// Fallback de 404 para toda la aplicación. Vive en el layout raíz (que ya no
// renderiza Header/Footer desde que la web de marketing se movió al grupo
// (marketing)), así que monta el cromado de marketing él mismo. Una URL
// suelta bajo /demo/* también verá este 404 con cromado de marketing en vez
// del shell oscuro del demo: es un compromiso aceptado a propósito.
export default function NotFound() {
  return (
    <>
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <section className="flex max-w-lg flex-col items-center gap-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground">404</p>
        </section>
      </main>
    </>
  );
}
