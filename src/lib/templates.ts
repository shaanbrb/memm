import raw from "@/data/templates.json";

export type Template = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  captions: number;
  category: string;
};

export const templates = raw as Template[];

export const categories = Array.from(
  new Set(templates.map((t) => t.category)),
).sort();

/** Same-origin proxy keeps the export canvas untainted. */
export function proxied(url: string) {
  return `/api/public/img?url=${encodeURIComponent(url)}`;
}

export function searchTemplates(query: string, category: string | null) {
  const q = query.trim().toLowerCase();
  return templates.filter((t) => {
    if (category && t.category !== category) return false;
    if (!q) return true;
    return t.name.toLowerCase().includes(q);
  });
}

const FAV_KEY = "memm.favorites";
const RECENT_KEY = "memm.recent";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function write(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids.slice(0, 40)));
}

export const favorites = {
  all: () => read(FAV_KEY),
  toggle(id: string) {
    const cur = read(FAV_KEY);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    write(FAV_KEY, next);
    return next;
  },
};

export const recents = {
  all: () => read(RECENT_KEY),
  push(id: string) {
    const next = [id, ...read(RECENT_KEY).filter((x) => x !== id)];
    write(RECENT_KEY, next);
    return next;
  },
};
