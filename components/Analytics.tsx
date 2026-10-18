import Script from "next/script";
import { site } from "@/content/site";

/**
 * Google Analytics 4.
 *
 * Loaded with `afterInteractive` so gtag never competes with first paint or
 * the scroll work — the tag is ~100KB of main-thread JS and this page is
 * deliberately smooth.
 *
 * Only runs on the real site: skipped in local development and on Vercel
 * preview deployments, so neither fills the property with phantom traffic.
 *
 * Route changes are deliberately NOT sent by hand. GA4's enhanced
 * measurement already reports history-based navigation, which is what
 * App Router does — sending our own `page_view` on top would double-count
 * every client-side navigation.
 */
export function Analytics() {
  const id = site.analytics.ga;
  const live = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
  if (!id || !live) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
