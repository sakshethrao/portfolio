import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { AccentProvider } from "@/components/AccentProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";

// display + body: variable, with optical size so 12px labels and 160px
// headlines are drawn from the same family without looking like the same cut
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
  display: "swap",
});

// one italic serif, for a single emphasised word per heading
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

// used only inside the Nurture app preview, to match that product's type
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const url = "https://sakshethbuilds.com";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${site.name} — I like building things`,
    template: `%s — ${site.name}`,
  },
  description:
    "Saksheth Rao builds products, startups and AI tools. Founder of QuantumSight. A running index of things shipped, things in progress, and things built out of curiosity.",
  keywords: ["Saksheth Rao", "QuantumSight", "founder", "product", "AI", "computer vision", "portfolio"],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title: `${site.name} — I like building things`,
    description: "Products, startups, AI. Founder of QuantumSight. A builder's portfolio.",
    url,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — I like building things`,
    description: "Products, startups, AI. Founder of QuantumSight.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable} ${jakarta.variable}`}>
      <body>
        <AccentProvider>
          <SmoothScroll>
            <a href="#main" className="skip mono">
              Skip to content
            </a>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </AccentProvider>
      </body>
    </html>
  );
}
