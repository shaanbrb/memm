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
      className="fixed inset-x-0 top-0 z-50 px-6 py-4 md:px-10"
    >
      <nav className="mx-auto flex w-full max-w-[74rem] items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="memm home"
        >
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-lg"
          />
          <span className="text-[15px] font-medium lowercase tracking-[0.01em]">
            memm — engineering memes
          </span>
        </Link>
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
