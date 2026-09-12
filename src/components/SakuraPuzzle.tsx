"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { Sparkles, HelpCircle, Check, ArrowRight, Clock } from "lucide-react";

interface SakuraPuzzleProps {
  onComplete: () => void;
}

export default function SakuraPuzzle({ onComplete }: SakuraPuzzleProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [revealedDifference, setRevealedDifference] = useState(false);
  const [differenceFound, setDifferenceFound] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("sakura");

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRevealedDifference(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSpotDifference = () => {
    if (differenceFound) return;
    setDifferenceFound(true);
    soundManager.playChime("success");
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f472b6", "#ec4899", "#fbcfe8"],
    });
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 250);
  };

  const handleRevealHint = () => {
    soundManager.playChime("hint");
    setShowHintText(true);
    setRevealedDifference(true);
  };

  const { chapter, title, instruction, hintText, emotionalMessage } =
    storyContent.sakura;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center max-w-4xl mx-auto pb-24">
      {/* Header */}
      <span className="text-pink-400/80 text-xs font-mono tracking-widest uppercase mb-1">
        {chapter} • Japanese Sakura Garden
      </span>
      <h2 className="font-serif-poetic text-2xl md:text-4xl text-neutral-100 font-semibold mb-1 text-glow-rose">
        {title}
      </h2>
      <p className="text-neutral-300/80 text-xs md:text-sm max-w-md mx-auto mb-3 font-light">
        {instruction}
      </p>

      {/* Timer badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-card-subtle mb-4 text-pink-300 text-xs">
        <Clock className="w-3.5 h-3.5 text-pink-400" />
        <span>Time Remaining: <strong className="font-mono">{timeLeft}s</strong></span>
      </div>

      {/* Dual Panel Comparison with Real Photographic Sakura Garden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-4">
        {/* Left Panel (Original Photo) */}
        <div className="relative rounded-2xl overflow-hidden h-56 border border-pink-400/30 shadow-lg group">
          <div
            style={{
              backgroundImage: "url('/backgrounds/sakura.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="w-full h-full filter brightness-95"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-pink-200 tracking-wider font-mono">
            SCENE A (ORIGINAL)
          </div>
        </div>

        {/* Right Panel (With Difference: lantern subtly glowing/missing) */}
        <div
          onClick={handleSpotDifference}
          className={`relative rounded-2xl overflow-hidden h-56 border transition-all cursor-pointer group ${
            differenceFound
              ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]"
              : "border-pink-400/40 hover:border-pink-300 shadow-lg"
          }`}
        >
          <div
            style={{
              backgroundImage: "url('/backgrounds/sakura.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="w-full h-full filter brightness-95"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-pink-200 tracking-wider font-mono">
            SCENE B
          </div>

          {/* Real spot difference overlay (on left lantern) */}
          <div
            className={`absolute top-12 left-10 transition-all ${
              revealedDifference || differenceFound
                ? "scale-125 opacity-100"
                : "opacity-0"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                differenceFound
                  ? "bg-emerald-500/40 ring-4 ring-emerald-400 shadow-[0_0_20px_#34d399]"
                  : "bg-pink-500/40 ring-4 ring-pink-400 animate-ping"
              }`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-pink-200 group-hover:text-white transition-colors whitespace-nowrap">
            Tap where you notice something amiss
          </span>
        </div>
      </div>

      {/* Hint button */}
      {!differenceFound && (
        <div className="flex flex-col items-center gap-2 mb-6">
          <button
            onClick={handleRevealHint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card-subtle text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>Need a little help? — Reveal Hint</span>
          </button>
          {showHintText && (
            <p className="text-xs text-pink-300 italic max-w-sm animate-fadeIn">
              {hintText}
            </p>
          )}
        </div>
      )}

      {/* Solved emotional dialogue */}
      {differenceFound && (
        <div className="glass-panel max-w-xl w-full p-6 md:p-8 rounded-3xl text-center space-y-4 animate-fadeIn border border-pink-400/30 shadow-[0_0_30px_rgba(244,114,182,0.25)]">
          <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mx-auto text-pink-300">
            <Check className="w-5 h-5" />
          </div>

          <div className="space-y-3">
            {emotionalMessage.map((p, idx) => (
              <p
                key={idx}
                className="font-serif-poetic text-base md:text-lg text-neutral-200 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          <button
            onClick={() => {
              soundManager.playChime("click");
              onComplete();
            }}
            className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-400/60 text-pink-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(244,114,182,0.4)] cursor-pointer"
          >
            <span>NEXT CHAPTER</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </div>
      )}
    </div>
  );
}
