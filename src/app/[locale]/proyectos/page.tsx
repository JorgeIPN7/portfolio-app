import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { publishedProjects } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/proyectos", locale),
  };
}

export default async function ProyectosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("projects");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-8 py-14">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t("backToCv")}
        </Link>

        <h1 className="font-heading text-5xl font-bold tracking-wide text-foreground uppercase lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
        <Separator className="mt-6" />

        {publishedProjects.length === 0 ? (
          <p className="mt-10 text-base text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="mt-10 flex flex-col gap-10">
            {publishedProjects.map((project) => (
              <li key={project.slug}>
                <Link href={`/proyectos/${project.slug}`} className="group">
                  <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
                    {project.content[locale].title}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {project.period}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-foreground">
                    {project.content[locale].summary}
                  </p>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="rounded-md text-xs font-normal"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
