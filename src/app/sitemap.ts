import type { MetadataRoute } from "next";
import { publishedProjects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home = {
    url: siteUrl,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 1,
  };

  // El índice de proyectos solo entra si tiene algo que enseñar: una página
  // vacía en el sitemap es una invitación a que la indexen vacía.
  if (publishedProjects.length === 0) return [home];

  return [
    home,
    {
      url: `${siteUrl}/proyectos`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...publishedProjects.map((project) => ({
      url: `${siteUrl}/proyectos/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
