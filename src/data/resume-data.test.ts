import { describe, expect, it } from "vitest";
import { getResumeData } from "@/data/resume-data";
import { routing } from "@/i18n/routing";

/**
 * El CV se edita a mano y no hay CMS que valide nada. Estas pruebas cubren lo
 * que el tipo `ResumeData` no puede: que las URLs funcionen, que no queden
 * campos en blanco, que las claves que usa React sigan siendo únicas y —desde
 * que hay dos idiomas— que las dos versiones no se separen.
 */
describe.each(routing.locales)("resumeData (%s)", (locale) => {
  const resumeData = getResumeData(locale);

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

/**
 * Lo que TypeScript no puede vigilar: que la traducción siga siendo una
 * traducción. Añadir un empleo solo en español compila sin protestar y deja el
 * CV en inglés incompleto, que es exactamente el fallo que nadie ve hasta que
 * lo lee un reclutador.
 */
describe("las dos versiones del CV no se separan", () => {
  const es = getResumeData("es");
  const en = getResumeData("en");

  it("tienen el mismo número de empleos, con los mismos puntos", () => {
    expect(en.experience).toHaveLength(es.experience.length);
    es.experience.forEach((experiencia, indice) => {
      expect(en.experience[indice]!.items).toHaveLength(
        experiencia.items.length,
      );
    });
  });

  it("tienen la misma formación y los mismos idiomas", () => {
    expect(en.education).toHaveLength(es.education.length);
    expect(en.languages).toHaveLength(es.languages.length);
  });

  it("declaran las mismas categorías de habilidades, con el mismo tamaño", () => {
    const tecnicasEs = Object.values(es.technicalSkills);
    const tecnicasEn = Object.values(en.technicalSkills);
    expect(tecnicasEn).toHaveLength(tecnicasEs.length);
    tecnicasEs.forEach((habilidades, indice) => {
      expect(tecnicasEn[indice]).toHaveLength(habilidades.length);
    });

    const blandasEs = Object.values(es.softSkills);
    const blandasEn = Object.values(en.softSkills);
    expect(blandasEn).toHaveLength(blandasEs.length);
  });

  it("los datos de contacto son idénticos, no traducidos", () => {
    // Un correo o un teléfono traducidos serían un error, no una versión.
    expect(en.contact.email).toBe(es.contact.email);
    expect(en.contact.phone.url).toBe(es.contact.phone.url);
    expect(en.contact.phone.label).toBe(es.contact.phone.label);
    expect(en.contact.linkedin.url).toBe(es.contact.linkedin.url);
    expect(en.contact.github.url).toBe(es.contact.github.url);
    expect(en.name).toBe(es.name);
    expect(en.lastName).toBe(es.lastName);
  });
});
