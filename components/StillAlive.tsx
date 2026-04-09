"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { stillAliveContent } from "@/lib/content";
import KineticStats from "@/components/KineticStats";

export default function StillAlive() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    paragraphsRef.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    
    if (scannerRef.current) {
        gsap.to(scannerRef.current, {
            y: "100%",
            duration: 3,
            ease: "none",
            repeat: -1,
            yoyo: true
        });
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
      className="relative py-32 md:py-48 overflow-hidden"
      style={{
        background: "#050605"
      }}
    >
      {/* Background Matrix/Digital grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 230, 118, 0.5) 1px, transparent 1px)`, backgroundSize: "30px 30px" }}
      />
      
      {/* Scanner Element */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-0 overflow-hidden">
        <div ref={scannerRef} className="w-full h-32 bg-gradient-to-b from-transparent via-alive-glow to-transparent opacity-20" style={{ transform: 'translateY(-100%)' }}>
            <div className="absolute bottom-1/2 left-0 right-0 h-[1px] bg-alive opacity-50 shadow-[0_0_15px_#00E676]"></div>
        </div>
      </div>

      <div className="relative max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 z-10">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="cell-door-plate mb-12 self-start border-alive/40 shadow-[0_0_20px_rgba(0,230,118,0.1)]">
            <span className="font-space text-[10px] md:text-xs text-alive tracking-[0.4em] font-bold">
                {stillAliveContent.sectionLabel}
            </span>
            </div>

            <div className="relative pl-6 md:pl-10 border-l border-alive/20">
                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-alive shadow-[0_0_10px_#00E676] animate-[rec-pulse_2s_infinite]"></div>
                {stillAliveContent.paragraphs.map((text, i) => (
                <p
                    key={i}
                    ref={(el) => {
                    paragraphsRef.current[i] = el;
                    }}
                    className="font-dm text-lg md:text-2xl text-[#d0ebd8] leading-[1.8] mb-8 opacity-0 font-medium"
                >
                    {text}
                </p>
                ))}
            </div>

            <div ref={quoteRef} className="mt-16 bg-[#0a120c] border border-alive/30 p-8 md:p-12 shadow-[0_20px_40px_rgba(0,230,118,0.05)] opacity-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-[100px] text-alive/5 font-playfair leading-none pointer-events-none translate-x-4 -translate-y-4">"</div>
                <p className="font-playfair italic text-[36px] md:text-[50px] leading-[1.2] text-alive drop-shadow-[0_0_10px_rgba(0,230,118,0.4)]">
                    {stillAliveContent.quote}
                </p>
                <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] w-12 bg-alive/50"></div>
                    <p className="font-space text-[10px] md:text-xs tracking-[0.3em] uppercase text-alive/70 font-bold">
                        {stillAliveContent.quoteTranslation}
                    </p>
                </div>
            </div>
        </div>

        {/* Right Side: Kinetic Stats (Sticky) */}
        <div className="lg:col-span-5 hidden lg:block relative">
            <div className="sticky top-1/3">
                <div className="bg-[#050605] border border-alive/20 rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-alive"></div>
                    <div className="p-4 border-b border-alive/10 flex justify-between items-center bg-[#0a120c]">
                        <span className="font-space text-[10px] text-alive tracking-widest uppercase">SYS.DIAGNOSTIC</span>
                        <span className="w-2 h-2 rounded-full bg-alive animate-pulse"></span>
                    </div>
                    <div className="p-8">
                        <KineticStats stats={stillAliveContent.stats} />
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Stats (rendered below content) */}
        <div className="lg:hidden block">
            <div className="bg-[#050605] border border-alive/20 rounded-xl overflow-hidden shadow-2xl relative mt-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-alive"></div>
                <div className="p-4 border-b border-alive/10 flex justify-between items-center bg-[#0a120c]">
                    <span className="font-space text-[10px] text-alive tracking-widest uppercase">SYS.DIAGNOSTIC</span>
                    <span className="w-2 h-2 rounded-full bg-alive animate-pulse"></span>
                </div>
                <div className="p-8">
                    <KineticStats stats={stillAliveContent.stats} />
                </div>
            </div>
        </div>

      </div>
      
      <div className="absolute bottom-6 right-6 font-space text-[60px] text-alive opacity-10">
          {stillAliveContent.tallyMarks}
      </div>
    </section>
  );
}
