import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Star, Clock, Flame, X } from "lucide-react";
import {
  categories,
  favorites,
  proxied,
  recents,
  searchTemplates,
  templates,
  type Template,
} from "@/lib/templates";
import { cn } from "@/lib/utils";

type Tab = "all" | "trending" | "favorites" | "recent";

export function TemplateBrowser({
  onPick,
  activeId,
}: {
  onPick: (t: Template) => void;
  activeId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [favs, setFavs] = useState<string[]>(() => favorites.all());
  const [recent, setRecent] = useState<string[]>(() => recents.all());

  const list = useMemo(() => {
    let base = searchTemplates(query, category);
    if (tab === "trending") base = base.slice(0, 24);
    if (tab === "favorites") base = base.filter((t) => favs.includes(t.id));
    if (tab === "recent")
      base = recent
        .map((id) => templates.find((t) => t.id === id))
        .filter((t): t is Template => Boolean(t))
        .filter((t) => base.includes(t));
    return base;
  }, [query, category, tab, favs, recent]);

  const tabs: { id: Tab; label: string; icon: typeof Flame }[] = [
    { id: "all", label: "All", icon: Search },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "recent", label: "Recent", icon: Clock },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-3 border-b border-border p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            aria-label="Search templates"
            className="h-10 w-full rounded-lg bg-surface-2 pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-signal"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                tab === t.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="browser-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-md bg-surface-2"
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          <Chip active={!category} onClick={() => setCategory(null)}>
            Everything
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {list.length === 0 ? (
          <p className="px-2 py-10 text-center text-sm text-muted-foreground">
            Nothing here yet. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {list.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onPick(t);
                  setRecent(recents.push(t.id));
                }}
                className={cn(
                  "group relative overflow-hidden rounded-lg bg-surface-2 text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]",
                  activeId === t.id && "ring-2 ring-signal",
                )}
                title={t.name}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={proxied(t.url)}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[10px] font-medium text-white">
                  {t.name}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Favorite ${t.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavs(favorites.toggle(t.id));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      setFavs(favorites.toggle(t.id));
                    }
                  }}
                  className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-md bg-black/45 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Star
                    className={cn(
                      "size-3.5",
                      favs.includes(t.id) && "fill-current text-signal",
                    )}
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-surface-2 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
