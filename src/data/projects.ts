export type Project = {
  /** Debe coincidir con la carpeta bajo `src/app/proyectos/`. */
  slug: string;
  title: string;
  summary: string;
  /** Tecnologías destacadas. Se muestran como etiquetas en el listado. */
  stack: string[];
  period: string;
  /** Un borrador no se enlaza desde el listado ni lo indexan los buscadores. */
  draft?: boolean;
};

/**
 * Índice de casos. Cada entrada necesita su `src/app/proyectos/<slug>/page.mdx`
 * con el contenido largo; esto es solo lo que se ve en el listado.
 *
 * Para publicar uno: escribe el MDX, rellena la entrada y quita `draft`.
 */
const projects = [
  {
    slug: "plantilla",
    title: "Título del proyecto",
    summary:
      "Una o dos frases sobre qué resolvía y para quién. Es lo único que se lee en el listado, así que conviene que diga el resultado, no la tecnología.",
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    period: "2026",
    draft: true,
  },
] satisfies Project[];

/** Los que se muestran en el listado, en el orden en que están declarados. */
export const publishedProjects = projects.filter((project) => !project.draft);
