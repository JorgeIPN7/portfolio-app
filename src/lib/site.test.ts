// @vitest-environment node
//
// El resto de la suite corre en jsdom, pero este módulo lee variables de
// servidor a través de t3-env, y t3-env decide si está en el cliente mirando
// `typeof window`. Bajo jsdom hay `window`, así que daría por hecho que es el
// navegador y lanzaría "Attempted to access a server-side environment variable
// on the client". `site.ts` es código de servidor y aquí se prueba como tal.
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cvPdfPath,
  profileDarkImagePath,
  profileImagePath,
  siteUrl,
} from "@/lib/site";

/**
 * La URL se resuelve una vez, al importar el módulo, así que para probar cada
 * entorno hay que reimportarlo con las variables cambiadas.
 */
async function resolverCon(entorno: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [clave, valor] of Object.entries(entorno)) {
    vi.stubEnv(clave, valor);
  }
  return import("@/lib/site");
}

describe("configuración del sitio", () => {
  it("siteUrl es absoluta y no termina en barra", () => {
    // Las rutas se concatenan directamente (`${siteUrl}${path}`): una barra
    // final produciría URLs con doble barra en el JSON-LD y el sitemap.
    expect(() => new URL(siteUrl)).not.toThrow();
    expect(siteUrl).not.toMatch(/\/$/);
  });

  it("las rutas de los assets salen de la raíz", () => {
    for (const path of [cvPdfPath, profileImagePath, profileDarkImagePath]) {
      expect(path).toMatch(/^\//);
    }
  });
});

describe("resolución de la URL del sitio", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("NEXT_PUBLIC_SITE_URL manda sobre todo lo demás", async () => {
    const site = await resolverCon({
      NEXT_PUBLIC_SITE_URL: "https://jorgelopez.dev",
      VERCEL_PROJECT_PRODUCTION_URL: "otro.vercel.app",
    });
    expect(site.siteUrl).toBe("https://jorgelopez.dev");
  });

  it("le quita la barra final para que no salgan URLs con doble barra", async () => {
    const site = await resolverCon({
      NEXT_PUBLIC_SITE_URL: "https://jorgelopez.dev///",
    });
    expect(site.siteUrl).toBe("https://jorgelopez.dev");
  });

  it("usa el dominio de producción de Vercel, con https", async () => {
    // Vercel entrega el dominio sin protocolo, y devuelve el propio en cuanto
    // hay uno asignado.
    const site = await resolverCon({
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: "jorgelopez.dev",
    });
    expect(site.siteUrl).toBe("https://jorgelopez.dev");
  });

  it("cae a localhost en desarrollo", async () => {
    const site = await resolverCon({
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
      VERCEL: undefined,
    });
    expect(site.siteUrl).toBe("http://localhost:3000");
  });

  it("falla dentro de un despliegue de Vercel en vez de publicar localhost", async () => {
    await expect(
      resolverCon({
        NEXT_PUBLIC_SITE_URL: undefined,
        VERCEL_PROJECT_PRODUCTION_URL: undefined,
        VERCEL: "1",
        // Dentro de un despliegue el esquema de entorno también exige la clave
        // de Resend, y saltaría antes que la guarda de la URL. Se le da un
        // valor para que esta prueba mida solo lo que dice medir.
        RESEND_API_KEY: "re_test",
      }),
    ).rejects.toThrow(/URL pública del sitio/);
  });
});
