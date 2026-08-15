import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * Límites del formulario. Se exportan porque los mensajes traducidos los
 * interpolan (`"al menos {min} caracteres"`) y no deben desincronizarse del
 * esquema que los aplica.
 */
export const CONTACT_LIMITS = {
  nameMax: 80,
  messageMin: 20,
  messageMax: 2000,
} as const;

/**
 * Claves de error, no frases.
 *
 * El esquema vive en el servidor y el visitante puede estar en cualquiera de
 * los dos idiomas, así que zod no puede saber en qué lengua redactar. Devuelve
 * una clave y el componente la traduce con su propio catálogo. La alternativa
 * —dos esquemas, uno por idioma— duplicaría las reglas de validación, que es
 * justo lo que no conviene duplicar.
 */
export type ContactErrorKey =
  "nameMin" | "nameMax" | "email" | "messageMin" | "messageMax";

/**
 * Validación del formulario de contacto. Es la única que cuenta: el navegador
 * hace lo que puede con `required` y `type="email"`, pero eso es comodidad, no
 * una barrera. Cualquiera puede llamar a la Server Action sin pasar por el
 * formulario.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "nameMin" satisfies ContactErrorKey)
    .max(CONTACT_LIMITS.nameMax, "nameMax" satisfies ContactErrorKey),
  email: z.email("email" satisfies ContactErrorKey),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, "messageMin" satisfies ContactErrorKey)
    .max(CONTACT_LIMITS.messageMax, "messageMax" satisfies ContactErrorKey),
  /**
   * Señuelo. El campo está oculto por CSS y ningún visitante lo ve, así que
   * viene relleno solo si lo ha rellenado un robot que completa todos los
   * `input` que encuentra. Se acepta como opcional y se comprueba en la acción,
   * que responde con un éxito falso: decirle al robot que ha fallado solo le
   * enseña a esquivar la trampa la próxima vez.
   */
  website: z.string().optional(),
  /** El idioma del visitante, para redactar el aviso en su lengua. */
  locale: z.enum(routing.locales),
});
