import { describe, expect, it } from "vitest";
import { resumeData } from "@/data/resume-data";

/**
 * El CV se edita a mano y no hay CMS que valide nada. Estas pruebas cubren lo
 * que el tipo `ResumeData` no puede: que las URLs funcionen, que no queden
 * campos en blanco y que las claves que usa React sigan siendo únicas.
 */
describe("resumeData", () => {
  it("los enlaces de contacto son URLs https válidas", () => {
    const urls = [
      resumeData.contact.linkedin.url,
      resumeData.contact.github.url,
      resumeData.contact.phone.url,
    ];
    for (const url of urls) {
      expect(() => new URL(url)).not.toThrow();
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("el email tiene forma de email", () => {
    expect(resumeData.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("ninguna experiencia se queda sin puntos ni con puntos vacíos", () => {
    for (const experiencia of resumeData.experience) {
      expect(experiencia.items.length).toBeGreaterThan(0);
      expect(experiencia.title.trim()).not.toBe("");
      expect(experiencia.company.trim()).not.toBe("");
      expect(experiencia.period.trim()).not.toBe("");
      for (const item of experiencia.items) {
        expect(item.text.trim()).not.toBe("");
      }
    }
  });

  it("las claves de React de la experiencia son únicas", () => {
    // page.tsx usa `${company}-${period}` como key. Dos iguales harían que
    // React reutilizara el nodo equivocado al reordenar.
    const claves = resumeData.experience.map(
      (experiencia) => `${experiencia.company}-${experiencia.period}`,
    );
    expect(new Set(claves).size).toBe(claves.length);
  });

  it("los textos de cada experiencia son únicos entre sí", () => {
    // page.tsx los usa como key dentro de la lista de puntos.
    for (const experiencia of resumeData.experience) {
      const textos = experiencia.items.map((item) => item.text);
      expect(new Set(textos).size).toBe(textos.length);
    }
  });

  it("no hay categorías de habilidades vacías", () => {
    const grupos = [
      ...Object.entries(resumeData.technicalSkills),
      ...Object.entries(resumeData.softSkills),
    ];
    expect(grupos.length).toBeGreaterThan(0);
    for (const [categoria, habilidades] of grupos) {
      expect(categoria.trim()).not.toBe("");
      expect(habilidades.length).toBeGreaterThan(0);
      // Duplicadas romperían la key del Badge, que es la propia habilidad.
      expect(new Set(habilidades).size).toBe(habilidades.length);
    }
  });

  it("los idiomas no se repiten", () => {
    // El idioma es la key de React en esa sección.
    const idiomas = resumeData.languages.map((idioma) => idioma.language);
    expect(new Set(idiomas).size).toBe(idiomas.length);
  });
});
