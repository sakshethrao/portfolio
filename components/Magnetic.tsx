"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

/**
 * A wrapper whose child leans toward the cursor (±`pull`px) and springs back.
 * Reserved for the handful of primary actions — not a general hover effect.
 */
export function Magnetic({
  children,
  pull = 6,
  style,
  className,
}: {
  children: React.ReactNode;
  pull?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  if (reduce) {
    return (
      <div style={{ display: "inline-block", ...style }} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block", x, y, ...style }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        mx.set(Math.max(-1, Math.min(1, dx)) * pull);
        my.set(Math.max(-1, Math.min(1, dy)) * pull);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
