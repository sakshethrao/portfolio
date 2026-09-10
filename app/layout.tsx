import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AccentProvider } from "@/components/AccentProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
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
  keywords: [
    "Saksheth Rao",
    "QuantumSight",
    "founder",
    "product",
    "AI",
    "computer vision",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title: `${site.name} — I like building things`,
    description:
      "Products, startups, AI. Founder of QuantumSight. A builder's portfolio.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${mono.variable}`}>
      <body>
        <AccentProvider>
          <a href="#main" className="skip mono">
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </AccentProvider>
      </body>
    </html>
  );
}
