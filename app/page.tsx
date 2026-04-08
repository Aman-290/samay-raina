"use client";

import { useEffect } from "react";
import { initScrollEngine, destroyScrollEngine } from "@/lib/gsap-setup";
import SurveillanceCam from "@/components/SurveillanceCam";
import SoundToggle from "@/components/SoundToggle";
import Hero from "@/components/Hero";
import Kashmir from "@/components/Kashmir";

export default function Home() {
  useEffect(() => {
    const lenis = initScrollEngine();
    return () => destroyScrollEngine();
  }, []);

  return (
    <>
      <SurveillanceCam />
      <SoundToggle />
      <main>
      <Hero />
      <Kashmir />
      <section id="chess-yard" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Chess Yard section</p>
        </div>
      </section>
      <section id="latent-riot" className="relative bg-yard py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Latent Riot section</p>
        </div>
      </section>
      <section id="solitary-fir" className="relative bg-cell py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Solitary FIR section</p>
        </div>
      </section>
      <section id="still-alive" className="relative bg-cell py-32">
        <div className="max-w-[520px] mx-auto px-6">
          <p className="font-space text-dim text-sm">Still Alive section</p>
        </div>
      </section>
      <section id="wall" className="relative bg-cell py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-space text-dim text-sm">The Wall section</p>
        </div>
      </section>
    </main>
    </>
  );
}
