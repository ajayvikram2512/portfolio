"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import TechLogo, { brandTint, isBrand } from "../ui/TechLogo";

const css = `
.skills-wrap{display:grid;gap:32px;grid-template-columns:minmax(0,1fr) 320px;align-items:start;margin-top:56px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:36px}
.chip{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.chip:hover{transform:translateY(-1px)}
.chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.pt{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px}
.tile{position:relative;aspect-ratio:1/1.12;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:10px 10px 9px;display:flex;flex-direction:column;justify-content:space-between;
  opacity:0;transform:translateY(18px) scale(.94);
  transition:opacity .8s var(--ease) calc(var(--d8) * 40ms),transform .9s var(--ease) calc(var(--d8) * 40ms),background .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease)}
.pt.in .tile{opacity:1;transform:none}
.pt.done .tile{transition-delay:0s}
.pt.in .tile.dim{opacity:.22}
.tile:hover,.tile.on{background:var(--ink);color:#fff;box-shadow:0 18px 30px -18px rgba(13,13,13,.55)}
.pt.done .tile:hover,.pt.done .tile.on{transform:translateY(-3px)}
.tile .n{font-family:var(--font-mono);font-size:10px;color:var(--mute)}
.tile:hover .n,.tile.on .n{color:rgba(255,255,255,.6)}
.tile .s{font-weight:700;letter-spacing:-.05em;font-size:clamp(22px,2.4vw,34px);line-height:1}
.tile .nm{display:block;font-size:11px;font-weight:500;line-height:1.15;letter-spacing:-.01em}
.tile .fm{display:block;margin-top:2px;font-family:var(--font-mono);font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile:hover .fm,.tile.on .fm{color:rgba(255,255,255,.55)}
.insp{position:sticky;top:96px;padding:26px;min-height:420px;display:flex;flex-direction:column;align-items:center;text-align:center}
.glow{position:relative;width:190px;height:190px;display:grid;place-items:center}
.glow::before{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(closest-side,rgba(var(--t),.16),rgba(var(--t),0));filter:blur(6px)}
.pop{position:relative;animation:pop .7s var(--ease)}
@keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}
.insp .fam{margin-top:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.insp h3{margin-top:6px;font-size:30px;font-weight:700;letter-spacing:-.04em;line-height:1.05}
.insp .used{margin-top:18px;width:100%;text-align:left;border-top:1px solid var(--line);padding-top:14px}
.insp .used b{display:block;font-family:var(--font-mono);font-weight:500;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
.insp .used li{font-size:14px;line-height:1.4;padding:3px 0;color:var(--ink-2)}
@media(max-width:1023px){
  .skills-wrap{grid-template-columns:minmax(0,1fr)}
  .insp{position:relative;top:0;min-height:0}
}
@media(max-width:767px){
  .pt{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
  .tile{transition-delay:calc(var(--d4) * 40ms),calc(var(--d4) * 40ms),0s,0s,0s;padding:8px}
  .tile .nm{font-size:10px}
  .tile .fm{display:none}
}
`;

export default function Skills() {
  const flat = useMemo(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family, n: ++n })));
  }, []);
  const [family, setFamily] = useState<string>("All");
  const [sel, setSel] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const inView = useInView(grid, { threshold: 0.15 });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, [inView]);

  const cur = flat[sel];

  return (
    <section id="skills" className="sec" aria-labelledby="skills-h">
      <style>{css}</style>
      <div className="wrap">
        <div className="tag rv"><span>02</span><span>— Skills</span></div>
        <h2 className="h2 rv-mask" id="skills-h"><span>The periodic table of <em>my stack.</em></span></h2>

        <div className="chips rv" role="group" aria-label="Filter skills by family" style={{ "--i": 1 } as React.CSSProperties}>
          {["All", ...SKILL_GROUPS.map((g) => g.family)].map((f) => (
            <button key={f} className="chip" aria-pressed={family === f} onClick={() => setFamily(f)}>{f}</button>
          ))}
        </div>

        <div className="skills-wrap">
          <div ref={grid} className={`pt ${inView ? "in" : ""} ${done ? "done" : ""}`} role="group" aria-label="Skills">
            {flat.map((s, i) => {
              const dim = family !== "All" && s.family !== family;
              const row8 = Math.floor(i / 8), col8 = i % 8, row4 = Math.floor(i / 4), col4 = i % 4;
              return (
                <button
                  key={s.name}
                  className={`tile ${dim ? "dim" : ""} ${i === sel ? "on" : ""}`}
                  style={{ "--d8": row8 + col8, "--d4": row4 + col4 } as React.CSSProperties}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                  aria-label={`${s.name}, ${s.family}, element ${s.n}`}
                >
                  <span className="n">{String(s.n).padStart(2, "0")}</span>
                  <span className="s">{s.symbol}</span>
                  <span>
                    <span className="nm">{s.name}</span>
                    <span className="fm">{s.family === "Other Technologies" ? "Other tech" : s.family}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="card insp rv" aria-live="polite" aria-label="Skill details" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="glow" style={{ "--t": brandTint(cur.name) } as React.CSSProperties}>
              <div className="pop" key={cur.name}>
                <TechLogo name={cur.name} size={isBrand(cur.name) ? 150 : 120} />
              </div>
            </div>
            <div className="fam">{cur.family}</div>
            <h3>{cur.name}</h3>
            <div className="used">
              <b>{cur.usedIn.length ? "Used in" : "From the résumé"}</b>
              {cur.usedIn.length ? (
                <ul>{cur.usedIn.map((u) => <li key={u}>{u}</li>)}</ul>
              ) : (
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}>Listed under {cur.family} in the technical skills.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
