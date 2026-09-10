import type { CSSProperties, ReactNode } from "react";

/**
 * iOS device frame — ported and trimmed from the mockup's ios-frame.jsx.
 * Bezel, Dynamic Island, status bar, home indicator, scrollable content area.
 * Base size 320 × 660; use `scale` to fit context.
 */
export function DeviceFrame({
  children,
  scale = 1,
  dark = false,
  time = "9:41",
  label,
  style,
}: {
  children: ReactNode;
  scale?: number;
  dark?: boolean;
  time?: string;
  label?: string;
  style?: CSSProperties;
}) {
  const W = 320;
  const H = 660;
  const fg = dark ? "#fff" : "#0a0a0a";

  return (
    <div
      aria-label={label}
      role={label ? "img" : undefined}
      style={{
        width: W * scale,
        height: H * scale,
        flex: "none",
        ...style,
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          borderRadius: 46,
          overflow: "hidden",
          position: "relative",
          background: dark ? "#000" : "#f2f2f7",
          boxShadow:
            "0 30px 60px rgba(18,18,18,0.16), 0 0 0 1px rgba(18,18,18,0.10), inset 0 0 0 6px rgba(18,18,18,0.9)",
          fontFamily: "-apple-system, system-ui, sans-serif",
        }}
      >
        {/* dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 104,
            height: 30,
            borderRadius: 20,
            background: "#000",
            zIndex: 50,
          }}
        />
        {/* status bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 26px 8px",
            font: "590 13px -apple-system, system-ui",
            color: fg,
          }}
        >
          <span>{time}</span>
          <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Bars fill={fg} />
            <Wifi fill={fg} />
            <Battery fill={fg} />
          </span>
        </div>

        {/* content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 44,
            paddingBottom: 22,
            overflow: "hidden",
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>{children}</div>
        </div>

        {/* home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 116,
            height: 5,
            borderRadius: 100,
            background: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.28)",
            zIndex: 60,
          }}
        />
      </div>
    </div>
  );
}

function Bars({ fill }: { fill: string }) {
  return (
    <svg width="17" height="11" viewBox="0 0 19 12" aria-hidden>
      <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={fill} />
      <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={fill} />
      <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={fill} />
      <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={fill} />
    </svg>
  );
}
function Wifi({ fill }: { fill: string }) {
  return (
    <svg width="15" height="11" viewBox="0 0 17 12" aria-hidden>
      <path
        d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z"
        fill={fill}
      />
      <path
        d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
        fill={fill}
      />
      <circle cx="8.5" cy="10.5" r="1.5" fill={fill} />
    </svg>
  );
}
function Battery({ fill }: { fill: string }) {
  return (
    <svg width="25" height="12" viewBox="0 0 27 13" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="12"
        rx="3.5"
        stroke={fill}
        strokeOpacity="0.35"
        fill="none"
      />
      <rect x="2" y="2" width="20" height="9" rx="2" fill={fill} />
      <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={fill} fillOpacity="0.4" />
    </svg>
  );
}
