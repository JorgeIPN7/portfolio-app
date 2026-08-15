import type { AppLocale } from "@/i18n/routing";
import { resumeEn } from "./resume-data.en";
import { resumeEs } from "./resume-data.es";

export type ResumeLink = {
  label: string;
  url: string;
};

export type ExperienceItem = {
  /** Encabezado en negrita del punto. Vacío u omitido lo deja como texto corrido. */
  label?: string;
  text: string;
};

export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  items: ExperienceItem[];
};

export type Education = {
  degree: string;
  date?: string;
  institution: string;
};

export type Language = {
  language: string;
  level: string;
};

/** Categoría visible → lista de habilidades. */
export type SkillGroups = Record<string, string[]>;

export type ResumeData = {
  name: string;
  lastName: string;
  title: string;
  profile: string;
  contact: {
    email: string;
    phone: { label: string; url: string; note: string };
    location: string;
    linkedin: ResumeLink;
    github: ResumeLink;
  };
  experience: Experience[];
  education: Education[];
  continuousLearning: string;
  technicalSkills: SkillGroups;
  softSkills: SkillGroups;
  languages: Language[];
  hobbies: string;
  quote: string;
  footer: {
    privacyNotice: string;
    lastUpdated: string;
  };
};

/**
 * El CV, uno por idioma.
 *
 * El contenido no vive en `messages/`, que es donde next-intl guarda los textos
 * de interfaz, sino aquí: son estructuras anidadas (experiencias con puntos,
 * categorías con listas) y el tipo `ResumeData` las vigila. En un catálogo JSON
 * plano se perdería esa garantía y nadie avisaría de que a la traducción le
 * falta un empleo.
 */
const resumeByLocale: Record<AppLocale, ResumeData> = {
  es: resumeEs,
  en: resumeEn,
};

export function getResumeData(locale: AppLocale): ResumeData {
  return resumeByLocale[locale];
}

/**
 * Los datos que no dependen del idioma: nombre, correo, teléfono y perfiles.
 * Los usan el `sitemap`, el JSON-LD y la imagen Open Graph, donde traducir no
 * tiene sentido. Se toma del español por ser el idioma de referencia; las
 * pruebas comprueban que el inglés no se desvíe en estos campos.
 */
export const resumeIdentity = {
  name: resumeEs.name,
  lastName: resumeEs.lastName,
  contact: resumeEs.contact,
} as const;
