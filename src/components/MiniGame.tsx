"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { Gamepad2, ArrowRight, Play, RefreshCw } from "lucide-react";

interface MiniGameProps {
  onComplete: () => void;
}

export default function MiniGame({ onComplete }: MiniGameProps) {
  const { chapter, title, subtitle, openingQuote, midQuote1, midQuote2, midQuote3, successQuote } =
    storyContent.mountain;

  // Game coordinates for two cooperative companions
  // Blue (Water/Aura) and Orange (Fire/Ember)
  const [blueX, setBlueX] = useState(10);
  const [orangeX, setOrangeX] = useState(15);
  const [switchActive, setSwitchActive] = useState(false);
  const [bridgeRaised, setBridgeRaised] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  useEffect(() => {
    soundManager.playAmbient("quiet");
  }, []);

  const runAutomatedWalk = () => {
    setIsAutomating(true);
    soundManager.playChime("click");

    // Blue steps on switch
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= 12) {
        setBlueX((prev) => Math.min(prev + 3.5, 52));
      } else if (step === 13) {
        setSwitchActive(true);
        setBridgeRaised(true);
        soundManager.playChime("hint");
        setDialogueIndex(1); // "I remember everything..."
      } else if (step > 13 && step <= 25) {
        setOrangeX((prev) => Math.min(prev + 3.5, 88));
        setBlueX((prev) => Math.min(prev + 2.5, 84));
        if (step === 18) setDialogueIndex(2); // "No need to check messages"
        if (step === 22) setDialogueIndex(3); // "Hehe jk"
      } else if (step > 25) {
        clearInterval(interval);
        setIsWon(true);
        soundManager.playChime("success");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#f97316", "#10b981"],
        });
      }
    }, 140);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-4xl mx-auto">
      {/* Header */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full glass-card-subtle text-emerald-300 text-xs tracking-widest uppercase">
        <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
        {chapter} • Emerald Mountain Valley
      </div>

      <h2 className="font-serif-poetic text-3xl md:text-5xl text-neutral-100 font-semibold mb-2 text-glow">
        {title}
      </h2>
      <p className="text-neutral-300/80 text-xs md:text-sm max-w-md mx-auto mb-6 font-light">
        {subtitle}
      </p>

      {/* Opening quote banner */}
      <div className="glass-card-subtle px-4 py-2 rounded-2xl mb-6 text-emerald-200 text-xs md:text-sm italic">
        {openingQuote}
      </div>

      {/* 2D Mini Platformer Canvas Frame */}
      <div className="relative glass-panel w-full max-w-2xl h-64 md:h-72 rounded-3xl overflow-hidden border border-emerald-500/30 p-4 flex flex-col justify-end shadow-[0_0_35px_rgba(16,185,129,0.25)]">
        {/* Sky / Floating clouds */}
        <div className="absolute top-4 left-6 text-2xl opacity-60">☁️</div>
        <div className="absolute top-8 right-12 text-3xl opacity-50">☁️</div>

        {/* Dynamic dialogue ticker inside game */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs text-neutral-200 whitespace-nowrap animate-fadeIn font-mono">
          {dialogueIndex === 0 && "Two companions must reach the sacred portal..."}
          {dialogueIndex === 1 && midQuote1}
          {dialogueIndex === 2 && midQuote2}
          {dialogueIndex === 3 && midQuote3}
        </div>

        {/* Hazard pit in the middle */}
        <div className="absolute bottom-6 left-[45%] w-[18%] h-6 bg-purple-900/60 rounded-t-lg border-t border-purple-400/50 flex items-center justify-center text-[10px] text-purple-200 font-mono">
          MIST HAZARD
        </div>

        {/* Switch trigger */}
        <div
          className={`absolute bottom-6 left-[38%] w-8 h-3 rounded-t transition-colors ${
            switchActive ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-neutral-500"
          }`}
        />

        {/* Bridge across hazard */}
        <div
          className={`absolute bottom-8 left-[45%] w-[18%] h-2 rounded transition-all duration-500 ${
            bridgeRaised
              ? "bg-amber-400 shadow-[0_0_15px_#fbbf24] opacity-100"
              : "bg-transparent border-dashed border-t border-amber-300/30 opacity-40"
          }`}
        />

        {/* Destination Portal */}
        <div className="absolute bottom-6 right-6 text-3xl animate-pulse">
          ✨🌀
        </div>

        {/* Companion A (Blue Aura Sprite) */}
        <div
          style={{ left: `${blueX}%` }}
          className="absolute bottom-6 transition-all duration-100 flex flex-col items-center"
        >
          <span className="text-[10px] text-sky-300 font-mono">Aura</span>
          <div className="w-8 h-8 rounded-full bg-sky-400 shadow-[0_0_15px_#38bdf8] flex items-center justify-center text-xs">
            💧
          </div>
        </div>

        {/* Companion B (Orange Ember Sprite) */}
        <div
          style={{ left: `${orangeX}%` }}
          className="absolute bottom-6 transition-all duration-100 flex flex-col items-center"
        >
          <span className="text-[10px] text-orange-300 font-mono">Ember</span>
          <div className="w-8 h-8 rounded-full bg-orange-500 shadow-[0_0_15px_#f97316] flex items-center justify-center text-xs">
            🔥
          </div>
        </div>

        {/* Ground level */}
        <div className="w-full h-6 bg-emerald-950/80 border-t border-emerald-500/40 rounded-b-xl flex items-center justify-between px-4 text-[10px] text-emerald-300/60 font-mono">
          <span>START</span>
          <span>GATEWAY</span>
        </div>
      </div>

      {/* Game controls */}
      {!isWon ? (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            disabled={isAutomating}
            onClick={runAutomatedWalk}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-sky-500/30 hover:from-emerald-500/40 hover:to-sky-500/40 border border-emerald-400/60 text-emerald-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-300 fill-emerald-300" />
            <span>Play Cooperative Journey</span>
          </button>
        </div>
      ) : (
        /* Solved stage */
        <div className="mt-6 space-y-4 animate-fadeIn">
          <p className="font-serif-poetic text-2xl text-emerald-200 text-glow">
            {successQuote}
          </p>
          <button
            onClick={() => {
              soundManager.playChime("click");
              onComplete();
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/60 text-emerald-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <span>NEXT CHAPTER</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      )}
    </div>
  );
}
