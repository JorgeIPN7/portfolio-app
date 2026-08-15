import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Configuración por petición: resuelve el idioma y carga su catálogo.
 *
 * El segmento `[locale]` actúa como comodín, así que aquí llega cualquier cosa
 * que alguien escriba en la barra de direcciones (`/robots.txt.bak`, `/xyz`).
 * `hasLocale` estrecha el tipo y, de paso, evita intentar importar un catálogo
 * que no existe.
 *
 * `requestLocale` está marcado como obsoleto en favor de `next/root-params`.
 * No se migra todavía a propósito: los tipos de `next/root-params` los genera
 * `next build`, así que en un clon recién hecho `pnpm typecheck` fallaría antes
 * de haber compilado nunca, y ese typecheck es justo lo que corre el hook de
 * pre-commit. Tampoco funciona dentro de Server Actions, que es donde el
 * formulario de contacto necesita saber el idioma.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const solicitado = await requestLocale;
  const locale = hasLocale(routing.locales, solicitado)
    ? solicitado
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
