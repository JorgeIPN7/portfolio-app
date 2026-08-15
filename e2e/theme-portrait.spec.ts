import { expect, test, type Page } from "@playwright/test";

const TOGGLE = 'button[aria-label="Cambiar entre tema claro y oscuro"]';

/** Lee el estado del `<video>` desde el navegador. */
function videoState(page: Page) {
  return page.evaluate(() => {
    const video = document.querySelector("video");
    if (!video) return null;
    return {
      readyState: video.readyState,
      currentTime: video.currentTime,
      duration: video.duration,
      paused: video.paused,
      preload: video.preload,
    };
  });
}

/** Espera a que haya fotogramas disponibles (`HAVE_CURRENT_DATA`). */
async function waitForFrames(page: Page) {
  await page.waitForFunction(
    () => {
      const video = document.querySelector("video");
      return Boolean(video && video.readyState >= 2);
    },
    undefined,
    { timeout: 30_000 },
  );
}

/**
 * Recorrido completo en el sentido nuevo: la página abre en oscuro con el
 * retrato en el último fotograma, el paso a claro rebobina hasta el principio
 * y la vuelta a oscuro lo reproduce de nuevo hacia delante.
 */
async function checkPortraitReacts(page: Page) {
  await page.goto("/");

  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  // La precarga en tiempo ocioso trae el archivo sin que nadie lo pida.
  await waitForFrames(page);

  // En reposo oscuro el vídeo descansa al final, no al principio.
  await page.waitForFunction(
    () => {
      const video = document.querySelector("video");
      return Boolean(video && video.currentTime > video.duration / 2);
    },
    undefined,
    { timeout: 10_000 },
  );

  const atRest = await videoState(page);
  expect(atRest!.currentTime).toBeGreaterThan(atRest!.duration / 2);

  // Oscuro → claro: rebobina hacia el principio.
  await page.click(TOGGLE);
  await expect(html).not.toHaveClass(/dark/);

  await page.waitForFunction(
    (from: number) => {
      const video = document.querySelector("video");
      return Boolean(video && video.currentTime < from);
    },
    atRest!.currentTime,
    { timeout: 10_000 },
  );

  // Claro → oscuro: reproduce hacia delante otra vez.
  await page.click(TOGGLE);
  await expect(html).toHaveClass(/dark/);

  await page.waitForFunction(
    () => {
      const video = document.querySelector("video");
      return Boolean(video && !video.paused && video.currentTime > 0);
    },
    undefined,
    { timeout: 10_000 },
  );
}

test.describe("retrato que responde al cambio de tema", () => {
  test("abre en el último fotograma, rebobina al pasar a claro y avanza al volver a oscuro", async ({
    page,
  }) => {
    await checkPortraitReacts(page);
  });

  // Reproduce el entorno real donde falló: Windows con MinAnimate = 0 hace que
  // el navegador reporte prefers-reduced-motion: reduce.
  test("sigue funcionando con las animaciones del sistema desactivadas", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await checkPortraitReacts(page);
    await context.close();
  });

  /**
   * El rebobinado llegó a producción saltando de golpe (17 ms, un solo
   * fotograma) y las pruebas no lo vieron: solo comprobaban que `currentTime`
   * bajaba, y bajar de 4,9 a 0 en un fotograma también es bajar. Esta mide el
   * recorrido, que es lo que el visitante percibe.
   */
  test("el rebobinado recorre el vídeo en vez de saltar al principio", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForFrames(page);
    await page.waitForFunction(
      () => {
        const video = document.querySelector("video");
        return Boolean(video && video.currentTime > video.duration / 2);
      },
      undefined,
      { timeout: 10_000 },
    );

    // Se arranca el muestreo antes del clic para no perder el principio.
    const muestreo = page.evaluate(() => {
      const video = document.querySelector("video");
      if (!video) return null;
      const inicio = performance.now();
      const fotogramas = new Set<string>();
      return new Promise<{ ms: number; fotogramas: number }>((resolve) => {
        let ultimoCambio = inicio;
        const id = window.setInterval(() => {
          const antes = fotogramas.size;
          fotogramas.add(video.currentTime.toFixed(2));
          if (fotogramas.size !== antes) ultimoCambio = performance.now();
          if (performance.now() - inicio > 4000) {
            window.clearInterval(id);
            resolve({
              ms: Math.round(ultimoCambio - inicio),
              fotogramas: fotogramas.size,
            });
          }
        }, 16);
      });
    });

    await page.click(TOGGLE);
    const medicion = await muestreo;

    // El vídeo dura ~5 s y se rebobina a 2,4x: alrededor de 2 s. Los márgenes
    // son anchos a propósito, para no atarse a la máquina que ejecute esto.
    expect(medicion!.ms).toBeGreaterThan(800);
    expect(medicion!.fotogramas).toBeGreaterThan(20);
  });
});

test.describe("tema", () => {
  test("abre en oscuro aunque el sistema prefiera claro", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await context.close();
  });

  test("la elección de claro sobrevive a la recarga", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.click(TOGGLE);
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
