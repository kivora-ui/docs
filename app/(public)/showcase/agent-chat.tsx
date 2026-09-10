"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Avatar, AvatarFallback, Badge, Button } from "@kivora/nextjs";
import { ArrowDown, ArrowUp, AudioLines, BarChart3, Check, Bot, Code2, Copy, Menu, Megaphone, Palette, Plus, Search, Sparkles, Square, X } from "lucide-react";
import { useT } from "../../_lib/i18n/provider";
import { agents, initialMessages, replies, type AgentId, type Message } from "./agent-chat-data";
import styles from "./agent-chat.module.css";

const icons = { code: Code2, marketing: Megaphone, design: Palette, data: BarChart3, sparkles: Sparkles, bot: Bot };
type Agent = {
  id: string; name: string; specialty: string; short: string; icon: keyof typeof icons;
  color: string; task: string; prompts: readonly string[]; specializations: AgentId[];
};
const specializations: { id: AgentId; label: string }[] = [
  { id: "dev", label: "Desarrollo" }, { id: "marketing", label: "Marketing" },
  { id: "design", label: "Diseño" }, { id: "data", label: "Datos" },
];
const iconLabels = { code: "Código", marketing: "Megáfono", design: "Paleta", data: "Gráfico", sparkles: "Destellos", bot: "Robot" };
const colors = [
  { value: "#627dbd", name: "Azul" }, { value: "#b87546", name: "Terracota" },
  { value: "#9d789c", name: "Malva" }, { value: "#558777", name: "Verde" },
  { value: "#b56778", name: "Rosa" }, { value: "#8a8149", name: "Oliva" },
];

