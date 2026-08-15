import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Solo JSX: el alias `@/*` lo resuelve Vite 8 de forma nativa leyendo el
  // tsconfig, así que `vite-tsconfig-paths` ya no hace falta.
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Los tests viven junto al código que prueban. `e2e/` queda fuera a
    // propósito: esos los corre Playwright, y Vitest no sabría ejecutarlos.
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
  },
});
