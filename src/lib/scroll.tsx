"use client";
import Lenis from "lenis";
import { ReactNode, useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Smooth scrolling via Lenis. Skipped entirely under prefers-reduced-motion. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = l;
    let id = requestAnimationFrame(function raf(t) {
      l.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      l.destroy();
      lenis = null;
    };
  }, []);
  return <>{children}</>;
}

export function scrollToTarget(target: string | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  const dest: string | number | HTMLElement = el ?? target;
  if (lenis) {
    lenis.scrollTo(dest, { duration: 1.3, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else if (el) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target });
  }
}

export function lockScroll(lock: boolean) {
  if (lock) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
