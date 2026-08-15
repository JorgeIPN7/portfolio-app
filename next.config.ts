import createMDX from "@next/mdx";
import type { NextConfig } from "next";

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

export default withMDX(nextConfig);
