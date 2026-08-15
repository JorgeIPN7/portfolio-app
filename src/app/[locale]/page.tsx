import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { publishedProjects } from "@/data/projects";
import { getResumeData } from "@/data/resume-data";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProfileVideo } from "@/components/profile-video";
import { Reveal } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  cvPdfPath,
  profileDarkImagePath,
  profileImagePath,
  siteName,
  siteUrl,
} from "@/lib/site";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Download,
  Phone,
  Brain,
  Eye,
  Dumbbell,
  Zap,
  TrendingUp,
} from "lucide-react";

/**
 * Los iconos viven aquí y el texto en `messages/`: la clave es lo que une a los
 * dos. Así traducir un principio no obliga a tocar este archivo.
 */
const principles = [
  { key: "thoughts", Icon: Brain },
  { key: "promises", Icon: Eye },
  { key: "train", Icon: Dumbbell },
  { key: "start", Icon: Zap },
  { key: "finish", Icon: TrendingUp },
] as const;

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-bold tracking-widest text-foreground uppercase">
        {title}
      </h2>
      <Separator className="mt-2" />
    </div>
  );
}

function SkillCategory({
  category,
  skills,
}: {
  category: string;
  skills: string[];
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="rounded-md text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();
  const data = getResumeData(locale);

  // Datos estructurados para buscadores y asistentes. Se escapa `<` según
  // recomienda la guía de JSON-LD de Next.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    jobTitle: data.title,
    description: data.profile,
    url: siteUrl,
    image: `${siteUrl}${profileImagePath}`,
    email: `mailto:${data.contact.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.contact.location,
      addressCountry: "MX",
    },
    sameAs: [data.contact.linkedin.url, data.contact.github.url],
    alumniOf: data.education.map((edu) => ({
      "@type": "CollegeOrUniversity",
      name: edu.institution,
    })),
    knowsLanguage: data.languages.map((lang) => lang.language),
    knowsAbout: Object.values(data.technicalSkills).flat(),
  };

  return (
    <div className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Acciones fijas, arriba a la derecha */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <a
          href={cvPdfPath}
          download
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground backdrop-blur transition-colors hover:bg-accent"
          aria-label={t("actions.downloadCv")}
        >
          <Download size={18} aria-hidden="true" />
        </a>
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <aside className="flex flex-col items-center gap-5 border-r border-border bg-card px-8 py-9 lg:sticky lg:top-0 lg:h-screen lg:w-87.5 lg:shrink-0 lg:overflow-y-auto">
          <ProfileVideo poster={profileDarkImagePath} />

          <div className="w-full">
            <SectionHeading title={t("sections.contact")} />
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${data.contact.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail size={16} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{data.contact.email}</span>
              </a>
              <a
                href={data.contact.phone.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone size={16} className="shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {data.contact.phone.label}{" "}
                  <span className="text-xs">({data.contact.phone.note})</span>
                </span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0" aria-hidden="true" />
                <span>{data.contact.location}</span>
              </div>
              <a
                href={data.contact.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LinkedinIcon size={16} className="shrink-0" />
                <span className="truncate">{data.contact.linkedin.label}</span>
              </a>
              <a
                href={data.contact.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon size={16} className="shrink-0" />
                <span className="truncate">{data.contact.github.label}</span>
              </a>
            </div>
          </div>

          <div className="w-full rounded-lg border border-border bg-background/50 px-3 py-2">
            <ul className="flex flex-col gap-1 text-xs leading-snug text-muted-foreground">
              {principles.map(({ key, Icon }) => (
                <li key={key} className="flex items-center gap-1.5">
                  <Icon
                    size={12}
                    className="shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <span>{t(`principles.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/*
            El enlace aparece solo cuando hay algún caso publicado: mientras el
            índice esté vacío, llevar allí al visitante no aporta nada.
          */}
          {publishedProjects.length > 0 && (
            <Link
              href="/proyectos"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("actions.viewProjects")}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          )}
        </aside>

        <main className="flex-1 px-8 py-10 lg:px-14">
          <div className="mb-10">
            <h1 className="font-heading tracking-wide text-foreground uppercase">
              <span className="block text-5xl font-light lg:text-6xl">
                {data.name}
              </span>
              <span className="block text-5xl font-bold lg:text-7xl">
                {data.lastName}
              </span>
            </h1>
            <p className="mt-2 text-xl text-muted-foreground lowercase">
              {data.title.toLowerCase()}
            </p>
          </div>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.profile")} />
              <p className="text-base leading-relaxed text-foreground">
                {data.profile}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.experience")} />
              <div className="flex flex-col gap-8">
                {data.experience.map((exp) => (
                  <div key={`${exp.company}-${exp.period}`}>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {exp.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground italic">
                      {exp.company} | {exp.location}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {exp.period}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {exp.items.map((item) => (
                        <li key={item.text}>
                          {item.label ? (
                            <>
                              <span className="font-semibold text-foreground">
                                {item.label}:
                              </span>{" "}
                              {item.text}
                            </>
                          ) : (
                            item.text
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.education")} />
              <div className="flex flex-col gap-5">
                {data.education.map((edu) => (
                  <div key={`${edu.degree}-${edu.institution}`}>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    {edu.date && (
                      <p className="text-sm text-muted-foreground italic">
                        {edu.date}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.continuousLearning")} />
              <p className="text-base leading-relaxed text-foreground">
                {data.continuousLearning}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.technicalSkills")} />
              {Object.entries(data.technicalSkills).map(([cat, skills]) => (
                <SkillCategory key={cat} category={cat} skills={skills} />
              ))}
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.softSkills")} />
              {Object.entries(data.softSkills).map(([cat, skills]) => (
                <SkillCategory key={cat} category={cat} skills={skills} />
              ))}
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.languages")} />
              <div className="grid grid-cols-2 gap-6">
                {data.languages.map((lang) => (
                  <div key={lang.language}>
                    <p className="font-heading text-base font-bold text-foreground">
                      {lang.language}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lang.level}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mb-10">
              <SectionHeading title={t("sections.interests")} />
              <p className="text-sm text-muted-foreground">{data.hobbies}</p>
            </section>
          </Reveal>

          <Reveal>
            <section id="contacto" className="mb-10 scroll-mt-8">
              <SectionHeading title={t("sections.writeToMe")} />
              <ContactForm fallbackEmail={data.contact.email} locale={locale} />
            </section>
          </Reveal>

          <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>{data.footer.privacyNotice}</p>
            <p className="mt-2">
              {t("footer.lastUpdated", { date: data.footer.lastUpdated })}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
