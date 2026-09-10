export const showcaseCases = [
  { slug: "chat", name: "Chat", category: "Tu equipo de agentes", description: "Relay: un espacio para trabajar con agentes de desarrollo, marketing, diseño y datos.", theme: "light", number: "01", image: "/showcase/screenshots/chat.png", components: ["Avatar", "Input", "Button", "Badge"] },
  { slug: "incidencias", name: "Gestor de incidencias", category: "Del problema a la solución", description: "Un tablero para registrar incidencias, priorizar el trabajo y seguir cada resolución.", theme: "dark", number: "02", image: "/showcase/screenshots/incidencias.png", components: ["Card", "Input", "Badge", "Button"] },
  { slug: "nave", name: "Nave espacial", category: "Tu puesto de control de misión", description: "Odyssey: supervisa la cabina, los sistemas y la navegación de una nave espacial en una consola de vuelo interactiva.", theme: "dark", number: "03", image: "/showcase/screenshots/nave.png", components: ["Badge", "Button", "Switch"] },
  { slug: "crm", name: "CRM", category: "Relaciones que hacen crecer tu negocio", description: "Orbit CRM: gestiona clientes, organiza tu cartera y consulta la actividad de tu equipo en un solo lugar.", theme: "light", number: "04", image: "/showcase/screenshots/crm.png", components: ["Card", "Badge", "Button", "Input"] },
] as const;
export type ShowcaseCase = (typeof showcaseCases)[number];
