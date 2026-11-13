"use client";

import { useSyncExternalStore } from "react";

/**
 * The desk is lit by the visitor's own clock. An inline script in the root
 * layout sets <html data-tod> before first paint (so the right poster and the
 * night colours are there immediately); this store mirrors it for React.
 */
export type Mood = "morning" | "day" | "golden" | "night";
export const MOODS: Mood[] = ["morning", "day", "golden", "night"];

export function moodForHour(h: number): Mood {
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "day";
  if (h >= 16 && h < 19) return "golden";
  return "night";
}

const listeners = new Set<() => void>();

function read(): Mood {
  const v = document.documentElement.dataset.tod as Mood | undefined;
  return v && MOODS.includes(v) ? v : moodForHour(new Date().getHours());
}

export function setMood(m: Mood) {
  document.documentElement.dataset.tod = m;
  listeners.forEach((l) => l());
}

export function getMood(): Mood {
  return typeof document === "undefined" ? "day" : read();
}

export function useMood(): Mood {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "day" as Mood,
  );
}

/** runs in <head>, before anything paints. Keep it tiny and dependency-free. */
export const TOD_SCRIPT = `(function(){try{var d=document.documentElement,m=['morning','day','golden','night'],q=new URLSearchParams(location.search).get('light'),h=new Date().getHours(),t=m.indexOf(q)>-1?q:h>=6&&h<11?'morning':h>=11&&h<16?'day':h>=16&&h<19?'golden':'night';d.dataset.tod=t;if(location.pathname==='/'){d.dataset.home='1';var l=document.createElement('link');l.rel='preload';l.as='image';l.setAttribute('fetchpriority','high');l.href='/studio/poster-'+t+'-'+(innerWidth<innerHeight*1.05?'port':'land')+'.webp';document.head.appendChild(l)}}catch(e){}})();`;
