import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { FilmStrip } from "@/components/gallery/FilmStrip";
import { photos, galleryIntro } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Travel",
  description: "A curated photo journal — places, loosely ordered, lightly edited.",
};

export default function GalleryPage() {
  const pending = photos.every((p) => !p.src);
  return (
    <>
      <PageIntro
        eyebrow="Travel"
        title={
          <>
            A photo <span className="serif-i" style={{ fontSize: "1.1em" }}>journal</span>.
          </>
        }
        lead={galleryIntro}
      />
      {pending && (
        <div className="wrap mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--faint)", paddingBottom: 24 }}>
          PHOTOS ARE ON THEIR WAY — THE FRAMES ARE WAITING.
        </div>
      )}
      <section data-section="travel" style={{ paddingBottom: "clamp(48px, 8vw, 120px)" }}>
        <FilmStrip photos={photos} />
      </section>
    </>
  );
}
