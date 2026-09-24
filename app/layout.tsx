import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n";
import { SITE_OWNER, SITE_URL, THEME_COLOR } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Favian Zufar Niardi (Thiris)",
    template: "%s | Favian Zufar Niardi (Thiris)",
  },
  description:
    "Portfolio of Favian Zufar Niardi (Thiris), a computer network engineering student focused on networks, servers, and web development.",
  authors: [{ name: SITE_OWNER }],
  creator: SITE_OWNER,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Thiris Portfolio",
    title: "Favian Zufar Niardi (Thiris)",
    description:
      "Portfolio of Favian Zufar Niardi (Thiris), a computer network engineering student focused on networks, servers, and web development.",
  },
  twitter: {
    card: "summary",
    title: "Favian Zufar Niardi (Thiris)",
    description:
      "Portfolio of Favian Zufar Niardi (Thiris), a computer network engineering student focused on networks, servers, and web development.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_OWNER,
  alternateName: "Thiris",
  url: SITE_URL,
  jobTitle: "Computer Network Engineering Student",
  knowsAbout: [
    "Computer Networks",
    "MikroTik",
    "Server Administration",
    "Web Development",
  ],
};

// Root layout with fonts, background canvas, and navigation.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="grain overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Lewati ke konten
        </a>
        <LanguageProvider>
          <Starfield />
          <Navbar />
          <div id="konten" className="relative z-10 min-h-screen">
            {children}
          </div>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
