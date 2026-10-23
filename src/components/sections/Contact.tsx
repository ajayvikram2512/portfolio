"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.contact{padding-bottom:40px}
.big{font-weight:700;letter-spacing:-.055em;line-height:.94;font-size:clamp(46px,10.2vw,168px);margin-top:4px}
.big .ln{display:block}
.ch{display:inline-block;will-change:transform}
.ch.sp{width:.26em}
.ch.hop{animation:hop .6s var(--ease)}
@keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}100%{transform:translateY(0)}}
.big em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute);letter-spacing:-.03em}
.mail-row{display:flex;align-items:center;flex-wrap:wrap;gap:16px;margin-top:clamp(36px,6vw,72px)}
.mail{font-size:clamp(22px,4.2vw,64px);font-weight:600;letter-spacing:-.045em;line-height:1.1;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.14em;text-decoration-color:rgba(13,13,13,.3);overflow-wrap:anywhere;transition:text-decoration-color .4s var(--ease)}
.mail:hover{text-decoration-color:var(--ink)}
.copy-chip{height:34px;padding:0 15px;border-radius:999px;font-family:var(--font-mono);font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(13,13,13,.25);transition:background .4s var(--ease),color .4s var(--ease)}
.copy-chip:hover,.copy-chip.ok{background:var(--ink);color:#fff}
.links{display:flex;flex-wrap:wrap;gap:12px 36px;margin-top:32px;font-size:18px;font-weight:500}
.links a{display:inline-flex;gap:8px;align-items:baseline;padding-bottom:2px;box-shadow:0 1px 0 rgba(13,13,13,.25);transition:box-shadow .4s var(--ease)}
.links a:hover{box-shadow:0 2px 0 var(--ink)}
.links small{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.badge{position:absolute;right:var(--gutter);top:clamp(40px,8vw,120px);width:clamp(96px,11vw,150px);aspect-ratio:1;display:grid;place-items:center}
.badge svg.swirl{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
.badge text{font-family:var(--font-mono);font-size:10.4px;letter-spacing:.2em;text-transform:uppercase;fill:var(--ink)}
@keyframes spin{to{transform:rotate(360deg)}}
.badge a{width:36%;aspect-ratio:1;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:20px;transition:transform .5s var(--ease)}
.badge a:hover{transform:scale(1.1) rotate(-12deg)}
footer.foot{margin-top:clamp(72px,12vw,150px);padding-top:26px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between;font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;color:var(--mute)}
footer.foot a,footer.foot button{transition:color .3s}
footer.foot a:hover,footer.foot button:hover{color:var(--ink)}
@media(max-width:699px){.badge{display:none}}
`;

function Hop({ text }: { text: string }) {
  const on = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("hop")) return;
    el.classList.add("hop");
    el.addEventListener("animationend", () => el.classList.remove("hop"), { once: true });
  };
  return (
    <>
      {text.split("").map((c, i) =>
        c === " " ? <span key={i} className="ch sp" /> : <span key={i} className="ch" onPointerEnter={on}>{c}</span>,
      )}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="sec contact" aria-labelledby="contact-h">
      <style>{css}</style>
      <div className="badge rv" aria-hidden="true">
        <svg className="swirl" viewBox="0 0 100 100">
          <defs><path id="circ" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
          <text><textPath href="#circ" textLength="236" lengthAdjust="spacing">say hello · say hello · say hello · </textPath></text>
        </svg>
        <a href={`mailto:${PROFILE.email}`} tabIndex={-1}>↗</a>
      </div>
      <div className="wrap">
        <div className="tag rv"><span>06</span><span>— Contact</span></div>
        <h2 className="big" id="contact-h" aria-label="Let's build something together.">
          <span className="ln" aria-hidden="true"><Hop text="Let’s build" /></span>
          <span className="ln" aria-hidden="true"><em><Hop text="something" /></em> <Hop text="together." /></span>
        </h2>

        <div className="mail-row rv">
          <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <button className={`copy-chip ${copied ? "ok" : ""}`} onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
          <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
        </div>

        <div className="links rv" style={{ "--i": 1 } as React.CSSProperties}>
          <a href={PROFILE.phoneHref}><small>Phone</small>{PROFILE.phone}</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer noopener"><small>GitHub</small>ajayvikram2512 ↗</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener"><small>LinkedIn</small>ajay-vikram-v ↗</a>
        </div>

        <footer className="foot">
          <span>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> {PROFILE.name}</span>
          <button onClick={() => scrollToTarget(0)}>Back to top ↑</button>
          <span>Built with Next.js</span>
        </footer>
      </div>
    </section>
  );
}
