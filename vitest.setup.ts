import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom no implementa matchMedia, y tanto next-themes como motion lo consultan
// al montar. Devuelve siempre `false`, que es lo que corresponde: el sitio no
// sigue al esquema del sistema y las pruebas no piden movimiento reducido.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Sin `globals: true`, Testing Library no engancha su limpieza automática:
// hay que desmontar a mano entre pruebas o el DOM se acumula.
afterEach(() => {
  cleanup();
});
