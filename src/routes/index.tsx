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
      className={`font-mono text-[11px] lowercase tracking-[0.14em] text-muted-foreground ${className}`}
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
        <h1 className="text-[15vw] font-medium lowercase leading-[0.85] tracking-[-0.055em] sm:text-[12vw] lg:text-[9.5rem]">
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
          <p className="max-w-md text-[15px] lowercase leading-[1.8] text-muted-foreground">
            pick one of {templates.length} templates, type your caption,
            download the png.
          </p>
          <Link
            to="/studio"
            className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-sm font-medium lowercase text-background transition-transform duration-300 ease-out hover:-translate-y-0.5"
          >
            start a meme
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
        <h2 className="text-balance-tight text-4xl font-medium lowercase leading-[1.05] md:text-6xl">
          make the kind of meme people save instead of scroll past.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[15px] lowercase leading-[1.8] text-muted">
  all that's left is finding the right image, writing the caption, and sending it before someone else thinks of it.
</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-16 flex justify-center">
        <div
  className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-surface-2"
  style={{
    containerType: "inline-size",
    aspectRatio: `${t.width} / ${t.height}`,
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
          { v: top, set: setTop, label: "top caption" },
          { v: bottom, set: setBottom, label: "bottom caption" },
        ].map((f) => (
          <div key={f.label} className="relative">
            <label className="pointer-events-none absolute -top-2 left-3 bg-background px-1.5 font-mono text-[10px] lowercase tracking-[0.12em] text-muted-foreground">
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

      <Reveal
        delay={0.16}
        className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
      >
        <Link
          to="/studio"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground pl-6 pr-5 text-sm font-medium lowercase text-background transition-transform duration-300 ease-out hover:-translate-y-0.5"
        >
          start a meme
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          to="/studio"
          className="group inline-flex items-center gap-2 text-sm font-medium lowercase underline-offset-[6px] hover:underline"
        >
          open the full studio
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
        <Label>{templates.length} templates, searchable by name</Label>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the spec */

const SPEC = [
  {
    title: "no junk templates.",
    body: "every template is hand-picked, tagged, and checked so you're not scrolling through endless low-quality memes to find the one you wanted.",
  },
  {
    title: "your captions, your layout.",
    body: "move text anywhere. change the weight, stroke, shadow, alignment, and make every meme feel like it was made for the joke.  ",
  },
  {
    title: "download and disappear.",
    body: "no accounts. no watermarks. just the image you came for.  ",
  },
];

function Spec() {
  return (
    <section className="mx-auto max-w-[74rem] px-6 py-32 md:px-10 md:py-44">
      <Reveal>
        <h2 className="max-w-2xl text-balance-tight text-4xl font-medium lowercase leading-[1.06] md:text-5xl">
          why people keep using memm.
        </h2>
      </Reveal>
      <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-12">
        {SPEC.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <h3 className="text-lg font-medium lowercase tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] lowercase leading-[1.8] text-muted-foreground">
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
          <h2 className="mx-auto max-w-3xl text-balance-tight text-[12vw] font-medium lowercase leading-[0.92] md:text-[5rem]">
            go make something unserious.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Link
            to="/studio"
            className="group mt-14 inline-flex h-14 items-center gap-2 rounded-full bg-foreground pl-7 pr-6 text-[15px] font-medium lowercase text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            start a meme
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
          <Label>no account. no watermark.</Label>
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
