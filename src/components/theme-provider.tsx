"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Envuelve a next-themes con la configuración de este sitio.
 *
 * `defaultTheme="dark"` con `enableSystem={false}`: la página abre siempre en
 * oscuro y solo una elección explícita guardada la saca de ahí. Es a propósito
 * distinto del comportamiento habitual de next-themes, que sigue al sistema.
 *
 * El script antiparpadeo ya no se escribe a mano en `layout.tsx`: lo inyecta
 * next-themes antes del primer pintado.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
