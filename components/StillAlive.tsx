"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { stillAliveContent } from "@/lib/content";
import KineticStats from "@/components/KineticStats";

export default function StillAlive() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const greenBgRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;

    if (containerRef.current && section) {
      gsap.fromTo(
        containerRef.current,
        { maxWidth: "520px" },
        {
          maxWidth: "1200px",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "+=100%",
            scrub: 1,
          },
        }
      );
    }

    if (greenBgRef.current && section) {
      gsap.fromTo(
        greenBgRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.85,
          scale: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }

    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
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
      className="relative bg-cell py-24 md:py-32 overflow-hidden"
    >
      <div
        ref={greenBgRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #00E676, transparent 70%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-16 flex justify-around px-8 opacity-10 pointer-events-none">
        {[15, -20, 8, -12, 25, -8].map((rot, i) => {
          const heights = [48, 52, 40, 45, 55, 38];
          return (
            <div
              key={i}
              className="w-[6px] bg-steel"
              style={{
                height: `${heights[i]}px`,
                transform: `rotate(${rot}deg)`,
              }}
            />
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto px-6 z-10"
        style={{ maxWidth: "520px" }}
      >
        <div className="cell-door-plate mx-auto mb-16 border-alive">
          <span className="font-space text-[10px] md:text-xs text-alive tracking-[3px]">
            {stillAliveContent.sectionLabel}
          </span>
        </div>

        {stillAliveContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 text-center"
          >
            {text}
          </p>
        ))}

        <KineticStats stats={stillAliveContent.stats} />

        <div ref={quoteRef} className="text-center mt-12 opacity-0">
          <p className="font-caveat text-[24px] md:text-[32px] text-chalk leading-[1.4]">
            {stillAliveContent.quote}
          </p>
          <p className="font-dm text-sm text-dim mt-2 italic">
            {stillAliveContent.quoteTranslation}
          </p>
        </div>

        <div className="text-right font-space text-lg text-alive/40 mt-12">
          {stillAliveContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
