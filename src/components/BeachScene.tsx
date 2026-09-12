"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { Mail, Sparkles, Heart, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface BeachSceneProps {
  onRestart: () => void;
}

export default function BeachScene({ onRestart }: BeachSceneProps) {
  const { environmentTitle, sandHint, letter } = storyContent.final;

  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("rain");
  }, []);

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    soundManager.playChime("success");
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.4 },
      colors: ["#60a5fa", "#f43f5e", "#fbbf24", "#34d399"],
    });
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) soundManager.playAmbient("rain");
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-4xl mx-auto">
      {/* Sound & Reset Floating Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleSound}
          className="p-3 rounded-full glass-panel hover:bg-white/10 text-sky-200 cursor-pointer transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          title="Toggle Music / Ambient"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onRestart}
          className="p-3 rounded-full glass-panel hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer transition-all"
          title="Restart Journey"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Environment Title */}
      <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 rounded-full glass-card-subtle text-amber-300 text-xs tracking-widest uppercase">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        {environmentTitle}
      </div>

      <h1 className="font-serif-poetic text-4xl md:text-6xl text-white font-bold mb-4 text-glow">
        Where The Rain Meets The Rainbow
      </h1>

      {/* Hidden Letter in Sand interaction */}
      {!isLetterOpen ? (
        <div className="mt-8 flex flex-col items-center space-y-6 animate-fadeIn">
          <p className="font-serif-poetic text-lg md:text-2xl text-amber-200/90 italic max-w-md">
            {sandHint}
          </p>

          <button
            onClick={handleOpenLetter}
            className="group relative flex flex-col items-center p-8 rounded-3xl glass-panel border border-amber-400/40 hover:border-amber-300 transition-all cursor-pointer shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] animate-pulse"
          >
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-amber-200 group-hover:scale-110 transition-transform mb-3">
              <Mail className="w-10 h-10" />
            </div>
            <span className="font-serif-poetic text-xl text-amber-100 font-semibold tracking-wide">
              Unfold The Buried Letter
            </span>
            <span className="text-[11px] text-amber-300/70 font-light mt-1">
              Protected by the tide • For Bubuuuuu
            </span>
          </button>
        </div>
      ) : (
        /* Unfolded Physical Parchment Love Letter */
        <div className="relative w-full max-w-3xl my-6 p-8 md:p-14 rounded-3xl bg-[#fbf5e8] text-[#2c1810] shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-[#dfd2be] animate-fadeIn text-left custom-scrollbar max-h-[80vh] overflow-y-auto">
          {/* Subtle parchment stamp */}
          <div className="flex items-center justify-between border-b border-[#e2d5c3] pb-6 mb-8">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-serif uppercase tracking-widest">
              <Heart className="w-4 h-4 fill-rose-700 text-rose-700" />
              <span>To My Haven</span>
            </div>
            <span className="text-xs text-[#8a7265] font-mono">Phi Phi Sanctuary</span>
          </div>

          {/* Salutation */}
          <h2 className="font-handwritten text-4xl md:text-5xl text-[#1e3a8a] mb-6 font-bold tracking-wide">
            {letter.salutation}
          </h2>

          {/* Letter Body Paragraphs */}
          <div className="space-y-5 text-sm md:text-base leading-relaxed text-[#37261d] font-serif">
            {letter.paragraphs.map((p, idx) => (
              <p key={idx} className="tracking-wide">
                {p}
              </p>
            ))}
          </div>

          {/* Closing and Signature */}
          <div className="mt-12 pt-8 border-t border-[#e2d5c3] flex flex-col items-end">
            <span className="font-serif italic text-base text-[#5c4639]">
              {letter.closing}
            </span>
            <span className="font-handwritten text-4xl text-[#1e3a8a] font-bold mt-1">
              {letter.signature}
            </span>
          </div>

          {/* Footnote */}
          <div className="mt-8 text-center text-xs text-[#9c8477] italic tracking-widest font-serif">
            {letter.footnote}
          </div>
        </div>
      )}
    </div>
  );
}
