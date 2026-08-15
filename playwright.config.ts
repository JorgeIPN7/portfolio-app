import { defineConfig, devices } from "@playwright/test";

// El puerto por defecto de `next dev`. Si ya tienes el servidor abierto,
// Playwright lo reutiliza en vez de intentar levantar otro: Next 16 no admite
// dos dev servers sobre el mismo directorio.
const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      // Chrome del sistema, no el Chromium que descarga Playwright: ese viene
      // sin los códecs propietarios y no decodifica el H.264 del retrato
      // (DEMUXER_ERROR_NO_SUPPORTED_STREAMS).
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
