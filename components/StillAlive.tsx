"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { stillAliveContent } from "@/lib/content";
import KineticStats from "@/components/KineticStats";

export default function StillAlive() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => section?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="still-alive"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 480px at 50% -10%, rgba(0, 230, 118, 0.14), transparent 65%), linear-gradient(180deg, #0a0a0a, #111215)",
      }}
    >
      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="cell-door-plate mx-auto mb-16 border-alive">
          <span className="font-space text-[10px] md:text-xs text-alive tracking-[3px]">
            {stillAliveContent.sectionLabel}
          </span>
        </div>

        <div className="max-w-[840px] mx-auto">
          {stillAliveContent.paragraphs.map((text, i) => (
            <p
              key={i}
              ref={(el) => {
                paragraphsRef.current[i] = el;
              }}
              className="font-dm text-base md:text-xl text-chalk leading-[1.85] mb-6 opacity-0"
            >
              {text}
            </p>
          ))}
        </div>

        <KineticStats stats={stillAliveContent.stats} />

        <div ref={quoteRef} className="max-w-[840px] mx-auto mt-12 text-center opacity-0">
          <p className="font-caveat text-[30px] md:text-[42px] leading-[1.25] text-alive">
            {stillAliveContent.quote}
          </p>
          <p className="font-space text-[10px] md:text-xs tracking-[0.22em] uppercase text-dim mt-4">
            {stillAliveContent.quoteTranslation}
          </p>
        </div>

        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {stillAliveContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
