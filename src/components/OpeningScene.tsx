"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import { Sparkles, ArrowRight } from "lucide-react";

interface OpeningSceneProps {
  onStart: () => void;
}

export default function OpeningScene({ onStart }: OpeningSceneProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("ocean");

    // Staggered poetic reveals
    const timer1 = setTimeout(() => setLineIndex(1), 1200);
    const timer2 = setTimeout(() => setLineIndex(2), 2400);
    const timer3 = setTimeout(() => setLineIndex(3), 3600);
    const timer4 = setTimeout(() => setShowReflection(true), 4800);
    const timer5 = setTimeout(() => setShowThankYou(true), 6200);
    const timer6 = setTimeout(() => setShowCta(true), 7500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  const handleJumpIn = () => {
    soundManager.playChime("click");
    onStart();
  };

  const { poemLines, reflection, thankYou, cta } = storyContent.opening;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-3xl mx-auto py-12">
      {/* Phi Phi Islands Location Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full glass-card-subtle text-amber-200/80 text-xs tracking-widest uppercase animate-pulse">
        <Sparkles className="w-3 h-3 text-amber-300" />
        Phi Phi Haven • Golden Hour
      </div>

      {/* Opening Poetic Stanza */}
      <div className="space-y-4 mb-8">
        {poemLines.map((line, idx) => (
          <p
            key={idx}
            className={`font-serif-poetic text-xl md:text-3xl text-neutral-200 transition-all duration-1000 transform ${
              idx <= lineIndex
                ? "opacity-100 translate-y-0 text-glow"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Reflection paragraph */}
      <div
        className={`transition-all duration-1000 mb-6 transform ${
          showReflection
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="font-serif-poetic text-2xl md:text-4xl text-amber-200 font-medium text-glow-gold italic">
          {reflection}
        </p>
      </div>

      {/* Thank you note */}
      <div
        className={`transition-all duration-1000 mb-10 max-w-xl mx-auto transform ${
          showThankYou
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="text-neutral-300/90 text-sm md:text-base leading-relaxed tracking-wide font-light">
          {thankYou}
        </p>
      </div>

      {/* Let Us Jump In CTA */}
      <div
        className={`transition-all duration-1000 transform ${
          showCta
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <button
          onClick={handleJumpIn}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-teal-500/20 hover:from-amber-500/30 hover:to-teal-500/30 border border-amber-300/40 hover:border-amber-300 text-amber-100 font-medium tracking-wider text-sm md:text-base transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] cursor-pointer"
        >
          <span>{cta}</span>
          <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
