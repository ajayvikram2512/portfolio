"use client";
import { ReactNode, useState } from "react";
import { PROJECTS, Project } from "@/lib/data";
import TechLogo, { hasLogo } from "../ui/TechLogo";

const css = `
.track{display:flex;gap:10px;height:min(78svh,600px);margin-top:56px}
.panel{position:relative;flex:1 1 0;min-width:0;border-radius:26px;overflow:hidden;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:flex .9s var(--ease),box-shadow .6s var(--ease)}
.panel.open{flex:8;box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -40px rgba(13,13,13,.35)}
.spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;opacity:1;transition:opacity .4s var(--ease) .25s}
.panel.open .spine{opacity:0;pointer-events:none;transition-delay:0s;transition-duration:.2s}
.spine .no{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.spine .vt{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:clamp(15px,1.3vw,19px);letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 120px)}
.plus{width:32px;height:32px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);display:grid;place-items:center;font-size:18px;line-height:1;transition:transform .6s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.spine:hover .plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.bw{position:absolute;inset:0}
.body{height:100%;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:28px;padding:clamp(22px,2.6vw,40px);opacity:0;transform:translateY(14px);transition:opacity .3s var(--ease),transform .3s var(--ease)}
.panel.open .body{opacity:1;transform:none;transition:opacity .8s var(--ease) .38s,transform 1s var(--ease) .38s}
.info{display:flex;flex-direction:column;min-width:0}
.kick{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.info h3{margin-top:14px;font-size:clamp(26px,2.9vw,44px);font-weight:700;letter-spacing:-.045em;line-height:1.02;text-wrap:balance}
.info .desc{margin-top:16px;color:var(--ink-2);font-size:clamp(14.5px,1.1vw,16.5px);line-height:1.55}
.feat{margin-top:20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 22px}
.feat.one{grid-template-columns:minmax(0,1fr)}
.feat li{position:relative;padding-left:16px;font-size:13.5px;line-height:1.45;color:var(--ink-2)}
.feat li::before{content:"";position:absolute;left:0;top:.62em;width:7px;height:1px;background:var(--ink)}
.techs{margin-top:auto;padding-top:18px;display:flex;flex-wrap:wrap;gap:8px}
.tech{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 14px 0 8px;border-radius:999px;background:var(--paper);font-family:var(--font-mono);font-size:12px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line)}
.tech.nl{padding-left:13px}
.ui{position:relative;align-self:stretch;min-width:0;clip-path:inset(0 0 0 100%);transition:clip-path .5s var(--ease)}
.panel.open .ui{clip-path:inset(0 0 0 0);transition:clip-path 1.1s var(--ease) .5s}
.mockwin{height:100%;display:flex;flex-direction:column;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.mw-top{display:flex;align-items:center;gap:6px;padding:14px 16px;border-bottom:1px solid var(--line)}
.mw-top i{width:9px;height:9px;border-radius:50%;background:#c9c6c0}
.mw-top i:first-child{background:#a9a6a0}
.mw-badge{margin-left:auto;font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 10px;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.mw-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center}
.mw-body .mock{flex:none;height:auto;background:none;box-shadow:none;padding:16px;overflow:visible}
.mw-body .mock>.term,.mw-body .mock>.chart,.mw-body .mock>.mri{flex:none;min-height:150px}
.mw-foot{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px;border-top:1px solid var(--line);font-family:var(--font-mono);font-size:10px;line-height:1.5;color:var(--mute)}
.khead{display:flex;align-items:baseline;gap:10px;font-family:var(--font-mono);font-size:11.5px;line-height:1.45;color:var(--mute)}
.khead b{color:var(--ink);font-weight:600}
.khead .kk{flex:1;min-width:0}
.khead .kd{text-align:right;flex:none;width:7.6em}
.feat{padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.feat li{padding-left:22px}
.feat li::before{content:"✓";width:auto;height:auto;background:none;top:0;font-size:12px;font-weight:700;color:var(--ink)}
.acts{display:flex;flex-wrap:wrap;gap:8px;padding-top:16px}
.acts .btn{height:44px;padding:0 22px;font-size:14px}
.chipx{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:5px;font-family:var(--font-mono);font-size:9.5px;font-weight:600;color:var(--ink-2);background:#e4e1db}

.mock{height:100%;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);padding:38px 18px 18px;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.bar{height:9px;border-radius:99px;background:#d9d6d0}
.bar.s{width:38%}.bar.m{width:64%}.bar.l{width:88%}.bar.k{background:var(--ink)}
.row{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.dot{width:26px;height:26px;border-radius:50%;background:#e4e1db;flex:none}
.pillx{margin-left:auto;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.06em;padding:4px 9px;border-radius:99px;background:var(--ink);color:#fff;white-space:nowrap}
.pillx.o{background:transparent;color:var(--ink-2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.25)}
.mri{position:relative;flex:1;min-height:120px;border-radius:16px;background:#e6e3de;display:grid;place-items:center;overflow:hidden}
.mri::before{content:"";width:62%;aspect-ratio:1;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 50% 40%,#bdb9b2,#8c8983 70%)}
.mri::after{content:"";position:absolute;width:26%;aspect-ratio:1;border-radius:50%;left:50%;top:38%;background:radial-gradient(circle,rgba(13,13,13,.78),rgba(13,13,13,0) 70%);animation:breath 3.4s ease-in-out infinite}
@keyframes breath{50%{transform:scale(1.25);opacity:.7}}
.stats{display:flex;gap:8px}
.stat{flex:1;padding:10px 12px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.stat b{display:block;font-size:20px;letter-spacing:-.04em}
.stat span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.bub{width:82%;max-width:82%;padding:10px 13px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);display:grid;gap:7px}
.bub.me{margin-left:auto;background:var(--ink);width:58%}
.bub.me .bar{background:rgba(255,255,255,.55)}
.flow{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
.flow span{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);color:var(--ink-2)}
.term{flex:1;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);padding:16px;font-family:var(--font-mono);font-size:11px;line-height:1.9;color:var(--ink-2);display:flex;flex-direction:column;gap:2px}
.term b{color:var(--ink);font-weight:500}
.term i{font-style:normal;color:var(--faint)}
.caret{display:inline-block;width:7px;height:13px;background:var(--ink);vertical-align:-2px;animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.chart{flex:1;min-height:120px;display:flex;align-items:flex-end;gap:12px;padding:16px 14px 12px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.chart div{flex:1;border-radius:7px 7px 3px 3px;background:#cfccc5;transform-origin:bottom;animation:grow 1.2s var(--ease) both}
.chart div:nth-child(3n+1){background:var(--ink)}
@keyframes grow{from{transform:scaleY(.05)}}
.chart-l{display:flex;gap:12px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);justify-content:space-between}

@media(max-width:899px){
  .track{flex-direction:column;height:auto;margin-top:40px}
  .panel{flex:none;transition:box-shadow .6s var(--ease)}
  .panel.open{flex:none}
  .spine{position:relative;inset:auto;flex-direction:row;justify-content:flex-start;gap:14px;padding:0 18px;height:72px;opacity:1}
  .panel.open .spine{opacity:1;pointer-events:auto}
  .spine .vt{writing-mode:horizontal-tb;transform:none;flex:1;min-width:0;max-height:none;text-align:left}
  .panel.open .plus{transform:rotate(45deg);background:var(--ink);color:#fff}
  .bw{position:relative;inset:auto;display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s var(--ease)}
  .panel.open .bw{grid-template-rows:1fr}
  .body{grid-template-columns:minmax(0,1fr);height:auto;min-height:0;overflow:hidden;padding:0 20px;gap:22px}
  .panel.open .body{padding:6px 20px 24px}
  .ui{height:360px;clip-path:none;opacity:0;transition:opacity .4s}
  .panel.open .ui{opacity:1;transition:opacity .8s var(--ease) .3s}
  .feat{grid-template-columns:minmax(0,1fr)}
}
`;