function CreateAgentModal({ onCreate, onClose }: { onCreate: (agent: Agent) => void; onClose: () => void }) {
  const t = useT();
  const modal = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const stepTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepNames = ["Información", "Especializaciones", "Apariencia"];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<AgentId[]>([]);
  const [icon, setIcon] = useState<keyof typeof icons>("bot");
  const [color, setColor] = useState(colors[0].value);
  const PreviewIcon = icons[icon];
  const informationValid = name.trim().length > 0 && description.trim().length > 0;
  const valid = informationValid && selected.length > 0;
  const canContinue = step === 0 ? informationValid : valid;
  function canVisit(index: number) { return index === 0 || (index === 1 ? informationValid : valid); }
  function goTo(index: number) {
    if (!canVisit(index)) return;
    setStep(index);
    stepTabs.current[index]?.focus();
  }
  useEffect(() => {
    const dialog = modal.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue) return;
    if (step < 2) { goTo(step + 1); return; }
    onCreate({ id: crypto.randomUUID(), name: name.trim(), specialty: description.trim(), short: name.trim(),
      icon, color, task: description.trim(), specializations: selected,
      prompts: selected.map(id => agents.find(agent => agent.id === id)!.prompts[0]),
    });
  }
  return <dialog ref={modal} className={styles.createDialog} aria-labelledby="create-agent-title" aria-describedby="create-agent-description" onCancel={onClose}>
    <form onSubmit={submit} className={styles.createForm}>
      <header className={styles.modalHeader}><div><h2 id="create-agent-title">{t("Crear nuevo agente")}</h2><p id="create-agent-description">{t("Dale una identidad y elige en qué puede ayudarte.")}</p></div><button type="button" onClick={onClose} aria-label={t("Cerrar")}><X size={20} /></button></header>
      <div className={styles.wizardTabs} role="tablist" aria-label={t("Pasos para crear un agente")}>
        {stepNames.map((label, index) => <button key={label} type="button" role="tab" id={`agent-step-${index}`} aria-controls={`agent-panel-${index}`} aria-selected={step === index} tabIndex={step === index ? 0 : -1} disabled={!canVisit(index)} ref={node => { stepTabs.current[index] = node; }} onClick={() => goTo(index)} onKeyDown={event => {
          const available = stepNames.map((_, index) => index).filter(canVisit);
          const position = available.indexOf(index);
          let next: number;
          if (event.key === "ArrowRight") next = available[(position + 1) % available.length];
          else if (event.key === "ArrowLeft") next = available[(position + available.length - 1) % available.length];
          else if (event.key === "Home") next = available[0];
          else if (event.key === "End") next = available[available.length - 1];
          else return;
          event.preventDefault(); goTo(next);
        }}><span>{index + 1}</span>{t(label)}</button>)}
      </div>
      <div className={styles.modalBody}>
        <div className={styles.agentPreview}><span className={styles.headerIcon} style={{ "--agent-color": color } as CSSProperties}><PreviewIcon size={23} /></span><div><strong>{name.trim() || t("Tu nuevo agente")}</strong><small>{selected.length ? selected.map(id => t(specializations.find(item => item.id === id)!.label)).join(" · ") : t("Una identidad propia, muchas posibilidades")}</small></div></div>
        <div role="tabpanel" id="agent-panel-0" aria-labelledby="agent-step-0" hidden={step !== 0} className={styles.wizardPanel}>
        <label className={styles.formField}>{t("Nombre del agente")}<input autoFocus required={step === 0} maxLength={48} value={name} onChange={event => setName(event.target.value)} placeholder={t("Ej. Estratega de producto")} /></label>
        <label className={styles.formField}>{t("Descripción")}<textarea required={step === 0} rows={3} maxLength={240} value={description} onChange={event => setDescription(event.target.value)} placeholder={t("Describe su función y cómo te ayudará.")} /></label>
        </div>
        <div role="tabpanel" id="agent-panel-1" aria-labelledby="agent-step-1" hidden={step !== 1} className={styles.wizardPanel}>
        <fieldset className={styles.specializations}><legend>{t("Especializaciones")}<span>{t("Selecciona una o varias")}</span></legend><div>{specializations.map(item => <label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={event => setSelected(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id))} /><span>{t(item.label)}</span></label>)}</div></fieldset>
        </div>
        <div role="tabpanel" id="agent-panel-2" aria-labelledby="agent-step-2" hidden={step !== 2} className={styles.wizardPanel}>
        <fieldset className={styles.iconPicker}><legend>{t("Icono")}</legend><div>{Object.entries(icons).map(([key, ItemIcon]) => <label key={key} title={t(iconLabels[key as keyof typeof icons])}><input type="radio" name="agent-icon" aria-label={t(iconLabels[key as keyof typeof icons])} checked={icon === key} onChange={() => setIcon(key as keyof typeof icons)} /><span><ItemIcon size={20} /></span></label>)}</div></fieldset>
        <fieldset className={styles.colorPicker}><legend>{t("Color")}</legend><div>{colors.map(item => <label key={item.value} title={t(item.name)} style={{ "--swatch": item.value } as CSSProperties}><input type="radio" name="agent-color" aria-label={t(item.name)} checked={color === item.value} onChange={() => setColor(item.value)} /><span>{color === item.value && <Check size={17} />}</span></label>)}</div></fieldset>
        </div>
      </div>
      <footer className={`${styles.modalFooter} ${styles.wizardFooter}`}>
        <Button type="button" variant="ghost" onClick={onClose}>{t("Cancelar")}</Button>
        <div>{step > 0 && <Button type="button" variant="outline" onClick={() => goTo(step - 1)}>{t("Anterior")}</Button>}
        <Button key={step} type="submit" disabled={!canContinue}>{step === 2 && <Plus size={15} />}{t(step === 2 ? "Crear agente" : "Siguiente")}</Button></div>
      </footer>
    </form>
  </dialog>;
}
function MessageContent({ message }: { message: Message }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(message.code ?? "");
      setCopied(true); setCopyError(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setCopyError(true); }
  }
  return <>
    <p>{message.role === "user" && !/^[dmsa]\d+$/.test(message.id) ? message.text : t(message.text)}</p>
    {message.kind === "code" && <div className={styles.codeBlock}><div><span>{t(message.title ?? "")}</span><button onClick={copy} aria-label={t("Copiar código")}>{copied ? <Check size={14} /> : <Copy size={14} />}{t(copied ? "Copiado" : "Copiar")}</button></div><pre tabIndex={0}><code>{message.code}</code></pre>{copyError && <small role="status">{t("No se ha podido copiar. Selecciona el código para copiarlo.")}</small>}</div>}
    {message.kind === "steps" && <div className={styles.steps}><h3>{t(message.title ?? "")}</h3><ol>{message.items?.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{t(item)}</li>)}</ol></div>}
    {message.kind === "metrics" && <div className={styles.metricBlock}><h3>{t(message.title ?? "")}</h3><div>{message.metrics?.map(metric => <div key={metric.label}><span>{t(metric.label)}</span><strong>{metric.value}</strong><small>{metric.change}</small></div>)}</div></div>}
    {message.kind === "table" && <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={t(message.title ?? "")}><table><caption>{t(message.title ?? "")}</caption><thead><tr>{message.rows?.[0].map(cell => <th key={cell} scope="col">{t(cell)}</th>)}</tr></thead><tbody>{message.rows?.slice(1).map((row, index) => <tr key={index}>{row.map((cell, index) => <td key={index}>{t(cell)}</td>)}</tr>)}</tbody></table></div>}
  </>;
}

