import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { proxied, templates } from "@/lib/templates";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "memm - engineering memes" },
      {
        name: "description",
        content:
          "A precise editor for unserious output. Curated templates, a real canvas, exports at source resolution. No account, no watermark.",
      },
      { property: "og:title", content: "memm - engineering memes" },
      {
        property: "og:description",
        content:
          "A precise editor for unserious output. Curated templates, a real canvas, exports at source resolution.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

/** Landscape hero template — reads best at large sizes. */
const FEATURE =
  templates.find((t) => t.width > t.height && t.width >= 1000) ?? templates[0]!;

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
      initial={{ opacity: 0, y: 18 }}
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

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] items-center overflow-hidden"
    >
      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-[74rem] px-6 pb-24 pt-44 md:px-10 md:pt-48"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <Label>memm — meme apparatus</Label>
        </motion.div>

        <h1 className="mt-12 text-[15vw] font-medium leading-[0.85] tracking-[-0.055em] sm:text-[12vw] lg:text-[9.5rem]">
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.05 }}
            className="block"
          >
            engineering
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.14 }}
            className="block text-muted-foreground"
          >
            memes.
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.34 }}
          className="mt-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md font-mono text-[11px] uppercase leading-[2.2] tracking-[0.22em] text-muted-foreground">
            A precise instrument for unserious output. Curated templates, a real
            canvas, exports at source resolution.
          </p>
          <Link
            to="/studio"
            className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-sm font-medium text-background transition-transform duration-300 ease-out hover:-translate-y-0.5"
          >
            Open the studio
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------------- live canvas */

function LiveCanvas() {
  const t = FEATURE;
  const [top, setTop] = useState("Opening another editor");
  const [bottom, setBottom] = useState("Just using memm");

  return (
    <section
      id="canvas"
      className="mx-auto max-w-[74rem] scroll-mt-24 px-6 py-32 md:px-10 md:py-48"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <Label>Live — this is the actual renderer</Label>
        <h2 className="mt-7 text-balance-tight text-4xl font-medium leading-[1.05] md:text-6xl">
          Type in the box. It responds instantly.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
          No sign-up wall, no tour, no "welcome to your workspace." The same
          engine that renders your export is idling here, waiting to be given
          something regrettable.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-16 flex justify-center">
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-surface-2"
          style={{
            containerType: "inline-size",
            aspectRatio: `${t.width} / ${t.height}`,
            maxHeight: "62svh",
          }}
        >
          <img
            src={proxied(t.url)}
            alt={t.name}
            width={t.width}
            height={t.height}
            className="block size-full object-contain"
          />
          <Caption text={top} position="top" />
          <Caption text={bottom} position="bottom" />
        </div>
      </Reveal>

      <Reveal
        delay={0.12}
        className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2"
      >
        {[
          { v: top, set: setTop, label: "Top caption" },
          { v: bottom, set: setBottom, label: "Bottom caption" },
        ].map((f) => (
          <div key={f.label} className="relative">
            <label className="pointer-events-none absolute -top-2 left-3 bg-background px-1.5 font-mono text-[9px] uppercase tracking-[0.26em] text-muted-foreground">
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
      </Reveal>

      <Reveal delay={0.16} className="mt-10 text-center">
        <Link
          to="/studio"
          className="group inline-flex items-center gap-2 text-sm font-medium underline-offset-[6px] hover:underline"
        >
          Open the full studio
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------- ribbon */

function Ribbon() {
  const strip = templates.slice(1, 25);
  const loop = [...strip, ...strip];
  return (
    <section className="overflow-hidden py-8">
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 14%, black 86%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 14%, black 86%, transparent)",
        }}
      >
        <div
          className="marquee-track flex w-max gap-4"
          style={{ "--marquee-duration": "90s" } as React.CSSProperties}
        >
          {loop.map((t, i) => (
            <img
              key={`${t.id}-${i}`}
              src={proxied(t.url)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-20 w-auto shrink-0 rounded-lg object-cover opacity-40 grayscale md:h-24"
            />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[74rem] px-6 md:px-10">
        <Label>{templates.length} templates, curated — nothing filler</Label>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the spec */

const SPEC = [
  {
    title: "A library, not a landfill",
    body: "Every template checked and categorised. Search is instant, favourites persist, nothing loads that you didn't ask for.",
  },
  {
    title: "A canvas that behaves",
    body: "Drag, type, restyle. Real typography controls — weight, stroke, shadow, alignment — with the restraint of a design tool.",
  },
  {
    title: "Exports at full fidelity",
    body: "Rendered at the template's native resolution. No watermark, no upsell, no account. Just a file.",
  },
];

function Spec() {
  return (
    <section className="mx-auto max-w-[74rem] px-6 py-32 md:px-10 md:py-44">
      <Reveal>
        <h2 className="max-w-2xl text-balance-tight text-4xl font-medium leading-[1.06] md:text-5xl">
          Built like an instrument. Used like a group chat.
        </h2>
      </Reveal>
      <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-12">
        {SPEC.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <h3 className="text-lg font-medium tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
              {p.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- closer */

function Closer() {
  return (
    <section>
      <div className="mx-auto max-w-[74rem] px-6 py-36 text-center md:px-10 md:py-48">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-balance-tight text-[12vw] font-medium leading-[0.92] md:text-[5rem]">
            Go make something unserious.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Link
            to="/studio"
            className="group mt-14 inline-flex h-14 items-center gap-2 rounded-full bg-foreground pl-7 pr-6 text-[15px] font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Open the studio
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <footer>
        <div className="mx-auto flex max-w-[74rem] flex-col gap-4 px-6 pb-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="memm" className="size-6 rounded-md" />
            <Label className="text-foreground">memm — engineering memes</Label>
          </div>
          <Label>No account. No watermark.</Label>
        </div>
      </footer>
    </section>
  );
}

function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <LiveCanvas />
      <Ribbon />
      <Spec />
      <Closer />
    </div>
  );
}
