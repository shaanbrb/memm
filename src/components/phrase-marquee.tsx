const PHRASES = [
  "stealing memes professionally",
  "certified brain rot",
  "professionally unserious",
  "image go brrr",
  "pixels under pressure",
  "internet archaeology",
  "memes > meetings",
  "Ctrl+C. Ctrl+Comedy.",
  "screenshot less",
  "your group chat approves",
  "chaos, but HD",
  "weaponized reaction images",
  "made with zero productivity",
  "dopamine engineering",
  "viral by design",
  "downloaded respectfully",
  "reaction image engineer",
  "this could've been an email",
];

export function PhraseMarquee({
  reverse,
  duration = 70,
}: {
  reverse?: boolean;
  duration?: number;
}) {
  const loop = [...PHRASES, ...PHRASES];
  return (
    <div className="relative overflow-hidden py-4" aria-hidden="true">
      <div
        className="marquee-track flex w-max items-center gap-10 whitespace-nowrap"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {loop.map((p, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            {p}
            <span className="ml-10 text-signal">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export { PHRASES };
