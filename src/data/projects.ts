import type { AppLocale } from "@/i18n/routing";

/** Lo que cambia de un idioma a otro: solo la prosa. */
export type ProjectContent = {
  title: string;
  summary: string;
};

export type Project = {
  /** Debe coincidir con la carpeta bajo `src/app/[locale]/proyectos/`. */
  slug: string;
  /** Tecnologías destacadas. Se muestran como etiquetas en el listado. */
  stack: string[];
  period: string;
  /** Un borrador no se enlaza desde el listado ni lo indexan los buscadores. */
  draft?: boolean;
  /**
   * El slug, el stack y el periodo son iguales en los dos idiomas, así que solo
   * se duplica el texto. Al ser un `Record` sobre `AppLocale`, añadir un idioma
   * a `routing` marca aquí un error de tipos hasta que se traduzca todo.
   */
  content: Record<AppLocale, ProjectContent>;
};

/**
 * Índice de casos. Cada entrada necesita su
 * `src/app/[locale]/proyectos/<slug>/page.mdx` con el contenido largo; esto es
 * solo lo que se ve en el listado.
 *
 * Para publicar uno: escribe el MDX, rellena la entrada y quita `draft`.
 */
const projects = [
  {
    slug: "plantilla",
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    period: "2026",
    draft: true,
    content: {
      es: {
        title: "Título del proyecto",
        summary:
          "Una o dos frases sobre qué resolvía y para quién. Es lo único que se lee en el listado, así que conviene que diga el resultado, no la tecnología.",
      },
      en: {
        title: "Project title",
        summary:
          "One or two sentences on what it solved and for whom. It's the only thing read in the listing, so it had better state the outcome, not the technology.",
      },
    },
  },
] satisfies Project[];

/** Los que se muestran en el listado, en el orden en que están declarados. */
export const publishedProjects = projects.filter((project) => !project.draft);
