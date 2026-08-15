import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { resumeIdentity } from "@/data/resume-data";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { siteName, siteUrl } from "@/lib/site";
import "../globals.css";

const montserrat = localFont({
  src: [
    {
      path: "../../fonts/montserrat/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const playfairDisplay = localFont({
  src: [
    {
      path: "../../fonts/playfair-display/PlayfairDisplay-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../fonts/playfair-display/PlayfairDisplay-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

/**
 * Las dos versiones se generan en build. Sin esto, el segmento `[locale]`
 * obligaría a renderizar bajo demanda y un CV no tiene nada que calcular por
 * visita.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");
  // `alternates.canonical` admite también un objeto descriptor, y `openGraph.url`
  // no: se pide la ruta suelta en vez de reutilizar aquel campo.
  const rutaCanonica = getPathname({ href: "/", locale });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    applicationName: siteName,
    authors: [{ name: siteName, url: resumeIdentity.contact.linkedin.url }],
    creator: siteName,
    keywords: t("keywords")
      .split(",")
      .map((palabra) => palabra.trim()),
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "profile",
      locale: locale === "es" ? "es_MX" : "en_US",
      url: rutaCanonica,
      siteName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

export const viewport: Viewport = {
  // El oscuro va primero: es el tema con el que abre la página.
  colorScheme: "dark light",
  themeColor: "#0b1120",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // El segmento actúa como comodín: `/cualquier-cosa` llega aquí antes que al
  // 404. Sin esta comprobación se renderizaría el CV bajo una ruta inventada.
  if (!hasLocale(routing.locales, locale)) notFound();

  // Habilita el renderizado estático: le dice a next-intl qué idioma toca sin
  // esperar a leer la petición.
  setRequestLocale(locale);

  return (
    // `suppressHydrationWarning` aquí es requisito de next-themes: su script
    // añade la clase del tema al <html> antes de que React hidrate.
    <html
      lang={locale}
      className={`${montserrat.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        `suppressHydrationWarning` no se hereda: hace falta también aquí porque
        las extensiones del navegador (Bitdefender inyecta `bis_register` y
        `__processed_<uuid>__`) modifican el <body> antes de que React hidrate.
      */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/*
          Las secciones del CV se sirven con opacidad 0 y aparecen al entrar en
          pantalla. Sin JavaScript no hay nada que las muestre, así que aquí se
          revierte ese estado inicial: el CV entero tiene que poder leerse.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {/*
          Pasa el catálogo a los componentes de cliente (el conmutador de
          idioma y el formulario). Va entero porque son unos pocos kilobytes y
          filtrarlo por rama costaría más mantenimiento del que ahorra.
        */}
        <NextIntlClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
