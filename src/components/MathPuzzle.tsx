"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

interface MathPuzzleProps {
  onComplete: () => void;
}

export default function MathPuzzle({ onComplete }: MathPuzzleProps) {
  const { chapter, title, equationDisplay, equationExplanation, acceptedAnswers, loveExplosionMain, loveExplosionSub } =
    storyContent.math;

  const [inputVal, setInputVal] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("quiet");
  }, []);

  const handleVerify = (val: string) => {
    const clean = val.trim().replace(/\s+/g, "");
    if (acceptedAnswers.includes(clean)) {
      setIsSuccess(true);
      setIsError(false);
      soundManager.playChime("heartbeat");

      setTimeout(() => {
        soundManager.playChime("success");
      }, 600);

      // Heart confetti explosion
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#ef4444", "#f43f5e", "#fb7185", "#fda4af"],
      });
    } else {
      setIsError(true);
      soundManager.playChime("error");
      setTimeout(() => setIsError(false), 800);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-2xl mx-auto">
      {/* Chapter header */}
      <span className="text-rose-400/80 text-xs font-mono tracking-widest uppercase mb-2">
        {chapter} • The Mathematical Proof
      </span>
      <h2 className="font-serif-poetic text-3xl md:text-5xl text-neutral-100 font-semibold mb-6 text-glow">
        {title}
      </h2>

      {!isSuccess ? (
        <div className="glass-panel w-full p-8 md:p-10 rounded-3xl space-y-6 border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.25)]">
          {/* Equation Banner */}
          <div className="py-6 px-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center">
            <span className="font-serif-poetic text-4xl md:text-6xl text-rose-300 font-medium tracking-wide text-glow-rose">
              {equationDisplay}
            </span>
            <span className="text-neutral-400 text-xs mt-3 font-light">
              {equationExplanation}
            </span>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your answer (e.g. 71.5 or 143/2)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify(inputVal);
              }}
              className={`w-full max-w-xs px-4 py-3.5 text-center rounded-2xl bg-white/10 border ${
                isError ? "border-rose-500 animate-shake" : "border-rose-400/40"
              } text-xl font-mono text-white focus:outline-none focus:border-rose-400 transition-colors`}
            />

            <div className="pt-2">
              <button
                onClick={() => handleVerify(inputVal)}
                className="px-8 py-3 rounded-full bg-rose-500/30 hover:bg-rose-500/40 border border-rose-400/60 text-rose-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
              >
                Solve Equation
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Giant Heart Explosion sequence */
        <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn py-6">
          {/* Heart icon with intense glow & pulse */}
          <div className="relative">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-rose-500/20 blur-2xl absolute inset-0 animate-pulse" />
            <Heart className="w-28 h-28 md:w-40 md:h-40 text-rose-500 fill-rose-500 animate-heart-pulse relative z-10 filter drop-shadow-[0_0_35px_rgba(239,68,68,0.9)]" />
          </div>

          <h1 className="font-serif-poetic text-4xl md:text-6xl text-white font-bold tracking-wider text-glow-rose">
            {loveExplosionMain}
          </h1>

          <p className="font-serif-poetic text-lg md:text-2xl text-rose-200/90 italic max-w-md">
            {loveExplosionSub}
          </p>

          <button
            onClick={() => {
              soundManager.playChime("click");
              onComplete();
            }}
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500/30 to-pink-500/30 border border-rose-400/60 text-rose-100 font-medium text-sm transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer"
          >
            <span>THE FINAL MYSTERY</span>
            <ArrowRight className="w-4 h-4 text-rose-300" />
          </button>
        </div>
      )}
    </div>
  );
}
