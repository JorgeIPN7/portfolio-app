import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TOGGLE = 'button[aria-label="Cambiar entre tema claro y oscuro"]';

/**
 * Espera a que todas las secciones hayan terminado de aparecer.
 *
 * `Reveal` las sirve con opacidad 0, y axe calcula el contraste sobre lo que
 * hay pintado: analizar a mitad de la animación producía 50 violaciones de
 * `color-contrast` que desaparecían solas medio segundo después. El fallo
 * aparecía y se iba según lo cargada que estuviera la máquina, que es la peor
 * clase de prueba.
 *
 * Las secciones que nunca cruzan el viewport las destapa el plazo de seguridad
 * de `Reveal` a los 2 s, así que esto termina siempre.
 */
async function esperarAparicion(page: Page) {
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("[data-reveal]")].every(
        (elemento) =>
          Number(getComputedStyle(elemento).opacity) === 1 &&
          elemento.getAnimations().every((a) => a.playState !== "running"),
      ),
    undefined,
    { timeout: 15_000 },
  );
}

/**
 * Analiza la página contra WCAG 2.1 nivel A y AA. Se comprueban los dos temas
 * porque el contraste depende de la paleta, y la oscura y la clara son
 * distintas: pasar una no dice nada de la otra.
 */
async function violaciones(page: Page) {
  await esperarAparicion(page);

  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  // Se aplanan a texto para que un fallo diga qué regla y dónde, en vez de
  // volcar el objeto entero de axe.
  return resultado.violations.map(
    (violacion) =>
      `${violacion.id} (${violacion.impact}): ${violacion.help} — ${violacion.nodes.length} nodo(s), p. ej. ${violacion.nodes[0]?.target.join(" ")}`,
  );
}

test.describe("accesibilidad", () => {
  test("el tema oscuro no tiene violaciones WCAG 2.1 AA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    expect(await violaciones(page)).toEqual([]);
  });

  test("el tema claro tampoco", async ({ page }) => {
    await page.goto("/");
    await page.click(TOGGLE);
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    expect(await violaciones(page)).toEqual([]);
  });

  // La versión inglesa tiene su propio marcado —el `lang` del <html>, las
  // etiquetas del formulario, el conmutador de idioma— y axe comprueba cosas
  // que dependen de él, así que pasar en español no dice nada del inglés.
  test("la versión inglesa tampoco, en los dos temas", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(await violaciones(page)).toEqual([]);

    await page.click(
      'button[aria-label="Switch between light and dark theme"]',
    );
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await violaciones(page)).toEqual([]);
  });

  test("la página de proyectos no tiene violaciones", async ({ page }) => {
    await page.goto("/proyectos");
    expect(await violaciones(page)).toEqual([]);
  });
});
