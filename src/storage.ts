import type { Task, User } from "./types";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const getUsers = () => read<Record<string, User>>("tm:users", {});
export const saveUsers = (u: Record<string, User>) => write("tm:users", u);

export const getSession = () => read<string | null>("tm:session", null);
export const setSession = (email: string) => write("tm:session", email);
export const clearSession = () => {
  try {
    localStorage.removeItem("tm:session");
  } catch {
    /* ignore */
  }
};

export const loadTasks = (email: string) => read<Task[]>(`tm:tasks:${email}`, []);
export const saveTasks = (email: string, tasks: Task[]) => write(`tm:tasks:${email}`, tasks);

// Demo-only hashing. A real app must hash passwords on a server.
export async function hashPassword(pw: string): Promise<string> {
  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return btoa(encodeURIComponent(pw));
}