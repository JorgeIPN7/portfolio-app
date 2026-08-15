import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
// Importarlo aquí es lo que convierte una variable de entorno mal puesta en un
// build fallido en vez de en un error a la primera visita. No se usa el alias
// `@/` porque este archivo lo carga Next fuera del tsconfig de la aplicación.
import "./src/env";

/**
 * Cabeceras para todas las rutas. El sitio no ejecuta código de terceros ni
 * pide permisos del navegador, así que puede cerrarse fuerte.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // No anunciar el framework en cada respuesta.
  poweredByHeader: false,
  // `.mdx` cuenta como página: cada caso de /proyectos es un archivo MDX.
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX({});

// El plugin necesita saber dónde está la configuración por petición; sin esta
// ruta buscaría en `./i18n/request.ts` y aquí el código vive bajo `src/`.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
