export const flightSystems = [
  { id: "fire", name: "Detección de incendios", detail: "Sin incidencias", state: "nominal" },
  { id: "pressure", name: "Presurización de cabina", detail: "Estable", state: "nominal" },
  { id: "oxygen", name: "Control de oxígeno", detail: "Automático", state: "nominal" },
  { id: "thermal", name: "Protección térmica", detail: "Activada", state: "active" },
  { id: "guidance", name: "Guiado y navegación", detail: "Seguimiento orbital", state: "nominal" },
  { id: "power", name: "Distribución de energía", detail: "Carga en curso", state: "active" },
  { id: "docking", name: "Secuencia de acoplamiento", detail: "En espera", state: "standby" },
] as const;
export const subsystems = [
  { id: "overview", name: "General", title: "Estado de la nave", description: "Todos los sistemas operativos", leftTitle: "Conexiones", rightTitle: "Enlaces de datos", left: [["Control de vuelo", "Conectado"], ["Sensores de cabina", "Conectado"], ["Anillo de acoplamiento", "Preparado"]], right: [["Estación terrestre", "Conectado"], ["Telemetría", "Conectado"], ["Canal de respaldo", "Disponible"]] },
  { id: "life", name: "Soporte vital", title: "Entorno de cabina", description: "Control ambiental de la tripulación", leftTitle: "Atmósfera", rightTitle: "Consumibles", left: [["Humedad relativa", "42%"], ["Filtrado de aire", "Activo"], ["Ventilación", "Automático"]], right: [["Reserva de oxígeno", "96%"], ["Agua disponible", "82%"], ["Filtro de CO₂", "Nominal"]] },
  { id: "comms", name: "Comunicaciones", title: "Red de comunicaciones", description: "Enlace con control de misión", leftTitle: "Canales", rightTitle: "Calidad del enlace", left: [["Voz de tripulación", "Conectado"], ["Vídeo de cabina", "Disponible"], ["Telemetría", "Conectado"]], right: [["Latencia", "240 ms"], ["Señal", "98%"], ["Paquetes recibidos", "99.9%"]] },
  { id: "prop", name: "Propulsión", title: "Sistema de propulsión", description: "Control de actitud y maniobra", leftTitle: "Propulsores", rightTitle: "Reservas", left: [["Grupo A", "Preparado"], ["Grupo B", "Preparado"], ["Maniobra orbital", "En espera"]], right: [["Propelente", "86%"], ["Presión del depósito", "22.4 bar"], ["Válvulas", "Cerradas"]] },
  { id: "power", name: "Energía", title: "Distribución de energía", description: "Generación, almacenamiento y consumo", leftTitle: "Baterías", rightTitle: "Distribución", left: [["Batería principal", "94%"], ["Batería secundaria", "92%"], ["Modo de carga", "Automático"]], right: [["Bus principal", "28.4 V"], ["Bus secundario", "28.2 V"], ["Potencia disponible", "4.8 kW"]] },
  { id: "thermal", name: "Térmico", title: "Regulación térmica", description: "Circuitos de refrigeración de la nave", leftTitle: "Circuitos", rightTitle: "Intercambio térmico", left: [["Bomba A", "Activa"], ["Bomba B", "Activa"], ["Radiadores", "Nominal"]], right: [["Caudal", "3.2 L/min"], ["Temperatura exterior", "−42 °C"], ["Protección térmica", "Activada"]] },
] as const;
export type SubsystemId = typeof subsystems[number]["id"];
