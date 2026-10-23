"use client";
import { useEffect, useRef, useState } from "react";
import { CERTIFICATIONS, Certification } from "@/lib/data";
import { lockScroll } from "@/lib/scroll";

const css = `
.certs{background:#fff;box-shadow:inset 0 1px 0 var(--line),inset 0 -1px 0 var(--line)}
.certs-grid{display:grid;gap:clamp(32px,5vw,80px);grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);align-items:start}
.certs-l{position:sticky;top:120px}
.certs-l p{margin-top:24px;font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.cert{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:44px 48px minmax(0,1fr) 40px;gap:16px;align-items:center;padding:22px 18px;border-top:1px solid var(--line);transition:color .5s var(--ease)}
.cert:last-child{border-bottom:1px solid var(--line)}
.cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
.cert:hover,.cert:focus-within{color:#fff}
.cert:hover::before,.cert:focus-within::before{transform:scaleX(1)}
.cert .i{font-family:var(--font-mono);font-size:12px;color:var(--mute);transition:color .5s var(--ease)}
.logo{width:48px;height:48px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 8px 20px -12px rgba(13,13,13,.25);display:grid;place-items:center;overflow:hidden}
.logo img{max-width:32px;max-height:32px;width:auto;height:auto;object-fit:contain}
.cert h3{font-size:clamp(18px,1.9vw,27px);font-weight:600;letter-spacing:-.03em;line-height:1.15}
.cert .by{display:block;margin-top:5px;font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;color:var(--mute);transition:color .5s var(--ease)}
.cert:hover .i,.cert:hover .by,.cert:focus-within .i,.cert:focus-within .by{color:rgba(255,255,255,.7)}
.open-btn{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:17px;color:var(--mute);transition:transform .5s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.cert:hover .open-btn,.cert:focus-within .open-btn{color:#fff}
.open-btn:hover{transform:translate(2px,-2px);background:#fff;color:var(--ink)!important}
.cm-back{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:clamp(12px,3vw,40px);background:rgba(244,242,238,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:cmIn .5s var(--ease)}
@keyframes cmIn{from{opacity:0}}
.cm{width:min(1040px,100%);max-height:calc(100dvh - 2 * clamp(12px,3vw,40px));display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:26px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 50px 90px -40px rgba(13,13,13,.45);animation:cmUp .7s var(--ease)}
@keyframes cmUp{from{opacity:0;transform:translateY(24px) scale(.98)}}
.cm-head{display:flex;align-items:center;gap:14px}
.cm-head .logo{flex:none}
.cm-head h3{font-size:clamp(17px,2vw,24px);font-weight:700;letter-spacing:-.03em;line-height:1.15}
.cm-head small{display:block;margin-top:3px;font-family:var(--font-mono);font-size:11.5px;color:var(--mute)}
.cm-head .sp{flex:1}
.cm-img{flex:1 1 auto;min-height:0;overflow:auto;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);background:var(--paper)}
.cm-img img{width:100%;height:auto;display:block}
.cm-x{width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);display:grid;place-items:center;font-size:18px;transition:background .4s var(--ease),color .4s var(--ease)}
.cm-x:hover{background:var(--ink);color:#fff}
@media(max-width:899px){.certs-grid{grid-template-columns:minmax(0,1fr)}.certs-l{position:relative;top:0}}
@media(max-width:560px){.cert{grid-template-columns:30px 44px minmax(0,1fr) 36px;gap:10px;padding:18px 8px}.logo{width:44px;height:44px}.cm-head .btn{display:none}}
`;

export default function Certifications() {
  const [sel, setSel] = useState<Certification | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sel) return;
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
      if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = document.querySelectorAll<HTMLElement>(".cm a, .cm button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      trigger.current?.focus();
    };
  }, [sel]);

  return (
    <section id="certifications" className="sec certs" aria-labelledby="certs-h">
      <style>{css}</style>
      <div className="wrap certs-grid">
        <div className="certs-l">
          <div className="tag rv"><span>04</span><span>— Certifications</span></div>
          <h2 className="h2 rv-mask" id="certs-h"><span>Always <em>learning.</em></span></h2>
          <p className="rv" style={{ "--i": 1 } as React.CSSProperties}>{String(CERTIFICATIONS.length).padStart(2, "0")} certifications</p>
        </div>
        <ol className="rv" style={{ "--i": 1 } as React.CSSProperties}>
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.slug} className="cert">
              <span className="i">{String(i + 1).padStart(2, "0")}</span>
              <span className="logo" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/issuers/${c.slug}.png`} alt="" loading="lazy" style={{ mixBlendMode: "multiply" }} />
              </span>
              <div>
                <h3>{c.title}</h3>
                <span className="by">{c.issuer}</span>
              </div>
              <button
                className="open-btn"
                aria-label={`View certificate: ${c.title}, ${c.issuer}`}
                aria-haspopup="dialog"
                onClick={(e) => { trigger.current = e.currentTarget; setSel(c); }}
              >
                ↗
              </button>
            </li>
          ))}
        </ol>
      </div>

      {sel && (
        <div className="cm-back" onClick={() => setSel(null)}>
          <div className="cm" role="dialog" aria-modal="true" aria-label={`Certificate: ${sel.title}`} onClick={(e) => e.stopPropagation()}>
            <div className="cm-head">
              <span className="logo" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/issuers/${sel.slug}.png`} alt="" style={{ mixBlendMode: "multiply" }} />
              </span>
              <div>
                <h3>{sel.title}</h3>
                <small>{sel.issuer} · Issued {sel.date}</small>
              </div>
              <span className="sp" />
              <a className="btn btn-ghost" style={{ height: 40 }} href={`/certs/${sel.slug}.pdf`} target="_blank" rel="noreferrer noopener">Open PDF ↗</a>
              <button ref={closeBtn} className="cm-x" onClick={() => setSel(null)} aria-label="Close certificate">✕</button>
            </div>
            <div className="cm-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/certs/${sel.slug}.webp`} alt={`Certificate of completion: ${sel.title}, authorized by ${sel.issuer}, issued ${sel.date}`} width={1600} height={1236} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
