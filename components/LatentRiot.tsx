"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { latentRiotContent } from "@/lib/content";
import LatentEvaluator from "@/components/LatentEvaluator";

export default function LatentRiot() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    paragraphsRef.current.filter(Boolean).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
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

    const section = sectionRef.current;
    
    return () => {
      ScrollTrigger.getAll()
        .filter((t) => section?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="latent-riot"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "#141416",
        animation: "hue-cycle 8s ease-in-out infinite",
      }}
    >
      {/* Noise texture at 8% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
          opacity: 0.08,
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-6 z-10">
        <div className="cell-door-plate mx-auto mb-16">
          <span className="font-space text-[10px] md:text-xs text-alarm tracking-[3px]">
            {latentRiotContent.sectionLabel}
          </span>
        </div>

        {latentRiotContent.paragraphs.map((text, i) => (
          <p
            key={i}
            ref={(el) => { paragraphsRef.current[i] = el; }}
            className="font-dm text-base md:text-lg text-chalk leading-[1.8] mb-6 opacity-0 max-w-[720px] mx-auto"
          >
            {text}
          </p>
        ))}

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {latentRiotContent.stats.map((stat, i) => (
            <div key={i} className="text-center px-5 py-3 bg-cell rounded border border-alarm/25">
              <div className="font-anton text-2xl md:text-4xl text-alarm">
                {stat.prefix || ""}{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}{stat.suffix}
              </div>
              <div className="font-dm text-[10px] text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <LatentEvaluator />

        <div className="absolute bottom-6 right-6 font-space text-lg text-steel">
          {latentRiotContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
