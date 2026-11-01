"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, isMounted } = useTheme();

  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`size-9 rounded-full ${className ?? ""}`}
        aria-label="Toggle theme"
      >
        <div className="size-4" />
      </Button>
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`size-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="size-4.5 transition-transform duration-300 rotate-0 scale-100 text-amber-400" />
      ) : (
        <Moon className="size-4.5 transition-transform duration-300 rotate-0 scale-100 text-slate-700" />
      )}
    </Button>
  );
}

