"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { latentRiotContent } from "@/lib/content";
import LatentEvaluator from "@/components/LatentEvaluator";

export default function LatentRiot() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, rotateZ: Math.random() * 4 - 2 },
        {
          opacity: 1,
          y: 0,
          rotateZ: 0,
          duration: 1.2,
          delay: Math.random() * 0.3,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
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
      className="relative py-32 md:py-48 overflow-hidden bg-yard"
      style={{
        animation: "hue-cycle 12s infinite alternate",
      }}
    >
      {/* Intense Caution Tape Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 61, 0, 0.05) 10px, rgba(255, 61, 0, 0.05) 20px)`
        }}
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 z-10">
        <div className="cell-door-plate mx-auto mb-20 bg-alarm/5 border-alarm/50 shadow-[0_10px_30px_rgba(255,61,0,0.15)]">
          <span className="font-space font-bold text-[10px] md:text-sm text-alarm tracking-[0.4em]">
            ⚠️ {latentRiotContent.sectionLabel} ⚠️
          </span>
        </div>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-20 auto-rows-auto">
          
          {/* Paragraph 1 - Large Card */}
          <div 
            ref={(el) => { cardRefs.current[0] = el; }}
            className="md:col-span-8 bg-concrete border-l-4 border-l-alarm border-t border-t-steel/30 border-r border-r-steel/30 border-b border-b-steel/30 p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-alarm/5 rounded-bl-full pointer-events-none"></div>
            <p className="font-playfair text-2xl md:text-3xl text-chalk leading-relaxed opacity-0" style={{ animation: 'none' }}>
              {latentRiotContent.paragraphs[0]}
            </p>
          </div>

          {/* Warning Stat 1 */}
          <div 
            ref={(el) => { cardRefs.current[1] = el; }}
            className="md:col-span-4 bg-alarm text-yard p-8 flex flex-col justify-center items-center text-center transform md:rotate-2 shadow-2xl"
          >
            <div className="font-space tracking-[0.2em] text-[10px] uppercase font-bold mb-4 border-b border-yard/30 pb-2 w-full">Threat Level</div>
            <div className="font-anton text-6xl md:text-7xl">
              {latentRiotContent.stats[0].value}{latentRiotContent.stats[0].suffix}
            </div>
            <div className="font-dm text-sm font-bold mt-2 uppercase">{latentRiotContent.stats[0].label}</div>
          </div>

          {/* Paragraph 2 - Medium Card */}
          <div 
            ref={(el) => { cardRefs.current[2] = el; }}
            className="md:col-span-6 bg-cell border border-steel/20 p-8 shadow-inner relative"
          >
            <div className="absolute top-4 left-4 font-space text-[10px] text-dim">DOC-REF-02</div>
            <p className="font-dm text-lg text-chalk leading-[1.8] mt-6">
              {latentRiotContent.paragraphs[1]}
            </p>
          </div>

          {/* Stats 2 & 3 */}
          <div className="md:col-span-6 grid grid-cols-2 gap-6">
            <div 
              ref={(el) => { cardRefs.current[3] = el; }}
              className="bg-[#1a1a1a] border border-dashed border-alarm/40 p-6 flex flex-col justify-center items-center text-center"
            >
              <div className="font-anton text-4xl text-alarm">
                {latentRiotContent.stats[1].value}{latentRiotContent.stats[1].suffix}
              </div>
              <div className="font-space text-[10px] text-chalk mt-2 uppercase tracking-wide">{latentRiotContent.stats[1].label}</div>
            </div>
            <div 
              ref={(el) => { cardRefs.current[4] = el; }}
              className="bg-[#1a1a1a] border border-dashed border-alarm/40 p-6 flex flex-col justify-center items-center text-center"
            >
              <div className="font-anton text-4xl text-alarm">
                {latentRiotContent.stats[2].value}{latentRiotContent.stats[2].suffix}
              </div>
              <div className="font-space text-[10px] text-chalk mt-2 uppercase tracking-wide">{latentRiotContent.stats[2].label}</div>
            </div>
          </div>
        </div>

        <div className="relative z-20 shadow-2xl rounded-lg overflow-hidden border border-alarm/20 bg-cell p-4 md:p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-alarm via-alarm/50 to-transparent"></div>
            <LatentEvaluator />
        </div>

        <div className="absolute bottom-6 right-8 font-space text-opacity-30 text-5xl text-alarm -rotate-12">
          {latentRiotContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
