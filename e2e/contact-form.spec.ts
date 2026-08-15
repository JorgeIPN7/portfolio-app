import { expect, test, type Page } from "@playwright/test";

/**
 * El formulario escribe de verdad cuando hay clave de Resend. En desarrollo no
 * la hay, y la acción responde con éxito tras volcar el mensaje por consola:
 * eso permite probar el recorrido completo sin mandar correo a nadie.
 */

const MENSAJE_VALIDO =
  "Hola, escribo desde una prueba automatizada para comprobar el formulario.";

async function irAlFormulario(page: Page, ruta = "/") {
  await page.goto(ruta);
  await page
    .getByLabel(/nombre|name/i)
    .first()
    .scrollIntoViewIfNeeded();
}

test.describe("formulario de contacto", () => {
  test("los tres campos están etiquetados y asociados", async ({ page }) => {
    await irAlFormulario(page);

    // `getByLabel` solo encuentra el campo si la etiqueta está bien asociada,
    // así que esto prueba la accesibilidad y no solo que el campo exista.
    await expect(page.getByLabel("Nombre")).toBeVisible();
    await expect(page.getByLabel("Correo electrónico")).toBeVisible();
    await expect(page.getByLabel("Mensaje")).toBeVisible();
  });

  test("el señuelo anti-robots no es visible ni alcanzable con el teclado", async ({
    page,
  }) => {
    await irAlFormulario(page);

    const senuelo = page.locator('input[name="website"]');
    await expect(senuelo).toHaveCount(1);
    await expect(senuelo).toBeHidden();
    await expect(senuelo).toHaveAttribute("tabindex", "-1");
  });

  test("un envío incompleto devuelve errores por campo, no un fallo genérico", async ({
    page,
  }) => {
    await irAlFormulario(page);

    // `noValidate` desactiva la validación del navegador a propósito: la que
    // manda es la del servidor, y es la que se quiere ver aquí.
    await page.getByLabel("Nombre").fill("Ana");
    await page.getByLabel("Correo electrónico").fill("esto-no-es-un-correo");
    await page.getByLabel("Mensaje").fill("corto");
    await page.getByRole("button", { name: /enviar mensaje/i }).click();

    await expect(page.getByText(/no parece válido/i)).toBeVisible();
    await expect(page.getByText(/al menos 20 caracteres/i)).toBeVisible();
  });

  test("un envío correcto confirma y vacía el formulario", async ({ page }) => {
    await irAlFormulario(page);

    await page.getByLabel("Nombre").fill("Ana Prueba");
    await page.getByLabel("Correo electrónico").fill("ana@ejemplo.com");
    await page.getByLabel("Mensaje").fill(MENSAJE_VALIDO);
    await page.getByRole("button", { name: /enviar mensaje/i }).click();

    await expect(page.getByRole("status")).toContainText(/mensaje enviado/i, {
      timeout: 15_000,
    });
    // Vaciarlo evita que un segundo clic mande lo mismo otra vez.
    await expect(page.getByLabel("Mensaje")).toHaveValue("");
  });

  test("en inglés el formulario responde en inglés", async ({ page }) => {
    await irAlFormulario(page, "/en");

    await page.getByLabel("Name").fill("Ann Test");
    await page.getByLabel("Email").fill("ann@example.com");
    await page.getByLabel("Message").fill(MENSAJE_VALIDO);
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByRole("status")).toContainText(/message sent/i, {
      timeout: 15_000,
    });
  });
});
