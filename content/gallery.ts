import type { Photo } from "@/lib/types";

/**
 * Travel gallery. A curated photo journal, not a feed.
 *
 * To add photos: drop files in public/gallery/ and append entries here.
 * Adding 10–20 more never requires touching the component.
 *   - span: 2  → the photo takes a wide/tall feature slot (use sparingly)
 *   - width/height → the real pixel dimensions, so the grid reserves space
 *     and nothing shifts on load
 *
 * Placeholders below use a neutral gradient so the layout is visible before
 * real images land. Replace `src` with "/gallery/your-file.jpg".
 */

export const photos: Photo[] = [
  { src: "", place: "TODO — replace with a real photo", location: "", date: "", span: 2, width: 1600, height: 1000 },
  { src: "", place: "TODO", location: "", date: "", width: 1000, height: 1250 },
  { src: "", place: "TODO", location: "", date: "", width: 1000, height: 1250 },
  { src: "", place: "TODO", location: "", date: "", width: 1600, height: 1000 },
  { src: "", place: "TODO", location: "", date: "", span: 2, width: 1600, height: 900 },
  { src: "", place: "TODO", location: "", date: "", width: 1000, height: 1250 },
];

export const galleryIntro =
  "Places I've pointed a camera at. Loosely ordered, lightly edited — the photos should do the talking.";
