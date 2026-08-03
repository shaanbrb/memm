import { memo } from "react";
import { motion } from "motion/react";
import { templates, proxied } from "@/lib/templates";

/**
 * Infinite vertical meme wall. Pure CSS transform marquee so it never freezes,
 * never gaps (each column duplicates its own list) and stays cheap on mobile.
 */
function Column({
  items,
  duration,
  reverse,
}: {
  items: typeof templates;
  duration: number;
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="marquee-track-y flex flex-col gap-3 md:gap-4"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {loop.map((t, i) => (
          <figure
            key={`${t.id}-${i}`}
            className="group relative overflow-hidden rounded-xl bg-surface-2 transition-transform duration-500 ease-out hover:scale-[1.04]"
          >
            <img
              src={proxied(t.url)}
              alt={t.name}
              loading="lazy"
              decoding="async"
              width={t.width}
              height={t.height}
              className="h-auto w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

export const MemeWall = memo(function MemeWall() {
  const pool = templates.slice(0, 36);
  const cols = [pool.slice(0, 9), pool.slice(9, 18), pool.slice(18, 27), pool.slice(27, 36)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1 }}
      className="pointer-events-none relative grid h-[70vh] grid-cols-2 gap-3 overflow-hidden md:h-[85vh] md:grid-cols-4 md:gap-4"
      aria-hidden="true"
    >
      {cols.map((c, i) => (
        <Column key={i} items={c} duration={50 + i * 14} reverse={i % 2 === 1} />
      ))}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </motion.div>
  );
});
