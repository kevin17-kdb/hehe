"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { HelpCircle, ArrowRight, Moon } from "lucide-react";

interface FinalTimePuzzleProps {
  onComplete: () => void;
}

export default function FinalTimePuzzle({ onComplete }: FinalTimePuzzleProps) {
  const { chapter, title, acceptedVariants, hints } = storyContent.time;

  const [inputVal, setInputVal] = useState("");
  const [hintTier, setHintTier] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("quiet");
  }, []);

  const handleVerifyTime = (val: string) => {
    const clean = val.trim().toUpperCase().replace(/\s+/g, " ");
    const isMatch = acceptedVariants.some(
      (v) => v.toUpperCase() === clean || clean === "2:00 AM" || clean === "02:00 AM" || clean === "2:00AM"
    );

    if (isMatch) {
      setIsSuccess(true);
      setIsError(false);
      soundManager.playChime("success");
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#60a5fa", "#38bdf8", "#818cf8"],
      });
    } else {
      setIsError(true);
      soundManager.playChime("error");
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleNextHint = () => {
    soundManager.playChime("hint");
    setHintTier((prev) => Math.min(prev + 1, hints.length));
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-xl mx-auto">
      {/* Chapter header */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full glass-card-subtle text-indigo-300 text-xs tracking-widest uppercase">
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
        {chapter}
      </div>

      <h2 className="font-serif-poetic text-4xl md:text-6xl text-neutral-100 font-semibold mb-6 text-glow">
        {title}
      </h2>

      {!isSuccess ? (
        <div className="glass-panel w-full p-8 rounded-3xl space-y-6 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
          <p className="text-neutral-400 text-xs md:text-sm font-light">
            No question will be given. Only a quiet secret kept between two souls.
          </p>

          {/* Time input */}
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              placeholder="--:-- AM"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerifyTime(inputVal);
              }}
              className={`w-48 h-14 text-center rounded-2xl bg-white/10 border ${
                isError ? "border-rose-500 animate-shake" : "border-indigo-400/40"
              } text-2xl font-mono text-white tracking-widest focus:outline-none focus:border-indigo-400 transition-colors`}
            />
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleVerifyTime(inputVal)}
              className="px-8 py-3 rounded-full bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/60 text-indigo-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer"
            >
              Unlock The Shore
            </button>

            {hintTier < hints.length && (
              <button
                onClick={handleNextHint}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full glass-card-subtle text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Need Clue</span>
              </button>
            )}
          </div>

          {/* Hint cards */}
          {hintTier > 0 && (
            <div className="space-y-2 pt-2 text-left animate-fadeIn">
              {hints.slice(0, hintTier).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-400/20 text-indigo-200 text-xs font-light italic"
                >
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Success message before final beach */
        <div className="glass-panel w-full p-8 rounded-3xl space-y-4 animate-fadeIn border border-indigo-400/40 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
          <p className="font-serif-poetic text-2xl text-indigo-200 text-glow">
            2:00 AM.
          </p>
          <p className="font-serif-poetic text-lg text-neutral-300 italic">
            When all words stopped hesitating, and the whole world belonged to us.
          </p>

          <button
            onClick={() => {
              soundManager.playChime("click");
              onComplete();
            }}
            className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500/30 via-sky-500/30 to-teal-500/30 border border-indigo-400/60 text-indigo-100 font-medium text-sm transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] cursor-pointer"
          >
            <span>ENTER THE RAINBOW BEACH</span>
            <ArrowRight className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      )}
    </div>
  );
}
