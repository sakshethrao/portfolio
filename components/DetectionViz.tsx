"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The QuantumSight camera panel from the mockup — a stylised representation of
 * CCTV + on-device detection. Deliberately abstract: boxes and labels, not a
 * fake product screenshot.
 */
export function DetectionViz({
  cam = "CAM_04 · LOBBY",
  compact = false,
}: {
  cam?: string;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const detect = "#B4FF39";

  return (
    <div
      style={{
        background: "#101112",
        borderRadius: 16,
        padding: compact ? 12 : 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.42)",
          fontSize: 10,
          letterSpacing: "0.03em",
        }}
      >
        <span>{cam}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            className="blink"
            style={{
              width: 5,
              height: 5,
              borderRadius: 99,
              background: detect,
              display: "inline-block",
            }}
          />
          LIVE
        </span>
      </div>

      <div
        style={{
          border: "1px dashed rgba(255,255,255,0.14)",
          borderRadius: 10,
          position: "relative",
          minHeight: compact ? 84 : 108,
          overflow: "hidden",
          background:
            "repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0 10px,transparent 10px 20px)",
        }}
      >
        {/* scan sweep */}
        {!reduce && (
          <motion.div
            aria-hidden
            initial={{ x: "-30%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 40,
              background:
                "linear-gradient(90deg,transparent,rgba(180,255,57,0.10),transparent)",
            }}
          />
        )}

        <Box
          top="22%"
          left="30%"
          w={compact ? 54 : 70}
          h={compact ? 42 : 52}
          label="PERSON · 0.94"
          color={detect}
          reduce={!!reduce}
        />
        <Box
          top="46%"
          left="62%"
          w={compact ? 40 : 48}
          h={compact ? 30 : 36}
          label="BAG · 0.71"
          color={detect}
          reduce={!!reduce}
          delay={0.6}
        />
      </div>
    </div>
  );
}

function Box({
  top,
  left,
  w,
  h,
  label,
  color,
  reduce,
  delay = 0,
}: {
  top: string;
  left: string;
  w: number;
  h: number;
  label: string;
  color: string;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      style={{ position: "absolute", top, left, width: w, height: h }}
      initial={reduce ? undefined : { opacity: 0.35 }}
      animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1.5px solid ${color}`,
          borderRadius: 4,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: -14,
          left: 0,
          fontSize: 8.5,
          color,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}
