"use client";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  color: number;
};
export const TEAM_STORAGE_KEY = "kivora.workspace.team.v1";
const initialMembers: TeamMember[] = [
  {
    id: "sofia",
    name: "Sofía Martín",
    email: "sofia@equipo.com",
    role: "Product designer",
    color: 0,
  },
  {
    id: "lucas",
    name: "Lucas García",
    email: "lucas@equipo.com",
    role: "Frontend developer",
    color: 1,
  },
  {
    id: "emma",
    name: "Emma Wilson",
    email: "emma@equipo.com",
    role: "Design engineer",
    color: 2,
  },
  {
    id: "leo",
    name: "Leo Fernández",
    email: "leo@equipo.com",
    role: "Creative developer",
    color: 3,
  },
];
let members = initialMembers;
let lastRaw: string | null | undefined;
let memoryOnly = false;
const listeners = new Set<() => void>();

function isTeam(
  value: unknown,
): value is { version: 1; members: TeamMember[] } {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1 ||
    !("members" in value) ||
    !Array.isArray(value.members)
  )
    return false;
  const ids = new Set<string>();
  return value.members.every((member: unknown) => {
    if (!member || typeof member !== "object") return false;
    const item = member as Record<string, unknown>;
    if (
      !["id", "name", "email", "role"].every(
        (key) => typeof item[key] === "string" && (item[key] as string).trim(),
      ) ||
      !Number.isInteger(item.color) ||
      Number(item.color) < 0 ||
      Number(item.color) > 3 ||
      ids.has(item.id as string)
    )
      return false;
    ids.add(item.id as string);
    return true;
  });
}
export function getTeamSnapshot() {
  if (memoryOnly) return members;
  try {
    const raw = window.sessionStorage.getItem(TEAM_STORAGE_KEY);
    if (raw !== lastRaw) {
      lastRaw = raw;
      try {
        const value: unknown = raw ? JSON.parse(raw) : null;
        members = isTeam(value) ? value.members : initialMembers;
      } catch {
        members = initialMembers;
      }
    }
  } catch {
    memoryOnly = true;
  }
  return members;
}
export function getServerTeamSnapshot() {
  return initialMembers;
}
export function subscribeToTeam(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (
      event.storageArea === window.sessionStorage &&
      (event.key === TEAM_STORAGE_KEY || event.key === null)
    )
      listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
export function saveTeam(next: TeamMember[]) {
  members = next;
  try {
    const raw = JSON.stringify({ version: 1, members: next });
    window.sessionStorage.setItem(TEAM_STORAGE_KEY, raw);
    lastRaw = raw;
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  listeners.forEach((listener) => listener());
  return !memoryOnly;
}
