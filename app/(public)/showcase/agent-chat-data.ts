export type Content = {
  text: string;
  kind?: "code" | "steps" | "metrics" | "table";
  title?: string;
  code?: string;
  items?: string[];
  metrics?: { label: string; value: string; change: string }[];
  rows?: string[][];
};
export type Message = Content & { id: string; role: "user" | "agent"; time: string };
export const agents = [
  { id: "dev", name: "Agente de desarrollo", specialty: "Código, arquitectura y producto", short: "Desarrollo", icon: "code", color: "#627dbd", task: "Una API lista para crecer", prompts: ["Propón una arquitectura", "Revisa el manejo de errores"] },
  { id: "marketing", name: "Agente de marketing", specialty: "Estrategia, campañas y contenido", short: "Marketing", icon: "marketing", color: "#b87546", task: "Lanzamiento de la nueva colección", prompts: ["Prepara un plan de campaña", "Dame tres ideas de contenido"] },
  { id: "design", name: "Agente de diseño", specialty: "Interfaces, sistemas y experiencia", short: "Diseño", icon: "design", color: "#9d789c", task: "Un onboarding más sencillo", prompts: ["Revisa la experiencia de usuario", "Propón un sistema visual"] },
  { id: "data", name: "Agente de datos", specialty: "Análisis, métricas y decisiones", short: "Datos", icon: "data", color: "#558777", task: "Entender la conversión del producto", prompts: ["Resume las métricas", "Busca oportunidades de mejora"] },
] as const;
export type AgentId = typeof agents[number]["id"];
export const replies: Record<AgentId, Content[]> = {
  dev: [
    { text: "Separaría la validación, la lógica de negocio y el acceso a datos. Así puedes probar cada parte sin levantar toda la aplicación.", kind: "code", title: "TypeScript · Ejemplo de servicio", code: 'type Project = { id: string; name: string };\n\nexport async function getProject(id: string) {\n  const response = await fetch(`/api/projects/${id}`);\n\n  if (!response.ok) {\n    throw new Error("Unable to load project");\n  }\n\n  return response.json() as Promise<Project>;\n}' },
    { text: "Lo abordaría en tres pasos pequeños, con una comprobación al terminar cada uno.", kind: "steps", title: "Plan de implementación", items: ["Definir el contrato de la API y los estados de error.", "Separar el servicio de datos de los componentes de interfaz.", "Probar el flujo principal y los casos de respuesta vacía."] },
    { text: "La propuesta tiene sentido. Antes de añadir más complejidad, definiría qué sucede si la petición falla, tarda demasiado o devuelve datos incompletos. ¿Prefieres que profundicemos en los errores o en la estructura del proyecto?" },
  ],
  marketing: [
    { text: "Centraría el lanzamiento en una idea clara: menos ruido, más valor. Esta sería una primera secuencia para validar el mensaje.", kind: "table", title: "Calendario de campaña", rows: [["Fase", "Canal", "Objetivo"], ["Expectativa", "Social", "Despertar interés"], ["Lanzamiento", "Email", "Mostrar el valor"], ["Seguimiento", "Contenido", "Resolver dudas"]] },
    { text: "Estas tres líneas de contenido pueden funcionar como punto de partida. Después compararía resultados antes de aumentar la inversión.", kind: "steps", title: "Ideas para la próxima semana", items: ["Una historia breve sobre el problema que resuelve el producto.", "Una demostración de 30 segundos centrada en un solo beneficio.", "Una comparación del antes y el después, con un ejemplo concreto."] },
    { text: "Aquí tienes un resumen con datos de ejemplo. La apertura es buena; probaría una llamada a la acción más específica para mejorar los clics.", kind: "metrics", title: "Campaña · Datos simulados", metrics: [{ label: "Apertura", value: "42,8%", change: "+6,2 pp" }, { label: "Clics", value: "8,4%", change: "+1,8 pp" }, { label: "Registros", value: "286", change: "+24%" }] },
  ],
  design: [
    { text: "Reduciría el esfuerzo de la primera sesión. El objetivo es que la persona llegue a su primer resultado antes de pedirle toda la configuración.", kind: "steps", title: "Propuesta de experiencia", items: ["Pedir solo la información imprescindible para empezar.", "Mostrar un ejemplo editable en lugar de una pantalla vacía.", "Explicar el siguiente paso con una acción principal visible."] },
    { text: "Un sistema pequeño y consistente será más útil que muchas variantes. Esta es una base para explorar.", kind: "table", title: "Decisiones de interfaz", rows: [["Elemento", "Propuesta"], ["Tipografía", "Escala de 4 tamaños"], ["Espaciado", "Base de 8 puntos"], ["Color", "Neutros + un acento"], ["Interacción", "Estados claros y visibles"]] },
    { text: "Mantendría una jerarquía muy clara: contexto, contenido y acción. Si dos botones compiten por la atención, elegiría uno como principal. Podemos revisar una pantalla concreta para afinarlo." },
  ],
  data: [
    { text: "En este conjunto de datos de ejemplo, la activación crece más que la adquisición. Conviene investigar qué cambió en la primera experiencia.", kind: "metrics", title: "Producto · Datos simulados", metrics: [{ label: "Usuarios", value: "12.480", change: "+12,6%" }, { label: "Activación", value: "68,2%", change: "+8,4 pp" }, { label: "Conversión", value: "4,7%", change: "+0,9 pp" }] },
    { text: "Antes de atribuir el cambio a una campaña, comprobaría la calidad de los datos y compararía segmentos equivalentes.", kind: "steps", title: "Siguiente análisis", items: ["Verificar que los eventos se registran una sola vez.", "Separar usuarios nuevos y recurrentes por canal.", "Comparar periodos de la misma duración y documentar la muestra."] },
    { text: "El promedio puede ocultar diferencias importantes. Miraría el embudo por dispositivo, canal y antigüedad del usuario. ¿Qué segmento te interesa explorar primero?" },
  ],
};
function user(id: string, text: string, time: string): Message { return { id, text, role: "user", time }; }
function agent(id: string, content: Content, time: string): Message { return { ...content, id, role: "agent", time }; }
export const initialMessages: Record<AgentId, Message[]> = {
  dev: [
    user("d1", "Estoy preparando la API de un gestor de proyectos. Quiero empezar con algo sencillo que pueda crecer.", "09:32"),
    agent("d2", { text: "Perfecto. Podemos empezar con proyectos, miembros y tareas. Mantendría una sola API y separaría sus responsabilidades. ¿Ya tienes elegido el stack?" }, "09:32"),
    user("d3", "Sí, TypeScript y Next.js. Me preocupa acabar mezclando la lógica con la interfaz.", "09:34"),
    agent("d4", replies.dev[0], "09:34"),
    user("d5", "Me encaja. ¿Cómo organizarías los siguientes pasos?", "09:36"),
    agent("d6", replies.dev[1], "09:36"),
  ],
  marketing: [
    user("m1", "En dos semanas lanzamos una colección. Necesitamos una campaña sencilla para email y redes.", "10:05"),
    agent("m2", { text: "Empezaría por concretar el público y el beneficio principal. Después podemos convertir esa idea en una secuencia breve, sin repetir el mismo mensaje en todos los canales." }, "10:05"),
    user("m3", "Nos dirigimos a profesionales creativos. El producto les ayuda a organizar su día.", "10:07"),
    agent("m4", replies.marketing[0], "10:07"),
    user("m5", "¿Y qué piezas publicarías la primera semana?", "10:09"),
    agent("m6", replies.marketing[1], "10:09"),
    user("m7", "Enséñame también cómo podríamos resumir los resultados.", "10:11"),
    agent("m8", replies.marketing[2], "10:11"),
  ],
  design: [user("s1", "Mucha gente abandona el onboarding antes de crear su primer proyecto.", "11:12"), agent("s2", replies.design[0], "11:12"), user("s3", "Quiero que la interfaz sea más coherente también.", "11:14"), agent("s4", replies.design[1], "11:14")],
  data: [user("a1", "Ayúdame a entender el embudo de conversión del producto.", "12:20"), agent("a2", replies.data[0], "12:20"), user("a3", "¿Qué comprobarías antes de sacar conclusiones?", "12:22"), agent("a4", replies.data[1], "12:22")],
};
