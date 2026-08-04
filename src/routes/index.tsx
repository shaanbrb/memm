import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { proxied, templates } from "@/lib/templates";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "memm — the meme editor that respects your taste" },
      {
        name: "description",
        content:
          "A quiet, precise editor for loud ideas. Curated templates, a real canvas, exports at source resolution. No signup.",
      },
      {
        property: "og:title",
        content: "memm — the meme editor that respects your taste",
      },
      {
        property: "og:description",
        content:
          "A quiet, precise editor for loud ideas. Curated templates, a real canvas, exports at source resolution.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

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
      className={`font-mono text-[10px] uppercase tracking-[0.36em] text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Caption({
  text,
  position,
}: {
  text: string;
  position: "top" | "bottom";
}) {
  if (!text) return null;
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

/* ------------------------------------------------------------------ hero */

const PUNCHLINES = ["brain rot", "bangers", "group-chat gold", "folklore"];

/** Signature detail: one word of the headline is typeset as a real meme caption. */
function Punchline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % PUNCHLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden align-baseline">
      <motion.span
        key={i}
        initial={{ opacity: 0, y: "0.5em" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="inline-block uppercase text-background"
        style={{
          fontFamily: "Anton, Impact, sans-serif",
          WebkitTextStroke: "0.028em var(--foreground)",
          paintOrder: "stroke fill",
          letterSpacing: "0.004em",
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
  const plateY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const feature =
    templates.find((t) => t.width > t.height && t.width >= 1000) ?? templates[0]!;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-40 md:pt-52"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[55vh] opacity-[0.5]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--signal) 16%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        style={{ opacity: copyOpacity }}
        className="relative mx-auto max-w-[78rem] px-6 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <Label>Meme apparatus — no. 001</Label>
        </motion.div>

        <h1 className="mt-10 text-[13.5vw] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[11vw] lg:text-[8.4rem]">
          <motion.span
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.06 }}
            className="block"
          >
            Manufacturing
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.16 }}
            className="mt-2 block"
          >
            <Punchline />
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mt-14 grid gap-10 border-t border-border pt-8 md:grid-cols-[1fr_auto] md:items-end"
        >
          <p className="max-w-xl font-mono text-[11px] uppercase leading-[2.1] tracking-[0.2em] text-muted-foreground">
            A quiet, precise editor for extremely loud ideas. Curated templates,
            a real canvas, exports at source resolution.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/studio"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-sm font-medium text-background transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              Start a meme
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#canvas"
              className="text-sm font-medium text-muted-foreground underline-offset-[6px] transition-colors hover:text-foreground hover:underline"
            >
              Try it without leaving
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* product plate */}
      <motion.div
        style={{ y: plateY, scale: plateScale }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.36 }}
        className="relative mx-auto mt-24 max-w-[78rem] px-6 md:mt-32 md:px-10"
      >
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-surface p-2 shadow-[0_60px_140px_-70px_rgba(0,0,0,0.7)] hairline">
            <div
              className="relative overflow-hidden rounded-[1.25rem] bg-surface-2"
              style={{ containerType: "inline-size" }}
            >
              <img
                src={proxied(feature.url)}
                alt={feature.name}
                width={feature.width}
                height={feature.height}
                className="block h-auto w-full object-contain"
              />
              <Caption text="Ship the idea" position="top" />
              <Caption text="Not the meeting" position="bottom" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Label>{feature.name}</Label>
            <Label>
              {feature.width}×{feature.height} — source resolution
            </Label>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------- ribbon */

function Ribbon() {
  const strip = templates.slice(1, 25);
  const loop = [...strip, ...strip];
  return (
    <section className="mt-32 overflow-hidden py-10 md:mt-44">
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div
          className="marquee-track flex w-max gap-4"
          style={{ "--marquee-duration": "80s" } as React.CSSProperties}
        >
          {loop.map((t, i) => (
            <img
              key={`${t.id}-${i}`}
              src={proxied(t.url)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-24 w-auto shrink-0 rounded-lg object-cover opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 md:h-32"
            />
          ))}
        </div>
      </div>
      <Reveal className="mx-auto mt-10 max-w-[78rem] px-6 md:px-10">
        <Label>{templates.length} templates, curated — nothing filler</Label>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------ triptych */

const PILLARS = [
  {
    n: "01",
    title: "A library, not a landfill",
    body: "Every template hand-checked and categorised. Search is instant. Favourites persist. Nothing loads that you didn't ask for.",
  },
  {
    n: "02",
    title: "A canvas that behaves",
    body: "Drag, type, restyle. Real typography controls — weight, stroke, shadow, alignment — with the restraint of a design tool.",
  },
  {
    n: "03",
    title: "Exports at full fidelity",
    body: "Rendered to canvas at the template's native resolution. No watermark, no upsell, no account. Just a file.",
  },
];

function Pillars() {
  return (
    <section className="mx-auto mt-32 max-w-[78rem] px-6 md:mt-48 md:px-10">
      <Reveal>
        <h2 className="max-w-2xl text-balance-tight text-4xl font-semibold leading-[1.04] md:text-6xl">
          Built like a design tool. Used like a group chat.
        </h2>
      </Reveal>
      <div className="mt-20 grid gap-px border-t border-border md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal
            key={p.n}
            delay={i * 0.08}
            className="border-b border-border py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
          >
            <Label>{p.n}</Label>
            <h3 className="mt-6 text-xl font-medium tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.75] text-muted-foreground">
              {p.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- live canvas */

function LiveCanvas() {
  const t = templates[0]!;
  const [top, setTop] = useState("Opening another editor");
  const [bottom, setBottom] = useState("Just using memm");

  return (
    <section
      id="canvas"
      className="mx-auto mt-32 max-w-[78rem] scroll-mt-24 px-6 md:mt-48 md:px-10"
    >
      <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
        <Reveal>
          <Label>Live — this is the real engine</Label>
          <h2 className="mt-6 text-balance-tight text-4xl font-semibold leading-[1.04] md:text-5xl">
            Type here. Regret it later.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
            No modal, no onboarding tour, no "welcome to your workspace". The
            same renderer that ships your HD export is running in this box right
            now — it just hasn't been asked for much yet.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { v: top, set: setTop, label: "Top caption" },
              { v: bottom, set: setBottom, label: "Bottom caption" },
            ].map((f) => (
              <div key={f.label} className="group relative">
                <label className="pointer-events-none absolute -top-2 left-3 bg-background px-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                  {f.label}
                </label>
                <input
                  value={f.v}
                  onChange={(e) => f.set(e.target.value)}
                  aria-label={f.label}
                  className="h-12 w-full rounded-xl border border-border bg-transparent px-4 text-sm outline-none transition-colors focus-visible:border-foreground"
                />
              </div>
            ))}
          </div>

          <Link
            to="/studio"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium underline-offset-[6px] hover:underline"
          >
            Open the full studio
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center">
          <div
            className="relative inline-block overflow-hidden rounded-2xl bg-surface-2 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.65)]"
            style={{ containerType: "inline-size" }}
          >
            <img
              src={proxied(t.url)}
              alt={t.name}
              width={t.width}
              height={t.height}
              className="block h-auto max-h-[68svh] w-auto max-w-full object-contain"
            />
            <Caption text={top} position="top" />
            <Caption text={bottom} position="bottom" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- closer */

function Closer() {
  return (
    <section className="mt-40 border-t border-border md:mt-56">
      <div className="mx-auto max-w-[78rem] px-6 py-32 md:px-10 md:py-44">
        <Reveal>
          <h2 className="max-w-4xl text-balance-tight text-[11vw] font-semibold leading-[0.92] md:text-[5.5rem]">
            Go make something unserious.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Link
            to="/studio"
            className="group mt-14 inline-flex h-14 items-center gap-2 rounded-full bg-foreground pl-7 pr-6 text-[15px] font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Start a meme
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[78rem] flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="memm" className="size-6 rounded-md" />
            <Label className="text-foreground">memm</Label>
          </div>
          <Label>Dopamine engineering — est. today</Label>
        </div>
      </footer>
    </section>
  );
}

function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <Ribbon />
      <Pillars />
      <LiveCanvas />
      <Closer />
    </div>
  );
}
