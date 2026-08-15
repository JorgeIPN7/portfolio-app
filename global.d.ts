import type { AppLocale } from "@/i18n/routing";
import type messages from "./messages/es.json";

/**
 * Tipado de next-intl a partir del catálogo español, que es el de referencia.
 *
 * Con esto `t("sections.perfil")` es un error de compilación en vez de un
 * `sections.perfil` impreso en la página, y el idioma deja de ser `string`
 * suelto en toda la aplicación. Que el inglés tenga las mismas claves no lo
 * cubre TypeScript: de eso se encarga la prueba de `messages`.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
