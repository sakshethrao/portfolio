import type { CSSProperties, ReactNode } from "react";

/**
 * A browser-window mockup for web-app demos — the desktop equivalent of
 * DeviceFrame. Traffic-light dots, an address pill, and a viewport that grows
 * with its content.
 *
 * `minHeight` is a floor, never a cap: a fixed height turns the viewport into
 * a nested scroller, which swallows the wheel when the cursor is over it and
 * strands the reader mid-page. The demo is meant to be read straight down.
 */
export function BrowserFrame({
  children,
  url = "app.parchi.in",
  minHeight = 420,
  style,
}: {
  children: ReactNode;
  url?: string;
  minHeight?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(18,18,18,0.10)",
        boxShadow:
          "0 24px 50px -14px rgba(18,18,18,0.22), 0 4px 14px rgba(18,18,18,0.08)",
        ...style,
      }}
    >
      {/* chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: "#f1f0f4",
          borderBottom: "1px solid rgba(18,18,18,0.08)",
        }}
      >
        <span style={{ display: "flex", gap: 6, flex: "none" }}>
          <Dot color="#ef5350" />
          <Dot color="#f6bd3a" />
          <Dot color="#3ec564" />
        </span>
        <span
          style={{
            flex: 1,
            maxWidth: 260,
            margin: "0 auto",
            background: "#fff",
            border: "1px solid rgba(18,18,18,0.08)",
            borderRadius: 99,
            padding: "5px 12px",
            fontSize: 11,
            fontFamily: "var(--font-mono), monospace",
            color: "rgba(18,18,18,0.45)",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {url}
        </span>
        <span style={{ width: 44, flex: "none" }} aria-hidden />
      </div>

      {/* viewport — grows to fit, so it never becomes a wheel trap */}
      <div style={{ minHeight, overflowX: "hidden", position: "relative" }}>{children}</div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
      }}
    />
  );
}
