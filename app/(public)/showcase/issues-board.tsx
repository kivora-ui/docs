"use client";
import { CaseSelect } from "./case-select";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@kivora/nextjs";
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, closestCorners, pointerWithin, useDroppable, useSensor, useSensors, type DragEndEvent, type KeyboardCoordinateGetter } from "@dnd-kit/core";
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpRight, CheckCheck, Circle, CircleDashed, Clock3, GripVertical, Layers2, LayoutGrid, MessageSquare, Plus, Search, SlidersHorizontal, X, Zap } from "lucide-react";
import { useT } from "../../_lib/i18n/provider";
import styles from "./issues-board.module.css";

const statuses = ["Pendiente", "En curso", "En revisión", "Resuelta"] as const;
type Status = typeof statuses[number];
type Issue = { id: number; title: string; description: string; priority: string; status: Status; tag: string; person: number; comments: number };
const people = [{ name: "Alex Morgan", image: "alex" }, { name: "Daniel Ruiz", image: "daniel" }, { name: "Sara Chen", image: "sara" }, { name: "Marcos Silva", image: "marcos" }];
const initialIssues: Issue[] = [
  { id: 104, title: "El acceso caduca antes de tiempo", description: "La sesión se cierra al cambiar de espacio de trabajo.", priority: "Alta", status: "Pendiente", tag: "Backend", person: 1, comments: 4 },
  { id: 103, title: "Revisar contraste en el menú", description: "Mejorar la legibilidad de los estados deshabilitados.", priority: "Media", status: "Pendiente", tag: "Diseño", person: 0, comments: 2 },
  { id: 102, title: "Error al adjuntar archivos", description: "Revisar la validación de archivos y el progreso de subida.", priority: "Alta", status: "En curso", tag: "Frontend", person: 3, comments: 8 },
  { id: 101, title: "Ajustar navegación en móvil", description: "Adaptar el menú a pantallas pequeñas.", priority: "Media", status: "En curso", tag: "Frontend", person: 2, comments: 3 },
  { id: 100, title: "Actualizar mensaje de bienvenida", description: "Nuevo contenido para la primera visita al producto.", priority: "Baja", status: "Resuelta", tag: "Producto", person: 0, comments: 2 },
  { id: 99, title: "Unificar los estados de carga", description: "Componentes coherentes durante la carga de datos.", priority: "Media", status: "En revisión", tag: "Diseño", person: 2, comments: 6 },
  { id: 98, title: "Optimizar la búsqueda de proyectos", description: "Reducir el tiempo de respuesta y evitar peticiones duplicadas.", priority: "Alta", status: "En curso", tag: "Backend", person: 1, comments: 5 },
  { id: 97, title: "Añadir atajos de teclado", description: "Acceso rápido a las acciones principales del tablero.", priority: "Baja", status: "Pendiente", tag: "Producto", person: 3, comments: 1 },
  { id: 96, title: "Validar el formulario de invitación", description: "Comprobar los mensajes de error y las invitaciones existentes.", priority: "Media", status: "En revisión", tag: "Frontend", person: 0, comments: 3 },
  { id: 95, title: "Corregir la exportación CSV", description: "Los caracteres especiales ya se exportan correctamente.", priority: "Baja", status: "Resuelta", tag: "Backend", person: 1, comments: 4 },
];
const boardKeyboardCoordinates: KeyboardCoordinateGetter = (event, args) => {
  if (event.code !== "ArrowLeft" && event.code !== "ArrowRight") return sortableKeyboardCoordinates(event, args);
  event.preventDefault();
  const rect = args.context.collisionRect;
  if (!rect) return;
  const lanes = statuses.map(status => args.context.droppableRects.get(status)).filter(r => r !== undefined);
  const center = rect.left + rect.width / 2;
  const current = lanes.reduce((nearest, lane, index) => Math.abs(lane.left + lane.width / 2 - center) < Math.abs(lanes[nearest].left + lanes[nearest].width / 2 - center) ? index : nearest, 0);
  const target = lanes[current + (event.code === "ArrowRight" ? 1 : -1)];
  if (target) return { x: args.currentCoordinates.x + target.left + target.width / 2 - center, y: args.currentCoordinates.y };
};
function Portrait({ person }: { person: number }) { return <Image className={styles.avatar} src={`/showcase/people/${people[person].image}.jpg`} width={28} height={28} alt={people[person].name} title={people[person].name} />; }
function IssueCard({ issue, open, overlay = false }: { issue: Issue; open?: () => void; overlay?: boolean }) {
  const t = useT();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: overlay ? `overlay-${issue.id}` : issue.id, disabled: overlay });
  return <article ref={setNodeRef} aria-hidden={overlay || undefined} data-testid={`issue-${issue.id}`} className={`${styles.card} ${overlay ? styles.overlay : ""}`} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.25 : 1 }}>
    <div className={styles.cardTop}><span>KIV-{issue.id}</span><button ref={setActivatorNodeRef} className={styles.drag} {...attributes} {...listeners} aria-label={`${t("Mover incidencia")} KIV-${issue.id}`}><GripVertical size={16} /></button></div>
    <button className={styles.cardTitle} onClick={open} tabIndex={overlay ? -1 : 0}><h4>{t(issue.title)}</h4></button>
    <p>{t(issue.description)}</p><div className={styles.tags}><span data-priority={issue.priority}>{t(issue.priority)}</span><span>{t(issue.tag)}</span></div>
    <footer><Portrait person={issue.person} /><span className={styles.cardMeta}><MessageSquare size={13} />{issue.comments}<ArrowUpRight size={14} /></span></footer>
  </article>;
}
function Lane({ status, issues, add, open }: { status: Status; issues: Issue[]; add: () => void; open: (issue: Issue) => void }) {
  const t = useT(); const { setNodeRef, isOver } = useDroppable({ id: status });
  const Icon = [CircleDashed, Clock3, Circle, CheckCheck][statuses.indexOf(status)];
  return <section ref={setNodeRef} className={`${styles.lane} ${isOver ? styles.over : ""}`} aria-label={t(status)} data-testid={`lane-${status}`}>
    <div className={styles.laneTitle}><Icon size={16} /><h3>{t(status)}</h3><span>{issues.length}</span><button onClick={add} aria-label={`${t("Añadir incidencia en")} ${t(status)}`}><Plus size={16} /></button></div>
    <div className={styles.cards}><SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>{issues.map(issue => <IssueCard key={issue.id} issue={issue} open={() => open(issue)} />)}</SortableContext>
    {!issues.length && <div className={styles.empty}>{t("Sin incidencias")}<small>{t("Arrastra una tarjeta aquí")}</small></div>}<button className={styles.addCard} onClick={add}><Plus size={14} />{t("Añadir incidencia")}</button></div>
  </section>;
}
export function IssuesApp() {
  const t = useT(); const [issues, setIssues] = useState(initialIssues); const [query, setQuery] = useState(""); const [priority, setPriority] = useState("Todas"); const [person, setPerson] = useState("all"); const [active, setActive] = useState<number | null>(null); const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<Issue | null>(null); const dialog = useRef<HTMLDialogElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: boardKeyboardCoordinates }));
  useEffect(() => { if (draft) dialog.current?.showModal(); else dialog.current?.close(); }, [draft]);
  function create(status: Status = "Pendiente") { setDraft({ id: 0, title: "", description: "", priority: "Media", status, tag: "Producto", person: 0, comments: 0 }); }
  function save(event: FormEvent) { event.preventDefault(); if (!draft?.title.trim()) return; const saved = { ...draft, title: draft.title.trim(), id: draft.id || Math.max(...issues.map(i => i.id)) + 1 }; setIssues(current => draft.id ? current.map(i => i.id === draft.id ? saved : i) : [saved, ...current]); setNotice(`KIV-${saved.id}: ${t(saved.status)}`); setDraft(null); }
  function drop({ active: dragged, over }: DragEndEvent) {
    setActive(null); if (!over || dragged.id === over.id) return;
    const destination = issues.find(i => i.id === over.id)?.status ?? (statuses.includes(over.id as Status) ? over.id as Status : null);
    if (!destination) return;
    setIssues(current => { const updated = current.map(i => i.id === dragged.id ? { ...i, status: destination } : i); const from = updated.findIndex(i => i.id === dragged.id); const to = updated.findIndex(i => i.id === over.id); return to < 0 ? [...updated.filter(i => i.id !== dragged.id), updated[from]] : arrayMove(updated, from, to); });
    setNotice(`KIV-${dragged.id}: ${t(destination)}`);
  }
  const visible = issues.filter(i => (priority === "Todas" || i.priority === priority) && (person === "all" || i.person === Number(person)) && `${i.id} ${i.title} ${t(i.title)}`.toLowerCase().includes(query.toLowerCase()));
  const activeIssue = issues.find(i => i.id === active);
  return <div className={styles.app}>
    <aside className={styles.sidebar}><Link className={styles.logo} href="/showcase/incidencias" aria-label="Flux"><Zap size={23} fill="currentColor" /></Link><div className={styles.sideActive} title={t("Incidencias")}><LayoutGrid size={20} /></div><div className={styles.sideLine} /><span className={styles.sideCaption}>FLUX</span><div className={styles.sideBottom}><Portrait person={0} /></div></aside>
    <div className={styles.workspace}>
      <header className={styles.header}><div className={styles.breadcrumb}><Layers2 size={15} /><span>Flux workspace</span><span>/</span><strong>{t("Producto")}</strong><span className={styles.demo}>{t("Espacio de demostración")}</span></div><div className={styles.heading}><div><span className={styles.eyebrow}>{t("ESPACIO DE TRABAJO")}</span><h1>{t("Incidencias")}<span>{issues.length}</span></h1><p>{t("Un equipo enfocado. Cada detalle bajo control.")}</p></div><div className={styles.headerActions}><div className={styles.team}>{people.map((p, i) => <Portrait key={p.name} person={i} />)}</div><Button onClick={() => create()}><Plus size={16} />{t("Nueva incidencia")}</Button></div></div></header>
      <div className={styles.filters}><span className={styles.boardTab}><LayoutGrid size={15} />{t("Tablero")}</span><div className={styles.search}><Search size={15} /><Input aria-label={t("Buscar incidencias")} placeholder={t("Buscar incidencias")} value={query} onChange={e => setQuery(e.target.value)} /></div><label className={styles.filter}><SlidersHorizontal size={14} /><CaseSelect label={t("Prioridad")} value={priority} onChange={setPriority} options={["Todas", "Alta", "Media", "Baja"].map(p => ({ value: p, label: t(p === "Todas" ? "Todas las prioridades" : p) }))} /></label><label className={styles.filter}><CaseSelect label={t("Responsable")} value={person} onChange={setPerson} options={[{ value: "all", label: t("Todo el equipo") }, ...people.map((p, i) => ({ value: String(i), label: p.name }))]} /></label><span className={styles.resultCount}>{visible.length} {t("incidencias")}</span></div>
      <DndContext id="flux-board" sensors={sensors} collisionDetection={args => args.pointerCoordinates ? pointerWithin(args) : closestCorners(args)} onDragStart={e => setActive(Number(e.active.id))} onDragCancel={() => setActive(null)} onDragEnd={drop} accessibility={{ screenReaderInstructions: { draggable: t("Pulsa espacio para recoger, las flechas para mover, espacio para soltar y Escape para cancelar.") } }}><div className={styles.board}>{statuses.map(status => <Lane key={status} status={status} issues={visible.filter(i => i.status === status)} add={() => create(status)} open={setDraft} />)}</div><DragOverlay>{activeIssue ? <IssueCard issue={activeIssue} overlay /> : null}</DragOverlay></DndContext>
      <footer className={styles.statusbar}><span><span className={styles.liveDot} />{t("Sprint 08")}<span className={styles.footerSeparator}>·</span>{issues.filter(i => i.status === "Resuelta").length}/{issues.length} {t("resueltas")}</span><span role="status" aria-label={t("Estado del tablero")}>{notice || t("Arrastra las tarjetas para organizar el trabajo")}</span></footer>
    </div>
    <dialog ref={dialog} aria-labelledby="issue-dialog-title" className={styles.dialog} onCancel={() => setDraft(null)} onClick={e => { if (e.target === e.currentTarget) setDraft(null); }}>{draft && <form onSubmit={save}><div className={styles.modalHeading}><div><small>{draft.id ? `KIV-${draft.id}` : "FLUX / PRODUCT"}</small><h2 id="issue-dialog-title">{t(draft.id ? "Editar incidencia" : "Nueva incidencia")}</h2></div><button type="button" aria-label={t("Cerrar")} onClick={() => setDraft(null)}><X size={20} /></button></div><label>{t("Título de la incidencia")}<Input autoFocus required maxLength={120} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label><label>{t("Descripción")}<textarea rows={3} maxLength={1000} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></label><div className={styles.formGrid}><label>{t("Estado")}<CaseSelect label={t("Estado")} value={draft.status} onChange={value => setDraft({ ...draft, status: value as Status })} options={statuses.map(s => ({ value: s, label: t(s) }))} /></label><label>{t("Prioridad")}<CaseSelect label={t("Prioridad")} value={draft.priority} onChange={value => setDraft({ ...draft, priority: value })} options={["Alta", "Media", "Baja"].map(p => ({ value: p, label: t(p) }))} /></label><label>{t("Responsable")}<CaseSelect label={t("Responsable")} value={String(draft.person)} onChange={value => setDraft({ ...draft, person: Number(value) })} options={people.map((p, i) => ({ value: String(i), label: p.name }))} /></label><label>{t("Categoría")}<CaseSelect label={t("Categoría")} value={draft.tag} onChange={value => setDraft({ ...draft, tag: value })} options={["Producto", "Diseño", "Frontend", "Backend"].map(v => ({ value: v, label: t(v) }))} /></label></div><div className={styles.modalActions}><Button type="button" variant="ghost" onClick={() => setDraft(null)}>{t("Cancelar")}</Button><Button type="submit" disabled={!draft.title.trim()}>{t(draft.id ? "Guardar cambios" : "Crear incidencia")}</Button></div></form>}</dialog>
  </div>;
}
