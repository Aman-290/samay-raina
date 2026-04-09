"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { stillAliveContent } from "@/lib/content";
import KineticStats from "@/components/KineticStats";

export default function StillAlive() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;

    // Sequential rising animation for all elements
    elementsRef.current.filter(Boolean).forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

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
      className="relative py-32 md:py-48 overflow-hidden min-h-screen flex flex-col justify-center"
      style={{ 
          background: "#000",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,1)), url('/images/stage_spotlight.png')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundAttachment: "fixed"
      }}
    >
      {/* Light Beam Overlay element to exaggerate the spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1200px] h-[70vh] bg-gradient-to-b from-white/10 to-transparent blur-[80px] pointer-events-none mix-blend-screen opacity-60"></div>
      
      <div className="relative max-w-[1200px] mx-auto px-6 z-20 flex flex-col items-center top-0">
        
        {/* Cinematic Title */}
        <div 
          ref={el => { elementsRef.current[0] = el; }}
          className="mb-16 md:mb-24 text-center border-b border-gold/30 pb-4 inline-block px-12"
        >
          <span className="font-space text-xs md:text-sm text-gold tracking-[0.5em] font-bold uppercase drop-shadow-[0_0_10px_rgba(178,149,55,0.5)]">
             {stillAliveContent.sectionLabel}
          </span>
        </div>

        {/* The Blinding Quote */}
        <div 
          ref={el => { elementsRef.current[1] = el; }}
          className="text-center w-full mb-24 md:mb-32 drop-shadow-2xl"
        >
            <p className="font-playfair italic text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] leading-[1.05] text-white font-black drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                {stillAliveContent.quote}
            </p>
            <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-[1px] w-24 bg-gold/50"></div>
                <p className="font-space text-xs md:text-sm tracking-[0.4em] uppercase text-chalk/70 font-bold mt-4">
                    {stillAliveContent.quoteTranslation}
                </p>
            </div>
        </div>

        {/* The Paragraphs */}
        <div className="max-w-[700px] mx-auto text-center mb-32 relative">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-transparent"></div>
            <div className="px-8 md:px-16">
                {stillAliveContent.paragraphs.map((text, i) => (
                <p
                    key={i}
                    ref={el => { elementsRef.current[2 + i] = el; }}
                    className="font-dm text-lg md:text-2xl text-chalk/90 leading-[1.8] mb-10 font-normal opacity-0 font-medium"
                >
                    {text}
                </p>
                ))}
            </div>
        </div>

        {/* The Monumental Tour Stats Billing */}
        <div 
            ref={el => { elementsRef.current[10] = el; }}
            className="w-full xl:w-[1200px]"
        >
            <div className="w-full flex justify-center mb-8">
                <span className="font-space text-[10px] text-gold tracking-widest uppercase border border-gold/30 px-6 py-2 rounded-full">World Tour Billing</span>
            </div>
            <KineticStats stats={stillAliveContent.stats} />
        </div>

      </div>
      
      {/* Absolute Bottom Tally */}
      <div className="absolute bottom-6 right-6 font-space text-[40px] md:text-[60px] text-white opacity-5 pointer-events-none">
          {stillAliveContent.tallyMarks}
      </div>
    </section>
  );
}
