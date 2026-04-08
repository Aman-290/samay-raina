"use client";

import { useEffect } from "react";
import { initScrollEngine, destroyScrollEngine } from "@/lib/gsap-setup";
import SurveillanceCam from "@/components/SurveillanceCam";
import SoundToggle from "@/components/SoundToggle";
import Hero from "@/components/Hero";
import Kashmir from "@/components/Kashmir";
import ChessYard from "@/components/ChessYard";
import LatentRiot from "@/components/LatentRiot";
import SolitaryFIR from "@/components/SolitaryFIR";
import StillAlive from "@/components/StillAlive";
import Wall from "@/components/Wall";

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
      <ChessYard />
      <LatentRiot />
      <SolitaryFIR />
      <StillAlive />
      <Wall />
    </main>
    </>
  );
}
