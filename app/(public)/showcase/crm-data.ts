export type CustomerStatus = "Cliente" | "Potencial" | "Inactivo";
export type Customer = {
  id: string; name: string; domain: string; description: string; industry: string;
  status: CustomerStatus; users: number; seats: number; color: string;
};
export const customerStatuses: CustomerStatus[] = ["Cliente", "Potencial", "Inactivo"];
export const initialCustomers: Customer[] = [
  { id: "1", name: "Catalog", domain: "catalog.example", description: "Todo tu contenido, en un solo lugar.", industry: "Contenido y colaboración", status: "Cliente", users: 12, seats: 20, color: "#7062e4" },
  { id: "2", name: "Circooles", domain: "circooles.example", description: "Diseño colaborativo para equipos.", industry: "Software de diseño", status: "Inactivo", users: 8, seats: 20, color: "#4289d3" },
  { id: "3", name: "Command", domain: "command.example", description: "Decisiones a partir de datos.", industry: "Inteligencia de negocio", status: "Cliente", users: 6, seats: 15, color: "#de9961" },
  { id: "4", name: "Hourglass", domain: "hourglass.example", description: "Más tiempo para lo que importa.", industry: "Productividad", status: "Cliente", users: 18, seats: 25, color: "#539daa" },
  { id: "5", name: "Layers", domain: "layers.example", description: "Conecta tus herramientas de trabajo.", industry: "Integraciones", status: "Potencial", users: 4, seats: 10, color: "#9e74d0" },
  { id: "6", name: "Quotient", domain: "quotient.example", description: "Relaciones comerciales más sencillas.", industry: "Ventas y CRM", status: "Cliente", users: 9, seats: 30, color: "#7c4fd8" },
  { id: "7", name: "Sisyphus", domain: "sisyphus.example", description: "Automatiza las tareas del día a día.", industry: "Automatización", status: "Cliente", users: 22, seats: 30, color: "#58aa89" },
  { id: "8", name: "Northstar", domain: "northstar.example", description: "Un nuevo rumbo para tu marca.", industry: "Marketing", status: "Potencial", users: 5, seats: 10, color: "#cc748e" },
  { id: "9", name: "Linearize", domain: "linearize.example", description: "Proyectos que avanzan contigo.", industry: "Gestión de proyectos", status: "Cliente", users: 14, seats: 20, color: "#6883c6" },
  { id: "10", name: "Goodwell", domain: "goodwell.example", description: "Cuidar de tu equipo es lo primero.", industry: "Recursos humanos", status: "Cliente", users: 11, seats: 15, color: "#95a35e" },
  { id: "11", name: "Capsule", domain: "capsule.example", description: "Ideas que se convierten en productos.", industry: "Estudio creativo", status: "Inactivo", users: 3, seats: 10, color: "#ab8371" },
  { id: "12", name: "Lumen", domain: "lumen.example", description: "La información que necesitas, a tiempo.", industry: "Analítica", status: "Cliente", users: 16, seats: 25, color: "#599baf" },
];
