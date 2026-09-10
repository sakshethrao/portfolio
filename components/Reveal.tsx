"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Restrained scroll-in. One gesture, used everywhere, so the whole site moves
 * with the same rhythm. No bounce, no stagger unless asked.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  as = "div",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: keyof typeof motion;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduce) {
    const Plain = as as keyof React.JSX.IntrinsicElements;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
