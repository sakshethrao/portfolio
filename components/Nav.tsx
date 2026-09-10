"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // hide on scroll down past the hero, show on scroll up
      if (y > 400 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        transition: "transform .35s cubic-bezier(.4,0,.2,1)",
        background: scrolled || open ? "rgba(255,255,255,0.82)" : "transparent",
        backdropFilter: scrolled || open ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled || open ? "blur(10px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          paddingTop: 14,
          paddingBottom: 14,
        }}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="sora"
          style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        {/* desktop links */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: 26 }}>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mono link-underline"
              style={{
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.03em",
                color: "var(--muted)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-desktop" style={{ alignItems: "center", gap: 10 }}>
          <SocialDot href={site.socials.linkedin} label="LinkedIn">
            in
          </SocialDot>
          <SocialDot href={site.socials.instagram} label="Instagram">
            ig
          </SocialDot>
          <SocialDot href={site.socials.github} label="GitHub">
            gh
          </SocialDot>
          <Link
            href="/#contact"
            className="mono"
            style={{
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.02em",
              background: "var(--ink)",
              color: "#fff",
              padding: "9px 16px",
              borderRadius: 99,
              whiteSpace: "nowrap",
            }}
          >
            Let’s build something ↗
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          className="nav-mobile-toggle mono"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          style={{
            border: "1px solid var(--line-strong)",
            background: "transparent",
            borderRadius: 99,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* mobile panel */}
      {open && (
        <div
          className="nav-mobile-panel"
          style={{
            borderTop: "1px solid var(--line)",
            padding: "8px var(--pad) 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sora"
              onClick={() => setOpen(false)}
              style={{
                fontWeight: 600,
                fontSize: 26,
                letterSpacing: "-0.01em",
                padding: "12px 0",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {item.label[0] + item.label.slice(1).toLowerCase()}
            </Link>
          ))}
          <div
            className="mono"
            style={{
              display: "flex",
              gap: 18,
              marginTop: 22,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted)",
            }}
          >
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={site.socials.instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <a href={site.socials.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
          <a
            href={`mailto:${site.email}`}
            className="mono"
            style={{
              marginTop: 18,
              fontWeight: 600,
              fontSize: 13,
              background: "var(--ink)",
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 99,
              textAlign: "center",
            }}
          >
            {site.email}
          </a>
        </div>
      )}
    </header>
  );
}

function SocialDot({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="mono social-dot"
      style={{
        width: 28,
        height: 28,
        border: "1px solid var(--line-strong)",
        borderRadius: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 10,
        color: "var(--muted)",
      }}
    >
      {children}
    </a>
  );
}
