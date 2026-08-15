import { describe, expect, it } from "vitest";
import {
  cvPdfPath,
  profileDarkImagePath,
  profileImagePath,
  siteDescription,
  siteUrl,
} from "@/lib/site";

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

  it("la descripción cabe en un resultado de búsqueda", () => {
    // Google corta alrededor de los 160 caracteres.
    expect(siteDescription.length).toBeLessThanOrEqual(160);
  });
});
