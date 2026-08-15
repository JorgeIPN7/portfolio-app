import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Canonical y alternativas `hreflang` de una ruta, en todos los idiomas.
 *
 * Las URLs se piden a `getPathname` en vez de componerlas a mano porque el
 * prefijo depende de la configuración de enrutado: hoy `as-needed` deja el
 * español sin prefijo, y concatenar `/${locale}${href}` produciría un `/es`
 * que redirige. Cambiar esa configuración no debería obligar a repasar los
 * metadatos de cada página.
 *
 * `x-default` apunta al español por ser el idioma por defecto: es lo que sirve
 * el proxy a quien llega sin preferencia reconocible.
 */
export function alternatesFor(
  href: string,
  locale: AppLocale,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: getPathname({ href, locale }),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((idioma) => [
          idioma,
          getPathname({ href, locale: idioma }),
        ]),
      ),
      "x-default": getPathname({ href, locale: routing.defaultLocale }),
    },
  };
}
