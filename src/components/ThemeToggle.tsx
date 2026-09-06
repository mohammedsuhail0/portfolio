"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="w-10 h-10 rounded-xl border border-border bg-card/60 flex items-center justify-center opacity-0"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    const doc = document as any;
    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Ripple originating from click / center
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 420,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={handleToggleTheme}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl border border-border/80 bg-card/60 backdrop-blur hover:bg-accent hover:border-purple-500/40 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 text-purple-400" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
