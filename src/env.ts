import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * `VERCEL` solo existe dentro de un despliegue. Sirve para exigir en producción
 * lo que en local sería un estorbo: nadie debería necesitar una clave de Resend
 * para compilar un CV en su portátil, pero desplegar el formulario sin ella es
 * publicar un botón que no envía nada.
 *
 * Se lee de `process.env` directamente porque esto decide el esquema, y el
 * esquema tiene que existir antes de que `createEnv` valide.
 */
const enDespliegue = Boolean(process.env.VERCEL);

/**
 * Variables de entorno validadas.
 *
 * Lo que aporta sobre leer `process.env` a pelo:
 *
 *  - **Frontera servidor/cliente**: acceder a `RESEND_API_KEY` desde un
 *    componente de cliente lanza una excepción en desarrollo, en vez de colar
 *    la clave en el bundle. Es la razón principal de tener esto.
 *  - **Validación en build**: `next.config.ts` importa este módulo, así que un
 *    despliegue con una URL malformada o sin clave falla al compilar y no al
 *    recibir la primera visita.
 *  - **Tipos**: `env.NEXT_PUBLIC_SITE_URL` es `string | undefined`, no `any`.
 *
 * Ninguna variable es obligatoria en local: `pnpm dev` y `pnpm build` funcionan
 * con el archivo `.env` vacío o inexistente.
 */
export const env = createEnv({
  server: {
    /** La inyecta Vercel. Su sola presencia indica que esto es un despliegue. */
    VERCEL: z.string().optional(),
    /**
     * Dominio de producción más corto del proyecto, sin protocolo. Pasa a ser
     * el dominio propio en cuanto se asigna uno.
     */
    VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1).optional(),
    /** Clave de Resend. Sin ella el formulario de contacto no envía nada. */
    RESEND_API_KEY: enDespliegue
      ? z.string().min(1)
      : z.string().min(1).optional(),
    /**
     * Destinatario del formulario. Si no se define, se usa el correo que ya
     * declara el propio CV: duplicarlo aquí solo daría dos sitios que
     * desincronizar.
     */
    CONTACT_TO_EMAIL: z.email().optional(),
    /**
     * Remitente. `onboarding@resend.dev` es el remitente de pruebas de Resend:
     * funciona sin verificar ningún dominio, pero **solo entrega al correo de
     * la cuenta**. Sirve exactamente para este caso, porque el formulario
     * escribe al dueño del CV. Con dominio propio verificado, cámbialo.
     *
     * No se valida como email porque Resend acepta el formato con nombre
     * visible: `Nombre <buzon@dominio>`.
     */
    CONTACT_FROM_EMAIL: z
      .string()
      .min(1)
      .default("Formulario del CV <onboarding@resend.dev>"),
  },
  client: {
    /** URL pública. Obligatoria fuera de Vercel; allí se deduce sola. */
    NEXT_PUBLIC_SITE_URL: z.url().optional(),
  },
  /**
   * Next.js sustituye `process.env.NEXT_PUBLIC_*` por su valor literal al
   * compilar, así que las de cliente hay que nombrarlas una a una: un acceso
   * dinámico no lo detecta y llegaría `undefined` al navegador.
   */
  runtimeEnv: {
    VERCEL: process.env.VERCEL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  /**
   * Una variable puesta a cadena vacía en el panel de Vercel se comporta como
   * si no existiera. Sin esto, `""` pasaría la validación de `.optional()` y
   * acabaría como dominio.
   */
  emptyStringAsUndefined: true,
});
