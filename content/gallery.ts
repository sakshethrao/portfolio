import type { Photo } from "@/lib/types";

/**
 * Travel gallery. A curated photo journal, not a feed.
 *
 * Order is a fixed shuffle, not the order the files arrived in — it is
 * deliberately stable so the server and client render the same sequence and
 * the layout never reshuffles under the reader. To reorder, move lines.
 *
 * To add photos: drop files in public/gallery/ and append entries here.
 *   - span: 2  -> a wider, taller feature slot (used sparingly, at irregular
 *     intervals, so a set of same-shaped frames still has rhythm)
 *   - width/height -> real pixel dimensions, so space is reserved up front
 *     and nothing shifts as images load
 *   - place/location/date -> optional; captions are off for this set, and the
 *     components fall back cleanly when they are empty
 */

export const photos: Photo[] = [
  { src: "/gallery/img-7869.jpg", place: "", span: 2, width: 1500, height: 2000 },
  { src: "/gallery/img-8004.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-4041.jpg", place: "", span: 2, width: 2000, height: 1122 },
  { src: "/gallery/img-8086.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-5827.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-4396.jpg", place: "", span: 2, width: 1500, height: 2000 },
  { src: "/gallery/img-0410.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-7215.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/gptempdownload-6.jpg", place: "", width: 1750, height: 2000 },
  { src: "/gallery/img-2666.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-0262.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-8460.jpg", place: "", span: 2, width: 1500, height: 2000 },
  { src: "/gallery/img-3645.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-8338.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-0915-1.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-9691.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-9142.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-2280.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-7796.jpg", place: "", span: 2, width: 1500, height: 2000 },
  { src: "/gallery/img-2933.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-6835.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-1251.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-7027.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-1185.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-1650.jpg", place: "", span: 2, width: 1500, height: 2000 },
  { src: "/gallery/img-9781.jpg", place: "", width: 1500, height: 2000 },
  { src: "/gallery/img-0452.jpg", place: "", width: 1500, height: 2000 },
];

export const galleryIntro =
  "Places I've pointed a camera at. Loosely ordered, lightly edited — the photos should do the talking.";
