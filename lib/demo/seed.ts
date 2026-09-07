import { PLANS, PRICE_CENTS_BY_PLAN } from "./constants";
import type { Subscriber, SubscriberStatus, Title } from "./types";

// Fuentes de vídeo público reales, reutilizadas de
// module/example/web/src/components/player-demo-sources.ts (catálogo de
// demos de Shaka Player / vectores de prueba de Axinom). Ver el riesgo de
// atribución en el spec.
const shakaIcons = "https://storage.googleapis.com/shaka-asset-icons/";
const axinomTestMessage =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA";

export const titleSeed: Title[] = [
  {
    id: "sintel",
    name: "Sintel",
    genre: "Animación",
    type: "Película",
    releaseYear: 2010,
    durationMinutes: 15,
    viewsLast30Days: 128400,
    posterUrl: `${shakaIcons}sintel.png`,
    playerSource: {
      id: "sintel",
      title: "Sintel",
      src: "https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}sintel.png`,
    },
  },
  {
    id: "angel-one-hls",
    name: "Angel One",
    genre: "Drama",
    type: "Película",
    releaseYear: 2014,
    durationMinutes: 15,
    viewsLast30Days: 98200,
    posterUrl: `${shakaIcons}angel_one.png`,
    playerSource: {
      id: "angel-one-hls",
      title: "Angel One",
      src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
      mimeType: "application/x-mpegurl",
      poster: `${shakaIcons}angel_one.png`,
    },
  },
  {
    id: "flower",
    name: "Flower",
    genre: "Documental",
    type: "Película",
    releaseYear: 2018,
    durationMinutes: 1,
    viewsLast30Days: 42100,
    playerSource: {
      id: "flower",
      title: "Flower",
      src: "https://developer.mozilla.org/shared-assets/videos/flower.mp4",
      mimeType: "video/mp4",
    },
  },
  {
    id: "angel-one-widevine",
    name: "Angel One · DRM",
    genre: "Drama",
    type: "Película",
    releaseYear: 2014,
    durationMinutes: 15,
    viewsLast30Days: 15300,
    posterUrl: `${shakaIcons}angel_one.png`,
    playerSource: {
      id: "angel-one-widevine",
      title: "Angel One · DRM",
      src: "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}angel_one.png`,
      drm: { servers: { "com.widevine.alpha": "https://proxy.uat.widevine.com/proxy" } },
    },
  },
  {
    id: "tears-of-steel",
    name: "Tears of Steel",
    genre: "Ciencia ficción",
    type: "Película",
    releaseYear: 2012,
    durationMinutes: 12,
    viewsLast30Days: 76500,
    posterUrl: `${shakaIcons}tears_of_steel.png`,
    playerSource: {
      id: "tears-of-steel",
      title: "Tears of Steel",
      src: "https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest.mpd",
      mimeType: "application/dash+xml",
      poster: `${shakaIcons}tears_of_steel.png`,
      drm: {
        servers: {
          "com.widevine.alpha": "https://drm-widevine-licensing.axtest.net/AcquireLicense",
          "com.microsoft.playready": "https://drm-playready-licensing.axtest.net/AcquireLicense",
        },
        advanced: {
          "com.widevine.alpha": { headers: { "X-AxDRM-Message": axinomTestMessage } },
          "com.microsoft.playready": { headers: { "X-AxDRM-Message": axinomTestMessage } },
        },
      },
    },
  },
  {
    id: "estacion-roja",
    name: "Estación Roja",
    genre: "Ciencia ficción",
    type: "Serie",
    releaseYear: 2023,
    durationMinutes: 45,
    viewsLast30Days: 51200,
  },
  {
    id: "cocina-nomada",
    name: "Cocina Nómada",
    genre: "Documental",
    type: "Serie",
    releaseYear: 2022,
    durationMinutes: 30,
    viewsLast30Days: 33400,
  },
  {
    id: "umbral",
    name: "Umbral",
    genre: "Drama",
    type: "Película",
    releaseYear: 2021,
    durationMinutes: 108,
    viewsLast30Days: 21000,
  },
  {
    id: "rutas-del-sur",
    name: "Rutas del Sur",
    genre: "Documental",
    type: "Serie",
    releaseYear: 2020,
    durationMinutes: 40,
    viewsLast30Days: 18700,
  },
  {
    id: "codigo-abierto",
    name: "Código Abierto",
    genre: "Ciencia ficción",
    type: "Serie",
    releaseYear: 2024,
    durationMinutes: 38,
    viewsLast30Days: 60300,
  },
  {
    id: "el-ultimo-faro",
    name: "El Último Faro",
    genre: "Drama",
    type: "Película",
    releaseYear: 2019,
    durationMinutes: 96,
    viewsLast30Days: 12400,
  },
  {
    id: "trazos",
    name: "Trazos",
    genre: "Animación",
    type: "Serie",
    releaseYear: 2023,
    durationMinutes: 22,
    viewsLast30Days: 27800,
  },
];

const FIRST_NAMES = [
  "Marta", "Diego", "Elena", "Pablo", "Lucía", "Marcos", "Sara", "Iván", "Noa", "Hugo",
  "Vera", "Bruno", "Clara", "Adrián", "Nerea", "Rubén", "Alba", "Tomás", "Julia", "Óscar",
];
const LAST_NAMES = ["Ruiz", "Molina", "Cano", "Reyes", "Ortega", "Vidal", "Campos", "Serra", "Bravo", "Nieto"];
// Reparto ponderado a propósito ("active" repetido) para que la semilla salga
// con mayoría de suscriptores activos. Es una preocupación distinta de la
// lista de valores para la UI (`SUBSCRIBER_STATUSES` en `constants.ts`), así
// que se queda privado aquí.
const STATUSES: SubscriberStatus[] = ["active", "active", "active", "paused", "cancelled"];

export const subscriberSeed: Subscriber[] = FIRST_NAMES.map((firstName, index) => {
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const plan = PLANS[index % PLANS.length];
  const status = STATUSES[index % STATUSES.length];
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 27) + 1).padStart(2, "0");

  return {
    id: `sub-${index + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    plan,
    status,
    joinedAt: `2025-${month}-${day}`,
    monthlyPriceCents: PRICE_CENTS_BY_PLAN[plan],
  };
});

export const monthlySignupsSeed = [
  { month: "Abr", signups: 120 },
  { month: "May", signups: 145 },
  { month: "Jun", signups: 160 },
  { month: "Jul", signups: 158 },
  { month: "Ago", signups: 180 },
  { month: "Sep", signups: 210 },
];
