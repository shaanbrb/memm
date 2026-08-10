import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CaseUpper,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import { FONTS, type TextLayer } from "@/lib/meme-render";
import { cn } from "@/lib/utils";

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        {value && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {value}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Range({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-foreground"
    />
  );
}

function Swatch({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg bg-surface-2 px-2 py-1.5">
      <input
        type="color"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
      />
      <span className="font-mono text-[11px] text-muted-foreground">{value}</span>
    </label>
  );
}

export function TypographyPanel({
  layers,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onDuplicate,
  onDelete,
}: {
  layers: TextLayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<TextLayer>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const layer = layers.find((l) => l.id === selectedId) ?? null;
  const set = (patch: Partial<TextLayer>) => layer && onUpdate(layer.id, patch);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border p-4">
        <button
          onClick={onAdd}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-medium text-background transition-transform active:scale-[0.98]"
        >
          <Plus className="size-4" /> Add text
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-border p-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Layers
          </p>
          {layers.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No layers yet. Text only appears when you add it.
            </p>
          ) : (
            <ul className="space-y-1">
              {layers.map((l) => (
                <li key={l.id}>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors",
                      l.id === selectedId ? "bg-surface-2" : "hover:bg-surface",
                    )}
                  >
                    <button
                      onClick={() => onSelect(l.id)}
                      className="flex-1 truncate text-left"
                    >
                      {l.text || "Empty text"}
                    </button>
                    <button
                      onClick={() => onDuplicate(l.id)}
                      aria-label="Duplicate layer"
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(l.id)}
                      aria-label="Delete layer"
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {!layer ? (
          <p className="p-4 text-xs text-muted-foreground">
            Select a layer to edit its typography.
          </p>
        ) : (
          <div className="space-y-5 p-4">
            <Row label="Content">
              <textarea
                value={layer.text}
                onChange={(e) => set({ text: e.target.value })}
                rows={2}
                aria-label="Layer text"
                className="w-full resize-none rounded-lg bg-surface-2 p-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal"
              />
            </Row>

            <Row label="Font">
              <div className="space-y-1">
                {FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => set({ font: f.value })}
                    style={{ fontFamily: f.value }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                      layer.font === f.value
                        ? "bg-foreground text-background"
                        : "bg-surface-2 hover:bg-accent",
                    )}
                  >
                    <span>{f.label}</span>
                    <span className="text-xs opacity-70">Aa memes</span>
                  </button>
                ))}
              </div>
            </Row>

            <Row label="Size" value={`${Math.round(layer.size * 100)}`}>
              <Range
                label="Font size"
                min={0.02}
                max={0.3}
                step={0.005}
                value={layer.size}
                onChange={(v) => set({ size: v })}
              />
            </Row>

            <Row label="Weight" value={String(layer.weight)}>
              <Range
                label="Font weight"
                min={300}
                max={900}
                step={100}
                value={layer.weight}
                onChange={(v) => set({ weight: v })}
              />
            </Row>

            <Row label="Alignment">
              <div className="flex gap-1">
                {(
                  [
                    ["left", AlignLeft],
                    ["center", AlignCenter],
                    ["right", AlignRight],
                  ] as const
                ).map(([a, Icon]) => (
                  <button
                    key={a}
                    onClick={() => set({ align: a })}
                    aria-label={`Align ${a}`}
                    className={cn(
                      "flex h-8 flex-1 items-center justify-center rounded-md transition-colors",
                      layer.align === a
                        ? "bg-foreground text-background"
                        : "bg-surface-2 hover:bg-accent",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
                <button
                  onClick={() => set({ uppercase: !layer.uppercase })}
                  aria-label="Toggle uppercase"
                  aria-pressed={layer.uppercase}
                  className={cn(
                    "flex h-8 flex-1 items-center justify-center rounded-md transition-colors",
                    layer.uppercase
                      ? "bg-foreground text-background"
                      : "bg-surface-2 hover:bg-accent",
                  )}
                >
                  <CaseUpper className="size-4" />
                </button>
              </div>
            </Row>

            <Row label="Fill">
              <Swatch
                label="Text color"
                value={layer.color}
                onChange={(v) => set({ color: v })}
              />
            </Row>

            <Row label="Outline" value={layer.strokeWidth.toFixed(2)}>
              <div className="space-y-2">
                <Range
                  label="Outline width"
                  min={0}
                  max={0.2}
                  step={0.005}
                  value={layer.strokeWidth}
                  onChange={(v) => set({ strokeWidth: v })}
                />
                <Swatch
                  label="Outline color"
                  value={layer.strokeColor}
                  onChange={(v) => set({ strokeColor: v })}
                />
              </div>
            </Row>

            <Row label="Shadow" value={layer.shadow.toFixed(2)}>
              <Range
                label="Shadow"
                min={0}
                max={1}
                step={0.05}
                value={layer.shadow}
                onChange={(v) => set({ shadow: v })}
              />
            </Row>

            <Row label="Background">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    set({ background: layer.background ? null : "#000000" })
                  }
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    layer.background
                      ? "bg-foreground text-background"
                      : "bg-surface-2 hover:bg-accent",
                  )}
                >
                  {layer.background ? "On" : "Off"}
                </button>
                {layer.background && (
                  <Swatch
                    label="Background color"
                    value={layer.background}
                    onChange={(v) => set({ background: v })}
                  />
                )}
              </div>
            </Row>

            <Row label="Opacity" value={`${Math.round(layer.opacity * 100)}%`}>
              <Range
                label="Opacity"
                min={0.1}
                max={1}
                step={0.05}
                value={layer.opacity}
                onChange={(v) => set({ opacity: v })}
              />
            </Row>

            <Row label="Rotation" value={`${layer.rotation}°`}>
              <Range
                label="Rotation"
                min={-45}
                max={45}
                step={1}
                value={layer.rotation}
                onChange={(v) => set({ rotation: v })}
              />
            </Row>

            <Row label="Letter spacing" value={layer.letterSpacing.toFixed(2)}>
              <Range
                label="Letter spacing"
                min={-0.05}
                max={0.4}
                step={0.01}
                value={layer.letterSpacing}
                onChange={(v) => set({ letterSpacing: v })}
              />
            </Row>

            <Row label="Line height" value={layer.lineHeight.toFixed(2)}>
              <Range
                label="Line height"
                min={0.8}
                max={2}
                step={0.05}
                value={layer.lineHeight}
                onChange={(v) => set({ lineHeight: v })}
              />
            </Row>

            <Row label="Box width" value={`${Math.round(layer.width * 100)}%`}>
              <Range
                label="Box width"
                min={0.2}
                max={1}
                step={0.02}
                value={layer.width}
                onChange={(v) => set({ width: v })}
              />
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
