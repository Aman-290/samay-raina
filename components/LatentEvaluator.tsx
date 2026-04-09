"use client";

import { useState } from "react";

export default function LatentEvaluator() {
  const [userScore, setUserScore] = useState(5);
  const [judgeScore, setJudgeScore] = useState(5);
  const [revealed, setRevealed] = useState(false);

  const delta = Math.abs(userScore - judgeScore);

  const getResult = () => {
    if (delta === 0) return { text: "You'd win ₹1,00,000! Perfect match! 🎉", color: "text-alive" };
    if (delta === 1) return { text: "So close! One point off.", color: "text-gold" };
    return { text: "Zero self-awareness. Samay would roast you. 😂", color: "text-alarm" };
  };

  const handleReveal = () => setRevealed(true);

  const handleReset = () => {
    setRevealed(false);
    setUserScore(5);
    setJudgeScore(5);
  };

  return (
    <div className="bg-cell border-2 border-alarm rounded p-4 md:p-6">
      <div className="font-space text-[10px] text-alarm tracking-[2px] mb-4">
        INTERACTIVE: THE LATENT EVALUATOR
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* YouTube embed */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-concrete rounded overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/Lpy1gOdxaBk?mute=1"
              title="Samay Raina: Beyond the Controversies"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div>
            <label className="font-space text-[10px] text-chalk tracking-[1px] block mb-2">
              YOUR SCORE: <span className="text-alarm">{userScore}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={userScore}
              onChange={(e) => { setUserScore(Number(e.target.value)); setRevealed(false); }}
              className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-alarm [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between font-space text-[8px] text-dim mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          <div>
            <label className="font-space text-[10px] text-chalk tracking-[1px] block mb-2">
              JUDGES&apos; SCORE: <span className="text-gold">{judgeScore}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={judgeScore}
              onChange={(e) => { setJudgeScore(Number(e.target.value)); setRevealed(false); }}
              className="w-full h-2 bg-concrete rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between font-space text-[8px] text-dim mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-3 bg-alarm text-white font-space text-xs tracking-[1px] rounded hover:brightness-110 transition-all"
            >
              REVEAL VARIANCE
            </button>
          ) : (
            <div className="text-center">
              <div className="font-anton text-3xl text-alarm mb-2">Δ = {delta}</div>
              <p className={`font-dm text-sm ${getResult().color}`}>{getResult().text}</p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 border border-steel text-dim font-space text-[10px] tracking-[1px] rounded hover:text-chalk transition-colors"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
