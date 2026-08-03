import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Download,
  ImagePlus,
  Loader2,
  Share2,
  Type as TypeIcon,
  Images,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { TemplateBrowser } from "@/components/studio/template-browser";
import { TypographyPanel } from "@/components/studio/text-panel";
import { createTextLayer, renderMeme, type TextLayer } from "@/lib/meme-render";
import { proxied, type Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio")({
  component: Studio,
  head: () => ({
    meta: [
      { title: "Studio — memm" },
      {
        name: "description",
        content:
          "A real canvas for memes: templates, typography controls, layers and HD export. Starts blank, always.",
      },
      { property: "og:title", content: "Studio — memm" },
      {
        property: "og:description",
        content: "Templates, typography, layers, HD export. Starts blank, always.",
      },
      { property: "og:url", content: "/studio" },
    ],
    links: [{ rel: "canonical", href: "/studio" }],
  }),
});

type Source = { url: string; width: number; height: number; id?: string } | null;

function Studio() {
  const [source, setSource] = useState<Source>(null);
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"templates" | "text" | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ratio = source ? source.width / source.height : 1;

  const update = useCallback((id: string, patch: Partial<TextLayer>) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const addLayer = useCallback(() => {
    const layer = createTextLayer({ y: 0.08 + Math.random() * 0.04 });
    setLayers((ls) => [...ls, layer]);
    setSelectedId(layer.id);
  }, []);

  const pickTemplate = useCallback((t: Template) => {
    setSource({ url: proxied(t.url), width: t.width, height: t.height, id: t.id });
    setMobilePanel(null);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("That's not an image.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setSource({
          url: String(reader.result),
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setUploading(false);
        toast.success("Uploaded. Looks dangerous.");
      };
      img.onerror = () => {
        setUploading(false);
        toast.error("Couldn't read that image.");
      };
      img.src = String(reader.result);
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Upload failed.");
    };
    reader.readAsDataURL(file);
  }, []);

  const buildBlob = useCallback(async () => {
    const width = source?.width ?? 1080;
    const height = source?.height ?? 1080;
    let image: HTMLImageElement | null = null;
    if (source) {
      image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.crossOrigin = "anonymous";
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = source.url;
      });
    }
    return renderMeme({
      image,
      layers,
      width,
      height,
      background: "#ffffff",
    });
  }, [source, layers]);

  const download = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await buildBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "memm.png";
      a.click();
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 1800);
    } catch {
      toast.error("Export failed. Try a different image.");
    } finally {
      setExporting(false);
    }
  }, [buildBlob]);

  const share = useCallback(async () => {
    try {
      const blob = await buildBlob();
      const file = new File([blob], "memm.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "made with memm" });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Copied to clipboard. Paste responsibly.");
      }
    } catch {
      toast.error("Sharing isn't available here.");
    }
  }, [buildBlob]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "t") {
        e.preventDefault();
        setMobilePanel("text");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void download();
      }
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        setLayers((ls) => ls.filter((l) => l.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [download, selectedId]);

  const startDrag = (e: React.PointerEvent, layer: TextLayer) => {
    e.preventDefault();
    setSelectedId(layer.id);
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = layer.x;
    const originY = layer.y;

    const move = (ev: PointerEvent) => {
      update(layer.id, {
        x: Math.min(1, Math.max(0, originX + (ev.clientX - startX) / rect.width)),
        y: Math.min(1, Math.max(0, originY + (ev.clientY - startY) / rect.height)),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const canvasHeight = boxRef.current?.clientHeight ?? 0;
  const canvasWidth = boxRef.current?.clientWidth ?? 0;
  const [, force] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(() => force((n) => n + 1));
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [source]);

  const layerNodes = useMemo(
    () =>
      layers.map((l) => (
        <div
          key={l.id}
          onPointerDown={(e) => startDrag(e, l)}
          role="button"
          tabIndex={0}
          aria-label={`Text layer: ${l.text}`}
          className={cn(
            "absolute cursor-grab select-none touch-none active:cursor-grabbing",
            selectedId === l.id && "outline outline-1 outline-signal",
          )}
          style={{
            left: `${l.x * 100}%`,
            top: `${l.y * 100}%`,
            width: `${l.width * 100}%`,
            transform: `translateX(-50%) rotate(${l.rotation}deg)`,
            fontFamily: l.font,
            fontWeight: l.weight,
            fontSize: canvasHeight ? `${l.size * canvasHeight}px` : "1px",
            lineHeight: l.lineHeight,
            letterSpacing: `${l.letterSpacing}em`,
            color: l.color,
            opacity: l.opacity,
            textAlign: l.align,
            textTransform: l.uppercase ? "uppercase" : "none",
            background: l.background ?? "transparent",
            WebkitTextStroke:
              l.strokeWidth > 0 && canvasHeight
                ? `${l.strokeWidth * l.size * canvasHeight}px ${l.strokeColor}`
                : undefined,
            paintOrder: "stroke fill",
            textShadow:
              l.shadow > 0 && canvasHeight
                ? `0 ${0.04 * l.size * canvasHeight}px ${0.25 * l.size * canvasHeight}px rgba(0,0,0,${l.shadow})`
                : undefined,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {l.text}
        </div>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layers, selectedId, canvasHeight, canvasWidth],
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Back home"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <img src="/logo.png" alt="" className="size-6 rounded-md" />
          <span className="text-sm font-semibold tracking-[-0.03em]">studio</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileRef.current?.click()}
            className="hidden h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:flex"
          >
            <ImagePlus className="size-4" /> Upload
          </button>
          {source && (
            <button
              onClick={() => setSource(null)}
              aria-label="Clear image"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <button
            onClick={share}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            aria-label="Share meme"
          >
            <Share2 className="size-4" />
          </button>
          <button
            onClick={download}
            disabled={exporting}
            className="flex h-9 items-center gap-2 rounded-lg bg-foreground px-3.5 text-sm font-medium text-background transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              {exporting ? (
                <motion.span
                  key="l"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  <Loader2 className="size-4 animate-spin" />
                </motion.span>
              ) : exported ? (
                <motion.span
                  key="d"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  <Check className="size-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="i"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  <Download className="size-4" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline">
              {exporting ? "Exporting" : exported ? "Saved" : "Export"}
            </span>
          </button>
        </div>
      </header>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[300px] shrink-0 border-r border-border lg:block">
          <TemplateBrowser onPick={pickTemplate} activeId={source?.id ?? null} />
        </aside>

        {/* Canvas */}
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className="relative flex min-w-0 flex-1 items-center justify-center overflow-auto bg-surface p-6 md:p-12"
        >
          <div
            ref={boxRef}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
            className="relative max-h-full w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]"
            style={{ aspectRatio: ratio }}
          >
            {source ? (
              <img
                src={source.url}
                alt="Meme canvas"
                className="pointer-events-none absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center px-8 text-center">
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    Blank canvas.
                  </p>
                  <p className="mt-1.5 max-w-xs text-xs text-neutral-500">
                    Pick a template, drop an image, or just add text. Nothing
                    happens until you say so.
                  </p>
                </div>
              </div>
            )}
            {layerNodes}

            <AnimatePresence>
              {(dragOver || uploading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 grid place-items-center bg-black/70 text-white"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <ImagePlus className="size-6" />
                    )}
                    <span className="text-sm">
                      {uploading ? "Optimizing" : "Drop it"}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <aside className="hidden w-[300px] shrink-0 border-l border-border lg:block">
          <TypographyPanel
            layers={layers}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={addLayer}
            onUpdate={update}
            onDuplicate={(id) => {
              const l = layers.find((x) => x.id === id);
              if (!l) return;
              const copy = { ...l, id: crypto.randomUUID(), y: Math.min(0.95, l.y + 0.06) };
              setLayers((ls) => [...ls, copy]);
              setSelectedId(copy.id);
            }}
            onDelete={(id) => {
              setLayers((ls) => ls.filter((l) => l.id !== id));
              if (selectedId === id) setSelectedId(null);
            }}
          />
        </aside>
      </div>

      {/* Mobile panels */}
      <div className="flex h-14 shrink-0 items-center justify-center gap-2 border-t border-border lg:hidden">
        <button
          onClick={() => setMobilePanel("templates")}
          className="flex h-10 items-center gap-2 rounded-lg bg-surface-2 px-4 text-sm"
        >
          <Images className="size-4" /> Templates
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-10 items-center gap-2 rounded-lg bg-surface-2 px-4 text-sm"
        >
          <ImagePlus className="size-4" /> Upload
        </button>
        <button
          onClick={() => setMobilePanel("text")}
          className="flex h-10 items-center gap-2 rounded-lg bg-surface-2 px-4 text-sm"
        >
          <TypeIcon className="size-4" /> Text
        </button>
      </div>

      <AnimatePresence>
        {mobilePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobilePanel(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 h-[78dvh] overflow-hidden rounded-t-2xl border-t border-border bg-background"
            >
              {mobilePanel === "templates" ? (
                <TemplateBrowser onPick={pickTemplate} activeId={source?.id ?? null} />
              ) : (
                <TypographyPanel
                  layers={layers}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onAdd={addLayer}
                  onUpdate={update}
                  onDuplicate={(id) => {
                    const l = layers.find((x) => x.id === id);
                    if (!l) return;
                    const copy = {
                      ...l,
                      id: crypto.randomUUID(),
                      y: Math.min(0.95, l.y + 0.06),
                    };
                    setLayers((ls) => [...ls, copy]);
                    setSelectedId(copy.id);
                  }}
                  onDelete={(id) => {
                    setLayers((ls) => ls.filter((l) => l.id !== id));
                    if (selectedId === id) setSelectedId(null);
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
