"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative size-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="size-4.5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute size-4.5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-slate-700 dark:text-slate-200" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
