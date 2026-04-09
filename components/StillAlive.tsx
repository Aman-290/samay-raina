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
  const flareRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    // The Power Surge Flare
    if (flareRef.current) {
      gsap.fromTo(
        flareRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.8,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      
      // Heartbeat pulse for flare
      gsap.to(flareRef.current, {
        opacity: 0.4,
        scale: 0.95,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5
      });
    }

    if (titleRef.current) {
        gsap.fromTo(
            titleRef.current,
            { scale: 1.5, opacity: 0, y: 50 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: section,
                    start: "top 65%",
                    toggleActions: "play none none reverse",
                }
            }
        )
    }

    paragraphsRef.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          delay: 0.4 + (index * 0.1),
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
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.7)",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
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
      style={{ background: "#030403" }}
    >
      {/* Massive Backlight Flare */}
      <div 
        ref={flareRef}
        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-alive blur-[150px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 z-0"
        style={{ opacity: 0 }}
      ></div>

      {/* Background Matrix/Digital grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] z-0"
        style={{ backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 230, 118, 0.5) 1px, transparent 1px)`, backgroundSize: "30px 30px" }}
      />
      
      {/* Scanner Element */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
        <div ref={scannerRef} className="w-full h-40 bg-gradient-to-b from-transparent via-alive-glow to-transparent opacity-40" style={{ transform: 'translateY(-100%)' }}>
            <div className="absolute bottom-1/2 left-0 right-0 h-[2px] bg-alive opacity-80 shadow-[0_0_30px_#00E676]"></div>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 z-20">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center">
            
            <div ref={titleRef} className="cell-door-plate mb-16 self-start border-alive shadow-[0_0_40px_rgba(0,230,118,0.3)] bg-[#051109] opacity-0 text-center flex items-center justify-center">
                <span className="font-space text-[14px] md:text-lg text-alive tracking-[0.4em] font-bold text-shadow-[0_0_10px_#00E676]">
                    ⚡ {stillAliveContent.sectionLabel}
                </span>
            </div>

            <div className="relative pl-6 md:pl-10 border-l-[3px] border-alive shadow-[-10px_0_20px_rgba(0,230,118,0.2)] bg-gradient-to-r from-alive/10 to-transparent py-4 rounded-r-lg">
                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-alive shadow-[0_0_20px_#00E676] animate-[rec-pulse_1.5s_infinite]"></div>
                {stillAliveContent.paragraphs.map((text, i) => (
                <p
                    key={i}
                    ref={(el) => {
                    paragraphsRef.current[i] = el;
                    }}
                    className="font-dm text-xl md:text-3xl text-chalk leading-[1.6] mb-8 opacity-0 font-bold drop-shadow-md tracking-tight"
                >
                    {text}
                </p>
                ))}
            </div>

            <div ref={quoteRef} className="mt-20 bg-[#0a120c]/80 backdrop-blur-md border-2 border-alive p-10 md:p-16 shadow-[0_0_60px_rgba(0,230,118,0.2)] opacity-0 relative overflow-hidden rounded-xl">
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-alive opacity-5 rounded-xl pointer-events-none blur-3xl"></div>
                <div className="absolute top-0 right-0 text-[140px] text-alive/10 font-playfair leading-none pointer-events-none translate-x-4 -translate-y-8">"</div>
                <p className="font-playfair italic text-[40px] sm:text-[50px] md:text-[64px] leading-[1.1] text-chalk font-black drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] relative z-10">
                    Samay didn’t just survive the FIR. <br/><span className="text-alive text-[48px] sm:text-[60px] md:text-[76px] filter drop-shadow-[0_0_20px_rgba(0,230,118,0.6)]">He turned it into a tour name.</span>
                </p>
                <div className="mt-8 flex items-center gap-6 relative z-10">
                    <div className="h-[2px] w-16 bg-alive"></div>
                    <p className="font-space text-[12px] md:text-sm tracking-[0.4em] uppercase text-alive font-bold">
                        {stillAliveContent.quoteTranslation}
                    </p>
                </div>
            </div>
        </div>

        {/* Right Side: Kinetic Stats (Sticky) */}
        <div className="lg:col-span-12 xl:col-span-5 relative mt-16 xl:mt-0">
            <div className="xl:sticky top-1/4 z-30">
                <div className="bg-[#050605]/90 backdrop-blur-xl border-2 border-alive rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,230,118,0.15)] relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-alive via-chalk to-alive animate-[hue-cycle_2s_infinite]"></div>
                    <div className="p-6 border-b border-alive/20 flex justify-between items-center bg-[#0a150c]">
                        <span className="font-space text-xs md:text-sm text-alive tracking-widest uppercase font-bold">SYS.DIAGNOSTIC_SURGE</span>
                        <span className="w-3 h-3 rounded-full bg-alive animate-ping shadow-[0_0_10px_#00E676]"></span>
                    </div>
                    <div className="p-8 md:p-12">
                        <KineticStats stats={stillAliveContent.stats} />
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 font-space text-[80px] md:text-[120px] text-alive opacity-[0.03] font-black -rotate-12 pointer-events-none">
          {stillAliveContent.tallyMarks}
      </div>
    </section>
  );
}
