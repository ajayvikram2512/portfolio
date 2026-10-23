"use client";
import { RefObject, useEffect, useState } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once the element has entered the viewport (stays true unless `once` is false). */
export function useInView<T extends Element>(ref: RefObject<T | null>, opts: IntersectionObserverInit & { once?: boolean } = {}) {
  const { once = true, ...io } = opts;
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        if (once) obs.disconnect();
      } else if (!once) setInView(false);
    }, io);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, once]);
  return inView;
}

/**
 * Calls `onProgress(0..1)` (rAF-throttled) as the element scrolls through the viewport.
 * 0 when the element's top is at `start` (fraction of viewport height), 1 once its bottom has reached that line.
 */
export function useScrollProgress<T extends Element>(
  ref: RefObject<T | null>,
  onProgress: (p: number, rect: DOMRect) => void,
  { start = 0.6 }: { start?: number } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * start - r.top) / Math.max(1, r.height)));
      onProgress(p, r);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
