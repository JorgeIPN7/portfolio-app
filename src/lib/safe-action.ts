import { createSafeActionClient } from "next-safe-action";

/**
 * Errores de servidor, como códigos.
 *
 * Igual que con las claves de validación: el servidor no sabe en qué idioma
 * está leyendo el visitante, así que devuelve un código y el componente escribe
 * la frase. Devolver el mensaje ya redactado obligaría a la acción a resolver
 * traducciones solo para el caso de fallo.
 *
 * - `unavailable`: falta configuración para enviar (sin clave de Resend). Es un
 *   problema de este sitio, no de quien escribe, y merece decirle que use el
 *   correo directo.
 * - `unexpected`: cualquier otra cosa. El detalle real queda en los registros
 *   del servidor y no viaja al navegador.
 */
export type ContactServerError = "unavailable" | "unexpected";

/**
 * Cliente de Server Actions con validación y errores acotados.
 *
 * `handleServerError` es lo que impide que una excepción cualquiera —una traza
 * con rutas del servidor, un mensaje de la API de Resend— acabe pintada en la
 * página. Sin esto, next-safe-action ya devolvería un texto genérico, pero
 * tampoco quedaría registrado nada del error real.
 */
export const actionClient = createSafeActionClient({
  /**
   * `flattened` deja los errores como `{ formErrors, fieldErrors }`, que es lo
   * que un formulario necesita para pintar un mensaje debajo de cada campo. El
   * formato por defecto los anida en un árbol pensado para esquemas profundos,
   * y aquí solo hay tres campos planos.
   */
  defaultValidationErrorsShape: "flattened",
  handleServerError(error): ContactServerError {
    console.error("Server Action falló:", error.message);
    return "unexpected";
  },
});
