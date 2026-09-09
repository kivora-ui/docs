export type GuideSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  code?: string;
  label?: string;
  bullets?: string[];
  links?: { label: string; href: string }[];
};
export const guideContent: Record<string, GuideSection[]> = {
  introduccion: [
    {
      id: "que-es-kivora",
      title: "Las piezas para tu próxima idea",
      paragraphs: [
        "Kivora es una biblioteca TypeScript de componentes para Next.js y React. Reúne formularios, navegación, tablas, paneles y contenido multimedia bajo un mismo lenguaje visual. Puedes empezar con un botón y componer una aplicación completa con las mismas convenciones.",
        "El paquete web es @kivora/nextjs. Los ejemplos y las propiedades de esta documentación corresponden a la versión 0.2.0 instalada desde npm.",
      ],
    },
    {
      id: "que-puedes-crear",
      title: "De una idea a una interfaz",
      bullets: [
        "Productos SaaS: cuentas, equipos, permisos visuales y formularios con validación.",
        "Herramientas internas: tablas de datos, filtros, selección y paneles de detalle.",
        "Sitios y experiencias: navegación, tarjetas, carruseles y temas de marca.",
        "Experiencias multimedia: reproducción de vídeo y audio, selección de archivos y códigos QR.",
      ],
      paragraphs: [
        "Los componentes resuelven la interfaz. La autenticación, la persistencia, los pagos y los servicios de subida pertenecen a tu aplicación.",
      ],
    },
    {
      id: "como-leer",
      title: "Una documentación para experimentar",
      paragraphs: [
        "Abre cualquier componente para probarlo. Cambia una propiedad desde los controles o edita el JSX directamente: la vista previa se actualiza mientras escribes y muestra los errores de sintaxis. Restablecer recupera el ejemplo original.",
        "El botón Copiar prepara un componente con sus imports. La referencia de API incluye las propiedades y los subcomponentes publicados; los tipos se generan a partir de las declaraciones TypeScript de npm.",
      ],
    },
    {
      id: "primer-componente",
      title: "Tu primer componente",
      code: '"use client";\n\nimport { Button } from "@kivora/nextjs";\n\nexport default function Example() {\n  return <Button>Crear mi primera idea</Button>;\n}',
      label: "app/page.tsx",
    },
  ],
  instalacion: [
    {
      id: "elige-plataforma",
      title: "Elige cómo empezar",
      paragraphs: ["Esta página explica la instalación web con Next.js. Puedes configurarla con el asistente o seguir los pasos manuales. React sin Next.js y React Native tienen sus propias guías."],
      code: "npx @kivora/init --framework nextjs",
      links: [
        { label: "Asistente @kivora/init", href: "/docs/inicializador" },
        { label: "Instalar en React web sin Next.js", href: "/docs/instalacion-react" },
        { label: "Instalar en React Native", href: "/docs/instalacion-react-native" },
      ],
    },
    {
      id: "requisitos",
      title: "Antes de empezar",
      paragraphs: [
        "Para la instalación manual necesitas un proyecto Next.js con React y React DOM 18 o posteriores. Kivora incluye CSS compilado: esta vía no requiere Tailwind ni PostCSS. El asistente @kivora/init 0.1.1 sí configura Tailwind 4.1–4.x y requiere Node.js 20.19+ y Next.js 13+.",
        "Los pasos siguientes asumen que app/ está en la raíz. Conserva tus plugins, estilos y providers existentes al integrar la configuración.",
      ],
    },
    {
      id: "instalar",
      title: "1. Instalación manual desde npm",
      code: "npm install @kivora/nextjs",
      paragraphs: [
        "También puedes usar npx @kivora/init para la instalación asistida. Añade --dry-run si quieres revisar los cambios que propone el instalador antes de aplicarlos. @kivora/theme se instala como dependencia transitiva; decláralo también como dependencia directa si lo importas en tu código.",
      ],
    },
    {
      id: "estilos",
      title: "2. Añade los estilos",
      code: '@import "@kivora/nextjs/styles.css";',
      label: "app/globals.css",
      paragraphs: [
        "La hoja incluye las clases de los componentes, los tokens, los estilos base y los recursos integrados. Impórtala una sola vez. No necesita @source ni configuración de PostCSS. Para estilos propios puedes usar CSS o style; las clases Tailwind nuevas necesitan tu propio compilador.",
      ],
    },
    {
      id: "tailwind-opcional",
      title: "Opcional: si tu aplicación ya usa Tailwind",
      code: '@import "@kivora/nextjs/tailwind.css";',
      label: "app/globals.css",
      paragraphs: ["Utiliza esta entrada en lugar de styles.css si ya tienes Tailwind 4.1+ y su compilador configurados. Permite generar tus propias utilidades y detecta las clases de Kivora automáticamente. No importes ambas entradas."],
    },
    {
      id: "next",
      title: "3. Configura Next.js",
      code: 'import type { NextConfig } from "next";\n\nconst config: NextConfig = {\n  transpilePackages: ["@kivora/nextjs", "@kivora/theme"],\n};\n\nexport default config;',
      label: "next.config.ts",
    },
    {
      id: "provider",
      title: "4. Monta el provider",
      code: '"use client";\n\nimport type { ReactNode } from "react";\nimport { KivoraProvider } from "@kivora/nextjs";\n\nexport default function Providers({ children }: { children: ReactNode }) {\n  return <KivoraProvider colorMode="system">{children}</KivoraProvider>;\n}',
      label: "app/providers.tsx",
    },
    {
      id: "layout",
      title: "5. Conecta el layout",
      code: 'import type { ReactNode } from "react";\nimport Providers from "./providers";\nimport "./globals.css";\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang="es" suppressHydrationWarning>\n      <body><Providers>{children}</Providers></body>\n    </html>\n  );\n}',
      label: "app/layout.tsx",
      paragraphs: [
        'El layout puede seguir siendo un Server Component. Usa "use client" en los componentes que gestionan estado, eventos o APIs del navegador. Ya puedes importar Button y empezar a componer.',
      ],
    },
    {
      id: "pages-router",
      title: "Si utilizas Pages Router",
      paragraphs: [
        "Conserva tu configuración existente de Next.js. Importa @kivora/nextjs/styles.css y monta KivoraProvider en pages/_app.tsx. No necesitas Tailwind, PostCSS ni @source.",
      ],
    },
  ],
  "inicializador": [
  {
    "id": "inicio",
    "title": "Configura tu proyecto con un comando",
    "paragraphs": [
      "@kivora/init es el asistente oficial de instalación. Ejecuta el comando desde la carpeta de una aplicación existente, donde está su package.json. Detecta Next.js o React Native y propone los archivos y dependencias necesarios. No crea una aplicación ni instala o migra el framework.",
      "Usa npx @kivora/init. npm install @kivora/init solo añade el paquete a tus dependencias; no ejecuta la configuración. No necesitas conservar el asistente como dependencia de tu aplicación."
    ],
    "code": "npx @kivora/init",
    "label": "Terminal",
    "links": [
      {
        "label": "@kivora/init en npm",
        "href": "https://www.npmjs.com/package/@kivora/init"
      }
    ]
  },
  {
    "id": "requisitos",
    "title": "Requisitos y plataformas",
    "paragraphs": [
      "Esta guía corresponde a @kivora/init 0.1.1. Requiere Node.js 20.19 o posterior, además de los requisitos del framework. Detecta npm, pnpm, Yarn o Bun a partir de packageManager y los lockfiles, incluidos los de un workspace padre.",
      "Next.js: versión 13+, React y React DOM 18+, Tailwind >=4.1 <5. El asistente añade Tailwind y PostCSS si faltan; no migra Tailwind 3. La instalación manual web permite usar el CSS compilado sin Tailwind.",
      "React Native: Community CLI >=0.85.3 <0.86, React >=19.2 <20, NativeWind >=4.2.6 <5, Reanimated >=4.3.0 <4.4, Worklets >=0.8.3 <0.9 y Tailwind >=3.4.17 <4. Babel preset y Metro config deben ser de la serie 0.85.",
      "No ofrece una opción React/Vite ni migra proyectos Expo. Si detecta ambos frameworks o ninguno, pide elegir; esa elección no convierte un proyecto React web en Next.js."
    ],
    "links": [
      {
        "label": "React web sin Next.js: instalación manual",
        "href": "/docs/instalacion-react"
      },
      {
        "label": "Preparar React Native",
        "href": "/docs/instalacion-react-native"
      }
    ]
  },
  {
    "id": "plan",
    "title": "Revisa el plan antes de aplicarlo",
    "code": "npx @kivora/init --dry-run\n\n# Aplicar con confirmación interactiva\nnpx @kivora/init",
    "label": "Terminal",
    "paragraphs": [
      "--dry-run muestra el contenido actual y propuesto sin escribir archivos ni instalar paquetes. En la ejecución normal, el asistente valida el plan y pide confirmación antes de escribir. Conserva las versiones ya declaradas e instala únicamente las dependencias que faltan."
    ]
  },
  {
    "id": "opciones",
    "title": "Opciones del asistente",
    "code": "npx @kivora/init --help\nnpx @kivora/init --cwd ./apps/web --framework nextjs --dry-run\nnpx @kivora/init --framework native --skip-install\n\n# Automatización: aplica el plan sin confirmación interactiva\nnpx @kivora/init --cwd ./apps/web --framework nextjs --yes",
    "label": "Terminal",
    "bullets": [
      "--cwd: carpeta de la aplicación.",
      "--framework nextjs|native: plataforma ya instalada en el proyecto.",
      "--dry-run: vista previa sin cambios.",
      "--skip-install: escribe la configuración y muestra los comandos de instalación pendientes.",
      "--yes: acepta el plan sin confirmación; úsalo conscientemente en automatizaciones.",
      "--package-manager npm|pnpm|yarn|bun: elige gestor si el proyecto no tiene uno definido. No reemplaza un gestor existente."
    ]
  },
  {
    "id": "cambios",
    "title": "Qué configura",
    "bullets": [
      "Next.js: añade @kivora/nextjs, Tailwind y PostCSS si faltan; configura transpilePackages y el plugin PostCSS; genera provider y CSS y los conecta a App Router o Pages Router.",
      "React Native: añade @kivora/native y dependencias nativas, configura Babel, Metro y Tailwind, e integra los providers de gestos, safe area, teclado y Kivora con sus variables de color.",
      "En Android añade POST_NOTIFICATIONS cuando existe el manifiesto. No ejecuta compilaciones nativas ni modifica Gradle, Podfile o recursos de imagen."
    ]
  },
  {
    "id": "recuperacion",
    "title": "Compatibilidad y recuperación",
    "paragraphs": [
      "Configuraciones dinámicas con funciones, spreads u opciones no reconocidas pueden requerir integración manual. Los gestores en conflicto o rangos de versiones incompatibles detienen el plan antes de escribir. No fuerces una versión distinta sin revisar compatibilidad.",
      "El asistente guarda copias en .kivora/backups/<id>/ y un manifest.json que relaciona cada archivo con su copia. Conserva esas copias hasta revisar la integración y no las publiques. Si falla el gestor, restaura los archivos y lockfiles, pero los cambios de node_modules o efectos de scripts no son una transacción reversible.",
      "Al terminar, revisa los estilos y ejecuta las comprobaciones de tu aplicación. En native, instala pods con el flujo de tu proyecto, reinicia Metro y recompila. El README del instalador indica que su integración iOS no ha sido validada."
    ],
    "links": [
      {
        "label": "README y resolución de problemas del asistente",
        "href": "https://www.npmjs.com/package/@kivora/init"
      }
    ]
  }
],
  "instalacion-react": [
  {
    "id": "paquete",
    "title": "React web sin Next.js",
    "paragraphs": [
      "Para una aplicación React que renderiza en el navegador, el paquete web es @kivora/nextjs. Sus peer dependencies requieren React y React DOM 18+. Usa un bundler que pueda importar CSS, como el de tu proyecto React existente.",
      "@kivora/init 0.1.1 no tiene una opción React/Vite: no selecciones nextjs si tu proyecto no usa ese framework. Aquí la integración es manual. No necesitas @kivora/native para renderizar en el navegador."
    ],
    "code": "npm install @kivora/nextjs",
    "label": "Terminal"
  },
  {
    "id": "entrada",
    "title": "Importa estilos y monta el provider",
    "paragraphs": [
      "Importa el CSS una sola vez en la entrada de tu aplicación y monta KivoraProvider alrededor de App. Conserva los providers existentes. El ejemplo asume que index.html contiene un elemento con id=\"root\".",
      "styles.css incluye las utilidades y tokens de la biblioteca: no necesitas instalar Tailwind para estos componentes. Añade tus propios estilos después del CSS de Kivora. En una aplicación exclusivamente cliente no hace falta la directiva use client."
    ],
    "code": "import { createRoot } from \"react-dom/client\";\nimport { KivoraProvider } from \"@kivora/nextjs\";\nimport \"@kivora/nextjs/styles.css\";\nimport App from \"./App\";\n\ncreateRoot(document.getElementById(\"root\")!).render(\n  <KivoraProvider colorMode=\"system\">\n    <App />\n  </KivoraProvider>\n);",
    "label": "src/main.tsx"
  },
  {
    "id": "ejemplo",
    "title": "Tu primer componente web",
    "code": "import { Button } from \"@kivora/nextjs\";\n\nexport default function App() {\n  return <Button onClick={() => console.log(\"Crear proyecto\")}>Crear proyecto</Button>;\n}",
    "label": "src/App.tsx"
  },
  {
    "id": "tailwind",
    "title": "Si ya utilizas Tailwind",
    "paragraphs": [
      "Si tu bundler ya compila Tailwind 4.1+, utiliza @kivora/nextjs/tailwind.css en lugar de styles.css. Conserva la configuración del compilador propia de tu bundler. No importes ambas hojas ni copies next.config.ts en una aplicación que no usa Next.js."
    ],
    "code": "@import \"@kivora/nextjs/tailwind.css\";",
    "label": "src/styles.css",
    "links": [
      {
        "label": "Instalación con Next.js",
        "href": "/docs/instalacion"
      },
      {
        "label": "Paquete web en npm",
        "href": "https://www.npmjs.com/package/@kivora/nextjs"
      }
    ]
  }
],
  "instalacion-react-native": [
  {
    "id": "plataforma",
    "title": "Una instalación propia para React Native",
    "paragraphs": [
      "En tu aplicación móvil utiliza @kivora/native. Comparte el lenguaje visual y los temas de Kivora, pero no renderiza HTML: sus eventos, providers y dependencias son nativos. No instales @kivora/nextjs ni importes su CSS dentro de la aplicación móvil.",
      "La vía asistida de @kivora/init 0.1.1 está orientada a React Native Community CLI, sin Expo. Necesitas una aplicación nativa existente y Node.js 20.19+."
    ],
    "links": [
      {
        "label": "@kivora/native en npm",
        "href": "https://www.npmjs.com/package/@kivora/native"
      },
      {
        "label": "Cómo funciona @kivora/init",
        "href": "/docs/inicializador"
      }
    ]
  },
  {
    "id": "compatibilidad",
    "title": "Comprueba las versiones antes de instalar",
    "bullets": [
      "React Native >=0.85.3 <0.86 y React >=19.2 <20.",
      "NativeWind >=4.2.6 <5 y Tailwind >=3.4.17 <4.",
      "Reanimated >=4.3.0 <4.4 y Worklets >=0.8.3 <0.9.",
      "@react-native/babel-preset y @react-native/metro-config de la serie 0.85."
    ],
    "paragraphs": [
      "Estos son los límites del asistente, más estrechos que los peer ranges del paquete nativo. Un rango aceptado por npm no demuestra que todas sus combinaciones estén probadas. No mezcles estas instrucciones con NativeWind 5, Reanimated 3 o Expo."
    ]
  },
  {
    "id": "asistente",
    "title": "Instala y configura con el asistente",
    "code": "# Ejecuta desde la carpeta de tu aplicación nativa\nnpx @kivora/init --framework native --dry-run\n\n# Revisa y confirma el plan\nnpx @kivora/init --framework native",
    "label": "Terminal",
    "paragraphs": [
      "El asistente prepara Babel, Metro, Tailwind, CSS y tipos NativeWind; conecta App o src/App con GestureHandlerRootView, SafeAreaProvider, KeyboardProvider y KivoraProvider, y aplica las variables de color necesarias. Revisa los archivos generados antes de continuar."
    ]
  },
  {
    "id": "primer-componente",
    "title": "Usa componentes y eventos nativos",
    "paragraphs": [
      "Este ejemplo es una pantalla dentro de la raíz ya configurada por el asistente. Conserva sus providers y variables de NativeWind. En React Native el texto va dentro de Text y el evento de pulsación es onPress."
    ],
    "code": "import { Text, View } from \"react-native\";\nimport { Button } from \"@kivora/native\";\n\nexport default function HomeScreen() {\n  return (\n    <View className=\"flex-1 justify-center bg-background p-6\">\n      <Button onPress={() => console.log(\"Crear proyecto\")}>\n        <Text className=\"text-primary-foreground\">Crear proyecto</Text>\n      </Button>\n    </View>\n  );\n}",
    "label": "HomeScreen.tsx"
  },
  {
    "id": "recompilar",
    "title": "Termina la integración nativa",
    "bullets": [
      "iOS: instala pods con el flujo de tu proyecto y recompila la aplicación.",
      "Reinicia Metro limpiando la caché después de cambiar Babel, Metro o Tailwind. Usa los scripts de tu proyecto para reconstruir Android o iOS.",
      "Las notificaciones necesitan un icono Android existente. El asistente añade el permiso cuando encuentra el manifiesto, pero no crea ese recurso.",
      "Los componentes multimedia pueden necesitar dependencias y configuración adicionales; consulta las notas del paquete para cada funcionalidad."
    ],
    "paragraphs": [
      "El README de @kivora/init 0.1.1 indica que la integración iOS del asistente no está validada. El paquete nativo describe validaciones de su entorno de referencia en Android y simulador iOS, y una corrección de css-interop que no distribuye automáticamente. No son una garantía para todas las instalaciones externas."
    ]
  },
  {
    "id": "manual",
    "title": "Si necesitas una instalación manual",
    "paragraphs": [
      "La instalación manual requiere integrar las dependencias nativas, Babel, Metro, Tailwind, providers y variables. npm install @kivora/native por sí solo no completa la configuración. Sigue el README de la versión que vayas a instalar y revisa tus dependencias existentes antes de cambiar versiones."
    ],
    "links": [
      {
        "label": "Instalación manual y compatibilidad de @kivora/native",
        "href": "https://www.npmjs.com/package/@kivora/native#installation"
      },
      {
        "label": "Qué compartir entre web y móvil",
        "href": "/docs/multiplataforma"
      }
    ]
  }
],
  temas: [
    {
      id: "modo",
      title: "Claro, oscuro o el modo del sistema",
      paragraphs: [
        'KivoraProvider acepta colorMode="light", "dark" o "system". El modo resuelto actualiza la clase dark del documento. Monta un provider de nivel superior para evitar que varios modos compitan entre sí.',
      ],
      code: '<KivoraProvider colorMode="system">\n  {children}\n</KivoraProvider>',
      label: "Tema global",
    },
    {
      id: "tokens",
      title: "Colores con significado",
      paragraphs: [
        "Usa bg-background, text-foreground, bg-primary y border-border. Los nombres describen el papel del color: así la interfaz puede cambiar de tema sin cambiar cada componente.",
        "La home y esta documentación comparten las mismas variables: violeta en claro, lavanda en oscuro, rosa y verde salvia. Los controles de la cabecera permiten probar estas cuatro paletas.",
      ],
      code: ":root {\n  --color-primary: #6558e8;\n  --color-primary-foreground: #ffffff;\n  --color-background: #f7f8fc;\n  --color-foreground: #25262c;\n}\n\n.dark {\n  --color-primary: #a79bff;\n  --color-primary-foreground: #201a3b;\n  --color-background: #13141e;\n  --color-foreground: #f0eef7;\n}",
      label: "globals.css · después del import de Kivora",
    },
    {
      id: "marca",
      title: "Dale el color de tu marca",
      paragraphs: [
        "Personaliza pares de tokens: primary con primary-foreground, card con card-foreground y así sucesivamente. Revisa la legibilidad en estados de hover, focus y disabled.",
        "Los paneles que usan portales pueden renderizarse bajo body. Si limitas tus variables a una sección, configura también el contenedor del portal o aplica la paleta al nivel del documento.",
      ],
      code: ".brand-rose {\n  --color-primary: #a03872;\n  --color-primary-foreground: #ffffff;\n  --color-secondary: #f7e0eb;\n  --color-secondary-foreground: #943564;\n}\n\n.brand-sage {\n  --color-primary: #287c60;\n  --color-primary-foreground: #ffffff;\n  --color-secondary: #e2eee5;\n  --color-secondary-foreground: #287c60;\n}",
      label: "Paletas de marca",
    },
    {
      id: "contexto",
      title: "Variables CSS y objeto de tema",
      paragraphs: [
        "themeOverrides modifica el objeto que devuelve useKivoraTheme, pero no genera variables CSS automáticamente. Si consumes el objeto del tema y las clases CSS, mantén ambas representaciones alineadas.",
      ],
      code: '"use client";\nimport { useKivoraTheme } from "@kivora/nextjs";\n\nexport function CurrentTheme() {\n  const { resolvedColorMode } = useKivoraTheme();\n  return <span>Modo actual: {resolvedColorMode}</span>;\n}',
      label: "Consultar el modo",
    },
    {
      id: "fuente",
      title: "Tu tipografía sigue siendo tuya",
      paragraphs: [
        "Kivora no te obliga a adoptar la tipografía de estos ejemplos. Esta web conserva Geist y Geist Mono. Define tu font-family en la aplicación y utiliza los componentes tipográficos para organizar la jerarquía.",
      ],
    },
  ],
  composicion: [
    {
      id: "piezas",
      title: "Componentes que trabajan juntos",
      paragraphs: [
        "Los componentes compuestos exponen piezas pequeñas: CardHeader, CardContent y CardFooter; DialogTrigger y DialogContent; TabsList y TabsContent. Conserva la estructura necesaria y adapta el contenido a tu producto.",
      ],
      code: '<Card>\n  <CardHeader>\n    <CardTitle>Mi equipo</CardTitle>\n    <CardDescription>Las personas detrás de la idea.</CardDescription>\n  </CardHeader>\n  <CardContent><Input aria-label="Email" placeholder="nombre@equipo.com" /></CardContent>\n  <CardFooter><Button>Invitar</Button></CardFooter>\n</Card>',
      label: "Composición",
    },
    {
      id: "estado",
      title: "El estado lo decide tu aplicación",
      paragraphs: [
        "defaultValue, defaultChecked y defaultOpen establecen el estado inicial de un componente no controlado. Usa value/checked/open y su callback correspondiente cuando el estado viva en React. No mezcles ambas estrategias en el mismo control.",
      ],
      code: '"use client";\nimport { useState } from "react";\nimport { Switch } from "@kivora/nextjs";\n\nexport default function Preferences() {\n  const [enabled, setEnabled] = useState(true);\n  return <Switch aria-label="Notificaciones" checked={enabled} onCheckedChange={setEnabled} />;\n}',
      label: "Estado controlado",
    },
    {
      id: "as-child",
      title: "Componer con asChild",
      paragraphs: [
        "Cuando un componente admite asChild, aplica su comportamiento al único hijo compatible en vez de crear un elemento adicional. Es útil para convertir un Button en un enlace o utilizar un Button como activador de un diálogo.",
        "El hijo debe poder recibir props y ref. No anides botones dentro de botones ni enlaces dentro de enlaces.",
      ],
      code: 'import Link from "next/link";\nimport { Button } from "@kivora/nextjs";\n\n<Button asChild>\n  <Link href="/docs">Leer documentación</Link>\n</Button>',
      label: "Navegación con Next.js",
    },
    {
      id: "servicios",
      title: "Conecta los servicios cuando los necesites",
      paragraphs: [
        "Los formularios recogen información; tu aplicación valida y guarda los datos. DataTable recibe las filas; tu servicio las consulta. FileUpload necesita un endpoint Tus o un transporte propio. Player necesita medios y, si procede, servicios de licencias.",
        "Separa el estado visual del estado remoto: indica cuándo una operación está pendiente, confirma su resultado y permite recuperarse de un error.",
      ],
    },
  ],
  accesibilidad: [
    {
      id: "etiquetas",
      title: "Empieza por nombres claros",
      paragraphs: [
        "Todos los controles deben tener un nombre accesible. Asocia Label e Input mediante htmlFor/id y añade aria-label a botones que solo muestran un icono. No dependas del placeholder para nombrar el campo.",
      ],
      code: '<Label htmlFor="email">Email de trabajo</Label>\n<Input id="email" type="email" aria-describedby="email-help" />\n<p id="email-help">Lo usaremos para invitarte al equipo.</p>',
      label: "Etiquetas y ayuda",
    },
    {
      id: "teclado",
      title: "Recorre la interfaz con el teclado",
      bullets: [
        "Tab y Shift+Tab deben recorrer controles en un orden lógico.",
        "El foco visible debe conservar suficiente contraste.",
        "Escape debe cerrar los paneles y devolver el foco a su activador.",
        "Las pestañas, menús y grupos de opciones deben responder a sus flechas correspondientes.",
      ],
      paragraphs: [
        "Las primitivas proporcionan comportamientos de teclado, pero la composición final necesita comprobarse. Los estilos personalizados no deben ocultar el foco ni bloquear un control.",
      ],
    },
    {
      id: "semantica",
      title: "Estructura antes que apariencia",
      paragraphs: [
        "Respeta la jerarquía de encabezados, utiliza enlaces para navegar y botones para ejecutar acciones. Incluye DialogTitle y DialogDescription en los paneles y captions cuando una tabla necesite contexto.",
        "El color no debe ser la única señal de error, éxito o selección. Añade texto y relaciones como aria-describedby; anuncia cambios relevantes con regiones de estado.",
      ],
    },
    {
      id: "movimiento",
      title: "Adaptación y movimiento",
      paragraphs: [
        "Prueba zoom al 200 %, tamaños de móvil y preferencias de movimiento reducido. Un ejemplo bonito no sustituye una revisión del flujo completo con teclado y lector de pantalla.",
        "Las variantes de tema deben comprobarse por separado: personalizar los tokens cambia el contraste y puede afectar a textos, bordes y estados interactivos.",
      ],
    },
  ],
  multiplataforma: [
    {
      id: "paquetes",
      title: "Una familia, dos renderizadores",
      paragraphs: [
        "@kivora/nextjs proporciona los componentes web. @kivora/native está orientado a React Native. Ambos comparten tipos y temas de @kivora/theme, sin obligarte a instalar los dos renderizadores.",
      ],
      code: "# Dentro de tu aplicación Next.js\nnpx @kivora/init --framework nextjs\n\n# Dentro de tu aplicación React Native compatible\nnpx @kivora/init --framework native",
      links: [{ label: "Instalación web", href: "/docs/instalacion" }, { label: "Instalación React Native", href: "/docs/instalacion-react-native" }],
      label: "Elegir un paquete",
    },
    {
      id: "compartir",
      title: "Qué puedes compartir",
      bullets: [
        "Paleta y decisiones de diseño expresadas con los tokens de tema.",
        "Nombres, estados y patrones de interacción equivalentes cuando ambas plataformas los admiten.",
        "Lógica de negocio, validación y modelos de datos independientes de la interfaz.",
      ],
    },
    {
      id: "adaptar",
      title: "Qué debes adaptar",
      paragraphs: [
        "Los atributos DOM, los motores de tablas y las opciones de react-slick no son intercambiables con React Native. Resizable pertenece al paquete web; Menu está disponible en ambas plataformas; la biblioteca nativa añade BottomSheet.",
        "Estas páginas documentan la API de @kivora/nextjs 0.2.0. Consulta el README y los tipos de la versión nativa instalada para construir sus componentes.",
      ],
    },
  ],
};

