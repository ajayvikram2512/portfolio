# Ajay Vikram V — portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no three.js, no external runtime scripts. Fonts are self-hosted (`src/fonts`).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Content
All text lives in `src/lib/data.ts` and comes from the résumé (`public/resume.pdf`). Components only read from it.

## Sections
| # | id | Component | Notes |
|---|----|-----------|-------|
| – | top | `hero/Hero.tsx` | looping intro video, sound button, pauses below 35 % visibility |
| 01 | about | `About.tsx` | lanyard ID card (pendulum physics, flip on hover/tap/Enter) |
| 02 | skills | `Skills.tsx` | periodic table, family filter, inspector |
| 03 | work | `Work.tsx` | accordion gallery with illustrative CSS UIs |
| 04 | certifications | `Certifications.tsx` | ink-flood list |
| 05 | experience | `Experience.tsx` | scroll-drawn timeline |
| 06 | contact | `Contact.tsx` | hop heading, copy chip, footer |

Certificate previews live in `public/certs` (webp + original PDF); issuer logos in `public/logos/issuers` were cropped from the certificate PDFs.

Achievements is intentionally not built: the résumé has no achievements data. Add `ACHIEVEMENTS` entries and a section if that changes.

## Rebuild the hero video
Needs `ffmpeg`, `numpy`, `Pillow`.
```bash
python3 scripts/build-hero-assets.py path/to/intro.mp4 path/to/photo.png
# optional tuning
CROP=36:64:648:1152 WHITE_MAX=0.86 python3 scripts/build-hero-assets.py intro.mp4
```
`CROP` is x:y:w:h of the source frame. `WHITE_MAX` is the input level mapped to pure white (0.98 for an evenly lit wall; lower for a vignette). The script prints the resulting border whiteness; aim for ≥ 250 so `mix-blend-mode: multiply` hides the backdrop.
Outputs: `public/hero/hero.mp4`, `hero.webm`, `poster.webp`, `public/portrait-bust.webp`, `public/og.jpg`.

## Credits and licences
- Python, Pandas, NumPy, Matplotlib, GitHub and VS Code logos: [devicon](https://devicon.dev) "original" SVGs, MIT (`public/logos/LICENSE-devicon.txt`). Logos remain trademarks of their owners.
- SQL, Seaborn, Power BI, Excel and all concept icons are custom line icons, not official marks.
- Fonts: Inter Tight, Instrument Serif, JetBrains Mono (SIL OFL 1.1), via Fontsource.
