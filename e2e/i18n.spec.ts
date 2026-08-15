import { expect, test } from "@playwright/test";

/**
 * El CV existe en dos idiomas y el enrutado es asimétrico a propósito: el
 * español vive en `/` sin prefijo y el inglés en `/en`. Esto comprueba lo que
 * se rompe en silencio: una redirección mal puesta, un `lang` que no coincide
 * con el contenido o unas alternativas `hreflang` que apuntan a donde no deben.
 */
test.describe("idiomas", () => {
  test("la raíz sirve español y conserva la URL sin prefijo", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(
      page.getByRole("heading", { name: "perfil profesional" }),
    ).toBeVisible();
  });

  test("/en sirve inglés", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", { name: "professional profile" }),
    ).toBeVisible();
  });

  test("un navegador en inglés aterriza en la versión inglesa", async ({
    browser,
  }) => {
    // Contexto propio: el de la configuración va fijado a es-MX.
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  });

  test("el conmutador cambia de idioma y vuelve", async ({ page }) => {
    await page.goto("/");

    // Es un enlace, no un botón: los buscadores tienen que poder seguirlo.
    const aIngles = page.getByRole("link", { name: /English/i });
    await expect(aIngles).toHaveAttribute("href", "/en");
    await aIngles.click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.getByRole("link", { name: /Español/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("cada versión declara la otra como alternativa hreflang", async ({
    page,
  }) => {
    await page.goto("/");

    // Sin esto, los buscadores tratan las dos versiones como contenido
    // duplicado en vez de como el mismo CV en dos idiomas.
    //
    // Se compara la ruta y no la URL entera: Next normaliza la raíz sin barra
    // final (`http://host`, no `http://host/`), y el puerto cambia según quién
    // ejecute esto.
    for (const [hreflang, ruta] of [
      ["es", "/"],
      ["en", "/en"],
      ["x-default", "/"],
    ] as const) {
      const enlace = page.locator(
        `link[rel="alternate"][hreflang="${hreflang}"]`,
      );
      await expect(enlace).toHaveCount(1);
      const href = await enlace.getAttribute("href");
      expect(new URL(href!).pathname).toBe(ruta);
    }
  });

  test("el canonical de cada idioma apunta a su propia URL", async ({
    page,
  }) => {
    for (const [ruta, esperada] of [
      ["/", "/"],
      ["/en", "/en"],
    ] as const) {
      await page.goto(ruta);
      const href = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(href!).pathname).toBe(esperada);
    }
  });

  test("el sitemap lista las dos versiones", async ({ request }) => {
    const respuesta = await request.get("/sitemap.xml");
    expect(respuesta.ok()).toBe(true);

    const xml = await respuesta.text();
    expect(xml).toContain('hreflang="es"');
    expect(xml).toContain('hreflang="en"');
  });
});