export function ChatApp() {
  const t = useT();
  const [agentList, setAgentList] = useState<Agent[]>(() => agents.map(agent => ({ ...agent, specializations: [agent.id] })));
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState<string>("dev");
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Partial<Record<string, string>>>({});
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [thinking, setThinking] = useState<Partial<Record<string, boolean>>>({});
  const [unread, setUnread] = useState<Partial<Record<string, boolean>>>({});
  const timers = useRef<Partial<Record<string, ReturnType<typeof setTimeout>>>>({});
  const lastReply = useRef<Partial<Record<string, number>>>({});
  const activeRef = useRef(active);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const followBottom = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const agent = agentList.find(agent => agent.id === active)!;
  const Icon = icons[agent.icon];
  const draft = drafts[active] ?? "";
  const thread = messages[active];
  const pending = thinking[active];
  useEffect(() => { const pendingTimers = timers.current; return () => { Object.values(pendingTimers).forEach(clearTimeout); }; }, []);
  useLayoutEffect(() => {
    if (followBottom.current && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, pending, active]);
  function select(id: string) {
    activeRef.current = id; setActive(id); setUnread(current => ({ ...current, [id]: false }));
    followBottom.current = true; setShowJump(false); dialogRef.current?.close();
  }
  function stop(id: string) {
    clearTimeout(timers.current[id]); delete timers.current[id];
    setThinking(current => ({ ...current, [id]: false }));
  }
  function openCreate() {
    dialogRef.current?.close();
    setCreateOpen(true);
  }
  function createAgent(created: Agent) {
    setAgentList(current => [...current, created]);
    setMessages(current => ({ ...current, [created.id]: [] }));
    setQuery(""); select(created.id); setCreateOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }
  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || timers.current[active]) return;
    const id = active;
    const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    followBottom.current = true; setShowJump(false);
    setMessages(current => ({ ...current, [id]: [...current[id], { id: crypto.randomUUID(), role: "user", text, time: time() }] }));
    setDrafts(current => ({ ...current, [id]: "" })); setThinking(current => ({ ...current, [id]: true }));
    const responsePool = agent.specializations.flatMap(specialization => replies[specialization]);
    const choices = responsePool.map((_, index) => index).filter(index => index !== lastReply.current[id]);
    const entropy = crypto.getRandomValues(new Uint32Array(2));
    const choice = choices[entropy[0] % choices.length];
    lastReply.current[id] = choice;
    timers.current[id] = setTimeout(() => {
      delete timers.current[id];
      setMessages(current => ({ ...current, [id]: [...current[id], { ...responsePool[choice], id: crypto.randomUUID(), role: "agent", time: time() }] }));
      setThinking(current => ({ ...current, [id]: false }));
      if (activeRef.current !== id) setUnread(current => ({ ...current, [id]: true }));
    }, 1800 + entropy[1] % 1600);
  }
  function agentNavigation() {
    const visible = agentList.filter(agent => t(agent.name).toLowerCase().includes(query.toLowerCase()));
    return <>
      <div className={styles.brand}><AudioLines size={27} /><strong>relay<span>AGENT WORKSPACE</span></strong><Badge variant="secondary">BETA</Badge></div>
      <Button className={styles.newChat} variant="outline" onClick={openCreate}><Plus size={16} />{t("Crear nuevo agente")}</Button>
      <label className={styles.search}><Search size={15} /><input aria-label={t("Buscar agentes")} placeholder={t("Buscar agentes")} value={query} onChange={event => setQuery(event.target.value)} /></label>
      <div className={styles.navLabel}>{t("TUS AGENTES")} <span>{String(agentList.length).padStart(2, "0")}</span></div>
      <nav aria-label={t("Agentes")} className={styles.agentList}>{visible.map(item => {
        const AgentIcon = icons[item.icon];
        return <button key={item.id} aria-pressed={active === item.id} onClick={() => select(item.id)} className={styles.agentButton} style={{ "--agent-color": item.color } as CSSProperties}>
          <span className={styles.agentIcon}><AgentIcon size={18} /></span><span><strong>{t(item.name)}</strong><small>{thinking[item.id] ? t("Pensando…") : t(item.task)}</small></span>{unread[item.id] && <i aria-label={t("Respuesta nueva")} />}
        </button>;
      })}</nav>
      {!visible.length && <p className={styles.noResults}>{t("No hay agentes que coincidan.")}</p>}
      <div className={styles.sidebarBottom}><div className={styles.localMode}><span /><span>{t("Modo de demostración")}<small>{t("Respuestas simuladas, sin conexión a IA")}</small></span></div><div className={styles.profile}><Avatar><AvatarFallback>AS</AvatarFallback></Avatar><div><strong>Alex Studio</strong><small>{t("Plan personal")}</small></div><span>AS</span></div></div>
    </>;
  }
  return <div className={styles.app}>
    {createOpen && <CreateAgentModal onCreate={createAgent} onClose={() => setCreateOpen(false)} />}
    <aside className={styles.sidebar}>{agentNavigation()}</aside>
    <dialog ref={dialogRef} className={styles.mobileDialog} aria-label={t("Agentes")}><button className={styles.closeMenu} onClick={() => dialogRef.current?.close()} aria-label={t("Cerrar agentes")}><X size={20} /></button>{agentNavigation()}</dialog>
    <section className={styles.thread} aria-label={t(agent.name)}>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={() => dialogRef.current?.showModal()} aria-label={t("Abrir agentes")}><Menu size={21} /></button>
        <span className={styles.headerIcon} style={{ "--agent-color": agent.color } as CSSProperties}><Icon size={20} /></span>
        <div><h1>{t(agent.name)}</h1><p>{t(agent.specialty)}</p></div>
        <span className={styles.available}><i />{t("Disponible")}</span>
      </header>
      <div className={styles.topic}><span><span>relay</span> / {t(agent.short)}</span><span>{t("Conversación privada")}</span></div>
      <div className={styles.scrollArea} ref={scrollRef} onScroll={event => { const node = event.currentTarget; const near = node.scrollHeight - node.scrollTop - node.clientHeight < 100; followBottom.current = near; setShowJump(!near); }}>
        <div className={styles.conversation} role="log" aria-label={t("Mensajes")} aria-live="polite" aria-relevant="additions">
          {thread.length ? <div className={styles.day}><span />{t("Hoy")}<span /></div> : <div className={styles.empty}><Sparkles size={32} /><h2>{t("Una idea es un buen comienzo.")}</h2><p>{t("Cuéntame qué quieres conseguir y lo exploramos juntos.")}</p></div>}
          {thread.map(message => <article key={message.id} className={`${styles.message} ${message.role === "user" ? styles.userMessage : ""}`}>
            {message.role === "agent" && <span className={styles.messageAvatar} style={{ "--agent-color": agent.color } as CSSProperties}><Icon size={16} /></span>}
            <div className={styles.messageBody}><div className={styles.messageMeta}><strong>{message.role === "user" ? t("Tú") : t(agent.short)}</strong>{message.role === "agent" && <span>AGENT</span>}<time>{message.time}</time></div><MessageContent message={message} /></div>
          </article>)}
          {pending && <div className={styles.thinking} role="status"><span className={styles.messageAvatar} style={{ "--agent-color": agent.color } as CSSProperties}><Icon size={16} /></span><span>{t("Pensando…")}</span><span className={styles.dots} aria-hidden="true"><i /><i /><i /></span></div>}
        </div>
      </div>
      <footer className={styles.footer}>
        {showJump && <button className={styles.jump} onClick={() => { followBottom.current = true; setShowJump(false); if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }}><ArrowDown size={14} />{t("Ir al último mensaje")}</button>}
        <div className={styles.footerInner}><div className={styles.suggestions}>{agent.prompts.map(prompt => <button key={prompt} onClick={() => { setDrafts(current => ({ ...current, [active]: t(prompt) })); inputRef.current?.focus(); }}>{t(prompt)}<Plus size={12} /></button>)}</div>
          <form className={styles.composer} onSubmit={send}>
            <textarea ref={inputRef} aria-label={t("Escribe un mensaje")} placeholder={t("Pregunta, crea o explora una idea…")} value={draft} rows={2} maxLength={4000} onChange={event => setDrafts(current => ({ ...current, [active]: event.target.value }))} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!pending) event.currentTarget.form?.requestSubmit(); } }} />
            <div className={styles.composerBottom}><span><Sparkles size={13} />{t("Asistente de")} {t(agent.short).toLowerCase()}</span>{pending ? <Button type="button" className={styles.send} onClick={() => stop(active)} aria-label={t("Detener respuesta")}><Square size={14} fill="currentColor" /></Button> : <Button type="submit" className={styles.send} disabled={!draft.trim()} aria-label={t("Enviar mensaje")}><ArrowUp size={18} /></Button>}</div>
          </form>
          <div className={styles.footerNote}><span>{t("Demo interactiva · Respuestas generadas de forma simulada")}</span><span>{t("Enter para enviar · Shift + Enter para nueva línea")}</span></div>
        </div>
      </footer>
    </section>
  </div>;
}
