import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { routing } from "@/i18n/routing";

const catalogos = { es, en } as const;

/** Aplana `{a: {b: "x"}}` en `{"a.b": "x"}` para poder comparar claves. */
function aplanar(objeto: unknown, prefijo = ""): Record<string, string> {
  if (typeof objeto !== "object" || objeto === null) return {};
  return Object.entries(objeto).reduce<Record<string, string>>(
    (acumulado, [clave, valor]) => {
      const ruta = prefijo ? `${prefijo}.${clave}` : clave;
      if (typeof valor === "string") return { ...acumulado, [ruta]: valor };
      return { ...acumulado, ...aplanar(valor, ruta) };
    },
    {},
  );
}

/** Los `{marcadores}` que interpola next-intl. */
function marcadores(texto: string): string[] {
  return [...texto.matchAll(/\{(\w+)\}/g)]
    .map((coincidencia) => coincidencia[1]!)
    .sort();
}

describe("catálogos de mensajes", () => {
  it("hay un catálogo por idioma declarado en el enrutado", () => {
    // Añadir un idioma a `routing` sin su JSON haría fallar la carga en tiempo
    // de ejecución, y solo en las rutas de ese idioma.
    expect(Object.keys(catalogos).sort()).toEqual([...routing.locales].sort());
  });

  it("los dos catálogos tienen exactamente las mismas claves", () => {
    // Una clave que falta en un idioma se pinta como la propia clave en la
    // página. TypeScript no lo ve: los tipos salen solo del catálogo español.
    const clavesEs = Object.keys(aplanar(es)).sort();
    const clavesEn = Object.keys(aplanar(en)).sort();
    expect(clavesEn).toEqual(clavesEs);
  });

  it("ningún mensaje se queda vacío", () => {
    for (const [idioma, catalogo] of Object.entries(catalogos)) {
      for (const [clave, valor] of Object.entries(aplanar(catalogo))) {
        expect(valor.trim(), `${idioma} → ${clave}`).not.toBe("");
      }
    }
  });

  it("los marcadores coinciden entre idiomas", () => {
    // `t("footer.lastUpdated", {date})` con una traducción que se comió el
    // `{date}` imprime la frase sin fecha y no avisa nadie.
    const planoEs = aplanar(es);
    const planoEn = aplanar(en);
    for (const [clave, texto] of Object.entries(planoEs)) {
      expect(marcadores(planoEn[clave]!), `clave ${clave}`).toEqual(
        marcadores(texto),
      );
    }
  });

  it("las descripciones caben en un resultado de búsqueda", () => {
    // Google corta alrededor de los 160 caracteres.
    for (const [idioma, catalogo] of Object.entries(catalogos)) {
      expect(catalogo.meta.description.length, idioma).toBeLessThanOrEqual(160);
    }
  });
});
