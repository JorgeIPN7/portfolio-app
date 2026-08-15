import { defineRouting } from "next-intl/routing";

/**
 * Configuración de idiomas, compartida por el proxy, la navegación y el
 * servidor. Es la única lista de idiomas del proyecto: añadir uno se hace aquí
 * y el resto se entera solo.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  /**
   * `as-needed` deja el español en la raíz y pone prefijo solo al inglés:
   * `/` y `/en`. Se elige así porque el CV ya vivía en `/` y esa URL puede
   * estar enlazada o indexada; con `always` pasaría a redirigir a `/es` y
   * habría que ir a recoger los enlaces rotos.
   */
  localePrefix: "as-needed",
});

/** `"es" | "en"`, derivado de la lista de arriba para que no se separen. */
export type AppLocale = (typeof routing.locales)[number];
