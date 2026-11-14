import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Silkscreen } from "next/font/google";
import { Consent } from "@/components/Consent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollFx } from "@/components/ScrollFx";
import { WorldBg } from "@/components/WorldBg";
import { integrations, links, site } from "@/config/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-bricolage", display: "swap" });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-silkscreen", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Learn AI by Building Games`,
    template: `%s`,
  },
  description: "Learn to make your first playable game with AI, practical lessons, feedback from other makers and personal project mentorship.",
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image" },
  verification: integrations.googleSiteVerification ? { google: integrations.googleSiteVerification } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#fff8ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${bricolage.variable} ${inter.variable} ${silkscreen.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <WorldBg />
        <ScrollFx />
        <Header brand={site.name} skoolUrl={links.skoolCommunity} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Consent provider={integrations.analytics.provider} domain={integrations.analytics.plausibleDomain} />
      </body>
    </html>
  );
}
