"use client";

import { resumeData } from "@/data/resume-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import {
  Mail,
  MapPin,
  Sun,
  Moon,
  Download,
  Phone,
  Brain,
  Eye,
  Dumbbell,
  Zap,
  TrendingUp,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { useRef, useEffect, useCallback } from "react";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl font-bold uppercase tracking-widest text-foreground">
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

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const data = resumeData;
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevThemeRef = useRef(theme);
  const rafRef = useRef<number | null>(null);

  const playReverse = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = () => {
      if (!video) return;
      if (video.currentTime <= 0.05) {
        video.currentTime = 0;
        return;
      }
      video.currentTime = Math.max(0, video.currentTime - 0.04);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prevThemeRef.current !== theme) {
      if (theme === "dark") {
        // Play forward: removing sunglasses
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        video.currentTime = 0;
        video.play();
      } else {
        // Play reverse: putting sunglasses back on
        video.pause();
        playReverse();
      }
      prevThemeRef.current = theme;
    }
  }, [theme, playReverse]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Top actions - top right like original */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground backdrop-blur transition-colors hover:bg-accent"
          aria-label="toggle dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="/cv_fullstack_jorge_herminio_lopez_vazquez.pdf"
          download
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground backdrop-blur transition-colors hover:bg-accent"
          aria-label="Descargar CV en PDF"
        >
          <Download size={18} />
        </a>
      </div>

      {/* Main layout */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="flex flex-col items-center gap-5 border-r border-border bg-card px-8 py-9 lg:w-87.5 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          {/* Profile video - plays on theme toggle */}
          <div className="relative h-56 w-56 overflow-hidden rounded-full border-2 border-border lg:h-64 lg:w-64">
            <video
              ref={videoRef}
              src="/profile-video.mp4"
              muted
              playsInline
              preload="auto"
              poster="/profile.jpeg"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Contact section */}
          <div className="w-full">
            <SectionHeading title="contacto" />
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${data.contact.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail size={16} className="shrink-0" />
                <span className="truncate">{data.contact.email}</span>
              </a>
              <a
                href={data.contact.phone.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone size={16} className="shrink-0" />
                <span className="truncate">
                  {data.contact.phone.label}{" "}
                  <span className="text-xs">({data.contact.phone.note})</span>
                </span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0" />
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

          {/* Principios */}
          <div className="w-full rounded-lg border border-border bg-background/50 px-3 py-2">
            <ul className="flex flex-col gap-1 text-xs leading-snug text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Brain size={12} className="shrink-0 text-foreground" />
                <span>Controla tus pensamientos antes que tus actos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Eye size={12} className="shrink-0 text-foreground" />
                <span>Cumple tus promesas, aunque nadie mire</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Dumbbell size={12} className="shrink-0 text-foreground" />
                <span>Entrena la mente como entrenas el cuerpo</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap size={12} className="shrink-0 text-foreground" />
                <span>Aprende a comenzar aunque no tengas ganas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <TrendingUp size={12} className="shrink-0 text-foreground" />
                <span>Termina lo que empiezas, aunque duela</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-8 py-10 lg:px-14">
          {/* Name */}
          <div className="mb-10">
            <h1 className="font-heading text-5xl font-light uppercase tracking-wide text-foreground lg:text-6xl">
              {data.name}
            </h1>
            <h1 className="font-heading text-5xl font-bold uppercase tracking-wide text-foreground lg:text-7xl">
              {data.lastName}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground lowercase">
              {data.title.toLowerCase()}
            </p>
          </div>

          {/* Perfil Profesional */}
          <section className="mb-10">
            <SectionHeading title="perfil profesional" />
            <p className="text-base leading-relaxed text-foreground">
              {data.profile}
            </p>
          </section>

          {/* Experiencia Profesional */}
          <section className="mb-10">
            <SectionHeading title="experiencia profesional" />
            <div className="flex flex-col gap-8">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {exp.title}
                  </h3>
                  <p className="mt-0.5 text-sm italic text-muted-foreground">
                    {exp.company} | {exp.location}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {exp.period}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {exp.items.map((item, j) => (
                      <li key={j}>
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

          {/* Formación Académica */}
          <section className="mb-10">
            <SectionHeading title="formación académica" />
            <div className="flex flex-col gap-5">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {edu.degree}
                  </h3>
                  {edu.date && (
                    <p className="text-sm italic text-muted-foreground">
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

          {/* Desarrollo Profesional Continuo */}
          <section className="mb-10">
            <SectionHeading title="desarrollo profesional continuo" />
            <p className="text-base leading-relaxed text-foreground">
              {data.continuousLearning}
            </p>
          </section>

          {/* Habilidades Técnicas */}
          <section className="mb-10">
            <SectionHeading title="habilidades técnicas" />
            {Object.entries(data.technicalSkills).map(([cat, skills]) => (
              <SkillCategory key={cat} category={cat} skills={skills} />
            ))}
          </section>

          {/* Habilidades Blandas */}
          <section className="mb-10">
            <SectionHeading title="habilidades blandas" />
            {Object.entries(data.softSkills).map(([cat, skills]) => (
              <SkillCategory key={cat} category={cat} skills={skills} />
            ))}
          </section>

          {/* Idiomas */}
          <section className="mb-10">
            <SectionHeading title="idiomas" />
            <div className="grid grid-cols-2 gap-6">
              {data.languages.map((lang) => (
                <div key={lang.language}>
                  <p className="font-heading text-base font-bold text-foreground">
                    {lang.language}
                  </p>
                  <p className="text-sm text-muted-foreground">{lang.level}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Intereses */}
          <section className="mb-10">
            <SectionHeading title="intereses" />
            <p className="text-sm text-muted-foreground">{data.hobbies}</p>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>{data.footer.privacyNotice}</p>
            <p className="mt-2">
              Última actualización: {data.footer.lastUpdated}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
