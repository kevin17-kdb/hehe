"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import { ArrowRight, CloudRain } from "lucide-react";

interface NYCSceneProps {
  onComplete: () => void;
}

export default function NYCScene({ onComplete }: NYCSceneProps) {
  const { chapter, title, words, thoughtOne, thoughtTwo, vulnerableMessage } =
    storyContent.nyc;

  const [phase, setPhase] = useState<"words" | "thought" | "vulnerable">("words");
  const [wordPositions, setWordPositions] = useState<
    Array<{ top: number; left: number; delay: number }>
  >([]);

  useEffect(() => {
    soundManager.playAmbient("rain");

    // Randomize initial positions for floating words
    const positions = words.map(() => ({
      top: 15 + Math.random() * 65,
      left: 8 + Math.random() * 75,
      delay: Math.random() * 2,
    }));
    setWordPositions(positions);
  }, [words]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8 text-center max-w-3xl mx-auto">
      {/* Header */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full glass-card-subtle text-sky-300 text-xs tracking-widest uppercase">
        <CloudRain className="w-3 h-3 text-sky-400" />
        {chapter} • New York City Midnight
      </div>

      <h2 className="font-serif-poetic text-3xl md:text-5xl text-neutral-100 font-semibold mb-6 text-glow">
        {title}
      </h2>

      {/* Phase 1: Floating Memory Cloud */}
      {phase === "words" && (
        <div className="relative w-full h-96 my-4">
          {words.map((word, i) => (
            <div
              key={i}
              style={{
                top: `${wordPositions[i]?.top || 30}%`,
                left: `${wordPositions[i]?.left || 30}%`,
                animationDelay: `${wordPositions[i]?.delay || 0}s`,
              }}
              className="absolute animate-float-word px-3 py-1.5 rounded-xl glass-card-subtle text-xs md:text-sm text-sky-200/80 font-light border border-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              {word}
            </div>
          ))}

          <button
            onClick={() => {
              soundManager.playChime("click");
              setPhase("thought");
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-400/40 hover:border-sky-400 text-xs font-medium text-sky-200 hover:text-white transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-pointer"
          >
            <span>NEXT</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
          </button>
        </div>
      )}

      {/* Phase 2: Meaningful thought */}
      {phase === "thought" && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-xl mx-auto space-y-6 animate-fadeIn border border-sky-400/30 shadow-[0_0_40px_rgba(56,189,248,0.2)]">
          <p className="font-serif-poetic text-2xl md:text-3xl text-sky-200 text-glow leading-relaxed">
            {thoughtOne}
          </p>
          <p className="font-serif-poetic text-lg md:text-xl text-neutral-300 italic leading-relaxed">
            {thoughtTwo}
          </p>

          <button
            onClick={() => {
              soundManager.playChime("click");
              setPhase("vulnerable");
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500/30 to-indigo-500/30 border border-sky-400/50 hover:border-sky-400 text-xs font-medium text-sky-200 hover:text-white transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer mt-4"
          >
            <span>NEXT</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
          </button>
        </div>
      )}

      {/* Phase 3: Vulnerable message (hand cricket, keeping thoughts inside) */}
      {phase === "vulnerable" && (
        <div className="glass-panel p-6 md:p-10 rounded-3xl max-w-2xl mx-auto space-y-4 text-left animate-fadeIn border border-sky-400/30 shadow-[0_0_50px_rgba(56,189,248,0.25)]">
          {vulnerableMessage.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-neutral-200 text-sm md:text-base leading-relaxed font-light"
            >
              {paragraph}
            </p>
          ))}

          <div className="pt-6 text-center">
            <button
              onClick={() => {
                soundManager.playChime("click");
                onComplete();
              }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-500/30 to-indigo-500/30 border border-sky-400/60 text-sky-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer"
            >
              <span>NEXT CHAPTER</span>
              <ArrowRight className="w-4 h-4 text-sky-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
