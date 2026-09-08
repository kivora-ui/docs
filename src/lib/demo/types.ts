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
