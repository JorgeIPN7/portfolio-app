import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { resumeData } from "@/data/resume-data";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const montserrat = localFont({
  src: [
    {
      path: "../fonts/montserrat/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf",
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
      path: "../fonts/playfair-display/PlayfairDisplay-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../fonts/playfair-display/PlayfairDisplay-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: resumeData.contact.linkedin.url }],
  creator: siteName,
  keywords: [
    "Full-Stack Engineer",
    "Tech Lead",
    "Fintech",
    "Proptech",
    "Blockchain",
    "Next.js",
    "NestJS",
    "TypeScript",
    "SPEI",
    "Tokenización inmobiliaria",
    "Ciudad de México",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "es_MX",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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

export const viewport: Viewport = {
  // El oscuro va primero: es el tema con el que abre la página.
  colorScheme: "dark light",
  themeColor: "#0b1120",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` aquí es requisito de next-themes: su script
    // añade la clase del tema al <html> antes de que React hidrate.
    <html
      lang="es"
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
