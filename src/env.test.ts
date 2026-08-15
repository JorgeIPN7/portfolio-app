// @vitest-environment node
//
// t3-env mira `typeof window` para decidir si está en el navegador, y bajo
// jsdom concluiría que sí. Las variables de servidor solo se pueden leer aquí.
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * El esquema se evalúa al importar el módulo, así que cada escenario necesita
 * su propia importación con el entorno ya colocado.
 */
async function cargarCon(entorno: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [clave, valor] of Object.entries(entorno)) {
    vi.stubEnv(clave, valor);
  }
  return import("@/env");
}

/** Lo mínimo para que un despliegue valide, y así variar una cosa cada vez. */
const despliegueValido = {
  VERCEL: "1",
  RESEND_API_KEY: "re_test",
  NEXT_PUBLIC_SITE_URL: "https://jorgelopez.dev",
};

describe("esquema de variables de entorno", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("no exige nada en local", async () => {
    // Un clon recién hecho, sin `.env`, tiene que poder compilar y arrancar.
    const { env } = await cargarCon({
      VERCEL: undefined,
      RESEND_API_KEY: undefined,
      NEXT_PUBLIC_SITE_URL: undefined,
      CONTACT_TO_EMAIL: undefined,
    });
    expect(env.RESEND_API_KEY).toBeUndefined();
    expect(env.NEXT_PUBLIC_SITE_URL).toBeUndefined();
  });

  it("exige la clave de Resend dentro de un despliegue", async () => {
    // Sin esto se publica un formulario cuyo botón de enviar no hace nada, y
    // el fallo solo aparece cuando alguien intenta escribir.
    await expect(
      cargarCon({ ...despliegueValido, RESEND_API_KEY: undefined }),
    ).rejects.toThrow(/Invalid environment variables/);
  });

  it("rechaza una URL de sitio malformada", async () => {
    await expect(
      cargarCon({
        VERCEL: undefined,
        NEXT_PUBLIC_SITE_URL: "jorgelopez.dev",
      }),
    ).rejects.toThrow(/Invalid environment variables/);
  });

  it("rechaza un destinatario que no es un correo", async () => {
    await expect(
      cargarCon({ VERCEL: undefined, CONTACT_TO_EMAIL: "jorge arroba gmail" }),
    ).rejects.toThrow(/Invalid environment variables/);
  });

  it("trata la cadena vacía como ausencia", async () => {
    // En el panel de Vercel es fácil dejar una variable creada y vacía. Sin
    // `emptyStringAsUndefined` acabaría como dominio del canonical.
    const { env } = await cargarCon({
      VERCEL: undefined,
      NEXT_PUBLIC_SITE_URL: "",
    });
    expect(env.NEXT_PUBLIC_SITE_URL).toBeUndefined();
  });

  it("da un remitente por defecto que funciona sin dominio propio", async () => {
    const { env } = await cargarCon({
      VERCEL: undefined,
      CONTACT_FROM_EMAIL: undefined,
    });
    expect(env.CONTACT_FROM_EMAIL).toContain("onboarding@resend.dev");
  });
});
