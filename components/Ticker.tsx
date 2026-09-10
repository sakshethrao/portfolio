"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Ticker({ items }: { items: readonly string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(
      () => setI((v) => (v + 1) % items.length),
      2800,
    );
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div
      className="mono"
      style={{
        fontWeight: 500,
        fontSize: 15,
        lineHeight: 1.6,
        color: "var(--muted-2)",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "baseline",
      }}
    >
      <span>currently thinking about —</span>
      {reduce ? (
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{items[i]}</span>
      ) : (
        <motion.span
          key={items[i]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ color: "var(--ink)", fontWeight: 600 }}
        >
          {items[i]}
        </motion.span>
      )}
    </div>
  );
}
