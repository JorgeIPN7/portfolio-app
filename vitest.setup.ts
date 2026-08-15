import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Sin `globals: true`, Testing Library no engancha su limpieza automática:
// hay que desmontar a mano entre pruebas o el DOM se acumula.
afterEach(() => {
  cleanup();
});
