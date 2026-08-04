import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MemeWall } from "@/components/meme-wall";
import { proxied, templates } from "@/lib/templates";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "memm — Manufacturing brain rot" },
      {
        name: "description",
        content:
          "Professional tools for highly unprofessional content. Browse curated templates, edit on a real canvas, export in HD.",
      },
      { property: "og:title", content: "memm — Manufacturing brain rot" },
      {
        property: "og:description",
        content:
          "Professional tools for highly unprofessional content. Templates, a real canvas, HD export.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const spring = { type: "spring" as const, stiffness: 120, damping: 22 };

/** Small-caps editorial label. */
function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The hero's signature detail: the final headline line is rendered as an actual
 * meme caption — Anton, all caps, black stroke — and it cycles.
 */
const PUNCHLINES = ["brain rot.", "bangers.", "group-chat gold.", "regret.", "history."];

function CaptionLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % PUNCHLINES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      <motion.span
        key={i}
        initial={{ opacity: 0, y: "0.12em" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="inline-block uppercase text-background"
        style={{
          fontFamily: "Anton, Impact, sans-serif",
          WebkitTextStroke: "0.035em var(--foreground)",
          paintOrder: "stroke fill",
          letterSpacing: "0.005em",
        }}
      >
        {PUNCHLINES[i]}
      </motion.span>
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const feature = templates[0]!;
  const strip = templates.slice(1, 13);

  return (
    <section ref={ref} className="relative min-h-dvh border-b border-border pt-24">
      {/* masthead rail */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3 md:px-10">
        <Label>memm — meme apparatus</Label>
        <Label className="hidden sm:inline">
          {templates.length} templates / no. 001
        </Label>
        <Label>est. today</Label>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]"
      >
        {/* left: headline block */}
        <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-24 lg:border-r lg:border-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Label className="text-signal">Productivity is temporary</Label>
          </motion.div>

          <h1 className="mt-8 text-[16vw] font-semibold leading-[0.82] tracking-[-0.05em] sm:text-[12vw] lg:text-[8.5vw] xl:text-[9rem]">
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.08 }}
              className="block"
            >
              Manufacturing
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.18 }}
              className="mt-1 block"
            >
              <CaptionLine />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-10 max-w-md border-l border-border pl-5 font-mono text-[11px] uppercase leading-[2] tracking-[0.2em] text-muted-foreground"
          >
            Serious tools. Deeply unserious output. Curated templates, a real
            canvas, HD exports — so your worst idea still ships looking expensive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.38 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/studio"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start a meme
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#wall"
              className="inline-flex h-12 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
            >
              See the wall
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        </div>

        {/* right: plate */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.22 }}
          className="flex flex-col justify-center gap-4 px-6 py-10 md:px-10 lg:py-24"
        >
          <div className="flex items-baseline justify-between">
            <Label className="shrink-0">Plate 01</Label>
            <Label className="truncate pl-4">{feature.name}</Label>
          </div>
          <div className="hairline overflow-hidden rounded-xl bg-surface-2 p-2">
            <img
              src={proxied(feature.url)}
              alt={feature.name}
              width={feature.width}
              height={feature.height}
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {feature.width}×{feature.height} — exported at source resolution
          </p>
        </motion.div>
      </motion.div>

      {/* bottom index strip */}
      <div className="flex items-center gap-3 overflow-hidden border-t border-border px-6 py-4 md:px-10">
        <Label className="shrink-0">Index</Label>
        <div className="flex min-w-0 gap-2 overflow-hidden">
          {strip.map((t) => (
            <img
              key={t.id}
              src={proxied(t.url)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="size-9 shrink-0 rounded-md object-cover opacity-60 transition-opacity duration-300 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveCanvas() {
  const t = templates[0]!;
  const [top, setTop] = useState("Opening another editor");
  const [bottom, setBottom] = useState("Just using memm");

  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Label>Try it right here</Label>
          <h2 className="mt-5 text-balance-tight text-4xl font-semibold leading-[1.02] md:text-6xl">
            No signup. No nonsense.
          </h2>
          <p className="mt-6 max-w-md font-mono text-[11px] uppercase leading-[2] tracking-[0.2em] text-muted-foreground">
            Type. Watch it become a problem for someone's timeline. Same engine as
            the studio — nothing loads until you decide it should.
          </p>
          <div className="mt-8 space-y-2">
            <input
              value={top}
              onChange={(e) => setTop(e.target.value)}
              aria-label="Top caption"
              className="h-11 w-full rounded-lg bg-surface-2 px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal"
            />
            <input
              value={bottom}
              onChange={(e) => setBottom(e.target.value)}
              aria-label="Bottom caption"
              className="h-11 w-full rounded-lg bg-surface-2 px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-signal"
            />
          </div>
          <Link
            to="/studio"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Open the full studio <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Preview: sized by the image itself, so the template's exact aspect
            ratio is preserved and it fits both the available width and height. */}
        <div className="flex justify-center">
          <div
            className="relative inline-block overflow-hidden rounded-2xl bg-surface-2 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.6)]"
            style={{ containerType: "inline-size" }}
          >
            <img
              src={proxied(t.url)}
              alt={t.name}
              width={t.width}
              height={t.height}
              className="block h-auto max-h-[70svh] w-auto max-w-full object-contain"
            />
            <Caption text={top} position="top" />
            <Caption text={bottom} position="bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({ text, position }: { text: string; position: "top" | "bottom" }) {
  return (
    <p
      className="absolute inset-x-[6%] text-center text-[clamp(0.9rem,7cqw,3rem)] uppercase leading-[1.05] text-white"
      style={{
        fontFamily: "Anton, Impact, sans-serif",
        WebkitTextStroke: "0.06em #000",
        paintOrder: "stroke fill",
        [position]: "5%",
      }}
    >
      {text}
    </p>
  );
}

function Closer() {
  return (
    <section className="relative border-t border-border px-6 py-32 text-center md:py-40">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={spring}
        className="mx-auto max-w-3xl text-balance-tight text-[12vw] font-semibold leading-[0.9] md:text-[6rem]"
      >
        Go make something unserious.
      </motion.h2>
      <Link
        to="/studio"
        className="group mt-12 inline-flex h-14 items-center gap-2 rounded-full bg-foreground pl-7 pr-6 text-[15px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
      >
        Start a meme
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <footer className="mt-24 flex flex-col items-center gap-3">
        <img src="/logo.png" alt="memm" className="size-8 rounded-lg" />
        <Label>memm — dopamine engineering since today</Label>
      </footer>
    </section>
  );
}

function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <section id="wall" className="px-3 py-28 md:px-10 md:py-36">
        <div className="mx-auto mb-12 max-w-6xl">
          <Label>The wall</Label>
          <h2 className="mt-5 max-w-xl text-balance-tight text-4xl font-semibold md:text-5xl">
            Every template, always moving.
          </h2>
        </div>
        <MemeWall />
      </section>
      <LiveCanvas />
      <Closer />
    </div>
  );
}
