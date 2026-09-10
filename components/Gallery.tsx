"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/types";

/**
 * Editorial photo grid + lightbox. Data-driven — add entries to content/gallery.ts
 * and the layout absorbs them. `span: 2` promotes a photo to a feature cell.
 */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <div className="gallery-grid">
        {photos.map((p, i) => {
          const empty = !p.src;
          return (
            <figure
              key={i}
              className="gallery-cell"
              style={{ gridColumn: p.span === 2 ? "span 2" : "span 1" }}
            >
              <button
                onClick={() => !empty && setOpen(i)}
                aria-label={empty ? "Photo coming soon" : `View ${p.place}`}
                style={{
                  display: "block",
                  width: "100%",
                  border: 0,
                  padding: 0,
                  margin: 0,
                  cursor: empty ? "default" : "zoom-in",
                  background: "var(--paper-3)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "block",
                    position: "relative",
                    width: "100%",
                    aspectRatio: `${p.width ?? 4} / ${p.height ?? 3}`,
                  }}
                >
                  {empty ? (
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "var(--faint)",
                        background:
                          "linear-gradient(135deg, #f3f2ef, #e9e7e2)",
                      }}
                    >
                      PHOTO
                    </span>
                  ) : (
                    <Image
                      src={p.src}
                      alt={p.place}
                      fill
                      sizes={p.span === 2 ? "(max-width: 720px) 100vw, 900px" : "(max-width: 720px) 50vw, 440px"}
                      style={{ objectFit: "cover" }}
                      className="gallery-img"
                    />
                  )}
                </span>
              </button>
              {(p.location || p.date) && (
                <figcaption
                  className="mono"
                  style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 8, letterSpacing: "0.02em" }}
                >
                  {[p.location, p.date].filter(Boolean).join(" · ")}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {open !== null && photos[open]?.src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[open].place}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(250,250,249,0.94)",
            backdropFilter: "blur(6px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 5vw, 64px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: 1100, width: "100%", maxHeight: "82vh" }}
          >
            <Image
              src={photos[open].src}
              alt={photos[open].place}
              width={photos[open].width ?? 1600}
              height={photos[open].height ?? 1000}
              sizes="90vw"
              style={{ width: "100%", height: "auto", maxHeight: "82vh", objectFit: "contain", borderRadius: 4 }}
              priority
            />
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--muted)" }}>
              <span>{[photos[open].location, photos[open].date].filter(Boolean).join(" · ") || photos[open].place}</span>
              <span>{open + 1} / {photos.length}</span>
            </div>
          </div>

          <button onClick={close} aria-label="Close" className="mono" style={lightboxBtn("top-right")}>Close ✕</button>
          {photos.length > 1 && (
            <>
              <button onClick={() => step(-1)} aria-label="Previous" className="mono" style={lightboxBtn("left")}>←</button>
              <button onClick={() => step(1)} aria-label="Next" className="mono" style={lightboxBtn("right")}>→</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function lightboxBtn(pos: "top-right" | "left" | "right"): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "fixed",
    background: "var(--paper)",
    border: "1px solid var(--line-strong)",
    borderRadius: 99,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--ink)",
  };
  if (pos === "top-right") return { ...base, top: 20, right: 20 };
  if (pos === "left") return { ...base, left: 20, top: "50%", transform: "translateY(-50%)" };
  return { ...base, right: 20, top: "50%", transform: "translateY(-50%)" };
}
