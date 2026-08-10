export type TextLayer = {
  id: string;
  text: string;
  /** all geometry stored as fractions of the canvas box */
  x: number;
  y: number;
  width: number;
  size: number;
  font: string;
  weight: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadow: number;
  background: string | null;
  opacity: number;
  rotation: number;
  align: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  uppercase: boolean;
};

export const FONTS = [
  { label: "Impact", value: "Anton, Impact, sans-serif" },
  { label: "Geist Sans", value: "Geist, sans-serif" },
  { label: "Geist Mono", value: "Geist Mono, monospace" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "System", value: "system-ui, sans-serif" },
];

export function createTextLayer(partial: Partial<TextLayer> = {}): TextLayer {
  return {
    id: crypto.randomUUID(),
    text: "Your text",
    x: 0.5,
    y: 0.12,
    width: 0.9,
    size: 0.1,
    font: FONTS[0]!.value,
    weight: 400,
    color: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 0.08,
    shadow: 0.2,
    background: null,
    opacity: 1,
    rotation: 0,
    align: "center",
    letterSpacing: 0,
    lineHeight: 1.1,
    uppercase: true,
    ...partial,
  };
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function renderMeme({
  image,
  layers,
  width,
  height,
  background,
}: {
  image: HTMLImageElement | null;
  layers: TextLayer[];
  width: number;
  height: number;
  background: string;
}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  if (image) ctx.drawImage(image, 0, 0, width, height);

  for (const l of layers) {
    const fontSize = l.size * height;
    const text = l.uppercase ? l.text.toUpperCase() : l.text;
    ctx.save();
    ctx.globalAlpha = l.opacity;
    ctx.font = `${l.weight} ${fontSize}px ${l.font}`;
    ctx.textAlign = l.align;
    ctx.textBaseline = "top";
    ctx.letterSpacing = `${l.letterSpacing * fontSize}px`;

    const boxWidth = l.width * width;
    const lines = wrap(ctx, text, boxWidth);
    const lineH = fontSize * l.lineHeight;

    const cx = l.x * width;
    const cy = l.y * height;
    ctx.translate(cx, cy);
    ctx.rotate((l.rotation * Math.PI) / 180);

    const originX =
      l.align === "center" ? 0 : l.align === "left" ? -boxWidth / 2 : boxWidth / 2;

    if (l.background) {
      const widest = Math.max(...lines.map((s) => ctx.measureText(s).width));
      const pad = fontSize * 0.18;
      ctx.fillStyle = l.background;
      ctx.fillRect(
        originX - (l.align === "center" ? widest / 2 : l.align === "left" ? 0 : widest) - pad,
        -pad,
        widest + pad * 2,
        lines.length * lineH + pad * 2,
      );
    }

    lines.forEach((line, i) => {
      const y = i * lineH;
      if (l.shadow > 0) {
        ctx.shadowColor = `rgba(0,0,0,${Math.min(l.shadow, 1)})`;
        ctx.shadowBlur = fontSize * 0.25;
        ctx.shadowOffsetY = fontSize * 0.04;
      }
      if (l.strokeWidth > 0) {
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeStyle = l.strokeColor;
        ctx.lineWidth = l.strokeWidth * fontSize;
        ctx.strokeText(line, originX, y);
      }
      ctx.shadowColor = "transparent";
      ctx.fillStyle = l.color;
      ctx.fillText(line, originX, y);
    });

    ctx.restore();
  }

  return new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png", 1),
  );
}
