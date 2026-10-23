"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, PROJECTS, CERTIFICATIONS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
.about{--pad:clamp(96px,14vh,160px);overflow:clip}
.about-grid{display:grid;gap:clamp(24px,3vw,48px);grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);align-items:stretch}
.about-l,.about-r{display:flex;flex-direction:column;justify-content:center;gap:22px}
.about-l p{color:var(--ink-2);font-size:clamp(16px,1.25vw,19px);line-height:1.6;max-width:46ch}
.about-l .cur{font-family:var(--font-mono);font-size:13px;letter-spacing:.02em;color:var(--mute)}
.about-l .ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
.facts{display:grid}
.facts>div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line);font-size:15px}
.facts>div:last-child{border-bottom:1px solid var(--line)}
.facts dt{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:3px}
.facts dd{margin:0;color:var(--ink);overflow-wrap:anywhere}
.facts a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(13,13,13,.3)}
.quote{font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.2vw,32px);line-height:1.2;letter-spacing:-.01em;color:var(--ink-2)}

.lan-col{position:relative;margin-top:calc(var(--pad) * -1);min-height:calc(var(--pad) + 470px)}
.lanyard{position:absolute;top:0;left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;will-change:transform}
.strap{position:relative;width:30px;height:calc(var(--pad) + 28px);margin:0 auto;background:var(--ink);overflow:hidden;border-radius:0 0 3px 3px;
  box-shadow:inset 3px 0 0 rgba(255,255,255,.07),inset -3px 0 0 rgba(255,255,255,.07)}
