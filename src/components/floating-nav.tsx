import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className="relative flex h-9 w-16 items-center rounded-full bg-surface-2 p-1 transition-colors hover:bg-accent"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
        className="flex size-7 items-center justify-center rounded-full bg-foreground text-background"
        style={{ marginLeft: dark ? "auto" : 0 }}
      >
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="flex"
        >
          {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </motion.span>
      </motion.span>
    </button>
  );
}

export function FloatingNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 120 && y > prev);
  });

  if (pathname.startsWith("/studio")) return null;

  return (
    <motion.header
      animate={{ y: hidden ? -110 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-border/70 bg-background/70 py-2 pl-3 pr-2 backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-full pr-2"
          aria-label="memm home"
        >
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-lg"
          />
          <span className="text-[15px] font-semibold tracking-[-0.03em]">
            memm
          </span>
        </Link>
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
