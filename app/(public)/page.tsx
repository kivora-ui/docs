"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Input,
  Switch,
} from "@kivora/nextjs";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  Code2,
  Copy,
  Layers,
  Moon,
  Plus,
  ShoppingBag,
  Sparkles,
  Sun,
} from "lucide-react";
import styles from "./page.module.css";
import { TeamCard } from "./_components/team-card";

const examples = [
  {
    name: "Workspace",
    category: "Equipos que conectan",
    theme: "light",
    accent: "#6558e8",
  },
  {
    name: "Analytics",
    category: "Datos con otra perspectiva",
    theme: "dark",
    accent: "#a79bff",
  },
  {
    name: "Studio",
    category: "Un poco más de imaginación",
    theme: "candy",
    accent: "#a03872",
  },
  {
    name: "Commerce",
    category: "Ideas que se convierten en marcas",
    theme: "mint",
    accent: "#287c60",
  },
] as const;

function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`${styles.card} ${className}`}>
      <div className={styles.cardHeading}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </Card>
  );
}

function Person({
  name,
  role,
  index,
}: {
  name: string;
  role: string;
  index: number;
}) {
  return (
    <div className={styles.person}>
      <Avatar className={styles.avatar}>
        <AvatarFallback
          style={{
            background: ["#e8dbf5", "#dbeae1", "#f7ddcf", "#dce4fb"][index % 4],
            color: "#403b50",
          }}
        >
          {name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
      <span className={styles.online} role="img" aria-label="En línea" />
    </div>
  );
}

function Workspace() {
  const [frozen, setFrozen] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <TeamCard />
        <Panel
          title="A tu manera"
          description="Un espacio que se adapta a tu ritmo."
        >
          {[
            "Notificaciones por email",
            "Actividad de tu equipo",
            "Novedades de producto",
          ].map((label, index) => (
            <div className={styles.setting} key={label}>
              <span>{label}</span>
              <Switch aria-label={label} defaultChecked={index < 2} />
            </div>
          ))}
        </Panel>
      </div>
      <div className={styles.column}>
        <Panel
          title="Tu próxima gran idea"
          description="Empieza por un espacio para crear."
        >
          <Signup />
        </Panel>
        <Panel
          title="Todo bajo control"
          description="Una tarjeta. Todas las posibilidades."
        >
          <div className={styles.bankCard}>
            <span>
              kivora <Sparkles size={18} />
            </span>
            <div className={styles.chip} />
            <strong>4929 •••• •••• 1846</strong>
            <span>
              SOFÍA MARTÍN <span>08 / 28</span>
            </span>
          </div>
          <div className={styles.cardBottom}>
            <span>{frozen ? "Tarjeta pausada" : "Tarjeta virtual activa"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFrozen(!frozen)}
            >
              {frozen ? "Activar" : "Pausar"}
            </Button>
          </div>
        </Panel>
        <Card className={`${styles.card} ${styles.success}`}>
          <span className={styles.successIcon}>
            <CheckCheck size={22} />
          </span>
          <div>
            <strong>Todo listo para crear</strong>
            <p>Tu siguiente proyecto empieza aquí.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Signup() {
  const [created, setCreated] = useState(false);
  return (
    <form
      className={styles.signup}
      onSubmit={(event) => {
        event.preventDefault();
        setCreated(true);
      }}
    >
      <label>
        Email
        <Input type="email" placeholder="tu@ejemplo.com" required />
      </label>
      <label>
        Contraseña
        <Input
          type="password"
          placeholder="Al menos 8 caracteres"
          minLength={8}
          required
        />
      </label>
      <Button type="submit">
        {created ? (
          <>
            <Check size={16} /> Cuenta de ejemplo creada
          </>
        ) : (
          <>
            Crear cuenta <ArrowRight size={16} />
          </>
        )}
      </Button>
      <p aria-live="polite">
        {created
          ? "Ya puedes explorar tu nuevo espacio."
          : "Tu espacio de trabajo, a un clic."}
      </p>
    </form>
  );
}

function Analytics() {
  const [period, setPeriod] = useState("Semana");
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title="La visión completa"
          description="Cada número cuenta una historia."
        >
          <div className={styles.cardBottom}>
            <Badge variant="secondary">Ingresos totales</Badge>
            <div className={styles.period}>
              {["Semana", "Mes"].map((value) => (
                <button
                  key={value}
                  aria-pressed={period === value}
                  onClick={() => setPeriod(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.bigNumber}>
            {period === "Semana" ? "24.680" : "98.420"}
            <span> €</span>
          </div>
          <span className={styles.positive}>
            ↗ 18,6% respecto al periodo anterior
          </span>
          <div
            className={styles.chart}
            role="img"
            aria-label={`Ingresos por día, periodo: ${period}`}
          >
            {[35, 58, 42, 75, 61, 88, 100].map((height, index) => (
              <div key={index}>
                <i
                  style={{
                    height: `${period === "Semana" ? height : 110 - height / 2}%`,
                  }}
                />
                <span>{["L", "M", "X", "J", "V", "S", "D"][index]}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Objetivos del mes" description="Un paso más cerca.">
          {[
            ["Nuevas suscripciones", 78],
            ["Retención de clientes", 92],
            ["Conversión", 64],
          ].map(([label, value]) => (
            <div className={styles.goal} key={label}>
              <div>
                <span>{label}</span>
                <strong>{value}%</strong>
              </div>
              <progress
                aria-label={String(label)}
                value={Number(value)}
                max={100}
              />
            </div>
          ))}
        </Panel>
      </div>
      <div className={styles.column}>
        <Panel
          title="En este momento"
          description="Tu producto sigue creciendo."
        >
          <Badge variant="secondary">● En directo</Badge>
          <div className={styles.bigNumber}>1.284</div>
          <p className={styles.muted}>personas conectadas</p>
          <div className={styles.sparkline} aria-hidden="true">
            ▁ ▂ ▁ ▃ ▂ ▄ ▃ ▅ ▄ ▆ ▅ █
          </div>
        </Panel>
        <Panel
          title="Últimos movimientos"
          description="Pequeños hitos. Grandes resultados."
        >
          <Person
            name="Marta López"
            role="Se ha unido al plan Pro · hace 2 min"
            index={0}
          />
          <Person
            name="Alex Chen"
            role="Ha creado un proyecto · hace 8 min"
            index={1}
          />
          <Person
            name="Julia Romero"
            role="Ha invitado a su equipo · hace 12 min"
            index={2}
          />
        </Panel>
        <Panel title="Tu informe, cuando quieras">
          <ReportButton />
        </Panel>
      </div>
    </div>
  );
}

function ReportButton() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob(
            [
              "Métrica,Valor\nIngresos semanales,24680\nUsuarios activos,1284\nRetención,92%",
            ],
            { type: "text/csv;charset=utf-8" },
          ),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "kivora-informe-demo.csv";
        link.click();
        URL.revokeObjectURL(url);
      }}
    >
      <ArrowDown size={16} /> Descargar informe
    </Button>
  );
}

function Studio() {
  const [color, setColor] = useState("#ad4c85");
  const [saved, setSaved] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title="Haz espacio a lo inesperado"
          description="Moodboard / Colección 001"
        >
          <div className={styles.artwork} style={{ backgroundColor: color }}>
            <div />
            <div />
            <span>
              Make
              <br />
              something
              <br />
              <em>wonderful.</em>
            </span>
            <Sparkles size={30} />
          </div>
          <div className={styles.cardBottom}>
            <span>Un lienzo lleno de posibilidades.</span>
            <Badge variant="secondary">Creative</Badge>
          </div>
        </Panel>
        <Panel
          title="La paleta es tuya"
          description="Elige un color y dale otra vida."
        >
          <div className={styles.swatches}>
            {["#ad4c85", "#7251b5", "#dc7346", "#387d74", "#3e60ad"].map(
              (value) => (
                <button
                  key={value}
                  style={{ backgroundColor: value }}
                  aria-label={`Usar color ${value}`}
                  aria-pressed={color === value}
                  onClick={() => setColor(value)}
                >
                  {color === value && <Check size={20} />}
                </button>
              ),
            )}
          </div>
        </Panel>
      </div>
      <div className={styles.column}>
        <Panel
          title="Una idea en marcha"
          description="De la primera chispa al último detalle."
        >
          <Badge variant="secondary">En progreso</Badge>
          <h3 className={styles.projectTitle}>
            Identidad para
            <br />
            mentes inquietas.
          </h3>
          <div className={styles.goal}>
            <div>
              <span>Progreso del proyecto</span>
              <strong>68%</strong>
            </div>
            <progress value={68} max={100} aria-label="Progreso del proyecto" />
          </div>
          <Person name="Emma Wilson" role="Dirección creativa" index={2} />
          <Button onClick={() => setSaved(!saved)}>
            {saved ? <Check size={16} /> : <Plus size={16} />}
            {saved ? "Guardado en tu colección" : "Guardar en mi colección"}
          </Button>
        </Panel>
        <Panel
          title="Hecho para colaborar"
          description="Las ideas crecen cuando se comparten."
        >
          <Person
            name="Sofía Martín"
            role="«¡Esta dirección me encanta!»"
            index={0}
          />
          <Person
            name="Lucas García"
            role="«Listo para darle vida.»"
            index={1}
          />
        </Panel>
      </div>
    </div>
  );
}

function Commerce() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title="Menos ruido. Más música."
          description="La colección de tus días favoritos."
        >
          <div className={styles.productArt}>
            <div className={styles.headphones}>
              <i />
              <i />
            </div>
            <span>sound, reimagined.</span>
          </div>
          <div className={styles.cardBottom}>
            <div>
              <h3>Studio headphones</h3>
              <span>Salvia / Edición esencial</span>
            </div>
            <strong>129 €</strong>
          </div>
          <div className={styles.purchase}>
            <div className={styles.quantity}>
              <button
                aria-label="Reducir cantidad"
                disabled={quantity === 1}
                onClick={() => {
                  setQuantity(quantity - 1);
                  setAdded(false);
                }}
              >
                −
              </button>
              <output aria-label="Cantidad">{quantity}</output>
              <button
                aria-label="Aumentar cantidad"
                onClick={() => {
                  setQuantity(quantity + 1);
                  setAdded(false);
                }}
              >
                +
              </button>
            </div>
            <Button onClick={() => setAdded(true)}>
              <ShoppingBag size={16} />
              {added ? "Añadido" : "Añadir a la bolsa"}
            </Button>
          </div>
        </Panel>
        <Card className={`${styles.card} ${styles.success}`}>
          <span className={styles.successIcon}>
            <Check size={22} />
          </span>
          <div>
            <strong>Diseñado para durar</strong>
            <p>Buenos materiales. Mejores experiencias.</p>
          </div>
        </Card>
      </div>
      <div className={styles.column}>
        <Panel
          title="Tu bolsa"
          description="Una pequeña inversión en tus grandes momentos."
        >
          <Person
            name="Studio headphones"
            role={`${added ? quantity : 0} unidades · Salvia`}
            index={1}
          />
          <div className={styles.receipt}>
            <div>
              <span>Subtotal</span>
              <strong>{added ? quantity * 129 : 0} €</strong>
            </div>
            <div>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div>
              <strong>Total</strong>
              <strong>{added ? quantity * 129 : 0} €</strong>
            </div>
          </div>
          <p className={styles.muted} aria-live="polite">
            {added
              ? "Tu selección está lista. Esta es una tienda de ejemplo."
              : "Añade un producto para verlo aquí."}
          </p>
        </Panel>
        <Panel
          title="Los detalles importan"
          description="Una compra a tu medida."
        >
          <div className={styles.setting}>
            <span>Envolver para regalo</span>
            <Switch aria-label="Envolver para regalo" />
          </div>
          <div className={styles.setting}>
            <span>Recibir novedades</span>
            <Switch aria-label="Recibir novedades" defaultChecked />
          </div>
        </Panel>
      </div>
    </div>
  );
}

const scenes = [Workspace, Analytics, Studio, Commerce];

export default function MainPage() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStart = useRef<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const theme = dark ? "dark" : examples[active].theme;
  function move(index: number) {
    setActive((index + examples.length) % examples.length);
  }
  async function copyInstall() {
    try {
      await navigator.clipboard.writeText("npx @kivora/init");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <main className={`kivora-theme ${styles.page}`} data-theme={theme}>
      <div className={styles.backdrop} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Kivora, inicio">
          <span className={styles.brandMark}>
            <Layers size={23} strokeWidth={2.4} />
          </span>
          kivora
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link className={styles.navActive} href="/docs/componentes">
            Componentes
          </Link>
          <Link href="/docs">Documentación</Link>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.mobileDocs} href="/docs">
            Docs
          </Link>
          <a
            href="https://www.npmjs.com/package/@kivora/nextjs"
            target="_blank"
            rel="noreferrer"
            aria-label="Kivora en npm"
            title="Kivora en npm"
            className={styles.npmLink}
          >
            <svg width="32" height="14" viewBox="0 0 18 7" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M0 0v6h5v1h4V6h9V0H0z M1 1h4v4H4V2H3v3H1V1z M6 1h4v4H9v1H6V1z M7 2v2h1V2H7z M11 1h6v4h-1V2h-1v3h-1V2h-1v3h-2V1z" />
            </svg>
          </a>
          <button
            aria-label={dark ? "Usar tema del ejemplo" : "Activar tema oscuro"}
            aria-pressed={dark}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <section className={styles.hero}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <Link className={styles.release} href="/docs/multiplataforma">
              <span /> React + React Native <ArrowRight size={13} />
            </Link>
            <h1>
              <span className={styles.headlineLead}>Tu web y tu app.</span>
              <span>Mismo diseño.</span>
            </h1>
            <p className={styles.description}>
              Componentes para React y React Native con un mismo lenguaje
              visual. Lleva tu marca de la web al móvil sin rediseñar cada
              pantalla. Crea más rápido. Haz que todo encaje.
            </p>
            <div className={styles.code}>
              <div className={styles.codeHeader}>
                <span>
                  <Code2 size={14} /> Empieza a construir
                </span>
                <span>React / Next.js</span>
              </div>
              <pre>
                <code>
                  <span className={styles.syntax}>import</span>
                  {" { Button } "}
                  <span className={styles.syntax}>from</span>{" "}
                  <span className={styles.string}>{'"@kivora/nextjs"'}</span>
                  {";\n\n"}
                  <span className={styles.syntax}>{"<Button>"}</span>
                  {"Crear mi app"}
                  <span className={styles.syntax}>{"</Button>"}</span>
                </code>
              </pre>
            </div>
            <div className={styles.actions}>
              <Button className={styles.startButton} onClick={copyInstall}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Comando copiado" : "npx @kivora/init"}
              </Button>
              <Button variant="ghost" onClick={() => move(active + 1)}>
                Ver ejemplos <ArrowRight size={16} />
              </Button>
            </div>
            <p className={styles.footnote}>
              Una identidad. Todas tus pantallas.
            </p>
          </div>
          <div className={styles.sliderControls}>
            <div className={styles.sliderLabel}>
              <span>
                Pruébalo en directo <span className={styles.liveDot} />
              </span>
              <span className={styles.slideCount}>
                0{active + 1} <span>/ 04</span>
              </span>
            </div>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Ejemplos de Kivora"
            >
              {examples.map((example, index) => (
                <button
                  key={example.name}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  id={`example-tab-${index}`}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls={`example-panel-${index}`}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => move(index)}
                  onKeyDown={(event) => {
                    let next = index;
                    if (event.key === "ArrowRight") next = (index + 1) % 4;
                    else if (event.key === "ArrowLeft") next = (index + 3) % 4;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = 3;
                    else return;
                    event.preventDefault();
                    move(next);
                    tabs.current[next]?.focus();
                  }}
                >
                  <i style={{ background: example.accent }} />
                  <span>{example.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className={styles.showcase}
          role="region"
          aria-label="Galería de ejemplos"
          aria-roledescription="carrusel"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current !== null) {
              const delta =
                touchStart.current - event.changedTouches[0].clientX;
              if (Math.abs(delta) > 60) move(active + (delta > 0 ? 1 : -1));
            }
            touchStart.current = null;
          }}
        >
          <div className={styles.showcaseHeader}>
            <span>
              <span className={styles.previewDot} /> {examples[active].category}
            </span>
            <span className={styles.previewMeta}>
              HECHO CON KIVORA <Layers size={13} />
            </span>
          </div>
          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {scenes.map((Scene, index) => (
                <section
                  key={examples[index].name}
                  id={`example-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`example-tab-${index}`}
                  aria-hidden={index !== active}
                  inert={index !== active}
                  className={styles.slide}
                >
                  <Scene />
                </section>
              ))}
            </div>
          </div>
          <div className={styles.showcaseFooter}>
            <span>
              <span className={styles.themeDot} />{" "}
              {theme === "dark"
                ? "Dark"
                : theme === "light"
                  ? "Light"
                  : theme === "candy"
                    ? "Rose"
                    : "Sage"}{" "}
              theme <span className={styles.footerDivider}>/</span> Componentes
              reales. Pruébalos.
            </span>
            <div>
              <button
                aria-label="Ejemplo anterior"
                onClick={() => move(active - 1)}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                aria-label="Ejemplo siguiente"
                onClick={() => move(active + 1)}
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
