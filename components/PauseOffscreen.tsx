"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders an element that pauses its CSS animations (its own and its
 * children's) whenever it is off screen. Decorative loops otherwise run for
 * the life of the page, waking the compositor on every frame while you scroll
 * somewhere else entirely.
 */
export function PauseOffscreen({
  children,
  className = "",
  style,
  margin = "200px",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={`${className}${visible ? "" : " anim-paused"}`} style={style}>
      {children}
    </div>
  );
}
