import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Gallery } from "@/components/Gallery";
import { photos, galleryIntro } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Travel",
  description: "A curated photo journal — places, loosely ordered, lightly edited.",
};

export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Travel" title="A photo journal." lead={galleryIntro} />
      <section className="wrap" style={{ padding: "0 var(--pad) clamp(72px, 12vw, 130px)" }}>
        <Gallery photos={photos} />
      </section>
    </>
  );
}
