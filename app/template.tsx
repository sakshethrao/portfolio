"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page-enter: a short fade. Deliberately opacity-only — animating `y` leaves a
 * transform on this wrapper, which promotes the whole document to one
 * composited layer, renders it on a fractional pixel offset (text shimmers as
 * you scroll) and makes it the containing block for every fixed child.
 * No exit choreography — App Router won't hold it.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
