import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dentroDelLimite } from "@/lib/rate-limit";

/**
 * El limitador solo se aplica en producción, así que las pruebas E2E no lo
 * recorren nunca. Aquí es donde se comprueba que hace lo que dice.
 *
 * Cada prueba usa una clave distinta porque el estado vive en un módulo y no
 * hay forma de vaciarlo desde fuera: es deliberado, un `reset()` exportado solo
 * para las pruebas sería una puerta abierta en producción.
 */
describe("dentroDelLimite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deja pasar hasta el máximo y corta a partir de ahí", () => {
    const clave = "ip-basica";
    expect(dentroDelLimite(clave, 3, 1000)).toBe(true);
    expect(dentroDelLimite(clave, 3, 1000)).toBe(true);
    expect(dentroDelLimite(clave, 3, 1000)).toBe(true);
    expect(dentroDelLimite(clave, 3, 1000)).toBe(false);
  });

  it("vuelve a dejar pasar cuando la ventana caduca", () => {
    const clave = "ip-que-espera";
    expect(dentroDelLimite(clave, 1, 1000)).toBe(true);
    expect(dentroDelLimite(clave, 1, 1000)).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(dentroDelLimite(clave, 1, 1000)).toBe(true);
  });

  it("cuenta cada clave por separado", () => {
    // Si el contador fuera global, un solo visitante insistente dejaría fuera a
    // todos los demás.
    expect(dentroDelLimite("ip-a", 1, 1000)).toBe(true);
    expect(dentroDelLimite("ip-a", 1, 1000)).toBe(false);
    expect(dentroDelLimite("ip-b", 1, 1000)).toBe(true);
  });

  it("un bloqueado sigue bloqueado sin que su intento alargue la ventana", () => {
    const clave = "ip-insistente";
    expect(dentroDelLimite(clave, 1, 1000)).toBe(true);

    // Reintenta a mitad de ventana: rechazado, y el rechazo no debe contar como
    // intento nuevo ni empujar el momento de desbloqueo.
    vi.advanceTimersByTime(600);
    expect(dentroDelLimite(clave, 1, 1000)).toBe(false);

    // A los 1001 ms del intento válido ya puede volver.
    vi.advanceTimersByTime(401);
    expect(dentroDelLimite(clave, 1, 1000)).toBe(true);
  });
});