.strap-track{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;align-items:center;animation:strapScroll 14s linear infinite}
.strap-track span{writing-mode:vertical-rl;white-space:nowrap;font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.82);padding:14px 0}
@keyframes strapScroll{to{transform:translateY(-50%)}}
.clip{position:relative;width:22px;height:34px;margin:-2px auto 0;z-index:2;border-radius:5px 5px 9px 9px;background:linear-gradient(90deg,#9b9b9b,#e4e4e4 45%,#8d8d8d);box-shadow:0 2px 4px rgba(13,13,13,.25)}
.clip::after{content:"";position:absolute;left:50%;bottom:5px;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:var(--paper);box-shadow:inset 0 1px 2px rgba(13,13,13,.35)}
.idcard{display:block;position:relative;width:300px;height:404px;margin:-8px auto 0;perspective:1400px;text-align:left;border-radius:22px}
.idin{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.idcard.flip .idin{transform:rotateY(180deg)}
.face{position:absolute;inset:0;border-radius:22px;background:var(--card);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -34px rgba(13,13,13,.45),0 12px 24px -16px rgba(13,13,13,.25)}
.face.back{transform:rotateY(180deg);padding:26px 24px;display:flex;flex-direction:column}
.band{height:46px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-mono);font-size:11px;letter-spacing:.28em;position:relative}
.band::before{content:"";position:absolute;top:10px;left:50%;width:48px;height:7px;margin-left:-24px;border-radius:99px;background:var(--paper)}
.band span{margin-top:14px}
.photo{width:128px;height:156px;margin:14px auto 0;position:relative;border-radius:18px;padding:3px;background:linear-gradient(145deg,#d9d9d9,#8f8f8f 50%,#e8e8e8);box-shadow:0 0 0 6px rgba(13,13,13,.04),0 18px 30px -16px rgba(13,13,13,.45)}
.photo div{width:100%;height:100%;border-radius:15px;overflow:hidden;background:var(--soft)}
.photo img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06);transition:transform .8s var(--ease)}
.idcard:hover .photo img{transform:scale(1.07)}
.who{text-align:center;margin-top:11px;padding:0 18px}
.who b{display:block;font-size:19px;font-weight:700;letter-spacing:-.035em;line-height:1.1}
.who small{display:block;margin-top:3px;font-size:12px;color:var(--mute);letter-spacing:-.005em}
.rows{margin:9px 22px 0;display:grid;font-size:12px}
.rows div{display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-top:1px solid var(--line)}
.rows dt{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.rows dd{margin:0;font-weight:600;text-align:right}
.idfoot{position:absolute;left:22px;right:22px;bottom:12px;display:flex;align-items:flex-end;justify-content:space-between}
.barcode{display:flex;align-items:flex-end;gap:1.5px;height:22px}
.barcode i{display:block;background:var(--ink);width:1.5px}
.holo{width:28px;height:28px;border-radius:50%;background:conic-gradient(from 0deg,#f2f2f2,#9a9a9a,#ececec,#6f6f6f,#f2f2f2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);animation:holo 8s linear infinite}
@keyframes holo{to{transform:rotate(360deg)}}
.back h3{font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute);font-weight:500;margin-bottom:14px}
.back ul{display:grid;gap:10px;font-size:13.5px;line-height:1.4;color:var(--ink-2)}
.back li{padding-left:16px;position:relative}
.back li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--ink)}
.sig{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}
.sig em{display:block;font-family:var(--font-serif);font-size:28px;line-height:1;color:var(--ink)}
.sig small{display:block;margin-top:8px;font-family:var(--font-mono);font-size:10px;letter-spacing:.04em;color:var(--mute);overflow-wrap:anywhere}
@media(max-width:1023px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-l{order:1}.lan-col{order:2;min-height:calc(var(--pad) + 470px);margin-top:calc(var(--pad) * -.2)}.about-r{order:3}
  .lan-col{margin-top:0;min-height:520px}
  .strap{height:96px}
}
`;

const barcode = Array.from({ length: 34 }, (_, i) => 6 + ((PROFILE.name.charCodeAt(i % PROFILE.name.length) * (i + 3)) % 20));

export default function About() {
  const sec = useRef<HTMLElement>(null);
  const lan = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const ptype = useRef("mouse");

  // damped pendulum + idle sway
  useEffect(() => {
    const el = lan.current;
    const root = sec.current;
    if (!el || !root || prefersReducedMotion()) return;
    let angle = 0, vel = 0, raf = 0, visible = false;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const acc = -26 * angle - 3.4 * vel; // spring + damping
      vel += acc * dt;
      angle += vel * dt;
      const idle = Math.sin(now / 1500) * 1.1 + Math.sin(now / 930) * 0.35;
      el.style.transform = `rotate(${(angle + idle).toFixed(3)}deg)`;
      raf = visible ? requestAnimationFrame(step) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(root);
    let lastX = 0;
    const move = (e: PointerEvent) => {
      if (!visible) return;
      const dx = e.pointerType === "mouse" ? e.movementX : e.clientX - lastX;
      lastX = e.clientX;
      vel += Math.max(-60, Math.min(60, dx)) * 0.32; // pointer velocity -> angle
    };
    root.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      root.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const key = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlip((f) => !f);
    }
  };

  return (
    <section id="about" className="sec about" ref={sec} aria-labelledby="about-h">
      <style>{css}</style>
      <div className="wrap about-grid">
        <div className="about-l">
          <div>
            <div className="tag rv">
              <span>01</span>
              <span>— About</span>
            </div>
            <h2 className="h2 rv-mask" id="about-h">
              <span>
                Hi, I&rsquo;m <em>Ajay.</em>
              </span>
            </h2>
          </div>
          <p className="rv" style={{ "--i": 1 } as React.CSSProperties}>{PROFILE.resumeSummary}</p>
          <p className="cur rv" style={{ "--i": 2 } as React.CSSProperties}>{PROFILE.currentLine}</p>
          <div className="ctas rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a className="btn btn-primary" href={PROFILE.resume} download>Résumé ↓</a>
            <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer noopener">GitHub ↗</a>
            <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn ↗</a>
          </div>
        </div>

        <div className="lan-col">
          <div className="lanyard" ref={lan}>
            <div className="strap" aria-hidden="true">
              <div className="strap-track">
                {[0, 1].map((k) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {[0, 1, 2].map((j) => (
                      <span key={j}>{PROFILE.name} · Applied Data Science ·</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="clip" aria-hidden="true" />
            <div
              className={`idcard ${flip ? "flip" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flip}
              aria-label={`${PROFILE.name} developer ID card. Press Enter or Space to flip it.`}
              onKeyDown={key}
              onPointerDown={(e) => { ptype.current = e.pointerType; }}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setFlip(true); }}
              onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlip(false); }}
              onClick={() => { if (ptype.current !== "mouse") setFlip((f) => !f); }}
            >
              <div className="idin">
                <div className="face front">
                  <div className="band"><span>DEVELOPER ID</span></div>
                  <div className="photo"><div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                  </div></div>
                  <div className="who">
                    <b>{PROFILE.name}</b>
                    <small>{PROFILE.role}</small>
                  </div>
                  <dl className="rows">
                    <div><dt>Dept.</dt><dd>Applied Data Science</dd></div>
                    <div><dt>Univ.</dt><dd>SRM University</dd></div>
                    <div><dt>Valid till</dt><dd>{PROFILE.graduation}</dd></div>
                  </dl>
                  <div className="idfoot" aria-hidden="true">
                    <div className="barcode">{barcode.map((h, i) => <i key={i} style={{ height: Math.min(22, h), width: i % 5 === 0 ? 3 : 1.5 }} />)}</div>
                    <div className="holo" />
                  </div>
                </div>
                <div className="face back">
                  <h3>What I am</h3>
                  <ul>
                    <li>{PROFILE.role}</li>
                    <li>M.Sc. Applied Data Science, SRM University · CGPA 9.5</li>
                    <li>Data Analyst Intern, Vektor Labs</li>
                    <li>{PROJECTS[1].title}; {PROJECTS[2].title}; {PROJECTS[0].title}</li>
                    <li>{CERTIFICATIONS.length} certifications: Google, IBM, Microsoft, DeepLearning.AI, SAS</li>
                  </ul>
                  <div className="sig">
                    <em>{PROFILE.name}</em>
                    <small>If found, say hello · {PROFILE.email}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-r">
          <h3 className="tag rv" style={{ marginBottom: 0, fontWeight: 400 }}>Quick facts</h3>
          <dl className="facts rv" style={{ "--i": 1 } as React.CSSProperties}>
            <div><dt>Location</dt><dd>{PROFILE.location}</dd></div>
            <div><dt>Education</dt><dd>M.Sc. Applied Data Science, SRM University (CGPA 9.5)</dd></div>
            <div><dt>Now</dt><dd>Data Analyst Intern, Vektor Labs</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></dd></div>
          </dl>
          <p className="quote rv" style={{ "--i": 2 } as React.CSSProperties}>
            &ldquo;Focused on scalable, data-driven applications and business insights.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
