"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

/**
 * Los dos iconos se renderizan siempre y es CSS quien decide cuál se ve, según
 * la clase `dark` del `<html>`. Así el botón coincide con el tema desde el
 * primer pintado, sin depender de que React se hidrate.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground backdrop-blur transition-colors hover:bg-accent"
      aria-label="Cambiar entre tema claro y oscuro"
    >
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
    </button>
  );
}