function Mock({ id }: { id: string }): ReactNode {
  switch (id) {
    case "gmail-agent":
      return (
        <div className="mock">
          {["Read", "Understand", "Respond"].map((t, i) => (
            <div className="row" key={t}>
              <span className="dot" />
              <div style={{ flex: 1, display: "grid", gap: 6 }}>
                <span className="bar m" />
                <span className="bar l" />
              </div>
              <span className={`pillx ${i < 2 ? "o" : ""}`}>{t}</span>
            </div>
          ))}
          <div className="flow"><span>Knowledge base</span><span>Conditional workflow</span></div>
        </div>
      );
    case "brain-tumor":
      return (
        <div className="mock">
          <div className="mri" role="img" aria-label="Abstract grayscale scan with a highlighted region" />
          <div className="stats">
            <div className="stat"><b>~88%</b><span>accuracy</span></div>
            <div className="stat"><b>0.97</b><span>AUC</span></div>
          </div>
        </div>
      );
    case "offline-rag":
      return (
        <div className="mock">
          <div className="bub me"><span className="bar m" /></div>
          <div className="bub"><span className="bar l" /><span className="bar l" /><span className="bar s" /></div>
          <div className="flow"><span>Ingestion</span><span>Chunking</span><span>Retrieval</span><span>Response</span></div>
        </div>
      );
    case "crop-suggestion":
      return (
        <div className="mock">
          <div className="term">
            <span><i>$</i> <b>crop-suggest</b></span>
            <span><i>›</i> Decision Tree → soil quality</span>
            <span><i>›</i> Gemini API → climate-based crops</span>
            <span><i>›</i> <span className="caret" /></span>
          </div>
        </div>
      );
    default:
      return (
        <div className="mock">
          <div className="chart" role="img" aria-label="Abstract bar chart">
            {[48, 82, 36, 64, 92, 54, 72].map((h, i) => <div key={i} style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }} />)}
          </div>
          <div className="chart-l"><span>Cities</span><span>Payment modes</span><span>Categories</span></div>
        </div>
      );
  }
}

