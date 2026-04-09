"use client";

import { useState, useCallback } from "react";
import FIRModal from "@/components/FIRModal";
import { playSound, stopSound, setSoundVolume } from "@/lib/audio";

// Generate a clank when FIR is revealed
function playClank() {
  playSound("clank", "/audio/clank.mp3", { volume: 0.6 });
}

export default function FIRSlider() {
  const [value, setValue] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  const degradationLevel = value <= 1 ? "critical" : value <= 25 ? "static" : value <= 50 ? "cracks" : value <= 75 ? "glitch" : "none";

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);

    if (v <= 25 && v > 1) {
      playSound("static", "/audio/static-noise.mp3", { loop: true, volume: 0.1 });
      setSoundVolume("static", 0.3 * (1 - v / 25));
    } else {
      stopSound("static");
    }

    if (v <= 1 && !showModal) {
      playSound("censor", "/audio/censor-beep.mp3", { volume: 0.7 });
      playClank();
      setFlashRed(true);
      setTimeout(() => {
        setFlashRed(false);
        setShowModal(true);
      }, 100);
    }
  }, [showModal]);

  const handleDismiss = () => {
    setShowModal(false);
    setValue(100);
  };

  return (
    <>
      {flashRed && (
        <div className="fixed inset-0 z-[9998] bg-alarm pointer-events-none" />
      )}
      {showModal && <FIRModal onDismiss={handleDismiss} />}

      <div className="bg-cell border-2 border-alarm rounded p-4 md:p-6 relative">
        <div className="font-space text-[10px] text-alarm tracking-[2px] mb-4">
          CONTENT FILTRATION SYSTEM
        </div>

        {/* Crack overlay */}
        {(degradationLevel === "cracks" || degradationLevel === "static" || degradationLevel === "critical") && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0,100 L80,95 L120,110 L180,85 L220,105 L280,90 L340,100 L400,95" stroke="#FF3D00" strokeWidth="0.5" fill="none" />
            <path d="M100,0 L105,50 L95,90 L110,140 L100,200" stroke="#FF3D00" strokeWidth="0.5" fill="none" />
            <path d="M300,0 L295,60 L305,120 L290,180 L300,200" stroke="#FF3D00" strokeWidth="0.3" fill="none" />
          </svg>
        )}

        <div className="flex justify-between font-space text-[9px] text-dim mb-2">
          <span>FILTRATION 100%</span>
          <span className="text-alarm">0%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-alarm [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ direction: "rtl" }}
        />

        <div
          className={`font-space text-[10px] mt-3 text-center ${degradationLevel === "none" ? "text-dim" : "text-alarm"}`}
          style={{
            animation: degradationLevel === "glitch" ? "glitch-jitter 0.3s infinite" : undefined,
          }}
        >
          {degradationLevel === "none" && `${value}% — Content within acceptable limits`}
          {degradationLevel === "glitch" && `${value}% — WARNING: Content integrity degrading`}
          {degradationLevel === "cracks" && `${value}% — ALERT: Structural damage detected`}
          {degradationLevel === "static" && `${value}% — CRITICAL: System failure imminent`}
          {degradationLevel === "critical" && `${value}% — [REDACTED]`}
        </div>
      </div>
    </>
  );
}
