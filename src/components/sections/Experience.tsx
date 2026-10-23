"use client";
import { useRef } from "react";
import { EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.path{--pad:clamp(34px,6vw,76px);position:relative;margin-top:64px;padding-left:var(--pad)}
.xspine{position:absolute;left:6px;top:10px;bottom:10px;width:2px;background:var(--line);border-radius:2px;overflow:hidden}
.xspine i{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0))}
.stop{position:relative;display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:8px clamp(16px,3vw,48px);padding-bottom:clamp(40px,6vw,64px);color:var(--faint);transition:color .7s var(--ease)}
.stop::before{content:"";position:absolute;left:calc(var(--pad) * -1);top:6px;width:14px;height:14px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--line);transition:background .6s var(--ease),box-shadow .6s var(--ease),transform .6s var(--ease)}
.stop.lit{color:var(--ink)}
.stop.lit::before{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.07);transform:scale(1.05)}
.when{font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding-top:4px;color:inherit}
.stop h3{font-size:clamp(24px,3vw,44px);font-weight:700;letter-spacing:-.045em;line-height:1.04;color:inherit}
.kindx{display:inline-block;margin-bottom:10px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:99px;box-shadow:inset 0 0 0 1px currentColor;opacity:.75}
.place{margin-top:8px;font-size:16px;font-weight:500;color:inherit}
.det{margin-top:10px;max-width:60ch;font-size:15px;line-height:1.55;color:var(--mute);opacity:0;transform:translateY(8px);transition:opacity .8s var(--ease) .1s,transform .8s var(--ease) .1s}
.stop.lit .det{opacity:1;transform:none;color:var(--ink-2)}
.next{margin-top:8px;padding:clamp(26px,4vw,44px);border-radius:26px;border:1.5px dashed rgba(13,13,13,.25);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.next h3{font-size:clamp(26px,3.4vw,48px);font-weight:700;letter-spacing:-.045em;line-height:1}
.next h3 em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute)}
@media(max-width:699px){.stop{grid-template-columns:minmax(0,1fr)}}
`;

export default function Experience() {
  const path = useRef<HTMLDivElement>(null);
  useScrollProgress(path, (p, rect) => {
    const el = path.current;
    if (!el) return;
    el.style.setProperty("--p", p.toFixed(4));
    const line = window.innerHeight * 0.6;
    el.querySelectorAll<HTMLElement>(".stop").forEach((s) => {
      s.classList.toggle("lit", s.getBoundingClientRect().top < line);
    });
    void rect;
  });

  return (
    <section id="experience" className="sec" aria-labelledby="exp-h">
      <style>{css}</style>
      <div className="wrap">
        <div className="tag rv"><span>05</span><span>— Experience &amp; education</span></div>
        <h2 className="h2 rv-mask" id="exp-h"><span>One path, <em>so far.</em></span></h2>
        <div className="path" ref={path}>
          <div className="xspine" aria-hidden="true"><i /></div>
          <ol>
            {EXPERIENCE.map((s) => (
              <li key={s.title + s.when} className="stop">
                <div className="when">{s.when}</div>
                <div>
                  <span className="kindx">{s.kind}</span>
                  <h3>{s.title}</h3>
                  <p className="place">{s.place}</p>
                  <p className="det">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="next rv">
            <h3>Next — <em>Your team?</em></h3>
            <a className="btn btn-primary" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>Let&rsquo;s talk</a>
          </div>
        </div>
      </div>
    </section>
  );
}