export const propDescriptions: Record<string, string> = {
  children: "Contenido o elementos hijos del componente.",
  className: "Clases CSS adicionales para personalizar el elemento.",
  style: "Estilos en línea de React.",
  id: "Identificador del elemento; permite asociar etiquetas y descripciones.",
  variant:
    "Variante visual. Utiliza uno de los valores admitidos por este componente.",
  size: "Tamaño visual del componente.",
  asChild:
    "Aplica las props y el comportamiento al único elemento hijo compatible.",
  disabled: "Desactiva la interacción del control.",
  value: "Valor controlado. Actualízalo desde el callback de cambio.",
  defaultValue: "Valor inicial cuando el estado lo gestiona el componente.",
  checked: "Estado de selección controlado.",
  defaultChecked: "Selección inicial del control.",
  onCheckedChange: "Recibe el nuevo estado de selección.",
  onValueChange: "Recibe el valor después de una interacción.",
  open: "Estado de apertura controlado.",
  defaultOpen: "Indica si empieza abierto en modo no controlado.",
  onOpenChange: "Recibe el nuevo estado de apertura.",
  onChange:
    "Evento de cambio. Consulta el tipo: algunos controles entregan un objeto, otros un evento DOM.",
  onClick: "Acción que se ejecuta al activar el elemento.",
  onSelect: "Acción o selección producida por el usuario.",
  onSubmit: "Evento de envío del formulario.",
  type: "Tipo o modo de operación; los valores dependen del componente.",
  name: "Nombre usado para identificar el control en formularios.",
  placeholder: "Ayuda breve mostrada cuando no hay un valor.",
  required: "Indica que se necesita un valor.",
  invalid: "Activa la presentación visual de error.",
  min: "Límite inferior permitido.",
  max: "Límite superior permitido.",
  step: "Incremento entre valores.",
  maxLength: "Máximo de caracteres admitidos.",
  rows: "Número de filas visibles del campo.",
  htmlFor: "id del control asociado a la etiqueta.",
  "aria-label": "Nombre accesible del control.",
  role: "Rol semántico del elemento. Conserva el rol predeterminado salvo necesidad justificada.",
  tabIndex: "Orden y disponibilidad de foco por teclado.",
  title: "Título o información complementaria.",
  src: "Ruta o URL del recurso.",
  alt: "Texto alternativo de la imagen.",
  autoComplete: "Indica al navegador el tipo de autocompletado.",
  options:
    "Opciones o configuración del componente. Consulta la estructura del tipo.",
  data: "Filas que se mostrarán.",
  columns: "Definición de columnas, acceso a datos y presentación.",
  config: "Asocia series del gráfico con etiquetas y colores.",
  orientation: "Eje horizontal o vertical.",
  dir: "Dirección de lectura de la interfaz.",
  align: "Alineación del contenido.",
  side: "Lado desde el que se muestra el panel.",
  sideOffset: "Separación entre el activador y el contenido.",
  alignOffset: "Desplazamiento respecto a la alineación elegida.",
  onError: "Recibe los errores para que la aplicación los gestione.",
  fallback: "Contenido alternativo si no se puede mostrar el principal.",
  ratio: "Proporción ancho/alto.",
  progress: "Progreso de la operación.",
  label: "Etiqueta textual o accesible.",
  showValue: "Muestra la etiqueta del valor.",
  formatValue: "Formatea el valor para su presentación.",
  animate: "Activa o desactiva la animación.",
  copyable: "Muestra la acción de copiar.",
  filename: "Nombre del archivo mostrado en la cabecera.",
  language: "Lenguaje usado para resaltar el código.",
  showLineNumbers: "Muestra los números de línea.",
  wrapLongLines: "Permite ajustar las líneas largas.",
  inline: "Presenta el contenido dentro de una línea.",
  mode: "Modo de selección.",
  selected: "Fecha o fechas seleccionadas.",
  locale: "Localización en el formato esperado por el componente.",
  localeCode: "Código de idioma para el selector.",
  withTime: "Incluye edición de hora.",
  timeFormat: "Ciclo de 12 o 24 horas.",
  autoResize: "Adapta la altura del campo al contenido.",
  minRows: "Altura mínima en filas.",
  maxRows: "Altura máxima en filas.",
  showCount: "Muestra el contador de caracteres.",
  mask: "Máscara o expresión regular aplicada a la entrada.",
  unmask: "Controla el formato del valor entregado por la máscara.",
  onAccept: "Recibe los cambios aceptados por la máscara.",
  onComplete: "Callback al completar la entrada u operación.",
  searchable: "Activa la búsqueda integrada.",
  searchPlaceholder: "Texto de ayuda para buscar.",
  paginated: "Activa la paginación.",
  pageSize: "Número de filas por página.",
  pageSizeOptions: "Tamaños de página disponibles.",
  selectable: "Permite seleccionar filas.",
  multiSelect: "Permite seleccionar varias filas.",
  filterable: "Activa los filtros.",
  filters: "Definición de los filtros disponibles.",
  emptyMessage: "Contenido cuando no hay resultados.",
  controller: "Instancia estable que gestiona la sesión y sus recursos.",
  source: "Fuente multimedia con id, src, title y opciones de reproducción.",
  autoPlay:
    "Solicita iniciar la reproducción automáticamente; sujeto a las reglas del navegador.",
  muted: "Inicia o mantiene la reproducción silenciada.",
  controlsVariant: "Presentación de los controles del reproductor.",
  colorMode: "Modo claro, oscuro o preferencia del sistema.",
  themeOverrides: "Cambios del objeto de tema; no genera variables CSS.",
  theme: "Tema del componente o identificador del tema, según su API.",
  items: "Colección de elementos que se va a renderizar.",
  renderItem: "Función que construye la vista de cada elemento.",
  estimateSize: "Estima la medida de cada fila para virtualizar.",
  getItemKey: "Devuelve una clave estable para cada elemento.",
  overscan: "Elementos extra montados fuera del área visible.",
  format: "Formato del código de barras.",
  foreground: "Color opaco #RRGGBB de los módulos.",
  background: "Color opaco #RRGGBB del fondo.",
  margin: "Margen del código. Mantén una zona silenciosa suficiente.",
  displayValue: "Muestra el valor legible del código.",
  errorCorrectionLevel: "Nivel de corrección de errores del QR.",
  width: "Anchura del resultado.",
  height: "Altura del resultado.",
  loadOptions:
    "Carga o filtra opciones y devuelve una promesa o usa el callback admitido.",
  isMulti: "Permite seleccionar varias opciones.",
  cacheOptions: "Conserva las opciones cargadas para reutilizarlas.",
  questions: "Preguntas del cuestionario con identificadores únicos.",
  defaultAnswers: "Respuestas iniciales por identificador.",
  accept: "Tipos de archivo admitidos.",
  camera: "Habilita las fuentes de cámara compatibles.",
  dashboard: "Configura fuentes y opciones del dashboard avanzado.",
  showStatus: "Muestra el estado integrado de subida.",
  messages: "Textos localizados que sustituyen los predeterminados.",
  pressed: "Estado pulsado controlado.",
  defaultPressed: "Estado pulsado inicial.",
  onPressedChange: "Recibe los cambios del estado pulsado.",
  collapsible: "Permite cerrar el contenido o colapsar el panel.",
  direction: "Eje en el que se distribuyen los paneles.",
  defaultSize: "Tamaño inicial del panel.",
  minSize: "Tamaño mínimo del panel.",
  maxSize: "Tamaño máximo del panel.",
  withHandle: "Muestra un agarre visual en el separador.",
  follow: "Sigue los mensajes nuevos cuando corresponde.",
};
