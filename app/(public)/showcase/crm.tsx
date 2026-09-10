"use client";
import { CaseSelect } from "./case-select";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Avatar, AvatarFallback, Badge, Button, Card, Input } from "@kivora/nextjs";
import { Activity, ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Building2, Check, ChevronDown, CircleHelp, LayoutDashboard, Layers, Menu, Pencil, Plus, Search, Settings2, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
import { useT } from "../../_lib/i18n/provider";
import { customerStatuses, initialCustomers, type Customer, type CustomerStatus } from "./crm-data";
import styles from "./crm.module.css";

type View = "overview" | "table" | "segments" | "activity";
type ActivityItem = { id: string; text: string; name: string; time: string };
const blankCustomer: Customer = { id: "", name: "", domain: "", description: "", industry: "", status: "Potencial", users: 1, seats: 10, color: "#7c3aed" };

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useT();
  useEffect(() => { const modal = ref.current; modal?.showModal(); return () => modal?.close(); }, []);
  return <dialog ref={ref} className={styles.modal} aria-label={title} onCancel={onClose}><header><h2>{title}</h2><button onClick={onClose} aria-label={t("Cerrar")}><X size={20} /></button></header>{children}</dialog>;
}

function CustomerForm({ customer, onSave, onClose }: { customer: Customer; onSave: (customer: Customer) => void; onClose: () => void }) {
  const t = useT();
  const [form, setForm] = useState(customer);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.domain.trim() || form.users > form.seats) return;
    onSave({ ...form, id: form.id || crypto.randomUUID(), name: form.name.trim(), domain: form.domain.trim(), industry: form.industry.trim(), description: form.description.trim() });
  }
  return <Modal title={t(customer.id ? "Editar cliente" : "Añadir cliente")} onClose={onClose}><form className={styles.customerForm} onSubmit={submit}>
    <p>{t("Organiza la información de la empresa y su relación con tu equipo.")}</p>
    <label>{t("Empresa")}<Input autoFocus required maxLength={60} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Acme Studio" /></label>
    <label>{t("Dominio")}<Input required maxLength={100} value={form.domain} onChange={event => setForm({ ...form, domain: event.target.value })} placeholder="acme.example" /></label>
    <div className={styles.formGrid}><label>{t("Sector")}<Input maxLength={60} value={form.industry} onChange={event => setForm({ ...form, industry: event.target.value })} /></label><label>{t("Estado")}<CaseSelect label={t("Estado")} value={form.status} onChange={value => setForm({ ...form, status: value as CustomerStatus })} options={customerStatuses.map(s => ({ value: s, label: t(s) }))} /></label></div>
    <label>{t("Descripción")}<textarea rows={2} maxLength={160} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
    <div className={styles.formGrid}><label>{t("Usuarios")}<Input type="number" required min={0} max={form.seats} value={form.users} onChange={event => setForm({ ...form, users: Number(event.target.value) })} /></label><label>{t("Licencias contratadas")}<Input type="number" required min={Math.max(1, form.users)} max={10000} value={form.seats} onChange={event => setForm({ ...form, seats: Number(event.target.value) })} /></label></div>
    <footer><Button type="button" variant="outline" onClick={onClose}>{t("Cancelar")}</Button><Button type="submit" disabled={!form.name.trim() || !form.domain.trim() || form.users > form.seats}>{t(customer.id ? "Guardar cambios" : "Crear cliente")}</Button></footer>
  </form></Modal>;
}