function monogram(t: string) {
  const w = t.replace(/[^A-Za-z ]/g, " ").split(" ").filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : t.slice(0, 2)).toUpperCase();
}

function Panel({ p, open, onOpen }: { p: Project; open: boolean; onOpen: () => void }) {
  return (
    <article className={`panel ${open ? "open" : ""}`} onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}>
      <button className="spine" onFocus={onOpen} onClick={onOpen} aria-expanded={open} aria-controls={`pb-${p.id}`}>
        <span className="no">{p.index}</span>
        <span className="vt">{p.title}</span>
        <span className="plus" aria-hidden="true">+</span>
      </button>
      <div className="bw" id={`pb-${p.id}`} inert={!open}>
        <div className="body">
          <div className="info">
            <div className="khead">
              <b>{p.index} —</b>
              <span className="kk">{p.kicker}</span>
              <span className="kd">{p.period}</span>
            </div>
            <h3>{p.title}</h3>
            <p className="desc">{p.description}</p>
            {p.features.length > 0 && (
              <ul className="feat">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
            <div className="techs">
              {p.tech.map((t) => (
                <span key={t} className="tech">
                  {hasLogo(t) ? <TechLogo name={t} size={20} /> : <span className="chipx" aria-hidden="true">{monogram(t)}</span>}
                  {t}
                </span>
              ))}
            </div>
            {(p.github || p.links) && (
              <div className="acts">
                {p.github && (
                  <a className="btn btn-primary" href={p.github} target="_blank" rel="noreferrer noopener">
                    View on GitHub <span aria-hidden="true">↗</span>
                  </a>
                )}
                {p.links?.map((l) => (
                  <a key={l.href} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer noopener">{l.label}</a>
                ))}
              </div>
            )}
          </div>
          <div className="ui">
            <div className="mockwin">
              <div className="mw-top" aria-hidden="true">
                <i /><i /><i />
                <span className="mw-badge">Illustrative UI</span>
              </div>
              <div className="mw-body"><Mock id={p.id} /></div>
              <div className="mw-foot" aria-hidden="true">
                <span>Illustrative mock-up</span>
                <span>Details from résumé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <style>{css}</style>
      <div className="wrap">
        <div className="tag rv"><span>03</span><span>— Selected work</span></div>
        <h2 className="h2 rv-mask" id="work-h"><span>Things I&rsquo;ve <em>built.</em></span></h2>
        <div className="track rv" style={{ "--i": 1 } as React.CSSProperties}>
          {PROJECTS.map((p, i) => <Panel key={p.id} p={p} open={open === i} onOpen={() => setOpen(i)} />)}
        </div>
      </div>
    </section>
  );
}
