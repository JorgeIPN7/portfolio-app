"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

/**
 * Los dos iconos se renderizan siempre y es CSS quien decide cuál se ve, según
 * la clase `dark` del `<html>`. Así el botón coincide con el tema desde el
 * primer pintado, sin depender de que React se hidrate ni de `resolvedTheme`,
 * que en el primer render de next-themes todavía es `undefined`.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("actions");

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground backdrop-blur transition-colors hover:bg-accent"
      aria-label={t("toggleTheme")}
    >
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
    </button>
  );
}
