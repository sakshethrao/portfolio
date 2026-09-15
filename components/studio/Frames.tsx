"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { subscribeScroll } from "@/lib/scroll";

/**
 * Both canvases run `frameloop="demand"`: they draw when something changes,
 * not 60 times a second while you scroll past. This asks for a frame on the
 * inputs that can change the picture — scrolling (the camera rig is a pure
 * function of scroll progress) and pointer movement (the CCTV head tracks it).
 * Anything still easing asks for its own frames via `useSettle`.
 */
export function DemandFrames({ watch }: { watch?: unknown }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidate();
    const unsub = subscribeScroll(() => invalidate());
    const onMove = () => invalidate();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    return () => {
      unsub();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [invalidate]);

  // re-draw when a watched value (e.g. the hovered object) changes
  useEffect(() => {
    invalidate();
  }, [invalidate, watch]);

  return null;
}

/** ask for another frame while a value is still easing toward its target */
export function useSettle() {
  return useThree((s) => s.invalidate);
}
