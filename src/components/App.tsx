"use client";
import { useEffect } from "react";
import { ScrollProvider } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";

/** One global observer adds .is-in to every .rv / .rv-mask the first time it is seen. */
function useRevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv, .rv-mask");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useRevealObserver();
  return (
    <ScrollProvider>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Contact />
      </main>
    </ScrollProvider>
  );
}
