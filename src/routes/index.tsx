import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MemeWall } from "@/components/meme-wall";
import { PhraseMarquee } from "@/components/phrase-marquee";
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

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const floats = templates.slice(0, 5);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 40);
        my.set((e.clientY / window.innerHeight - 0.5) * 30);
      }}
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-24 pt-32"
    >
      {/* floating templates */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute inset-0 hidden md:block"
        aria-hidden="true"
      >
        {floats.map((t, i) => {
          const spots = [
            { left: "6%", top: "18%", r: -8, w: 150 },
            { left: "84%", top: "14%", r: 7, w: 130 },
            { left: "12%", top: "68%", r: 6, w: 130 },
            { left: "80%", top: "66%", r: -6, w: 160 },
            { left: "46%", top: "86%", r: 3, w: 110 },
          ][i]!;
          return (
            <motion.img
              key={t.id}
              src={proxied(t.url)}
              alt=""
              loading="lazy"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 0.85, y: 0, scale: 1 }}
              transition={{ ...spring, delay: 0.35 + i * 0.09 }}
              className="absolute rounded-xl object-cover shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
              style={{
                left: spots.left,
                top: spots.top,
                width: spots.w,
                rotate: `${spots.r}deg`,
              }}
            />
          );
        })}
      </motion.div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
        >
          Productivity is temporary. Memes are forever.
        </motion.p>

        <h1 className="mt-7 text-balance-tight text-[13.5vw] font-semibold leading-[0.86] md:text-[7rem]">
          <span className="block whitespace-nowrap">
          {"Manufacturing".split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.022 }}
              className="inline-block"
            >
              {c}
            </motion.span>
          ))}
          </span>
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.42 }}
            className="inline-block italic text-muted-foreground"
          >
            brain rot.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="mx-auto mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground"
        >
          Professional tools for highly unprofessional content. Because internet
          humor deserves better than blurry screenshots, stretched text, and five
          different editing apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.58 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
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
      </motion.div>
    </section>
  );
}

function StickyStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const beats = [
    {
      k: "Templates",
      t: "A curated library, not a landfill.",
      d: "Every template appears exactly once. Searchable instantly, organised by how people actually think about memes.",
    },
    {
      k: "Canvas",
      t: "It opens empty. On purpose.",
      d: "No auto-loaded template. No phantom captions. You start with nothing and add exactly what you meant to add.",
    },
    {
      k: "Export",
      t: "HD out. Every time.",
      d: "Rendered at the source resolution, not the size of your browser window. Download or share straight to the group chat.",
    },
  ];

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden px-6">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1fr_auto]">
          <div className="space-y-16">
            {beats.map((b, i) => {
              const start = i / beats.length;
              const end = (i + 1) / beats.length;
              return <Beat key={b.k} beat={b} progress={scrollYProgress} start={start} end={end} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Beat({
  beat,
  progress,
  start,
  end,
}: {
  beat: { k: string; t: string; d: string };
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const range = [
    clamp(start - 0.08),
    clamp(start + 0.05),
    clamp(end - 0.05),
    clamp(end + 0.05),
  ];
  const opacity = useTransform(progress, range, [0.15, 1, 1, 0.15]);
  const yv = useTransform(progress, [clamp(start), clamp(end)], [24, -24]);

  return (
    <motion.div style={{ opacity, y: yv }} className="max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
        {beat.k}
      </p>
      <h3 className="mt-4 text-balance-tight text-4xl font-semibold leading-[1.05] md:text-6xl">
        {beat.t}
      </h3>
      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
        {beat.d}
      </p>
    </motion.div>
  );
}

function LiveCanvas() {
  const t = templates[0]!;
  const [top, setTop] = useState("Opening another editor");
  const [bottom, setBottom] = useState("Just using memm");

  return (
    <section className="px-6 py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Try it right here
          </p>
          <h2 className="mt-4 text-balance-tight text-4xl font-semibold leading-[1.05] md:text-5xl">
            No signup. No modal. Just type.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            This is the same rendering engine the studio uses. Edit the captions
            and watch it update instantly.
          </p>
          <div className="mt-7 space-y-2">
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
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Open the full studio <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={spring}
          className="relative overflow-hidden rounded-2xl bg-surface-2 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.6)]"
          style={{ aspectRatio: t.width / t.height }}
        >
          <img
            src={proxied(t.url)}
            alt={t.name}
            className="absolute inset-0 size-full object-cover"
          />
          <Caption text={top} position="top" />
          <Caption text={bottom} position="bottom" />
        </motion.div>
      </div>
    </section>
  );
}

function Caption({ text, position }: { text: string; position: "top" | "bottom" }) {
  return (
    <p
      className="absolute inset-x-[6%] text-center text-[clamp(1rem,4.2cqw,2.6rem)] uppercase leading-[1.05] text-white"
      style={{
        containerType: "inline-size",
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

function Stats() {
  const stats = [
    { n: "100", l: "curated templates, zero duplicates" },
    { n: "0", l: "captions inserted without permission" },
    { n: "HD", l: "exports at source resolution" },
    { n: "1", l: "app instead of five" },
  ];
  return (
    <section className="border-y border-border px-6 py-24">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.n + s.l}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <p className="text-6xl font-semibold tracking-[-0.05em]">{s.n}</p>
            <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">{s.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Closer() {
  return (
    <section className="relative px-6 py-40 text-center">
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
      <footer className="mt-28 flex flex-col items-center gap-3 text-xs text-muted-foreground">
        <img src="/logo.png" alt="memm" className="size-8 rounded-lg" />
        <p>memm — dopamine engineering since today.</p>
      </footer>
    </section>
  );
}

function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <PhraseMarquee />
      <StickyStory />
      <section id="wall" className="px-3 py-20 md:px-6">
        <div className="mx-auto mb-12 max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            The wall
          </p>
          <h2 className="mt-4 max-w-xl text-balance-tight text-4xl font-semibold md:text-5xl">
            Every template, always moving.
          </h2>
        </div>
        <MemeWall />
      </section>
      <PhraseMarquee reverse duration={90} />
      <LiveCanvas />
      <Stats />
      <Closer />
    </div>
  );
}
