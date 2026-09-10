"use client";
import { useT } from "../../_lib/i18n/provider";

import { useState, type ReactNode } from "react";
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
  ArrowRight,
  Check,
  CheckCheck,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import styles from "../page.module.css";
import { TeamCard } from "./team-card";


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
  const t = useT();
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
      <span className={styles.online} role="img" aria-label={t("En línea")} />
    </div>
  );
}

export function Workspace() {
  const t = useT();
  const [frozen, setFrozen] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <TeamCard />
        <Panel
          title={t("A tu manera")}
          description={t("Un espacio que se adapta a tu ritmo.")}
        >
          {[
            t("Notificaciones por email"),
            t("Actividad de tu equipo"),
            t("Novedades de producto"),
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
          title={t("Tu próxima gran idea")}
          description={t("Empieza por un espacio para crear.")}
        >
          <Signup />
        </Panel>
        <Panel
          title={t("Todo bajo control")}
          description={t("Una tarjeta. Todas las posibilidades.")}
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
            <span>
              {frozen ? t("Tarjeta pausada") : t("Tarjeta virtual activa")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFrozen(!frozen)}
            >
              {frozen ? t("Activar") : t("Pausar")}
            </Button>
          </div>
        </Panel>
        <Card className={`${styles.card} ${styles.success}`}>
          <span className={styles.successIcon}>
            <CheckCheck size={22} />
          </span>
          <div>
            <strong>{t("Todo listo para crear")}</strong>
            <p>{t("Tu siguiente proyecto empieza aquí.")}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Signup() {
  const t = useT();
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
        <Input type="email" placeholder={t("tu@ejemplo.com")} required />
      </label>
      <label>
        {t("Contraseña")}
        <Input
          type="password"
          placeholder={t("Al menos 8 caracteres")}
          minLength={8}
          required
        />
      </label>
      <Button type="submit">
        {created ? (
          <>
            <Check size={16} /> {t("Cuenta de ejemplo creada")}
          </>
        ) : (
          <>
            {t("Crear cuenta")}
            <ArrowRight size={16} />
          </>
        )}
      </Button>
      <p aria-live="polite">
        {created
          ? t("Ya puedes explorar tu nuevo espacio.")
          : t("Tu espacio de trabajo, a un clic.")}
      </p>
    </form>
  );
}

export function Analytics() {
  const t = useT();
  const [period, setPeriod] = useState("Semana");
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title={t("La visión completa")}
          description={t("Cada número cuenta una historia.")}
        >
          <div className={styles.cardBottom}>
            <Badge variant="secondary">{t("Ingresos totales")}</Badge>
            <div className={styles.period}>
              {["Semana", "Mes"].map((value) => (
                <button
                  key={value}
                  aria-pressed={period === value}
                  onClick={() => setPeriod(value)}
                >
                  {t(value)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.bigNumber}>
            {period === "Semana" ? "24.680" : "98.420"}
            <span> €</span>
          </div>
          <span className={styles.positive}>
            {t("↗ 18,6% respecto al periodo anterior")}
          </span>
          <div
            className={styles.chart}
            role="img"
            aria-label={t("Ingresos por día, periodo: {0}", { 0: t(period) })}
          >
            {[35, 58, 42, 75, 61, 88, 100].map((height, index) => (
              <div key={index}>
                <i
                  style={{
                    height: `${period === "Semana" ? height : 110 - height / 2}%`,
                  }}
                />
                <span>
                  {
                    [t("L"), t("M"), t("X"), t("J"), t("V"), t("S"), t("D")][
                      index
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title={t("Objetivos del mes")}
          description={t("Un paso más cerca.")}
        >
          {[
            [t("Nuevas suscripciones"), 78],
            [t("Retención de clientes"), 92],
            [t("Conversión"), 64],
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
          title={t("En este momento")}
          description={t("Tu producto sigue creciendo.")}
        >
          <Badge variant="secondary">{t("● En directo")}</Badge>
          <div className={styles.bigNumber}>1.284</div>
          <p className={styles.muted}>personas conectadas</p>
          <div className={styles.sparkline} aria-hidden="true">
            ▁ ▂ ▁ ▃ ▂ ▄ ▃ ▅ ▄ ▆ ▅ █
          </div>
        </Panel>
        <Panel
          title={t("Últimos movimientos")}
          description={t("Pequeños hitos. Grandes resultados.")}
        >
          <Person
            name="Marta López"
            role={t("Se ha unido al plan Pro · hace 2 min")}
            index={0}
          />
          <Person
            name="Alex Chen"
            role={t("Ha creado un proyecto · hace 8 min")}
            index={1}
          />
          <Person
            name="Julia Romero"
            role={t("Ha invitado a su equipo · hace 12 min")}
            index={2}
          />
        </Panel>
        <Panel title={t("Tu informe, cuando quieras")}>
          <ReportButton />
        </Panel>
      </div>
    </div>
  );
}

function ReportButton() {
  const t = useT();
  return (
    <Button
      variant="outline"
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob(
            [
              t(
                "Métrica,Valor\nIngresos semanales,24680\nUsuarios activos,1284\nRetención,92%",
              ),
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
      <ArrowDown size={16} /> {t("Descargar informe")}
    </Button>
  );
}

export function Studio() {
  const t = useT();
  const [color, setColor] = useState("#ad4c85");
  const [saved, setSaved] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title={t("Haz espacio a lo inesperado")}
          description={t("Moodboard / Colección 001")}
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
            <span>{t("Un lienzo lleno de posibilidades.")}</span>
            <Badge variant="secondary">Creative</Badge>
          </div>
        </Panel>
        <Panel
          title={t("La paleta es tuya")}
          description={t("Elige un color y dale otra vida.")}
        >
          <div className={styles.swatches}>
            {["#ad4c85", "#7251b5", "#dc7346", "#387d74", "#3e60ad"].map(
              (value) => (
                <button
                  key={value}
                  style={{ backgroundColor: value }}
                  aria-label={t("Usar color {0}", { 0: value })}
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
          title={t("Una idea en marcha")}
          description={t("De la primera chispa al último detalle.")}
        >
          <Badge variant="secondary">{t("En progreso")}</Badge>
          <h3 className={styles.projectTitle}>
            {t("Identidad para")}
            <br />
            mentes inquietas.
          </h3>
          <div className={styles.goal}>
            <div>
              <span>{t("Progreso del proyecto")}</span>
              <strong>68%</strong>
            </div>
            <progress
              value={68}
              max={100}
              aria-label={t("Progreso del proyecto")}
            />
          </div>
          <Person name="Emma Wilson" role={t("Dirección creativa")} index={2} />
          <Button onClick={() => setSaved(!saved)}>
            {saved ? <Check size={16} /> : <Plus size={16} />}
            {saved
              ? t("Guardado en tu colección")
              : t("Guardar en mi colección")}
          </Button>
        </Panel>
        <Panel
          title={t("Hecho para colaborar")}
          description={t("Las ideas crecen cuando se comparten.")}
        >
          <Person
            name="Sofía Martín"
            role={t("«¡Esta dirección me encanta!»")}
            index={0}
          />
          <Person
            name="Lucas García"
            role={t("«Listo para darle vida.»")}
            index={1}
          />
        </Panel>
      </div>
    </div>
  );
}

export function Commerce() {
  const t = useT();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className={styles.board}>
      <div className={styles.column}>
        <Panel
          title={t("Menos ruido. Más música.")}
          description={t("La colección de tus días favoritos.")}
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
              <span>{t("Salvia / Edición esencial")}</span>
            </div>
            <strong>129 €</strong>
          </div>
          <div className={styles.purchase}>
            <div className={styles.quantity}>
              <button
                aria-label={t("Reducir cantidad")}
                disabled={quantity === 1}
                onClick={() => {
                  setQuantity(quantity - 1);
                  setAdded(false);
                }}
              >
                −
              </button>
              <output aria-label={t("Cantidad")}>{quantity}</output>
              <button
                aria-label={t("Aumentar cantidad")}
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
              {added ? t("Añadido") : t("Añadir a la bolsa")}
            </Button>
          </div>
        </Panel>
        <Card className={`${styles.card} ${styles.success}`}>
          <span className={styles.successIcon}>
            <Check size={22} />
          </span>
          <div>
            <strong>{t("Diseñado para durar")}</strong>
            <p>{t("Buenos materiales. Mejores experiencias.")}</p>
          </div>
        </Card>
      </div>
      <div className={styles.column}>
        <Panel
          title={t("Tu bolsa")}
          description={t("Una pequeña inversión en tus grandes momentos.")}
        >
          <Person
            name="Studio headphones"
            role={t("{0} unidades · Salvia", { 0: added ? quantity : 0 })}
            index={1}
          />
          <div className={styles.receipt}>
            <div>
              <span>Subtotal</span>
              <strong>{added ? quantity * 129 : 0} €</strong>
            </div>
            <div>
              <span>{t("Envío")}</span>
              <span>{t("Gratis")}</span>
            </div>
            <div>
              <strong>Total</strong>
              <strong>{added ? quantity * 129 : 0} €</strong>
            </div>
          </div>
          <p className={styles.muted} aria-live="polite">
            {added
              ? t("Tu selección está lista. Esta es una tienda de ejemplo.")
              : t("Añade un producto para verlo aquí.")}
          </p>
        </Panel>
        <Panel
          title={t("Los detalles importan")}
          description={t("Una compra a tu medida.")}
        >
          <div className={styles.setting}>
            <span>{t("Envolver para regalo")}</span>
            <Switch aria-label={t("Envolver para regalo")} />
          </div>
          <div className={styles.setting}>
            <span>{t("Recibir novedades")}</span>
            <Switch aria-label={t("Recibir novedades")} defaultChecked />
          </div>
        </Panel>
      </div>
    </div>
  );
}
