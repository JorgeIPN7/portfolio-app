import type { MetadataRoute } from "next";
import { publishedProjects } from "@/data/projects";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

/**
 * URL absoluta de una ruta en un idioma. `getPathname` devuelve `/` para el
 * idioma por defecto, y concatenarlo daría `https://dominio/`: la barra sobra y
 * un buscador la trata como una URL distinta de la canónica.
 */
function absoluta(href: string, locale: (typeof routing.locales)[number]) {
  const ruta = getPathname({ href, locale });
  return `${siteUrl}${ruta === "/" ? "" : ruta}`;
}

/**
 * Una entrada por ruta, con las demás versiones declaradas como alternativas.
 * No se listan como URLs sueltas: los buscadores tienen que saber que son la
 * misma página en otro idioma, no dos páginas que compiten entre sí.
 */
function entrada(
  href: string,
  extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluta(href, routing.defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, absoluta(href, locale)]),
      ),
    },
    ...extra,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home = entrada("/", {
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
  });

  // El índice de proyectos solo entra si tiene algo que enseñar: una página
  // vacía en el sitemap es una invitación a que la indexen vacía.
  if (publishedProjects.length === 0) return [home];

  return [
    home,
    entrada("/proyectos", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...publishedProjects.map((project) =>
      entrada(`/proyectos/${project.slug}`, {
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
      }),
    ),
  ];
}
