"use client";

import { useEffect, useState, useRef } from "react";
import { playSound } from "@/lib/audio";

export default function EasterEggs() {
  const [isBakchod, setIsBakchod] = useState(false);
  const [showFIRTally, setShowFIRTally] = useState(false);
  const bufferRef = useRef("");

  // Konami code: type "BAKCHOD"
  useEffect(() => {
    const target = "BAKCHOD";
    const handleKeyDown = (e: KeyboardEvent) => {
      bufferRef.current += e.key.toUpperCase();
      if (bufferRef.current.length > target.length) {
        bufferRef.current = bufferRef.current.slice(-target.length);
      }
      if (bufferRef.current === target) {
        setIsBakchod((prev) => !prev);
        playSound("roast", "/audio/roast-clip.mp3", { volume: 0.5 });
        bufferRef.current = "";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply IGL branding inversion
  useEffect(() => {
    if (isBakchod) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "";
    }
    return () => { document.documentElement.style.filter = ""; };
  }, [isBakchod]);

  // FIR tally: days since Feb 8, 2025
  const [daysSinceFIR, setDaysSinceFIR] = useState(0);

  useEffect(() => {
    const firDate = new Date("2025-02-08");
    const diff = Math.floor((Date.now() - firDate.getTime()) / (1000 * 60 * 60 * 24));
    setTimeout(() => {
      setDaysSinceFIR(diff);
    }, 0);
  }, []);

  return (
    <>
      {/* FIR Tally — click to reveal */}
      <div
        className="fixed bottom-4 right-4 z-[9989] cursor-pointer"
        onClick={() => setShowFIRTally((prev) => !prev)}
      >
        {showFIRTally ? (
          <div className="font-space text-[10px] text-alarm bg-cell/90 px-3 py-2 rounded border border-alarm/30">
            Days since last FIR: {daysSinceFIR}
          </div>
        ) : (
          <div className="font-space text-[10px] text-steel hover:text-dim transition-colors">
            &#9432;
          </div>
        )}
      </div>
    </>
  );
}
