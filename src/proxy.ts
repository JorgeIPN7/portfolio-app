import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Negociación de idioma antes de renderizar.
 *
 * Se llama `proxy` y no `middleware` porque Next 16 renombró el convenio; la
 * función que devuelve next-intl es la misma, solo cambia dónde la busca Next.
 * Va en `src/` para quedar al mismo nivel que `app/`, que es donde se busca.
 *
 * Qué hace en la práctica: reescribe `/` a `/es`, deja pasar `/en`, y para
 * quien llega sin preferencia guardada mira la cabecera `accept-language`. La
 * elección se recuerda en una cookie, así que cambiar de idioma a mano gana
 * sobre lo que diga el navegador.
 */
export const proxy = createMiddleware(routing);

export const config = {
  /**
   * Sin `matcher` esto correría también para el CSS, el vídeo del retrato y el
   * PDF. El patrón excluye las rutas internas de Next y cualquier cosa con
   * punto, que cubre a la vez `public/` y los metadatos generados
   * (`robots.txt`, `sitemap.xml`, `favicon.ico`): ninguno lleva idioma.
   */
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
