import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TOGGLE = 'button[aria-label="Cambiar entre tema claro y oscuro"]';

/**
 * Analiza la página contra WCAG 2.1 nivel A y AA. Se comprueban los dos temas
 * porque el contraste depende de la paleta, y la oscura y la clara son
 * distintas: pasar una no dice nada de la otra.
 */
async function violaciones(page: Page) {
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
});
