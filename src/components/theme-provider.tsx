"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Theme = "dark" | "light";

/** Clave de localStorage. La comparte el script antiparpadeo de `layout.tsx`. */
export const THEME_STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readAppliedTheme(): Theme {
  // El script de `layout.tsx` ya dejó la clase puesta antes del primer pintado,
  // así que el DOM es la fuente de verdad y no hace falta releer localStorage.
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    // El oscuro es el estado por defecto de la página; el script de `layout.tsx`
    // ya lo dejó aplicado salvo que haya un "light" guardado.
    typeof document === "undefined" ? "dark" : readAppliedTheme(),
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Modo privado o almacenamiento bloqueado: el tema sigue funcionando,
        // solo no sobrevive a la recarga.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>.");
  }
  return context;
}
