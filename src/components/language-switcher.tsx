"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Cambia entre los dos idiomas manteniendo la página actual.
 *
 * Es un enlace y no un botón a propósito: un `<a href="/en">` de verdad lo
 * siguen los buscadores y funciona sin JavaScript, mientras que un botón con
 * `router.replace` dejaría la versión inglesa sin ninguna ruta de entrada que
 * un rastreador pueda recorrer.
 *
 * `usePathname` de next-intl devuelve la ruta **sin** prefijo de idioma, así
 * que `href={pathname}` con otro `locale` da la misma página traducida. Con el
 * `usePathname` de Next se estaría concatenando el prefijo dos veces.
 *
 * Alterna entre dos idiomas. Con un tercero esto tendría que pasar a ser un
 * desplegable, no un conmutador.
 */
export function LanguageSwitcher() {
  const t = useTranslations("actions");
  const locale = useLocale();
  const pathname = usePathname();

  const otro =
    routing.locales.find((idioma) => idioma !== locale) ??
    routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={otro}
      hrefLang={otro}
      aria-label={`${t("switchLanguage")}: ${t("otherLanguageName")}`}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-xs font-semibold tracking-wider text-muted-foreground uppercase backdrop-blur transition-colors hover:bg-accent hover:text-foreground"
    >
      {otro}
    </Link>
  );
}
