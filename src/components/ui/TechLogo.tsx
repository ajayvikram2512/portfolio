import type { ReactElement } from "react";

/** Real brand logos (devicon "original" SVGs, see public/logos/LICENSE-devicon.txt). */
export const BRAND: Record<string, { src: string; tint: string }> = {
  Python: { src: "/logos/python.svg", tint: "55,118,171" },
  Pandas: { src: "/logos/pandas.svg", tint: "90,80,170" },
  NumPy: { src: "/logos/numpy.svg", tint: "77,171,207" },
  Matplotlib: { src: "/logos/matplotlib.svg", tint: "17,85,124" },
  GitHub: { src: "/logos/github.svg", tint: "13,13,13" },
  "VS Code": { src: "/logos/vscode.svg", tint: "0,122,204" },
};

const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/**
 * Thin line icons in one style, for skills that are concepts or that have no
 * freely licensed brand mark (SQL, Seaborn, Power BI, Excel are drawn here, not official logos).
 */
export const CONCEPT: Record<string, ReactElement> = {
  SQL: (<g {...p}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></g>),
  Seaborn: (<g {...p}><path d="M4 20h16M6 20v-5M9 20v-9M12 20V7M15 20v-7M18 20v-4" /><path d="M3 14c3-1 4-8 9-8s6 7 9 8" /></g>),
  "Power BI": (<g {...p}><rect x="4" y="13" width="4" height="7" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="16" y="3" width="4" height="17" rx="1" /></g>),
  Excel: (<g {...p}><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M3.5 14.5h17M9.5 4v16M15 4v16" /></g>),
  Classification: (<g {...p}><circle cx="6.5" cy="7" r="1.6" /><circle cx="9.5" cy="12" r="1.6" /><circle cx="6" cy="16.5" r="1.6" /><rect x="15" y="6" width="3.2" height="3.2" /><rect x="14" y="14" width="3.2" height="3.2" /><path d="M12 3v18" strokeDasharray="2 2.4" /></g>),
  "Data Preprocessing": (<g {...p}><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" /></g>),
  "Model Training": (<g {...p}><path d="M4 4v16h16" /><path d="M6 7c3 0 3 8 6 8s3-3 8-3" /><circle cx="20" cy="12" r="1" /></g>),
  "Deep Learning": (<g {...p}><circle cx="5" cy="7" r="1.6" /><circle cx="5" cy="17" r="1.6" /><circle cx="12" cy="4.5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19.5" r="1.6" /><circle cx="19" cy="12" r="1.6" /><path d="M6.4 7.6 10.6 5M6.4 7.6l4.2 3.8M6.4 16.4l4.2-3.8M6.4 16.4l4.2 2.6M13.5 5l4 6M13.5 12h4M13.5 19l4-6" /></g>),
  "Explainable AI": (<g {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></g>),
  RAG: (<g {...p}><path d="M5 3.5h7l3 3V13H5z" /><path d="M8 8.5h4M8 11h3" /><path d="M10 17.5h8a2 2 0 0 0 2-2V13M10 17.5l-2 2.5v-2.5" /></g>),
  "Data Visualization": (<g {...p}><path d="M4 4v16h16" /><path d="M7 15l4-5 3 3 5-7" /></g>),
  // work-chip extras
  "Gmail Automation": (<g {...p}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></g>),
  "AI Workflows": (<g {...p}><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="4" width="6" height="5" rx="1.2" /><rect x="9" y="15" width="6" height="5" rx="1.2" /><path d="M9 6.5h6M6 9v3h12V9M12 12v3" /></g>),
  "Knowledge Base": (<g {...p}><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" /><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3M9 7h6" /></g>),
  CNN: (<g {...p}><rect x="3" y="7" width="7" height="10" rx="1" /><rect x="14" y="9" width="7" height="6" rx="1" /><path d="M10 12h4" /></g>),
  EfficientNet: (<g {...p}><path d="M3 18 9 9l4 5 3-4 5 8" /></g>),
  "Grad-CAM": (<g {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="14" cy="10" r="3" strokeDasharray="1.5 2" /></g>),
  LLMs: (<g {...p}><path d="M4 5h16v10H10l-4 4v-4H4z" /><path d="M8 9h8M8 12h5" /></g>),
  "Vector Databases": (<g {...p}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="m9 13 3-2 3 2" /></g>),
  "Gemini API": (<g {...p}><path d="M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3" /></g>),
  "Machine Learning": (<g {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></g>),
};

export const isBrand = (name: string) => name in BRAND;
export const hasLogo = (name: string) => name in BRAND || name in CONCEPT;
export const brandTint = (name: string) => BRAND[name]?.tint ?? "13,13,13";

export default function TechLogo({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const b = BRAND[name];
  if (b) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={b.src} alt="" width={size} height={size} className={className} style={{ width: size, height: size, objectFit: "contain" }} loading="lazy" decoding="async" />;
  }
  const c = CONCEPT[name];
  if (!c) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" style={{ width: size, height: size, color: "var(--ink-2)" }}>
      {c}
    </svg>
  );
}
