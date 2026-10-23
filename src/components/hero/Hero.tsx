"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:center;overflow:clip;padding-top:72px}
.ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);z-index:0;pointer-events:none;user-select:none;white-space:nowrap;
  font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(150px,34vw,560px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13)}
.hero-grid{display:grid;align-items:center;gap:clamp(8px,2vw,32px);grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}
.stage{position:relative;grid-column:2;justify-self:center}
.video-wrap{position:relative;height:min(96svh,1040px);aspect-ratio:576/1024}
.video-wrap video{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;background:transparent}
.copy{grid-column:1;grid-row:1;align-self:end;padding-bottom:clamp(40px,12vh,120px);position:relative;z-index:2}
.copy h1{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(34px,4.6vw,72px);text-wrap:balance;margin-bottom:28px}
.copy h1 em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute);letter-spacing:-.02em}
.ctas{display:flex;flex-wrap:wrap;gap:10px}
.side{grid-column:3;grid-row:1;align-self:end;justify-self:end;text-align:right;padding-bottom:clamp(40px,12vh,120px);font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);line-height:1.8}
.side b{display:block;color:var(--ink);font-weight:500}
.sound{position:absolute;right:6%;bottom:9%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;z-index:3;
  transition:transform .5s var(--ease),background .4s var(--ease)}
.sound:hover{transform:scale(1.08);background:#2a2a2a}
.sound svg{width:16px;height:16px;fill:currentColor}
.sound.ping::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px rgba(13,13,13,.45);animation:ping 2s var(--ease) infinite}
@keyframes ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.9);opacity:0}}
@media(max-width:899px){
  .hero{padding-top:84px;justify-content:flex-start}
  .hero-grid{grid-template-columns:minmax(0,1fr);gap:0}
  .stage{grid-column:1;grid-row:1}
  .video-wrap{height:62svh}
  .copy{grid-column:1;grid-row:2;padding:8px 0 24px;text-align:left}
  .side{grid-column:1;grid-row:3;justify-self:start;text-align:left;padding-bottom:48px}
  .sound{right:4%;bottom:6%}
  .ghost{top:38%}
}
`;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const reduced = useRef(false);
  const wantsSound = useRef(true);

  const tryPlay = useCallback(async () => {
    const v = video.current;
    if (!v) return;
    try {
      v.muted = !wantsSound.current;
      await v.play();
      setSoundOn(!v.muted);
      setBlocked(false);
    } catch {
      // autoplay with sound refused: play muted and wait for the first gesture
      v.muted = true;
      setSoundOn(false);
      setBlocked(true);
      v.play().catch(() => {});
    }
  }, []);

  // initial play (not under reduced motion; the visitor starts it with the button)
  useEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) {
      wantsSound.current = false;
      return;
    }
    tryPlay();
  }, [tryPlay]);

  // unlock sound on the first interaction
  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      const v = video.current;
      if (!v) return;
      v.muted = false;
      wantsSound.current = true;
      v.play()
        .then(() => {
          setSoundOn(true);
          setBlocked(false);
        })
        .catch(() => {});
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    evs.forEach((e) => window.addEventListener(e, unlock, { once: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, unlock));
  }, [blocked]);

  // pause (and silence) when < 35 % of the hero is visible; resume on return
  useEffect(() => {
    const el = ref.current;
    const v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.35) {
          if (!v.paused) v.pause();
        } else if (v.paused && !reduced.current) {
          v.play().catch(() => {
            v.muted = true;
            setSoundOn(false);
            v.play().catch(() => {});
          });
        }
      },
      { threshold: [0, 0.35, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      wantsSound.current = true;
      reduced.current = false;
      v.muted = false;
      v.play().then(() => setSoundOn(true)).catch(() => {});
      return;
    }
    v.muted = !v.muted;
    wantsSound.current = !v.muted;
    setSoundOn(!v.muted);
    if (!v.muted) setBlocked(false);
  };

  return (
    <section id="top" className="hero" ref={ref} aria-label="Introduction">
      <style>{css}</style>
      <div className="ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>
      <div className="wrap hero-grid">
        <div className="stage">
          <div className="video-wrap">
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero/poster.webp"
              aria-label={`${PROFILE.name} introducing himself to the camera. Looping video with voice; use the button to turn sound on or off.`}
            >
              <source src="/hero/hero.webm" type="video/webm" />
              <source src="/hero/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <button
            className={`sound ${blocked ? "ping" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="3" y="2" width="3.4" height="12" rx="1" />
                <rect x="9.6" y="2" width="3.4" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.2v11.6a.7.7 0 0 0 1.07.6l9-5.8a.7.7 0 0 0 0-1.2l-9-5.8A.7.7 0 0 0 4 2.2Z" />
              </svg>
            )}
          </button>
        </div>
        <div className="copy">
          <h1 className="rv-mask">
            <span>
              Applied Data Science <em>postgraduate.</em>
            </span>
          </h1>
          <div className="ctas rv" style={{ "--i": 2 } as React.CSSProperties}>
            <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>
              Explore work
            </a>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>
              Let&rsquo;s talk
            </a>
            <a className="btn btn-ghost" href={PROFILE.resume} download>
              Résumé ↓
            </a>
          </div>
        </div>
        <div className="side rv" style={{ "--i": 3 } as React.CSSProperties}>
          <b>{PROFILE.name}</b>
          M.Sc. Applied Data Science
          <br />
          SRM University, Chennai
        </div>
      </div>
    </section>
  );
}
