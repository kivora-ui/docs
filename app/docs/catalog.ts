export type Story = { name: string; code: string };
export type ComponentDoc = {
  slug: string;
  name: string;
  group: string;
  description: string;
  usage: string;
  code: string;
  stories: Story[];
  exports: string[];
  note?: string;
};
const components: ComponentDoc[] = [];
function add(
  name: string,
  group: string,
  description: string,
  usage: string,
  code: string,
  options: Partial<Pick<ComponentDoc, "stories" | "exports" | "note">> = {},
) {
  components.push({
    name,
    slug: name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    group,
    description,
    usage,
    code,
    stories: [],
    exports: [name],
    ...options,
  });
}
const row = (content: string) =>
  `<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>\n  ${content}\n</div>`;
const stack = (content: string) =>
  `<div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}>\n  ${content}\n</div>`;
add(
  "Icon",
  "Fundamentos",
  "Iconos Lucide con tamaño, color y etiqueta accesible.",
  "Importa el icono desde lucide-react y pásalo con icon={Check}. En native usa lucide-react-native e Icon de @kivora/native dentro de KivoraProvider. size, color, strokeWidth y label funcionan en ambas plataformas. Omite label cuando el icono acompaña texto; si comunica información por sí solo, añade label. En web también puedes usar className.",
  '<Icon icon={Check} label="Completado" size={24} color="#16a34a" />',
  {
    stories: [
      { name: "Tamaños", code: row('<Icon icon={Heart} size={16} label="Favorito pequeño" /><Icon icon={Heart} size={24} label="Favorito mediano" /><Icon icon={Heart} size={40} label="Favorito grande" />') },
      { name: "Color y trazo", code: row('<Icon icon={Check} color="#16a34a" strokeWidth={3} label="Completado" /><Icon icon={Heart} className="text-destructive" strokeWidth={1} label="Favorito" />') },
      { name: "En un botón", code: '<Button><Icon icon={Search} size={16} />Buscar</Button>' },
    ],
  },
);
add(
  "Button",
  "Fundamentos",
  "Una acción clara, en el momento adecuado.",
  'Utiliza Button para acciones y asChild con un enlace para navegar. En formularios, declara type="button" si la acción no debe enviar los datos.',
  '<Button variant="default" size="default">Crear proyecto</Button>',
  {
    stories: [
      {
        name: "Variantes",
        code: row(
          '{(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}',
        ),
      },
      {
        name: "Con estado",
        code: 'function Example() {\n  const [saved, setSaved] = useState(false);\n  return <Button onClick={() => setSaved(!saved)}>{saved ? "Guardado ✓" : "Guardar cambios"}</Button>;\n}',
      },
    ],
  },
);
add(
  "ButtonGroup",
  "Fundamentos",
  "Agrupa acciones relacionadas en una misma fila.",
  "Combina botones con variantes coherentes. Usa etiquetas distintas para que cada acción sea reconocible.",
  '<ButtonGroup><Button variant="outline">Anterior</Button><Button>Siguiente</Button></ButtonGroup>',
);
add(
  "Badge",
  "Fundamentos",
  "Una pequeña etiqueta para estados, categorías y novedades.",
  "Comunica el estado también con texto. Un Badge describe información; para ejecutar una acción utiliza Button.",
  '<Badge variant="secondary">Nuevo</Badge>',
  {
    stories: [
      {
        name: "Estados",
        code: row(
          '<Badge>Publicado</Badge><Badge variant="outline">Borrador</Badge><Badge variant="destructive">Error</Badge>',
        ),
      },
    ],
  },
);
add(
  "Typography",
  "Fundamentos",
  "Jerarquía tipográfica con el mismo lenguaje visual.",
  "Elige el nivel del título por su posición en el documento. Conserva un solo h1 principal y utiliza párrafos para el contenido.",
  stack(
    "<TypographyH2>Las ideas toman forma.</TypographyH2><TypographyP>Una base consistente para lo que estás construyendo.</TypographyP><TypographyMuted>Los pequeños detalles también cuentan.</TypographyMuted>",
  ),
  {
    exports: [
      "TypographyH1",
      "TypographyH2",
      "TypographyH3",
      "TypographyH4",
      "TypographyP",
      "TypographyLead",
      "TypographyLarge",
      "TypographySmall",
      "TypographyMuted",
      "TypographyBlockquote",
      "TypographyList",
      "TypographyInlineCode",
    ],
  },
);
add(
  "Card",
  "Fundamentos",
  "Un contenedor para dar contexto y estructura al contenido.",
  "Compón la tarjeta con Header, Title, Description, Content y Footer. El contenedor no impone el comportamiento de sus acciones.",
  "<Card style={{ width: 320 }}><CardHeader><CardTitle>Tu próximo proyecto</CardTitle><CardDescription>Un espacio para una gran idea.</CardDescription></CardHeader><CardContent>Invita a tu equipo y empieza a crear.</CardContent><CardFooter><Button>Crear proyecto</Button></CardFooter></Card>",
  {
    exports: [
      "Card",
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardContent",
      "CardFooter",
    ],
  },
);
add(
  "Avatar",
  "Fundamentos",
  "Representa una persona con imagen o iniciales.",
  "Proporciona texto alternativo a AvatarImage y un AvatarFallback para imágenes no disponibles o durante la carga.",
  "<Avatar><AvatarFallback>SM</AvatarFallback></Avatar>",
  {
    exports: ["Avatar", "AvatarImage", "AvatarFallback"],
    stories: [
      {
        name: "Equipo",
        code: row(
          '{["SM", "LG", "EW"].map(name => <Avatar key={name}><AvatarFallback>{name}</AvatarFallback></Avatar>)}',
        ),
      },
    ],
  },
);
add(
  "Separator",
  "Fundamentos",
  "Separa bloques de contenido de forma discreta.",
  "Usa orientation para cambiar el eje. Con decorative indicas que la separación es únicamente visual.",
  stack(
    "<span>Tu espacio de trabajo</span><Separator /><span>Configuración del equipo</span>",
  ),
);
add(
  "AspectRatio",
  "Fundamentos",
  "Reserva proporciones estables para imágenes y contenido visual.",
  "Define ratio como ancho dividido por alto. Mantén una anchura en el contenedor para que se pueda calcular su altura.",
  '<div style={{ width: 360 }}><AspectRatio ratio={16 / 9} style={{ background: "linear-gradient(135deg, #6558e8, #dec5ef)", borderRadius: 12, display: "grid", placeItems: "center", color: "white" }}>16 : 9</AspectRatio></div>',
);
add(
  "Kbd",
  "Fundamentos",
  "Presenta combinaciones de teclado legibles.",
  "Describe un atajo existente en la aplicación. Kbd solo representa las teclas; registra el evento en tu código.",
  row("<Kbd>⌘</Kbd><Kbd>K</Kbd>"),
);
add(
  "Code",
  "Fundamentos",
  "Código con formato, numeración y copia integrada.",
  "Indica language para el resaltado y filename para contextualizar el fragmento. El contenido debe ser una cadena.",
  '<Code language="tsx" filename="example.tsx" copyable showLineNumbers>{`<Button>Hola, Kivora</Button>`}</Code>',
);
add(
  "Input",
  "Formularios",
  "Entrada de texto con tamaños, validación y máscaras.",
  "Asocia una etiqueta mediante htmlFor e id. Usa invalid para el estado visual de error y aria-describedby para explicar cómo corregirlo.",
  stack(
    '<Label htmlFor="demo-email">Email</Label><Input id="demo-email" type="email" placeholder="tu@ejemplo.com" />',
  ),
  {
    stories: [
      {
        name: "Máscara",
        code: '<Input aria-label="Teléfono" mask="000 000 000" placeholder="600 000 000" />',
      },
      {
        name: "Error",
        code: stack(
          '<Input aria-label="Email" invalid defaultValue="email incompleto" aria-describedby="email-error" /><p id="email-error">Introduce un email válido.</p>',
        ),
      },
    ],
  },
);
add(
  "Textarea",
  "Formularios",
  "Texto libre con contador y altura adaptable.",
  "Usa minRows y maxRows junto con autoResize para acompañar el contenido. maxLength define el límite del campo.",
  '<Textarea aria-label="Descripción del proyecto" placeholder="Cuéntanos tu idea…" autoResize minRows={3} maxRows={6} maxLength={200} showCount />',
);
add(
  "Label",
  "Formularios",
  "La etiqueta visible de un campo.",
  "Conecta htmlFor con el id del control. El placeholder complementa la etiqueta, pero no la sustituye.",
  stack(
    '<Label htmlFor="project-name">Nombre del proyecto</Label><Input id="project-name" placeholder="Mi próxima idea" />',
  ),
);
add(
  "Field",
  "Formularios",
  "Etiqueta, ayuda, control y error en una unidad.",
  "Agrupa campos con FieldGroup o FieldSet. Usa FieldDescription para instrucciones y FieldError para mensajes de validación.",
  '<Field><FieldLabel htmlFor="field-name">Nombre</FieldLabel><Input id="field-name" placeholder="Tu nombre" /><FieldDescription>Así te verá tu equipo.</FieldDescription></Field>',
  {
    exports: [
      "Field",
      "FieldSet",
      "FieldLegend",
      "FieldGroup",
      "FieldLabel",
      "FieldContent",
      "FieldDescription",
      "FieldError",
      "FieldSeparator",
    ],
  },
);
add(
  "InputGroup",
  "Formularios",
  "Añade contexto y acciones a una entrada.",
  "Combina Input con adornos y botones. Mantén una etiqueta accesible para el campo y para los botones que solo contienen iconos.",
  '<InputGroup><InputGroupAddon>@</InputGroupAddon><Input aria-label="Usuario" placeholder="usuario" /><InputGroupAddon><InputGroupButton aria-label="Buscar usuario">Buscar</InputGroupButton></InputGroupAddon></InputGroup>',
  { exports: ["InputGroup", "InputGroupAddon", "InputGroupButton"] },
);
add(
  "InputOTP",
  "Formularios",
  "Un código de verificación, dividido en posiciones.",
  "Define maxLength y una posición index para cada slot. El servidor debe validar el código; el componente solo recoge la entrada.",
  '<InputOTP maxLength={6} aria-label="Código de verificación"><InputOTPGroup>{[0,1,2,3,4,5].map(index => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup></InputOTP>',
  {
    exports: ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
  },
);
add(
  "Checkbox",
  "Formularios",
  "Una elección independiente o parte de una selección múltiple.",
  "Usa checked y onCheckedChange para controlarlo desde React. El valor también puede ser indeterminate en una selección parcial.",
  row(
    '<Checkbox id="terms" defaultChecked /><Label htmlFor="terms">Acepto las condiciones</Label>',
  ),
);
add(
  "Switch",
  "Formularios",
  "Activa o desactiva una preferencia inmediatamente.",
  "Reserva Switch para configuraciones binarias. En modo controlado conecta checked y onCheckedChange, sin esperar al envío de un formulario.",
  row(
    '<Switch id="notifications" defaultChecked /><Label htmlFor="notifications">Recibir notificaciones</Label>',
  ),
  {
    stories: [
      {
        name: "Controlado",
        code: 'function Example() {\n const [enabled, setEnabled] = useState(true);\n return <div style={{display: "flex", gap: 12, alignItems: "center"}}><Switch aria-label="Notificaciones" checked={enabled} onCheckedChange={setEnabled} /><span>{enabled ? "Activadas" : "Desactivadas"}</span></div>;\n}',
      },
    ],
  },
);
add(
  "RadioGroup",
  "Formularios",
  "Una única elección entre varias alternativas.",
  "Cada RadioGroupItem necesita un value distinto y una etiqueta. El grupo comparte el estado mediante value y onValueChange.",
  '<RadioGroup defaultValue="pro" aria-label="Plan"><div style={{display:"flex",gap:8}}><RadioGroupItem value="starter" id="starter" /><Label htmlFor="starter">Starter</Label></div><div style={{display:"flex",gap:8}}><RadioGroupItem value="pro" id="pro" /><Label htmlFor="pro">Pro</Label></div></RadioGroup>',
  { exports: ["RadioGroup", "RadioGroupItem"] },
);
add(
  "Select",
  "Formularios",
  "Selección con búsqueda, grupos, carga asíncrona y creación de opciones.",
  "La API usa options con objetos label/value y onChange recibe el objeto seleccionado. loadOptions activa la carga asíncrona; isCreatable permite crear opciones y puede combinarse con loadOptions. Usa defaultOptions para cargar al inicio y cacheOptions para reutilizar búsquedas. No compongas SelectItem como si fuera un Select de Radix: los exports de compatibilidad son elementos HTML.",
  '<Select aria-label="Framework" placeholder="Elige tu framework" options={[{value:"next",label:"Next.js"},{value:"react",label:"React"},{value:"native",label:"React Native"}]} />',
  {
    exports: [
      "Select",
      "SelectTrigger",
      "SelectValue",
      "SelectContent",
      "SelectGroup",
      "SelectLabel",
      "SelectItem",
      "SelectSeparator",
      "SelectScrollDownButton",
      "SelectScrollUpButton",
    ],
    stories: [
      {
        name: "Carga asíncrona",
        code: '<Select aria-label="Buscar framework" defaultOptions cacheOptions loadOptions={async (query) => [{value:"next",label:"Next.js"},{value:"react",label:"React"}].filter(option => option.label.toLowerCase().includes(query.toLowerCase()))} />',
      },
      {
        name: "Crear opciones",
        code: '<Select isCreatable aria-label="Etiquetas" isMulti placeholder="Selecciona o crea…" options={[{value:"design",label:"Diseño"},{value:"dev",label:"Desarrollo"}]} />',
      },
      {
        name: "Carga y creación",
        code: '<Select isCreatable isMulti aria-label="Buscar o crear" defaultOptions loadOptions={async (query) => [{value:"react",label:"React"}].filter(option => option.label.toLowerCase().includes(query.toLowerCase()))} />',
      },
      {
        name: "Selección múltiple",
        code: '<Select aria-label="Tecnologías" isMulti options={[{value:"ts",label:"TypeScript"},{value:"react",label:"React"},{value:"css",label:"CSS"}]} />',
      },
    ],
  },
);
add(
  "Slider",
  "Formularios",
  "Ajusta un valor o un intervalo con precisión.",
  "value y defaultValue son arrays. Usa min, max y step para establecer el rango permitido; añade una etiqueta accesible.",
  '<Slider aria-label="Volumen" defaultValue={[65]} min={0} max={100} step={5} showValue style={{width:280}} />',
  {
    stories: [
      {
        name: "Intervalo",
        code: '<Slider aria-label="Rango de precio" defaultValue={[25,75]} min={0} max={100} showValue style={{width:280}} />',
      },
    ],
  },
);
add(
  "Calendar",
  "Formularios",
  "Selección de fechas con una vista de calendario.",
  'Se basa en DayPicker. Combina mode="single" con selected y onSelect; para rangos utiliza mode="range".',
  'function Example() {\n const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 9));\n return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 8, 1)} />;\n}',
);
add(
  "DatePicker",
  "Formularios",
  "Un selector de fecha compacto con calendario desplegable.",
  "Usa value y onValueChange para integrarlo en un formulario. mode permite fecha, rango, mes o año; withTime añade la hora.",
  '<DatePicker placeholder="Elige una fecha" mode="single" localeCode="es" />',
  {
    stories: [
      {
        name: "Con hora",
        code: '<DatePicker placeholder="Fecha y hora" withTime timeFormat="24h" localeCode="es" />',
      },
    ],
  },
);
add(
  "Toggle",
  "Formularios",
  "Un botón con estado pulsado.",
  "Usa pressed y onPressedChange para herramientas de formato o preferencias. El texto o aria-label debe explicar la acción.",
  '<Toggle aria-label="Negrita" variant="outline">B</Toggle>',
);
add(
  "ToggleGroup",
  "Formularios",
  "Una barra de opciones de selección simple o múltiple.",
  'Define type="single" o type="multiple". Cada ToggleGroupItem debe tener un value estable.',
  '<ToggleGroup type="single" defaultValue="left" aria-label="Alineación"><ToggleGroupItem value="left">Izquierda</ToggleGroupItem><ToggleGroupItem value="center">Centro</ToggleGroupItem><ToggleGroupItem value="right">Derecha</ToggleGroupItem></ToggleGroup>',
  { exports: ["ToggleGroup", "ToggleGroupItem"] },
);
add(
  "Questionnaire",
  "Formularios",
  "Preguntas secuenciales con respuestas estructuradas.",
  "Define un id único por pregunta y procesa onComplete. Admite single, multiple y freeform; indica optional cuando no sea obligatoria.",
  'function Example() {\n const [done, setDone] = useState(false);\n return done ? <Alert><AlertTitle>¡Gracias!</AlertTitle><AlertDescription>Respuestas recibidas en esta demo.</AlertDescription></Alert> : <Questionnaire questions={[{id:"role",title:"¿Qué estás creando?",type:"single",options:[{label:"Una web",value:"web"},{label:"Una app",value:"app"}]},{id:"idea",title:"Cuéntanos tu idea",type:"freeform",optional:true}]} onComplete={() => setDone(true)} />;\n}',
);
add(
  "Accordion",
  "Navegación",
  "Contenido que se despliega cuando hace falta.",
  'Usa type="single" para abrir un elemento o multiple para varios. Cada AccordionItem requiere un value único.',
  '<Accordion type="single" collapsible style={{width:360}}><AccordionItem value="one"><AccordionTrigger>¿Qué es Kivora?</AccordionTrigger><AccordionContent>Componentes para crear tu próxima interfaz.</AccordionContent></AccordionItem><AccordionItem value="two"><AccordionTrigger>¿Puedo personalizar los colores?</AccordionTrigger><AccordionContent>Sí. Utiliza las variables semánticas del tema.</AccordionContent></AccordionItem></Accordion>',
  {
    exports: [
      "Accordion",
      "AccordionItem",
      "AccordionTrigger",
      "AccordionContent",
    ],
  },
);
add(
  "Tabs",
  "Navegación",
  "Vistas relacionadas dentro del mismo contexto.",
  "Relaciona cada TabsTrigger y TabsContent con el mismo value. Usa pestañas para cambiar contenido, no para sustituir enlaces a otras páginas.",
  '<Tabs defaultValue="account" style={{width:360}}><TabsList><TabsTrigger value="account">Cuenta</TabsTrigger><TabsTrigger value="team">Equipo</TabsTrigger></TabsList><TabsContent value="account">Tu espacio personal.</TabsContent><TabsContent value="team">Las personas detrás de la idea.</TabsContent></Tabs>',
  { exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"] },
);
add(
  "Breadcrumb",
  "Navegación",
  "Muestra el camino hasta la página actual.",
  "Usa enlaces en los niveles anteriores y BreadcrumbPage para la ubicación actual. Mantén los separadores decorativos.",
  '<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">Inicio</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="/docs">Documentación</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Componentes</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>',
  {
    exports: [
      "Breadcrumb",
      "BreadcrumbList",
      "BreadcrumbItem",
      "BreadcrumbLink",
      "BreadcrumbPage",
      "BreadcrumbSeparator",
      "BreadcrumbEllipsis",
    ],
  },
);
add(
  "NavigationMenu",
  "Navegación",
  "Navegación principal con contenido desplegable.",
  "Usa NavigationMenuLink para destinos y Trigger con Content para grupos. Conserva nombres claros y navegación por teclado.",
  '<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="/docs">Documentación</NavigationMenuLink></NavigationMenuItem><NavigationMenuItem><NavigationMenuTrigger>Explorar</NavigationMenuTrigger><NavigationMenuContent><NavigationMenuLink href="/docs/componentes/button" style={{display:"block",padding:24}}>Button →</NavigationMenuLink></NavigationMenuContent></NavigationMenuItem></NavigationMenuList></NavigationMenu>',
  {
    exports: [
      "NavigationMenu",
      "NavigationMenuList",
      "NavigationMenuItem",
      "NavigationMenuLink",
      "NavigationMenuTrigger",
      "NavigationMenuContent",
      "NavigationMenuIndicator",
      "NavigationMenuViewport",
    ],
  },
);
add(
  "Pagination",
  "Navegación",
  "Navega por conjuntos de resultados divididos en páginas.",
  "Mantén el estado de página en tu aplicación y conecta los eventos. Marca el enlace actual con isActive.",
  'function Example() {\n const [page, setPage] = useState(1);\n return <Pagination><PaginationContent>{[1,2,3].map(value => <PaginationItem key={value}><PaginationLink href="#" isActive={page === value} onClick={event => {event.preventDefault();setPage(value)}}>{value}</PaginationLink></PaginationItem>)}</PaginationContent></Pagination>;\n}',
  {
    exports: [
      "Pagination",
      "PaginationContent",
      "PaginationItem",
      "PaginationLink",
      "PaginationButton",
      "PaginationPrevious",
      "PaginationNext",
      "PaginationEllipsis",
    ],
  },
);
add(
  "Command",
  "Navegación",
  "Una lista de acciones que se filtra al escribir.",
  "Define value en cada acción y maneja onSelect. CommandDialog permite presentar el buscador en un diálogo.",
  '<Command style={{width:360}}><CommandInput placeholder="Busca una acción…" /><CommandList><CommandEmpty>Sin resultados.</CommandEmpty><CommandGroup heading="Acciones"><CommandItem value="proyecto">Crear proyecto</CommandItem><CommandItem value="equipo">Invitar al equipo</CommandItem></CommandGroup></CommandList></Command>',
  {
    exports: [
      "Command",
      "CommandDialog",
      "CommandInput",
      "CommandList",
      "CommandEmpty",
      "CommandGroup",
      "CommandItem",
      "CommandSeparator",
      "CommandShortcut",
    ],
  },
);
for (const [name, label] of [
  ["Dialog", "Abrir diálogo"],
  ["Sheet", "Abrir panel"],
  ["Drawer", "Abrir drawer"],
] as const) {
  add(
    name,
    "Paneles y menús",
    name === "Dialog"
      ? "Una conversación enfocada sobre la interfaz."
      : name === "Sheet"
        ? "Un panel lateral para tareas que necesitan contexto."
        : "Un panel deslizante para contenido complementario.",
    "Incluye siempre Title y Description. El trigger abre el panel, Escape lo cierra y el foco vuelve al control de origen. Puedes gestionar open y onOpenChange.",
    `<${name}><${name}Trigger asChild><Button>${label}</Button></${name}Trigger><${name}Content><${name}Header><${name}Title>Un espacio para tu idea</${name}Title><${name}Description>Revisa los detalles antes de continuar.</${name}Description></${name}Header><div style={{padding:"24px 0"}}><Input aria-label="Nombre del proyecto" placeholder="Nombre del proyecto" /></div><${name}Footer><${name}Close asChild><Button>Listo</Button></${name}Close></${name}Footer></${name}Content></${name}>`,
    {
      exports: [
        name,
        ...[
          "Trigger",
          "Content",
          "Header",
          "Title",
          "Description",
          "Footer",
          "Close",
          "Overlay",
          "Portal",
        ].map((part) => `${name}${part}`),
      ],
    },
  );
}
add(
  "Popover",
  "Paneles y menús",
  "Información o controles al lado de su activador.",
  "Usa Popover para contenido interactivo breve. Content admite alineación y separación respecto al trigger.",
  '<Popover><PopoverTrigger asChild><Button variant="outline">Preferencias</Button></PopoverTrigger><PopoverContent><Label htmlFor="popover-name">Nombre visible</Label><Input id="popover-name" defaultValue="Mi proyecto" /></PopoverContent></Popover>',
  {
    exports: [
      "Popover",
      "PopoverTrigger",
      "PopoverContent",
      "PopoverAnchor",
      "PopoverClose",
    ],
  },
);
add(
  "Tooltip",
  "Paneles y menús",
  "Una explicación breve para un control.",
  "Monta TooltipProvider alrededor de los tooltips. Evita incluir controles interactivos; para eso utiliza Popover.",
  '<TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline" aria-label="Añadir proyecto">+</Button></TooltipTrigger><TooltipContent>Crear un nuevo proyecto</TooltipContent></Tooltip></TooltipProvider>',
  {
    exports: ["Tooltip", "TooltipProvider", "TooltipTrigger", "TooltipContent"],
  },
);
add(
  "HoverCard",
  "Paneles y menús",
  "Una vista previa contextual al pasar el cursor o enfocar.",
  "El contenido es complementario: la información esencial debe estar disponible también en el destino enlazado.",
  '<HoverCard><HoverCardTrigger asChild><a href="/docs" style={{color:"var(--color-primary)"}}>@kivora</a></HoverCardTrigger><HoverCardContent>Componentes para la web y tu próxima gran idea.</HoverCardContent></HoverCard>',
  { exports: ["HoverCard", "HoverCardTrigger", "HoverCardContent"] },
);
for (const name of ["Menu", "ContextMenu"]) {
  const root = `<${name}>`;
  const close = `</${name}>`;
  const trigger =
    name === "ContextMenu"
      ? '<ContextMenuTrigger style={{display:"block",padding:36,border:"1px dashed var(--color-border)",borderRadius:12}}>Haz clic derecho aquí</ContextMenuTrigger>'
      : '<MenuTrigger asChild><Button variant="outline">Acciones</Button></MenuTrigger>';
  add(
    name,
    "Paneles y menús",
    name === "ContextMenu"
      ? "Acciones contextuales con clic derecho."
      : "Menú de acciones desplegable o barra de menús.",
    "Conecta onSelect en los elementos de acción. Puedes combinar separadores, grupos, opciones de checkbox y submenús.",
    `${root}${trigger}<${name}Content><${name}Item onSelect={() => window.alert("Nuevo proyecto de ejemplo")}>Nuevo proyecto</${name}Item><${name}Separator /><${name}Item disabled>Exportar (no disponible)</${name}Item></${name}Content>${close}`,
    {
      stories: name === "Menu" ? [{ name: "Barra de menús", code: '<Menu variant="bar"><MenuDropdown><MenuTrigger>Archivo</MenuTrigger><MenuContent><MenuItem>Nuevo</MenuItem><MenuItem>Abrir</MenuItem></MenuContent></MenuDropdown><MenuDropdown><MenuTrigger>Editar</MenuTrigger><MenuContent><MenuItem>Copiar</MenuItem><MenuItem>Pegar</MenuItem></MenuContent></MenuDropdown></Menu>' }] : [],
      exports: [
        name,
        ...[
          "Trigger",
          "Content",
          "Item",
          "Group",
          "Label",
          "Separator",
          "CheckboxItem",
          "RadioGroup",
          "RadioItem",
          "Sub",
          "SubTrigger",
          "SubContent",
          "Shortcut",
          "Portal",
          ...(name === "Menu" ? ["Dropdown"] : []),
        ].map((part) => `${name}${part}`),
      ],
    },
  );
}
add(
  "Table",
  "Datos",
  "Tablas semánticas con una presentación consistente.",
  "Usa TableHead para encabezados y TableCaption para explicar el conjunto. Para ordenar, filtrar y paginar, utiliza DataTable.",
  "<Table><TableCaption>Tu equipo</TableCaption><TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Rol</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Sofía Martín</TableCell><TableCell>Diseño</TableCell></TableRow><TableRow><TableCell>Lucas García</TableCell><TableCell>Desarrollo</TableCell></TableRow></TableBody></Table>",
  {
    exports: [
      "Table",
      "TableHeader",
      "TableBody",
      "TableFooter",
      "TableRow",
      "TableHead",
      "TableCell",
      "TableCaption",
    ],
  },
);
add(
  "DataTable",
  "Datos",
  "Datos con búsqueda, ordenación, selección y paginación.",
  "Define columns con accessorKey y header, y pasa data como array. Las columnas usan LegacyColumnDef de la versión de TanStack incluida en Kivora.",
  '<DataTable columns={[{accessorKey:"name",header:"Nombre"},{accessorKey:"role",header:"Rol"}]} data={[{name:"Sofía Martín",role:"Diseño"},{name:"Lucas García",role:"Desarrollo"},{name:"Emma Wilson",role:"Producto"}]} searchable paginated pageSize={2} />',
);
add(
  "Chart",
  "Datos",
  "Gráficos de Recharts con colores y tooltips de Kivora.",
  "ChartContainer proporciona el contexto visual; configura las series con label y color. Dale una altura explícita al gráfico.",
  '<ChartContainer config={{visits:{label:"Visitas",color:"#6558e8"}}} style={{width:"100%",height:240}}><BarChart data={[{day:"L",visits:120},{day:"M",visits:180},{day:"X",visits:145},{day:"J",visits:240},{day:"V",visits:310}]}><XAxis dataKey="day" /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="visits" fill="var(--color-visits)" radius={6} /></BarChart></ChartContainer>',
  {
    exports: [
      "ChartContainer",
      "ChartTooltip",
      "ChartTooltipContent",
      "ChartLegend",
    ],
    note: "BarChart, Bar y XAxis pertenecen a recharts. Instala recharts como dependencia directa si los importas en tu aplicación.",
  },
);
add(
  "Progress",
  "Feedback",
  "Muestra cuánto se ha completado de una tarea.",
  "Usa value de 0 a max. El progreso debe representar datos reales; no lo utilices como un temporizador ficticio.",
  '<Progress value={65} max={100} aria-label="Progreso del proyecto" style={{width:320}} />',
);
add(
  "Alert",
  "Feedback",
  "Mensajes de información, éxito, advertencia o error.",
  "Combina AlertTitle con AlertDescription. Elige la variante por su significado y añade instrucciones si el usuario debe actuar.",
  '<Alert variant="success"><AlertTitle>Todo listo</AlertTitle><AlertDescription>Los cambios se han guardado correctamente.</AlertDescription></Alert>',
  {
    exports: ["Alert", "AlertTitle", "AlertDescription"],
    stories: [
      {
        name: "Advertencia",
        code: '<Alert variant="warning"><AlertTitle>Revisa tu información</AlertTitle><AlertDescription>Completa los campos obligatorios.</AlertDescription></Alert>',
      },
    ],
  },
);
add(
  "Empty",
  "Feedback",
  "Da contexto cuando todavía no hay contenido.",
  "Explica por qué está vacío y ofrece una acción útil. Usa un mensaje diferente para ausencia de datos y ausencia de resultados de búsqueda.",
  "<Empty><EmptyHeader><EmptyTitle>Todo empieza aquí</EmptyTitle><EmptyDescription>Aún no tienes proyectos.</EmptyDescription></EmptyHeader><EmptyContent><Button>Crear mi primer proyecto</Button></EmptyContent></Empty>",
  {
    exports: [
      "Empty",
      "EmptyHeader",
      "EmptyIcon",
      "EmptyTitle",
      "EmptyDescription",
      "EmptyContent",
      "EmptyFooter",
    ],
  },
);
add(
  "Skeleton",
  "Feedback",
  "Reserva espacio mientras llega el contenido.",
  "Imita la estructura aproximada del resultado para reducir saltos de diseño. Respeta la preferencia de movimiento del usuario.",
  stack(
    '<Skeleton style={{height:24,width:"60%"}} /><Skeleton style={{height:14}} /><Skeleton style={{height:14,width:"80%"}} />',
  ),
);
add(
  "Spinner",
  "Feedback",
  "Un indicador para operaciones en curso.",
  "Usa label para describir qué se está cargando. Cambia size y variant según el espacio disponible.",
  '<Spinner size="lg" variant="primary" label="Cargando proyecto" />',
);
add(
  "Toaster",
  "Feedback",
  "Notificaciones breves que acompañan una acción.",
  "Monta un solo Toaster en tu aplicación y llama a toast desde los eventos. No uses los toasts como único lugar para errores que requieren corrección.",
  '<><Toaster /><Button onClick={() => toast.success("Proyecto guardado")}>Mostrar notificación</Button></>',
  { exports: ["Toaster"] },
);
add(
  "Item",
  "Contenido",
  "Una fila de contenido con texto, iconos y acciones.",
  "Compón ItemMedia, ItemContent y ItemActions para listas. ItemGroup permite agrupar elementos relacionados.",
  '<Item variant="outline"><ItemContent><ItemTitle>Diseño de la web</ItemTitle><ItemDescription>Actualizado hace un momento.</ItemDescription></ItemContent><ItemActions><Badge variant="secondary">En curso</Badge></ItemActions></Item>',
  {
    exports: [
      "Item",
      "ItemGroup",
      "ItemHeader",
      "ItemMedia",
      "ItemContent",
      "ItemTitle",
      "ItemDescription",
      "ItemActions",
      "ItemFooter",
    ],
  },
);
add(
  "Attachment",
  "Contenido",
  "Un archivo con descripción, acciones y progreso.",
  "El componente representa el archivo; no realiza subidas. Utiliza FileUpload si necesitas transferir datos.",
  "<Attachment><AttachmentContent><AttachmentTitle>brand-guidelines.pdf</AttachmentTitle><AttachmentDescription>PDF · 2,4 MB</AttachmentDescription></AttachmentContent><AttachmentActions><Badge>Listo</Badge></AttachmentActions></Attachment>",
  {
    exports: [
      "Attachment",
      "AttachmentContent",
      "AttachmentTitle",
      "AttachmentDescription",
      "AttachmentMedia",
      "AttachmentActions",
      "AttachmentProgress",
    ],
  },
);
add(
  "Bubble",
  "Contenido",
  "Una burbuja visual para mensajes y fragmentos breves.",
  "Utiliza variant para distinguir mensajes y deja el estado de la conversación en la aplicación.",
  '<Bubble variant="primary"><BubbleContent>Tu próxima idea empieza aquí.</BubbleContent></Bubble>',
  { exports: ["Bubble", "BubbleContent"] },
);
add(
  "Message",
  "Contenido",
  "Estructura para conversaciones con autor, cuerpo y estado.",
  "Usa align para distinguir emisor y receptor. MessageScroller puede seguir los mensajes nuevos cuando follow está activado.",
  '<MessageGroup><Message align="start"><MessageContent><MessageHeader>Sofía</MessageHeader><Bubble><BubbleContent>¿Le damos forma a esta idea?</BubbleContent></Bubble><MessageFooter>09:41</MessageFooter></MessageContent></Message></MessageGroup>',
  {
    exports: [
      "Message",
      "MessageGroup",
      "MessageAvatar",
      "MessageContent",
      "MessageHeader",
      "MessageFooter",
      "MessageScroller",
    ],
  },
);
add(
  "Marker",
  "Contenido",
  "Un marcador para resaltar una nota o una característica.",
  "Combina MarkerIcon y MarkerContent. Utiliza variantes para adaptar el borde o la separación al contexto.",
  '<Marker variant="border"><MarkerIcon>✦</MarkerIcon><MarkerContent>Hecho con Kivora</MarkerContent></Marker>',
  { exports: ["Marker", "MarkerIcon", "MarkerContent"] },
);
add(
  "Carousel",
  "Contenido",
  "Contenido que se recorre diapositiva a diapositiva.",
  "Las opciones son de react-slick. Usa settings u opts y monta controles para que no dependa de gestos o reproducción automática.",
  '<Carousel style={{width:320}} settings={{dots:true,infinite:false}}><CarouselContent>{["Una idea", "Un equipo", "Un proyecto"].map(title => <CarouselItem key={title}><Card style={{padding:48,textAlign:"center"}}>{title}</Card></CarouselItem>)}</CarouselContent><CarouselControls><CarouselPrevious aria-label="Anterior" /><CarouselNext aria-label="Siguiente" /></CarouselControls></Carousel>',
  {
    exports: [
      "Carousel",
      "CarouselContent",
      "CarouselItem",
      "CarouselControls",
      "CarouselPrevious",
      "CarouselNext",
      "CarouselPlay",
      "CarouselPause",
    ],
  },
);
add(
  "ScrollArea",
  "Layout",
  "Una región de desplazamiento con estilo consistente.",
  "Establece una altura para el área y asegúrate de que su propósito sea claro. El contenido continúa siendo accesible por teclado. virtualized activa listas grandes: items, renderItem y estimateSize en web; data y renderItem de FlatList en native.",
  '<ScrollArea style={{height:180,width:320}}>{Array.from({length:15}, (_,i) => <p key={i} style={{padding:12,borderBottom:"1px solid var(--color-border)"}}>Proyecto {i + 1}</p>)}</ScrollArea>',
  { exports: ["ScrollArea", "ScrollBar"], stories: [{ name: "Lista virtualizada", code: '<ScrollArea virtualized style={{height:220,width:320}} items={Array.from({length:1000}, (_,i) => `Proyecto ${i + 1}`)} estimateSize={() => 44} renderItem={item => <div style={{padding:12}}>{item}</div>} />' }] },
);
add(
  "Resizable",
  "Layout",
  "Paneles cuyo tamaño puede ajustar el usuario.",
  "Define direction en el grupo y límites minSize/maxSize en los paneles. ResizableHandle incluye interacción por teclado.",
  '<ResizablePanelGroup direction="horizontal" style={{height:200,width:380,border:"1px solid var(--color-border)",borderRadius:8}}><ResizablePanel defaultSize={40} minSize={20}><div style={{padding:20}}>Navegación</div></ResizablePanel><ResizableHandle withHandle /><ResizablePanel minSize={20}><div style={{padding:20}}>Tu espacio de trabajo</div></ResizablePanel></ResizablePanelGroup>',
  { exports: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"] },
);
add(
  "Barcode",
  "Multimedia",
  "Códigos de barras y QR en un único componente.",
  "format define la codificación. EAN y UPC necesitan valores y dígitos de control válidos. onError y fallback permiten gestionar entradas incorrectas.",
  '<Barcode value="KIVORA-2026" format="code128" width={280} displayValue />',
  {
    stories: [
      { name: "Código QR", code: '<Barcode format="qrcode" value="https://kivora.pro" width={180} height={180} />' },
      {
        name: "EAN-13",
        code: '<Barcode value="5901234123457" format="ean13" width={280} displayValue />',
      },
    ],
  },
);
add(
  "Player",
  "Multimedia",
  "Vídeo y audio con controles, pistas y reproducción adaptativa.",
  "Pasa source con id y src. Usa una URL de medios compatible, con CORS cuando corresponda. Los controles y las funciones avanzadas se configuran con props.",
  '<Player source={{id:"demo",src:"/truck.mp4",type:"video",title:"Kivora · En movimiento"}} style={{width:"100%",maxWidth:520}} />',
  {
    note: "La demo usa un vídeo local del sitio. DRM requiere un servidor de licencias; las fuentes HLS/DASH, anuncios y descargas dependen de la configuración del servicio y del navegador.",
  },
);
add(
  "FileUpload",
  "Multimedia",
  "Selección de archivos y transferencias con progreso.",
  "Crea un UploadController estable y libera sus recursos al desmontar. El modo simple permite un transporte propio; advanced usa un endpoint Tus y confirma las subidas desde el dashboard.",
  "function Example() {\n const [controller] = useState(() => new UploadController({\n   endpoint: \"/api/uploads\",\n   autoStart: false\n }));\n useEffect(() => () => { void controller.dispose(); }, [controller]);\n return <div><Toaster /><FileUpload variant=\"advanced\" controller={controller} locale=\"es\" /><p style={{fontSize:12,marginTop:16}}>Selecciona, edita y elimina archivos localmente. Para subirlos, conecta un endpoint Tus en /api/uploads.</p></div>;\n}",
  {
    exports: ["FileUpload", "FileUploadStatus"],
    note: "Abrir el modal, seleccionar, editar y eliminar archivos no requiere servidor. El modo advanced no admite createTask: utiliza el transporte Tus y solo inicia la transferencia al pulsar Subir. /api/uploads es una ruta de ejemplo, no un servidor configurado. Las fuentes remotas requieren Companion y sus credenciales de servidor.",
  },
);
add(
  "KivoraProvider",
  "Configuración",
  "Contexto de tema y modo de color para tu aplicación.",
  "Móntalo en un Client Component del layout. colorMode actualiza la clase dark del documento. themeOverrides modifica el objeto del contexto; los colores CSS se personalizan con variables.",
  '<div><Badge variant="secondary">Tema compartido</Badge><p style={{marginTop:16}}>Este playground ya está dentro de KivoraProvider. Cambia el tema desde los controles superiores.</p></div>',
  {
    note: "El provider ya está montado en esta documentación. Evita anidar providers con modos de color distintos: ambos actualizan la clase dark del documento.",
  },
);
add(
  "DirectionProvider",
  "Configuración",
  "Dirección de lectura compartida para interfaces LTR y RTL.",
  'Usa dir="rtl" para idiomas de derecha a izquierda. El contenido debe estar traducido por tu aplicación.',
  '<DirectionProvider dir="rtl"><div dir="rtl" style={{width:320}}><Button>مرحبا</Button><p style={{marginTop:12}}>واجهة من اليمين إلى اليسار</p></div></DirectionProvider>',
);
add(
  "AudioPlayerProvider",
  "Configuración",
  "Mantén una sesión de audio entre cambios de página.",
  "Móntalo en un layout persistente. useAudioPlayer devuelve play y close para controlar la sesión desde los descendientes.",
  'function Example() {\n function Controls() {\n const { close } = useAudioPlayer();\n return <Button variant="outline" onClick={close}>Cerrar sesión de audio</Button>;\n }\n return <AudioPlayerProvider><Controls /></AudioPlayerProvider>;\n}',
  {
    note: 'Para iniciar audio, llama a play({ id: "track", src: "/audio.mp3", type: "audio", title: "Mi pista" }) con un archivo existente. El provider debe vivir por encima de las páginas que comparten reproducción.',
  },
);
export { components };
export const groups = [
  ...new Set(components.map((component) => component.group)),
];
export const guides = [
{
  "slug": "agentes",
  "name": "Uso con agentes",
  "description": "Instala la skill de Kivora y comparte sus instrucciones con tu agente.",
  "icon": "terminal"
},
  {
    slug: "introduccion",
    name: "Introducción",
    description: "Conoce las piezas y todo lo que puedes construir.",
    icon: "sparkles",
  },
  {
    slug: "instalacion",
    name: "Instalación",
    description: "Instalación asistida o manual en React con Next.js.",
    icon: "terminal",
  },
  {
    slug: "inicializador",
    name: "Asistente @kivora/init",
    description: "Un comando para configurar Kivora en Next.js o React Native.",
    icon: "terminal",
  },
  {
    slug: "instalacion-react",
    name: "Instalación React web",
    description: "Usa los componentes web en una aplicación React sin Next.js.",
    icon: "terminal",
  },
  {
    slug: "instalacion-react-native",
    name: "Instalación React Native",
    description: "Configura la biblioteca nativa, sus providers y dependencias.",
    icon: "devices",
  },
  {
    slug: "temas",
    name: "Temas y colores",
    description: "La misma base. Toda tu personalidad.",
    icon: "palette",
  },
  {
    slug: "composicion",
    name: "Composición y estado",
    description: "Conecta componentes, datos y comportamiento.",
    icon: "layers",
  },
  {
    slug: "accesibilidad",
    name: "Accesibilidad",
    description: "Interfaces que se pueden usar de más formas.",
    icon: "accessibility",
  },
  {
    slug: "multiplataforma",
    name: "Web y React Native",
    description: "Un lenguaje visual para distintas plataformas.",
    icon: "devices",
  },
];
export const componentHref = (component: ComponentDoc) =>
  `/docs/componentes/${component.slug}`;
