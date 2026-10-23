import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PROFILE } from "@/lib/data";

const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});
const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});
const jbMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jb-mono",
  weight: "100 800",
  display: "swap",
});

const title = `${PROFILE.name} — ${PROFILE.role}`;
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajayvikram2512.github.io"),
  title,
  description: PROFILE.resumeSummary,
  openGraph: {
    title,
    description: PROFILE.resumeSummary,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${PROFILE.name} — portrait` }],
  },
  twitter: { card: "summary_large_image", title, description: PROFILE.resumeSummary, images: ["/og.jpg"] },
};
export const viewport: Viewport = { themeColor: "#f4f2ee", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${instrument.variable} ${jbMono.variable}`}>
      <body suppressHydrationWarning>
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}.rv-mask>span{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
