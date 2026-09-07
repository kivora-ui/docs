import type { Plan, SubscriberStatus, TitleGenre, TitleType } from "./types";

// Única fuente de verdad de los valores de cada enumerado del demo. Tanto los
// filtros de las DataTable como los <option> de los formularios se derivan de
// estos arrays, para que añadir un valor al tipo de `types.ts` no obligue a
// recordar los dos o tres sitios donde antes estaba copiado a mano.

export const PLANS: Plan[] = ["Básico", "Estándar", "Premium"];

export const GENRES: TitleGenre[] = [
  "Acción",
  "Drama",
  "Documental",
  "Ciencia ficción",
  "Animación",
];

export const TYPES: TitleType[] = ["Película", "Serie"];

// Los tres valores distintos del estado de un suscriptor, para poblar filtros
// y selectores. No confundir con el array ponderado (con "active" repetido)
// que `seed.ts` usa para reparto de la semilla: eso es otra cosa y sigue
// siendo privado de ese módulo.
export const SUBSCRIBER_STATUSES: SubscriberStatus[] = ["active", "paused", "cancelled"];

export const STATUS_LABEL: Record<SubscriberStatus, string> = {
  active: "Activo",
  paused: "Pausado",
  cancelled: "Cancelado",
};

export const PRICE_CENTS_BY_PLAN: Record<Plan, number> = {
  "Básico": 599,
  "Estándar": 999,
  "Premium": 1499,
};

// Los pósteres se guardan como data URL dentro del store de localStorage, cuya
// cuota ronda los 5 MB. Un límite de 500 KB por imagen deja margen de sobra
// para el resto del store y evita que un setItem falle en silencio y el
// usuario pierda sus datos al recargar.
export const MAX_POSTER_BYTES = 500 * 1024;
