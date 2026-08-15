import { resumeData } from "@/data/resume-data";

/**
 * URL pública del sitio. Ancla el canonical, el sitemap, el robots y las
 * etiquetas Open Graph, así que tiene que ser absoluta.
 *
 * Orden: variable propia → dominio de producción que Vercel inyecta solo →
 * localhost para desarrollo.
 *
 * Desplegando en Vercel no hay que configurar nada, ni siquiera con dominio
 * propio: `VERCEL_PROJECT_PRODUCTION_URL` devuelve el dominio de producción
 * más corto, y pasa a ser el propio en cuanto se asigna. En cualquier otro
 * host hay que definir `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com`.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  // Llegar aquí dentro de un despliegue significa publicar el sitemap, el
  // canonical y el Open Graph apuntando a la máquina que compiló. Nada más se
  // rompería: es un fallo silencioso, y por eso conviene detener el despliegue.
  //
  // Limitación conocida: si en el proyecto de Vercel se desactiva "Enable
  // access to System Environment Variables", `VERCEL` tampoco existe y esto no
  // puede saltar. No hay ninguna variable que sobreviva a ese ajuste.
  if (process.env.VERCEL) {
    throw new Error(
      "No se pudo determinar la URL pública del sitio. En Vercel, comprueba " +
        'que "Enable access to System Environment Variables" siga activo en ' +
        "los ajustes del proyecto. En cualquier otro host, define " +
        "NEXT_PUBLIC_SITE_URL con el dominio público.",
    );
  }

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
