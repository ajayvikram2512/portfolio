#!/usr/bin/env python3
"""
Build the seamless looping hero clip + stills from the intro video.

Usage:
  python3 scripts/build-hero-assets.py SRC_VIDEO [PORTRAIT_PHOTO]
Optional crop override (x:y:w:h of the SOURCE frame):
  CROP=36:64:648:1152 python3 scripts/build-hero-assets.py intro.mp4

Needs: ffmpeg, numpy, Pillow (Pillow only for the stills from a photo).
Outputs -> public/hero/hero.mp4, hero.webm, public/portrait-bust.webp, public/og.jpg
"""
import os, subprocess, sys, tempfile
import numpy as np

SRC = sys.argv[1]
PHOTO = sys.argv[2] if len(sys.argv) > 2 else None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public")
os.makedirs(os.path.join(OUT, "hero"), exist_ok=True)

XFADE = 0.5          # seconds of cross-fade
MAXLEN = 10.0        # use at most the first 10 s
SR = 48000
CROP = os.environ.get("CROP", "36:64:648:1152")   # x:y:w:h  (head-to-toe, centred, 9:16)
OUT_W = int(os.environ.get("OUT_W", "576"))
# Input level mapped to pure white. Tune to your backdrop: 0.98 for an evenly lit wall,
# lower (e.g. 0.86) when the corners/vignette are darker. Check with the border-sample
# printed at the end of this script.
WHITE_MAX = float(os.environ.get("WHITE_MAX", "0.86"))

def run(*a):
    subprocess.run(a, check=True)

def probe_duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", p], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

dur = min(probe_duration(SRC), MAXLEN)
x, y, w, h = CROP.split(":")
out_h = int(round(OUT_W * int(h) / int(w) / 2) * 2)
tmp = tempfile.mkdtemp()
vid_loop = os.path.join(tmp, "loop_video.mp4")
aud_loop = os.path.join(tmp, "loop_audio.wav")

# 1) crop -> scale -> whiten the backdrop (pure white blends into the page via multiply)
base = (f"crop={w}:{h}:{x}:{y},scale={OUT_W}:{out_h}:flags=lanczos,"
        f"colorlevels=rimax={WHITE_MAX}:gimax={WHITE_MAX}:bimax={WHITE_MAX},fps=24,format=yuv420p")

# 2) seamless video loop: [blend(end -> start, XFADE)] + [middle]
#    result length = dur - XFADE; last frame (t = dur - XFADE) flows into the first frame.
t_end = dur - XFADE
fc = (
    f"[0:v]{base},split=3[a][b][c];"
    f"[a]trim=start={t_end}:end={dur},setpts=PTS-STARTPTS[tail];"
    f"[b]trim=start=0:end={XFADE},setpts=PTS-STARTPTS[head];"
    f"[c]trim=start={XFADE}:end={t_end},setpts=PTS-STARTPTS[mid];"
    f"[tail][head]xfade=transition=fade:duration={XFADE}:offset=0[xf];"
    f"[xf][mid]concat=n=2:v=1:a=0[v]"
)
run("ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", fc, "-map", "[v]",
    "-an", "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", vid_loop)

# 3) seamless audio loop, sample-accurate, in numpy (no ffmpeg acrossfade)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-t", str(dur), "-vn", "-ac", "1",
                      "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
a = np.frombuffer(raw, dtype=np.float32).copy()
n_total = int(round(dur * SR))
a = np.pad(a, (0, max(0, n_total - len(a))))[:n_total]
nx = int(round(XFADE * SR))
n_end = n_total - nx
tail, head, mid = a[n_end:], a[:nx], a[nx:n_end]
ramp = np.linspace(0.0, 1.0, nx, dtype=np.float32)
# equal-power curve keeps loudness steady through the blend
blend = tail * np.cos(ramp * np.pi / 2) + head * np.sin(ramp * np.pi / 2)
loop = np.concatenate([blend, mid])
# the loop point is continuous by construction (last sample precedes the first blend sample)
pcm = (np.clip(loop, -1, 1) * 32767).astype("<i2")
import wave
with wave.open(aud_loop, "wb") as wf:
    wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(pcm.tobytes())

# 4) final exports (never retimed -> lips stay in sync)
mp4 = os.path.join(OUT, "hero", "hero.mp4")
webm = os.path.join(OUT, "hero", "hero.webm")
run("ffmpeg", "-v", "error", "-y", "-i", vid_loop, "-i", aud_loop, "-map", "0:v", "-map", "1:a",
    "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest", mp4)
run("ffmpeg", "-v", "error", "-y", "-i", vid_loop, "-i", aud_loop, "-map", "0:v", "-map", "1:a",
    "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
    "-c:a", "libopus", "-b:a", "80k", "-shortest", webm)

# 5) stills
from PIL import Image, ImageOps
if PHOTO:
    im = Image.open(PHOTO).convert("RGB")
    W, H = im.size
    # head-to-shirt crop, 4:5 -> 480x600 (tuned for a centred, front-facing photo)
    cw = int(W * 0.78); ch = int(cw * 1.25)
    left = int(W * 0.5 - cw * 0.46); top = int(H * 0.04)
    im = im.crop((left, top, left + cw, min(H, top + ch))).resize((480, 600), Image.LANCZOS)
else:
    still = os.path.join(tmp, "still.png")
    run("ffmpeg", "-v", "error", "-y", "-ss", "0.5", "-i", vid_loop, "-frames:v", "1", still)
    im = Image.open(still).convert("RGB")
    W, H = im.size
    im = im.crop((int(W*0.12), int(H*0.04), int(W*0.88), int(H*0.04 + W*0.76*1.25))).resize((480, 600), Image.LANCZOS)
im.save(os.path.join(OUT, "portrait-bust.webp"), quality=86)

# og.jpg 1200x630 on the paper colour with the portrait on the right
og = Image.new("RGB", (1200, 630), (244, 242, 238))
p = im.resize((504, 630), Image.LANCZOS)
og.paste(ImageOps.grayscale(p).convert("RGB"), (696, 0))
og.save(os.path.join(OUT, "og.jpg"), quality=88)
# report how white the backdrop ended up (border strip, ignoring the floor-shadow band)
lo = 255
for ts in ("0.2", "2", "4", "6", "8", "9.2"):
    chk = os.path.join(tmp, f"chk_{ts}.png")
    run("ffmpeg", "-v", "error", "-y", "-ss", ts, "-i", mp4, "-frames:v", "1", chk)
    fr = np.asarray(Image.open(chk).convert("RGB"))
    edge = np.concatenate([fr[:, :6].reshape(-1, 3), fr[:, -6:].reshape(-1, 3), fr[:6].reshape(-1, 3)])
    lo = min(lo, int(edge.min()))
print("backdrop min channel on border over 6 frames:", lo, "(255 = pure white; aim for >= 250)")
# poster = first frame of the final clip
run("ffmpeg", "-v", "error", "-y", "-ss", "0.4", "-i", mp4, "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", os.path.join(OUT, "hero", "poster.webp"))
print("done:", mp4, webm)
