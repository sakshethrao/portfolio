/**
 * A tiny frame-rate-safe scroll store. Lenis (see components/SmoothScroll)
 * writes here on every scroll tick; the 3D studio reads `scroll.y` directly
 * inside its render loop, so nothing in React re-renders per frame.
 *
 * `scrollTo` proxies to Lenis when it's mounted, else native.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export const scroll = {
  y: 0,
  /** viewport height, kept fresh on resize */
  vh: 0,
};

export function setScroll(y: number) {
  scroll.y = y;
  for (const l of listeners) l();
}

export function subscribeScroll(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

type ScrollToTarget = number | string | HTMLElement;
type ScrollToFn = (t: ScrollToTarget, opts?: { offset?: number; immediate?: boolean }) => void;

let scrollToImpl: ScrollToFn | null = null;

export function registerScrollTo(fn: ScrollToFn | null) {
  scrollToImpl = fn;
}

export function scrollTo(t: ScrollToTarget, opts?: { offset?: number; immediate?: boolean }) {
  if (scrollToImpl) return scrollToImpl(t, opts);
  if (typeof window === "undefined") return;
  const el = typeof t === "string" ? document.querySelector<HTMLElement>(t) : t;
  if (typeof el === "number") window.scrollTo({ top: el, behavior: opts?.immediate ? "auto" : "smooth" });
  else if (el) el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
}