export function CrmApp() {
  const t = useT();
  const [customers, setCustomers] = useState(initialCustomers);
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [moreFilters, setMoreFilters] = useState(false);
  const [capacityOnly, setCapacityOnly] = useState(false);
  const [ascending, setAscending] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<string[]>([]);
  const [info, setInfo] = useState<"help" | "settings" | null>(null);
  const [workspace, setWorkspace] = useState("Orbit CRM");
  const [notice, setNotice] = useState("");
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const mobileNav = useRef<HTMLDialogElement>(null);
  const selectAll = useRef<HTMLInputElement>(null);
  const pageSize = 7;
  const filtered = customers.filter(customer => (status === "Todos" || customer.status === status) && (!capacityOnly || customer.users / customer.seats >= .7) && `${customer.name} ${customer.domain} ${t(customer.industry)}`.toLowerCase().includes(query.toLowerCase()));
  if (ascending !== null) filtered.sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedVisible = visible.filter(customer => selected.includes(customer.id)).length;
  useEffect(() => { if (selectAll.current) selectAll.current.indeterminate = selectedVisible > 0 && selectedVisible < visible.length; }, [selectedVisible, visible.length, view]);
  const users = customers.reduce((sum, customer) => sum + customer.users, 0);
  const seats = customers.reduce((sum, customer) => sum + customer.seats, 0);
  function navigate(next: View) { setView(next); mobileNav.current?.close(); }
  function record(text: string, name: string) {
    setActivity(current => [{ id: crypto.randomUUID(), text, name, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...current]);
    setNotice(`${t(text)} · ${name}`);
  }
  function save(customer: Customer) {
    const exists = customers.some(item => item.id === customer.id);
    setCustomers(current => exists ? current.map(item => item.id === customer.id ? customer : item) : [customer, ...current]);
    record(exists ? "Cliente actualizado" : "Cliente creado", customer.name);
    setEditing(null); setQuery(""); setStatus("Todos"); setCapacityOnly(false); setAscending(null); setPage(1); setView("overview");
  }
  function remove() {
    const names = customers.filter(customer => deleting.includes(customer.id)).map(customer => customer.name).join(", ");
    setCustomers(current => current.filter(customer => !deleting.includes(customer.id)));
    setSelected(current => current.filter(id => !deleting.includes(id))); setDeleting([]);
    record("Clientes eliminados", names);
  }
  function exportCustomers() {
    const rows = [[t("Empresa"), t("Dominio"), t("Estado"), t("Usuarios"), t("Licencias contratadas")], ...filtered.filter(customer => !selected.length || selected.includes(customer.id)).map(customer => [customer.name, customer.domain, t(customer.status), String(customer.users), String(customer.seats)])];
    const csv = rows.map(row => row.map(value => `"${(/^[=+@\-\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "orbit-clientes.csv"; link.click(); URL.revokeObjectURL(url);
    setNotice(t("Exportación preparada"));
  }
  function navigation() {
    return <><div className={styles.brand}><span><Layers size={22} /></span><strong>{workspace}</strong></div><span className={styles.navCaption}>{t("ESPACIO DE TRABAJO")}</span><nav aria-label={t("Navegación del CRM")}>{([
      ["overview", "Resumen", LayoutDashboard], ["table", "Clientes", Users], ["segments", "Segmentos", Building2], ["activity", "Actividad", Activity],
    ] as const).map(([key, name, Icon]) => <button key={key} onClick={() => navigate(key)} aria-current={view === key ? "page" : undefined}><Icon size={18} />{t(name)}{key === "table" && <span>{customers.length}</span>}{key === "activity" && activity.length > 0 && <span>{activity.length}</span>}</button>)}</nav><div className={styles.sidebarBottom}><p><span />{t("Espacio de demostración")}</p><button onClick={() => { mobileNav.current?.close(); setInfo("help"); }}><CircleHelp size={18} />{t("Ayuda")}</button><button onClick={() => { mobileNav.current?.close(); setInfo("settings"); }}><Settings2 size={18} />{t("Configuración")}</button><div className={styles.profile}><Avatar><AvatarFallback>AM</AvatarFallback></Avatar><div><strong>Alex Morgan</strong><span>alex@orbit.example</span></div><ChevronDown size={15} /></div></div></>;
  }
  return <div className={styles.app}>
    <aside className={styles.sidebar}>{navigation()}</aside>
    <dialog ref={mobileNav} className={styles.mobileNav} aria-label={t("Menú del CRM")}><button className={styles.closeNav} aria-label={t("Cerrar menú")} onClick={() => mobileNav.current?.close()}><X size={20} /></button>{navigation()}</dialog>
    <section className={styles.content}>
      <header className={styles.header}><div><div className={styles.breadcrumb}><button className={styles.menuButton} onClick={() => mobileNav.current?.showModal()} aria-label={t("Abrir menú")}><Menu size={20} /></button>{workspace}<span>/</span>{t("Espacio de trabajo")}</div><h1>{t(view === "activity" ? "Actividad" : "Clientes")}</h1><p>{t(view === "activity" ? "Los últimos cambios de tu equipo, en un solo lugar." : "Cuida tus relaciones. Haz crecer tu negocio.")}</p></div><div className={styles.headerActions}><Button variant="outline" onClick={exportCustomers}><ArrowDownToLine size={15} />{t("Exportar")}</Button><Button onClick={() => setEditing({ ...blankCustomer })}><Plus size={16} />{t("Añadir cliente")}</Button></div></header>
      {view !== "activity" && <div className={styles.tabs} role="group" aria-label={t("Vista de clientes")}>{([ ["overview", "Resumen"], ["table", "Tabla"], ["segments", "Segmentos"] ] as const).map(([key, label]) => <button key={key} aria-pressed={view === key} onClick={() => navigate(key)}>{t(label)}</button>)}</div>}
      {view === "overview" && <div className={styles.metrics}><Card><div><span>{t("Total de clientes")}</span><Users size={17} /></div><strong>{customers.length.toLocaleString()}</strong><small>{t("Empresas en tu cartera")}</small></Card><Card><div><span>{t("Miembros")}</span><Building2 size={17} /></div><strong>{users.toLocaleString()}</strong><small>{seats} {t("licencias contratadas")}</small></Card><Card><div><span>{t("Clientes activos")}</span><Activity size={17} /></div><strong>{customers.filter(customer => customer.status === "Cliente").length}<span className={styles.avatarStack}>{["AM", "JL", "SR", "LC"].map((initials, index) => <span key={initials} style={{ background: ["#ede4d8", "#d9e4f0", "#eedfe7", "#e0e9d9"][index] }}>{initials}</span>)}</span></strong><small>{t("Relaciones que siguen creciendo")}</small></Card></div>}
      {view === "segments" && <div className={styles.segments}>{customerStatuses.map(value => <Card key={value}><Badge variant="secondary">{t(value)}</Badge><strong>{customers.filter(customer => customer.status === value).length}</strong><p>{t(value === "Cliente" ? "Empresas con una relación comercial activa." : value === "Potencial" ? "Oportunidades para tu próximo acuerdo." : "Relaciones que puedes volver a activar.")}</p><Button variant="outline" onClick={() => { setStatus(value); setPage(1); navigate("table"); }}>{t("Ver clientes")}<ArrowUpRight size={15} /></Button></Card>)}</div>}
      <p role="status" className={styles.notice}>{notice}</p>
      {(view === "overview" || view === "table") && <>
        <div className={styles.filters}><div className={styles.filterActions}><label><span className={styles.srOnly}>{t("Filtrar por estado")}</span><CaseSelect label={t("Filtrar por estado")} value={status} onChange={value => { setStatus(value); setPage(1); }} options={[{ value: "Todos", label: t("Todos los estados") }, ...customerStatuses.map(s => ({ value: s, label: t(s) }))]} /></label><Button variant="outline" size="sm" aria-expanded={moreFilters} onClick={() => setMoreFilters(!moreFilters)}><SlidersHorizontal size={14} />{t("Más filtros")}</Button>{(status !== "Todos" || query || capacityOnly) && <button className={styles.clearFilters} onClick={() => { setQuery(""); setStatus("Todos"); setCapacityOnly(false); setPage(1); }}>{t("Limpiar")}<X size={12} /></button>}</div><label className={styles.search}><Search size={16} /><input placeholder={t("Buscar clientes")} aria-label={t("Buscar clientes")} value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label></div>
        {moreFilters && <div className={styles.extraFilters}><label><input type="checkbox" checked={capacityOnly} onChange={event => { setCapacityOnly(event.target.checked); setPage(1); }} />{t("Uso de licencias igual o superior al 70%")}</label></div>}
        {selected.length > 0 && <div className={styles.selectionBar}><span>{selected.length} {t("seleccionados")}</span><button onClick={() => setSelected([])}>{t("Deseleccionar")}</button><button onClick={() => setDeleting(selected)}><Trash2 size={13} />{t("Eliminar seleccionados")}</button></div>}
        <div className={styles.tableCard}><div className={styles.tableScroll} tabIndex={0} role="region" aria-label={t("Tabla de clientes")}><table><thead><tr><th className={styles.checkboxCell}><input ref={selectAll} type="checkbox" aria-label={t("Seleccionar página")} checked={visible.length > 0 && selectedVisible === visible.length} disabled={!visible.length} onChange={event => setSelected(current => event.target.checked ? [...new Set([...current, ...visible.map(customer => customer.id)])] : current.filter(id => !visible.some(customer => customer.id === id)))} /></th><th aria-sort={ascending === null ? "none" : ascending ? "ascending" : "descending"}><button onClick={() => { setAscending(ascending !== true); setPage(1); }}>{t("Empresa")}<ArrowDown size={13} style={{ transform: ascending === false ? "rotate(180deg)" : undefined }} /></button></th><th>{t("Estado")}</th><th>{t("Acerca de")}</th><th>{t("Usuarios")}</th><th>{t("Uso de licencias")}</th><th><span className={styles.srOnly}>{t("Acciones")}</span></th></tr></thead><tbody>{visible.map(customer => <tr key={customer.id} data-selected={selected.includes(customer.id)}><td className={styles.checkboxCell}><input type="checkbox" aria-label={`${t("Seleccionar")} ${customer.name}`} checked={selected.includes(customer.id)} onChange={event => setSelected(current => event.target.checked ? [...current, customer.id] : current.filter(id => id !== customer.id))} /></td><td><div className={styles.company}><span style={{ color: customer.color, background: `${customer.color}18` }}>{customer.name.slice(0, 1)}</span><div><strong>{customer.name}</strong><small>{customer.domain}</small></div></div></td><td><span className={styles.status} data-status={customer.status}><i />{t(customer.status)}</span></td><td className={styles.about}><strong>{t(customer.industry) || "—"}</strong><small>{t(customer.description) || "—"}</small></td><td><div className={styles.avatarStack} aria-label={`${customer.users} ${t("Usuarios")}`}>{["AM", "JL", "SR"].slice(0, customer.users).map((initials, index) => <span key={initials} style={{ background: ["#ede4d8", "#d9e4f0", "#eedfe7"][index] }}>{initials}</span>)}{customer.users > 3 && <span className={styles.moreUsers}>+{customer.users - 3}</span>}{customer.users === 0 && "—"}</div></td><td><div className={styles.license}><progress value={customer.users} max={customer.seats} aria-label={`${t("Uso de licencias")} ${customer.name}`} /><small>{customer.users}/{customer.seats}</small></div></td><td><div className={styles.rowActions}><button aria-label={`${t("Eliminar")} ${customer.name}`} onClick={() => setDeleting([customer.id])}><Trash2 size={15} /></button><button aria-label={`${t("Editar")} ${customer.name}`} onClick={() => setEditing(customer)}><Pencil size={15} /></button></div></td></tr>)}</tbody></table>{!visible.length && <div className={styles.empty}><Search size={26} /><h2>{t("No se encontraron clientes")}</h2><p>{t("Prueba otra búsqueda o cambia los filtros.")}</p></div>}</div><footer className={styles.pagination}><Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={14} />{t("Anterior")}</Button><span>{t("Página {0} de {1}", { 0: currentPage, 1: pageCount })}<small>{filtered.length} {t("clientes")}</small></span><Button size="sm" variant="outline" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>{t("Siguiente")}<ArrowRight size={14} /></Button></footer></div>
      </>}
      {view === "activity" && <Card className={styles.activityCard}>{activity.length ? activity.map(item => <div key={item.id}><span><Check size={17} /></span><div><strong>{t(item.text)}</strong><p>{item.name}</p></div><time>{item.time}</time></div>) : <div className={styles.empty}><Activity size={28} /><h2>{t("Tu actividad empieza aquí")}</h2><p>{t("Crea o actualiza un cliente para ver los cambios de esta sesión.")}</p></div>}</Card>}
      <div className={styles.pageFooter}><span>Orbit CRM</span><span>{t("Datos de ejemplo · Cambios guardados durante esta sesión")}</span></div>
    </section>
    {editing && <CustomerForm customer={editing} onSave={save} onClose={() => setEditing(null)} />}
    {!!deleting.length && <Modal title={t("Eliminar clientes")} onClose={() => setDeleting([])}><div className={styles.confirmDelete}><Trash2 size={26} /><p>{t("Se eliminarán {0} clientes de esta demo.", { 0: deleting.length })}</p><strong>{customers.filter(customer => deleting.includes(customer.id)).map(customer => customer.name).join(", ")}</strong><footer><Button variant="outline" onClick={() => setDeleting([])}>{t("Cancelar")}</Button><Button variant="destructive" onClick={remove}>{t("Eliminar")}</Button></footer></div></Modal>}
    {info === "help" && <Modal title={t("Ayuda")} onClose={() => setInfo(null)}><div className={styles.help}><p>{t("Gestiona clientes desde la tabla: busca, filtra, selecciona y edita sus datos. Puedes exportar la vista actual a CSV.")}</p><p>{t("Esta demo guarda los cambios mientras la página está abierta. Al recargar, se restauran los datos de ejemplo.")}</p><Button onClick={() => setInfo(null)}>{t("Entendido")}</Button></div></Modal>}
    {info === "settings" && <Modal title={t("Configuración")} onClose={() => setInfo(null)}><form className={styles.customerForm} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setWorkspace(String(data.get("workspace")).trim()); setInfo(null); setNotice(t("Configuración guardada")); }}><label>{t("Nombre del espacio")}<Input name="workspace" required pattern=".*\S.*" maxLength={32} defaultValue={workspace} /></label><footer><Button type="button" variant="outline" onClick={() => setInfo(null)}>{t("Cancelar")}</Button><Button type="submit">{t("Guardar cambios")}</Button></footer></form></Modal>}
  </div>;
}
