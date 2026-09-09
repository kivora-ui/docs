"use client";
import { useT } from "../../_lib/i18n/provider";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@kivora/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  getServerTeamSnapshot,
  getTeamSnapshot,
  saveTeam,
  subscribeToTeam,
  type TeamMember,
} from "./team-store";
import styles from "../page.module.css";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const pageSize = 4;
type Draft = { id?: string; name: string; email: string; role: string };

export function TeamCard() {
  const t = useT();
  const members = useSyncExternalStore(
    subscribeToTeam,
    getTeamSnapshot,
    getServerTeamSnapshot,
  );
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = members.filter((member) =>
    normalize(`${member.name} ${member.email} ${member.role}`).includes(
      normalize(query),
    ),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  function returnFocus(event: Event) {
    event.preventDefault();
    (trigger.current?.isConnected
      ? trigger.current
      : searchRef.current
    )?.focus();
  }
  function openEditor(value: Draft) {
    trigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDraft(value);
    setError("");
  }
  function persist(next: TeamMember[], message: string) {
    const stored = saveTeam(next);
    setStorageWarning(!stored);
    setNotice(
      stored
        ? message
        : t(
            "{0} El navegador no permite guardar la sesión; los cambios durarán hasta recargar.",
            { 0: message },
          ),
    );
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const name = draft.name.trim();
    const email = draft.email.trim().toLowerCase();
    const role = draft.role.trim();
    if (!name || !email || !role) {
      setError(t("Completa el nombre, el email y el rol."));
      return;
    }
    const latest = getTeamSnapshot();
    if (
      latest.some(
        (member) =>
          member.id !== draft.id && member.email.toLowerCase() === email,
      )
    ) {
      setError(t("Ya existe una persona con este email."));
      return;
    }
    if (draft.id && !latest.some((member) => member.id === draft.id)) {
      setError(
        t(
          "Esta persona ya no está en el equipo. Cierra el diálogo y revisa la lista.",
        ),
      );
      return;
    }
    const next = draft.id
      ? latest.map((member) =>
          member.id === draft.id ? { ...member, name, email, role } : member,
        )
      : [
          {
            id: crypto.randomUUID(),
            name,
            email,
            role,
            color: latest.length % 4,
          },
          ...latest,
        ];
    persist(
      next,
      draft.id
        ? t("Datos de {0} actualizados.", { 0: name })
        : t("{0} se ha añadido al equipo de ejemplo.", { 0: name }),
    );
    if (!draft.id) {
      setQuery("");
      setPage(0);
    }
    setDraft(null);
  }

  return (
    <Card className={`${styles.card} ${styles.teamCard}`}>
      <div className={styles.cardHeading}>
        <h2>{t("Un gran equipo.")}</h2>
        <p>{t("Las mejores ideas empiezan con las personas.")}</p>
      </div>
      <div className={styles.inlineForm}>
        <div className={styles.teamSearch}>
          <Search size={14} aria-hidden="true" />
          <Input
            ref={searchRef}
            type="search"
            placeholder={t("Buscar en el equipo…")}
            aria-label={t("Buscar en el equipo")}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </div>
        <Button
          type="button"
          onClick={() => openEditor({ name: "", email: "", role: "" })}
        >
          <Plus size={15} />
          {t("Invitar")}
        </Button>
      </div>
      <ul className={styles.teamPeople} aria-label={t("Miembros del equipo")}>
        {visible.map((member) => (
          <li className={styles.teamRow} key={member.id}>
            <Avatar className={styles.avatar}>
              <AvatarFallback
                style={{
                  background: ["#e8dbf5", "#dbeae1", "#f7ddcf", "#dce4fb"][
                    member.color
                  ],
                  color: "#403b50",
                }}
              >
                {member.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className={styles.teamIdentity}>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
              <span className={styles.teamEmail}>{member.email}</span>
            </div>
            <div className={styles.teamActions}>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("Editar a {0}", { 0: member.name })}
                onClick={() =>
                  openEditor({
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                  })
                }
              >
                <Pencil size={13} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("Eliminar a {0}", { 0: member.name })}
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setDeleting(member);
                }}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p className={styles.teamEmpty}>
          {members.length
            ? t("No hay personas que coincidan con tu búsqueda.")
            : t("Tu equipo está vacío. Invita a la primera persona.")}
        </p>
      )}
      <div className={styles.cardBottom}>
        <span>
          {query
            ? t("{0} de {1} personas", {
                0: filtered.length,
                1: members.length,
              })
            : t("{0} {1}, infinitas posibilidades.", {
                0: members.length,
                1: members.length === 1 ? t("persona") : t("personas"),
              })}
        </span>
        <Badge variant="secondary">Pro team</Badge>
      </div>
      {pages > 1 && (
        <nav
          className={styles.teamPagination}
          aria-label={t("Páginas del equipo")}
        >
          <span>
            {t("Página")} {currentPage + 1} {t("de")} {pages}
          </span>
          <div>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 0}
              aria-label={t("Página anterior del equipo")}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === pages - 1}
              aria-label={t("Página siguiente del equipo")}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </nav>
      )}
      <p
        className={storageWarning ? styles.teamNotice : "sr-only"}
        role="status"
      >
        {notice}
      </p>

      <Dialog
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <DialogContent
          className={styles.teamDialog}
          onCloseAutoFocus={returnFocus}
        >
          <DialogHeader>
            <DialogTitle>
              {draft?.id ? t("Editar persona") : t("Invitar al equipo")}
            </DialogTitle>
            <DialogDescription>
              {draft?.id
                ? t("Actualiza los datos de esta persona en tu equipo.")
                : t(
                    "Añade una persona a este equipo de ejemplo. No se envían correos; los cambios se guardan en esta pestaña.",
                  )}
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <form className={styles.teamForm} onSubmit={submit}>
              <div>
                <Label htmlFor="team-name">{t("Nombre")}</Label>
                <Input
                  id="team-name"
                  value={draft.name}
                  maxLength={80}
                  required
                  autoComplete="name"
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="team-email">Email</Label>
                <Input
                  id="team-email"
                  type="email"
                  value={draft.email}
                  maxLength={254}
                  required
                  autoComplete="email"
                  onChange={(event) => {
                    setDraft({ ...draft, email: event.target.value });
                    setError("");
                  }}
                  aria-describedby={error ? "team-form-error" : undefined}
                />
              </div>
              <div>
                <Label htmlFor="team-role">{t("Rol")}</Label>
                <Input
                  id="team-role"
                  value={draft.role}
                  maxLength={80}
                  required
                  placeholder={t("Por ejemplo, Product designer")}
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value })
                  }
                />
              </div>
              {error && (
                <p
                  id="team-form-error"
                  className={styles.teamError}
                  role="alert"
                >
                  {error}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDraft(null)}
                >
                  {t("Cancelar")}
                </Button>
                <Button type="submit">
                  {draft.id ? t("Guardar cambios") : t("Añadir al equipo")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent
          className={styles.teamDialog}
          onCloseAutoFocus={returnFocus}
        >
          <DialogHeader>
            <DialogTitle>{t("Eliminar del equipo")}</DialogTitle>
            <DialogDescription>
              {t("¿Quieres eliminar a")} {deleting?.name}{" "}
              {t("de este equipo de ejemplo?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("Cancelar")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting)
                  persist(
                    getTeamSnapshot().filter(
                      (member) => member.id !== deleting.id,
                    ),
                    t("{0} se ha eliminado del equipo.", { 0: deleting.name }),
                  );
                setDeleting(null);
              }}
            >
              {t("Eliminar persona")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
