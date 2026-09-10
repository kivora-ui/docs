"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Badge, Button, Switch } from "@kivora/nextjs";
import { AlertTriangle, OctagonAlert, CircleAlert, Activity, AudioLines, BatteryCharging, Check, ChevronRight, Circle, Crosshair, Fan, Flame, HeartPulse, ListChecks, Maximize2, Mic, Pause, Play, Radio, Rocket, ShieldCheck, X } from "lucide-react";
import { useT } from "../../_lib/i18n/provider";
import { flightSystems, subsystems, type SubsystemId } from "./spacecraft-data";
import styles from "./spacecraft.module.css";

const navIcons = { overview: Rocket, life: HeartPulse, comms: Radio, prop: Flame, power: BatteryCharging, thermal: Fan };
function Gauge({ label, value, unit, max, compact = false, severity = "nominal" }: { label: string; value: number; unit: string; max: number; compact?: boolean; severity?: string }) {
  return <div className={`${styles.gauge} ${compact ? styles.compactGauge : ""}`} data-severity={severity} role="meter" aria-label={label} aria-valuenow={Number(value.toFixed(2))} aria-valuemin={0} aria-valuemax={max} aria-valuetext={`${value.toFixed(2)} ${unit}`}>
    <svg viewBox="0 0 140 125" aria-hidden="true"><path className={styles.gaugeTicks} d="M 25 107 A 59 59 0 1 1 115 107" /><path className={styles.gaugeTrack} d="M 27 105 A 56 56 0 1 1 113 105" pathLength="100" /><path className={styles.gaugeValue} d="M 27 105 A 56 56 0 1 1 113 105" pathLength="100" strokeDasharray={`${Math.min(100, value / max * 100)} 100`} /></svg>
    <div><span>{label}</span><strong>{value.toFixed(2)}</strong><small>{unit}</small></div>
  </div>;
}
function Connections({ title, rows }: { title: string; rows: readonly (readonly string[])[] }) {
  const t = useT();
  return <section className={styles.connections}><h3>{t(title)}</h3><dl>{rows.map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl></section>;
}
export function SpacecraftApp() {
  const t = useT();
  const [alerts, setAlerts] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [active, setActive] = useState<SubsystemId>("overview");
  const [tick, setTick] = useState(0);
  const [live, setLive] = useState(true);
  const [recording, setRecording] = useState(true);
  const [lights, setLights] = useState(true);
  const [sideMode, setSideMode] = useState<"systems" | "cabin">("systems");
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [notice, setNotice] = useState("");
  const [log, setLog] = useState<string[]>(["Enlace de telemetría establecido", "Comprobación inicial completada", "Modo de seguimiento orbital activo"]);
  const [modal, setModal] = useState<"log" | "vehicle" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subsystem = subsystems.find(item => item.id === active)!;
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => setTick(current => current + 1), 2000);
    return () => clearInterval(timer);
  }, [live]);
  useEffect(() => () => { if (checkTimer.current) clearTimeout(checkTimer.current); }, []);
  useEffect(() => { if (modal) dialog.current?.showModal(); else dialog.current?.close(); }, [modal]);
  function record(message: string) { setNotice(t(message)); setLog(current => [message, ...current].slice(0, 20)); }
  function checkSystems() {
    if (checkTimer.current) return;
    setChecking(true); setChecked(false); record("Comprobación de sistemas en curso");
    checkTimer.current = setTimeout(() => { checkTimer.current = null; setChecking(false); setChecked(true); record(alerts ? "Comprobación completada: 3 alertas requieren atención" : "Comprobación completada: todos los sistemas nominales"); }, 1800);
  }
  const wave = Math.sin(tick / 4);
  const elapsed = 8072 + tick * 2;
  const met = `${String(Math.floor(elapsed / 3600)).padStart(2, "0")}:${String(Math.floor(elapsed % 3600 / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const orbit = [
    { label: "Velocidad orbital", value: (7.68 + wave * .01).toFixed(2), unit: "km/s", percent: 84 },
    { label: "Altitud", value: (390 + wave * .4).toFixed(1), unit: "km", percent: 68 },
    { label: "Apogeo", value: "404.4", unit: "km", percent: 76 },
    { label: "Perigeo", value: "389.4", unit: "km", percent: 64 },
    { label: "Inclinación", value: "51.67", unit: "°", percent: 57 },
    { label: "Distancia a la estación", value: Math.max(.02, .12 - tick * .0002).toFixed(2), unit: "km", percent: 91 },
  ];
  return <div className={styles.app}>
    <header className={styles.topbar}><div className={styles.brand}><Rocket size={19} /><strong>ODYSSEY<span>FLIGHT INTERFACE</span></strong></div><div className={styles.mission}><span>MISSION / ORB-07</span><span><i />{t("ÓRBITA ESTABLE")}</span></div><div className={styles.topActions}><Badge variant="outline">{t("SIMULACIÓN")}</Badge><button onClick={() => setModal("log")} aria-label={t("Abrir registro de vuelo")}><ListChecks size={17} /></button></div></header>
    <div className={styles.alertStrip} data-alerting={alerts} role="region" aria-label={t("Estado de las alertas")}><div><AlertTriangle size={16} /><strong>{t(alerts ? "3 ALERTAS ACTIVAS" : "SISTEMAS NOMINALES")}</strong><span>{t(alerts ? "Alarma de presión · Error de energía · Aviso térmico" : "Todos los parámetros dentro de rango")}</span></div><div>{alerts && <button onClick={() => { setAcknowledged(true); record("Alertas reconocidas: pendientes de resolución"); }}>{t(acknowledged ? "Reconocidas" : "Reconocer alertas")}</button>}<button onClick={() => { setAlerts(!alerts); setAcknowledged(false); setChecked(false); record(alerts ? "Simulación restablecida: todos los sistemas nominales" : "Escenario de alertas activado"); }}>{t(alerts ? "Restablecer simulación" : "Simular alertas")}</button></div></div>
    <div className={styles.deck}>
      <aside className={styles.systems}>
        <div className={styles.sectionHeading}><span>01 / {t(sideMode === "systems" ? "SISTEMAS" : "CABINA")}</span><span className={styles.statusLed} /></div>
        {sideMode === "systems" ? <div className={styles.systemList}>{flightSystems.map(system => { const severity = alerts ? ({ pressure: "alarm", power: "error", thermal: "warning" } as Record<string, string>)[system.id] ?? system.state : system.state; const detail = alerts ? ({ pressure: "ALARMA · Presión por debajo del umbral", power: "ERROR · Bus secundario desconectado", thermal: "AVISO · Temperatura elevada" } as Record<string, string>)[system.id] ?? system.detail : system.detail; return <div key={system.id} data-severity={severity}><span className={styles.systemIndicator} data-state={severity}>{severity === "alarm" ? <OctagonAlert size={14} /> : severity === "error" ? <CircleAlert size={14} /> : severity === "warning" ? <AlertTriangle size={14} /> : system.state === "standby" ? <Circle size={12} /> : <Check size={12} />}</span><div><h2>{t(system.name)}</h2><p>{t(checking ? "Comprobando…" : detail)}</p></div></div>; })}</div> : <div className={styles.cabinControls}><h2>{t("Entorno de la tripulación")}</h2><div><span><Mic size={16} />{t("Micrófonos de cabina")}</span><Switch checked={recording} aria-label={t("Micrófonos de cabina")} onCheckedChange={value => { setRecording(value); record(value ? "Grabación de cabina activada" : "Grabación de cabina pausada"); }} /></div><div><span><Circle size={16} />{t("Iluminación interior")}</span><Switch checked={lights} aria-label={t("Iluminación interior")} onCheckedChange={value => { setLights(value); record(value ? "Iluminación de cabina activada" : "Iluminación de cabina atenuada"); }} /></div><dl><div><dt>{t("Tripulación")}</dt><dd>04</dd></div><div><dt>{t("Humedad")}</dt><dd>42%</dd></div><div><dt>{t("Ventilación")}</dt><dd>{t("Automático")}</dd></div></dl></div>}
        <div className={styles.systemActions}><Button variant="outline" onClick={checkSystems} disabled={checking}>{checking ? <Activity size={14} /> : <ShieldCheck size={14} />}{t(checking ? "Comprobando…" : checked ? "Volver a comprobar" : "Comprobar sistemas")}</Button><div className={styles.modeSwitch} role="group" aria-label={t("Panel lateral")}><button aria-pressed={sideMode === "systems"} onClick={() => setSideMode("systems")}>{t("Sistemas")}</button><button aria-pressed={sideMode === "cabin"} onClick={() => setSideMode("cabin")}>{t("Cabina")}</button></div></div>
      </aside>
      <section className={styles.vehicle} aria-label={t("Panel de la nave")}>
        <div className={styles.vehicleTitle}><span>02 / {t("VEHÍCULO")}</span><h1>{t(subsystem.title)}</h1><button onClick={() => setModal("vehicle")} aria-label={t("Ampliar nave")}><Maximize2 size={15} /></button></div>
        <div className={styles.primaryGauges}><Gauge label="PPO₂" value={3.06 + wave * .02} unit="psia" max={5} /><Gauge label={t("TEMP. CABINA")} severity={alerts ? "warning" : "nominal"} value={(alerts ? 31.4 : 22.4) + wave * .15} unit="°C" max={35} /><Gauge label={t("PRESIÓN CABINA")} severity={alerts ? "alarm" : "nominal"} value={(alerts ? 10.2 : 14.7) + wave * .01} unit="psia" max={20} /><Gauge label="CO₂" value={.07 + Math.abs(wave) * .005} unit="mmHg" max={.3} /></div>
        <div className={styles.vehicleStage}>
          <div className={styles.stageLeft}><div className={styles.auxGauges}><Gauge compact label={t("CIRCUITO A")} value={18.85 + wave * .1} unit="°C" max={30} /><Gauge compact label={t("CIRCUITO B")} value={18.57 - wave * .1} unit="°C" max={30} /></div><Connections title={subsystem.leftTitle} rows={subsystem.left} /></div>
          <figure className={styles.spacecraft}><div className={styles.shipGlow} aria-hidden="true" /><Image src="/nave.png" alt={t("Nave espacial de la misión Odyssey")} fill sizes="(max-width: 600px) 85vw, (max-width: 1000px) 45vw, 34vw" priority className={styles.shipImage} /><figcaption><Mic size={11} />{t("CABIN AUDIO")}<span data-recording={recording}>{t(recording ? "GRABANDO" : "PAUSADO")}</span></figcaption></figure>
          <div className={styles.stageRight}><div className={styles.auxGauges}><Gauge compact label={t("POTENCIA 1")} value={1.82 + wave * .03} unit="kW" max={3} /><Gauge compact label={t("POTENCIA 2")} severity={alerts ? "error" : "nominal"} value={alerts ? 0 : 1.76 - wave * .03} unit="kW" max={3} /></div><Connections title={subsystem.rightTitle} rows={subsystem.right} /></div>
        </div>
        <div className={styles.vehicleCaption}><Crosshair size={12} /><span>{t(alerts && active === "overview" ? "Atención requerida: 3 anomalías detectadas" : subsystem.description)}</span><span>C207 / ODYSSEY</span></div>
      </section>
      <aside className={styles.orbit}>
        <div className={styles.sectionHeading}><span>03 / {t("NAVEGACIÓN")}</span><Crosshair size={13} /></div>
        <div className={styles.orbitHeader}><span>{t("PARÁMETRO")}</span><span>{t("VALOR")}</span></div><dl>{orbit.map(item => <div key={item.label}><dt>{t(item.label)}</dt><dd><div className={styles.orbitTrack} role="meter" aria-label={t(item.label)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent} aria-valuetext={`${item.value} ${item.unit}`}><i style={{ width: `${item.percent}%` }} /><span style={{ left: `${item.percent - 10}%` } as CSSProperties} /></div><strong>{item.value}<small>{item.unit}</small></strong></dd></div>)}</dl>
        <div className={styles.target}><span>{t("OBJETIVO DE ENCUENTRO")}</span><div><Crosshair size={25} /><strong>ISS<span>{t("Aproximación orbital")}</span></strong></div><p>{t("Corredor de aproximación nominal")}</p></div>
        <button className={styles.liveToggle} onClick={() => { setLive(!live); record(live ? "Telemetría pausada" : "Telemetría reanudada"); }}>{live ? <Pause size={13} /> : <Play size={13} />}{t(live ? "Pausar telemetría" : "Reanudar telemetría")}</button>
      </aside>
    </div>
    <div className={styles.consoleBottom}><div className={styles.missionTime}><span>MISSION ELAPSED TIME</span><strong data-testid="mission-time">{met}</strong></div><nav aria-label={t("Subsistemas de la nave")} className={styles.subsystemNav}>{subsystems.map(item => { const Icon = navIcons[item.id]; return <button key={item.id} aria-pressed={active === item.id} onClick={() => setActive(item.id)}><Icon size={22} /><span>{t(item.name)}</span></button>; })}</nav><button className={styles.logButton} onClick={() => setModal("log")}><ListChecks size={16} />{t("Registro de vuelo")}<ChevronRight size={14} /></button></div>
    <footer className={styles.footer}><span><Radio size={12} />{t(live ? "ENLACE ACTIVO" : "ENLACE PAUSADO")}<i />TDRS / S-BAND</span><p role="status">{notice || t("Datos de demostración · Sin conexión con una nave real")}</p><span><AudioLines size={12} />ODYSSEY OS <small>v.04.12</small></span></footer>
    <dialog ref={dialog} className={styles.modal} aria-label={t(modal === "vehicle" ? "Vista de la nave" : "Registro de vuelo")} onCancel={() => setModal(null)}><header><h2>{t(modal === "vehicle" ? "Vista de la nave" : "Registro de vuelo")}</h2><button onClick={() => setModal(null)} aria-label={t("Cerrar")}><X size={20} /></button></header>{modal === "vehicle" ? <div className={styles.expandedShip}><Image src="/nave.png" alt={t("Nave espacial de la misión Odyssey")} fill sizes="80vw" className={styles.shipImage} /></div> : <div className={styles.flightLog}><span>{t("Eventos de esta sesión")}</span><ol>{log.map((entry, index) => <li key={`${entry}-${index}`}><span>{String(log.length - index).padStart(2, "0")}</span><Check size={13} /><p>{t(entry)}</p></li>)}</ol></div>}</dialog>
  </div>;
}
