"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
.nav-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px var(--gutter);pointer-events:none}
.nav-bar>*{pointer-events:auto}
.nav-progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);z-index:60;pointer-events:none}
.brand{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.02em}
.mark{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px;letter-spacing:-.04em;
  box-shadow:inset 0 0 0 1.5px var(--ink);color:var(--ink);background:transparent;
  transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav.is-scrolled .mark{background:var(--ink);color:var(--paper)}
.brand:hover .mark{transform:rotate(360deg)}
.brand-name{transition:opacity .5s var(--ease),transform .5s var(--ease);white-space:nowrap}
.nav.is-scrolled .brand-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.pill{position:relative;display:none;align-items:center;gap:2px;padding:5px;border-radius:999px;
  transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s var(--ease)}
.nav.is-scrolled .pill{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 12px 32px -18px rgba(13,13,13,.3)}
.pill a{position:relative;z-index:1;padding:9px 18px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);transition:color .4s var(--ease)}
.pill a[aria-current="true"]{color:#fff}
.pill .ind{position:absolute;z-index:0;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);width:var(--w,0);transform:translateX(var(--x,0));opacity:var(--o,0);
  transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
.menu-btn{height:42px;padding:0 20px;border-radius:999px;font-weight:600;font-size:14px;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
@media(min-width:820px){.pill{display:flex}.menu-btn{display:none}}
.overlay{position:fixed;inset:0;z-index:70;background:var(--paper);clip-path:circle(0 at calc(100% - 52px) 38px);visibility:hidden;
  transition:clip-path .9s var(--ease),visibility 0s linear .9s;display:flex;flex-direction:column;padding:16px var(--gutter) 40px}
.overlay.open{clip-path:circle(150% at calc(100% - 52px) 38px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.overlay-top{display:flex;justify-content:space-between;align-items:center}
.overlay ol{margin-top:auto;display:grid;gap:4px}
.overlay li a{display:flex;align-items:baseline;gap:16px;font-size:clamp(44px,13vw,84px);font-weight:700;letter-spacing:-.05em;line-height:1.05;padding:6px 0;
  opacity:0;transform:translateY(32px);transition:opacity .7s var(--ease),transform .9s var(--ease)}
.overlay.open li a{opacity:1;transform:none;transition-delay:calc(.18s + var(--i)*70ms)}
.overlay li a span{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:.06em;color:var(--mute)}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);

  // scroll state + progress bar
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // active section
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // clear the indicator while on the hero
    const hero = document.getElementById("top");
    const hio = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive("")), { rootMargin: "-45% 0px -50% 0px" });
    if (hero) hio.observe(hero);
    return () => {
      io.disconnect();
      hio.disconnect();
    };
  }, []);

  // sliding indicator position
  useLayoutEffect(() => {
    const el = pill.current?.querySelector<HTMLElement>(`a[data-id="${active}"]`);
    setInd(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [active, scrolled]);

  // overlay: Esc closes + lock scroll
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release the scroll lock first
    setTimeout(() => scrollToTarget(`#${id}`), open ? 60 : 0);
  };

  return (
    <>
      <style>{css}</style>
      <div className="nav-progress" ref={progress} aria-hidden="true" />
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-bar">
          <a href="#top" className="brand" onClick={go("top")} aria-label={`${PROFILE.name} — back to top`}>
            <span className="mark">{PROFILE.initials}</span>
            <span className="brand-name">{PROFILE.name}</span>
          </a>
          <nav aria-label="Primary">
            <div className="pill" ref={pill} style={ind ? ({ "--x": `${ind.x}px`, "--w": `${ind.w}px`, "--o": 1 } as React.CSSProperties) : undefined}>
              <span className="ind" aria-hidden="true" />
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} data-id={n.id} onClick={go(n.id)} aria-current={active === n.id ? "true" : undefined}>
                  {n.label}
                </a>
              ))}
            </div>
          </nav>
          <button className="menu-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
            Menu
          </button>
        </div>
      </header>
      <div className={`overlay ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <div className="overlay-top">
          <span className="brand">
            <span className="mark" style={{ background: "var(--ink)", color: "var(--paper)" }}>{PROFILE.initials}</span>
          </span>
          <button className="menu-btn" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Close
          </button>
        </div>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={go(n.id)} style={{ "--i": i } as React.CSSProperties} tabIndex={open ? 0 : -1}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
