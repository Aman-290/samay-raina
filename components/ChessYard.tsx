"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { chessYardContent } from "@/lib/content";
import ChessPuzzle from "@/components/ChessPuzzle";

export default function ChessYard() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 0.15,
          scale: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    paragraphsRef.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
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
        { opacity: 0, y: 40, rotateX: 45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    
    statsRef.current.filter(Boolean).forEach((el, index) => {
        gsap.fromTo(
            el,
            { opacity: 0, scale: 0.8, y: 20 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                }
            }
        )
    })

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => sectionRef.current?.contains(t.trigger as Element))
        .forEach((t) => t.kill());
    };
  }, []);

  const gridCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isDark = (row + col) % 2 === 1;
    return <div key={i} className={`${isDark ? "bg-gold" : "bg-transparent"} transition-all duration-1000`} />;
  });

  return (
    <section
      ref={sectionRef}
      id="chess-yard"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ 
          backgroundImage: "linear-gradient(rgba(8,8,8,0.85), rgba(8,8,8,0.95)), url('/images/chess_yard_bg.webp')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          backgroundAttachment: "fixed" 
      }}
    >
      {/* 3D-ish glowing grid background */}
      <div className="absolute inset-0 perspective-[1000px] overflow-hidden pointer-events-none flex items-center justify-center">
        <div
          ref={gridRef}
          className="w-[200%] h-[200%] grid grid-cols-8 opacity-0 transform rotate-x-[60deg] -translate-y-[20%]"
          style={{ gridTemplateRows: "repeat(8, 1fr)" }}
        >
          {gridCells}
        </div>
        {/* Vignette to blend grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#080808_70%)]"></div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 z-10">
        <div className="cell-door-plate mx-auto mb-20 lg:mb-32 shadow-[0_0_30px_rgba(255,213,79,0.1)] border-gold/30">
          <span className="font-space text-[10px] md:text-xs text-gold tracking-[0.3em]">
            {chessYardContent.sectionLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent rounded-full"></div>
                {chessYardContent.paragraphs.map((text, i) => (
                <p
                    key={i}
                    ref={(el) => { paragraphsRef.current[i] = el; }}
                    className="font-dm text-lg md:text-2xl text-chalk leading-[1.8] opacity-0 mb-6 pl-6"
                >
                    {text}
                </p>
                ))}
            </div>

            <div ref={quoteRef} className="mt-8 opacity-0 perspective-1000">
              <p className="font-playfair italic text-[32px] md:text-[42px] lg:text-[52px] text-gold leading-[1.2] -rotate-1 drop-shadow-[0_0_15px_rgba(255,213,79,0.3)]">
                {chessYardContent.quote}
              </p>
            </div>

            {/* Stats as digital clocks */}
            <div className="flex flex-wrap gap-6 mt-16 lg:mt-24 justify-center xl:justify-start">
              {chessYardContent.stats.map((stat, i) => (
                <div 
                    key={i} 
                    ref={(el) => { if (el) statsRef.current[i] = el; }}
                    className="flex flex-col relative px-8 py-6 rounded-lg bg-[#0e0e0e]/80 border border-gold/20 shadow-[0_0_40px_rgba(FF,D5,4F,0.05)] backdrop-blur-md overflow-hidden opacity-0"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
                  <div className="font-space text-[48px] md:text-[64px] leading-none text-gold tracking-tight" style={{ textShadow: "0 0 20px rgba(255,213,79,0.4)" }}>
                    {stat.value.toLocaleString()}<span className="text-3xl text-gold/60 ml-1">{stat.suffix}</span>
                  </div>
                  <div className="font-dm text-[11px] md:text-sm text-dim mt-3 tracking-[0.2em] uppercase font-bold text-center xl:text-left">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
             {/* Neon glow behind the puzzle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gold/20 blur-[100px] rounded-full point-events-none"></div>
            
            <div className="relative w-full max-w-[500px] mx-auto rounded-xl overflow-hidden bg-[#121212]/60 backdrop-blur-xl p-6 border border-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,213,79,0.05)]">
               
               {/* Screws/bolts in corners */}
               <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-steel/50"></div>
               <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-steel/50"></div>
               <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-steel/50"></div>
               <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-steel/50"></div>
               
              <ChessPuzzle />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 font-space text-[40px] opacity-20 text-gold -rotate-[15deg]">
          {chessYardContent.tallyMarks}
        </div>
      </div>
    </section>
  );
}
