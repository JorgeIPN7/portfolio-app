import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Sustitutos de `next/link` y `next/navigation` que conocen el idioma actual.
 *
 * La diferencia práctica: `<Link href="/proyectos">` lleva a `/proyectos` en
 * español y a `/en/proyectos` en inglés, sin que quien lo escribe tenga que
 * pensar en el prefijo. Con el `Link` de Next habría que componer la ruta a
 * mano en cada uso, y basta olvidarlo una vez para tirar al visitante inglés
 * de vuelta al español.
 *
 * `getPathname` no es un componente: construye la ruta de un idioma concreto
 * desde el servidor, y con eso se arman las alternativas `hreflang` y el
 * sitemap.
 *
 * `createNavigation` devuelve también `redirect` y `useRouter`. No se exportan
 * porque hoy nadie navega por código: el conmutador de idioma es un enlace de
 * verdad. Cuando hagan falta, se añaden aquí.
 */
export const { Link, usePathname, getPathname } = createNavigation(routing);
