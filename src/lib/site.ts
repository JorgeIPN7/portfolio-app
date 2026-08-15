import { resumeData } from "@/data/resume-data";

/**
 * URL pública del sitio. Es lo que ancla el canonical, el sitemap, el robots y
 * las etiquetas Open Graph, así que tiene que ser absoluta.
 *
 * Orden: variable propia → dominio de producción que Vercel inyecta solo →
 * localhost para desarrollo. Al tener dominio propio, define
 * `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteName = `${resumeData.name} ${resumeData.lastName}`;

export const siteTitle = `${siteName} — Senior Full-Stack Engineer`;

export const siteDescription =
  "Senior Full-Stack Engineer con +8 años en fintech, proptech y blockchain. Pagos SPEI/STP, tokenización inmobiliaria y producto en producción desde CDMX.";

export const cvPdfPath = "/cv_fullstack_jorge_herminio_lopez_vazquez.pdf";

export const profileImagePath = "/profile.jpeg";

/**
 * Último fotograma del vídeo del retrato, extraído con Chrome. Es el póster
 * que corresponde al tema oscuro, con el que arranca la página.
 */
export const profileDarkImagePath = "/profile-dark.jpeg";
