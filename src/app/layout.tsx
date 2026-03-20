import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const montserrat = localFont({
  src: [
    {
      path: "../../public/fonts/montserrat/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
});

const playfairDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/playfair_display/PlayfairDisplay-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/playfair_display/PlayfairDisplay-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Jorge Herminio López Vázquez | CV",
  description:
    "Senior Full-Stack Engineer | Fintech · Proptech · Blockchain - CV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
