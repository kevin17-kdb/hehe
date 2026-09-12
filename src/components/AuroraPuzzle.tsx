"use client";

import React, { useState, useEffect } from "react";
import { storyContent } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { HelpCircle, CheckCircle, ArrowRight } from "lucide-react";

interface AuroraPuzzleProps {
  onComplete: () => void;
}

export default function AuroraPuzzle({ onComplete }: AuroraPuzzleProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("aurora");
  }, []);

  const { chapter, title, question, hintOptions, successMessage } =
    storyContent.aurora;

  const validateDate = (d: string, m: string, y: string) => {
    const cleanD = d.trim().padStart(2, "0");
    const cleanM = m.trim().padStart(2, "0");
    const cleanY = y.trim();

    if (
      cleanD === "24" &&
      (cleanM === "06" || cleanM === "6" || cleanM.toLowerCase() === "june") &&
      cleanY === "2025"
    ) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  const handleSelectOption = (opt: string) => {
    soundManager.playChime("click");
    if (opt === "24 June 2025") {
      setDay("24");
      setMonth("06");
      setYear("2025");
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  const triggerSuccess = () => {
    setIsSolved(true);
    setIsError(false);
    soundManager.playChime("success");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#06b6d4", "#a855f7"],
    });
  };

  const triggerError = () => {
    setIsError(true);
    soundManager.playChime("error");
    setTimeout(() => setIsError(false), 800);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-2xl mx-auto">
      {/* Chapter header */}
      <span className="text-emerald-400/80 text-xs font-mono tracking-widest uppercase mb-2">
        {chapter} • 3D Northern Lights
      </span>
      <h2 className="font-serif-poetic text-3xl md:text-5xl text-neutral-100 font-semibold mb-6 text-glow">
        {title}
      </h2>

      {/* Main glass card */}
      <div className="glass-panel w-full p-6 md:p-8 rounded-3xl mb-6 text-neutral-200">
        <p className="font-serif-poetic text-lg md:text-2xl italic text-emerald-200/90 whitespace-pre-line mb-8 leading-relaxed">
          {question}
        </p>

        {!isSolved ? (
          <div className="space-y-6">
            {/* Date Inputs */}
            <div className="flex items-center justify-center gap-3">
              <input
                type="text"
                maxLength={2}
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className={`w-16 h-14 text-center rounded-2xl bg-white/10 border ${
                  isError ? "border-rose-500 animate-shake" : "border-white/20"
                } text-xl font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors`}
              />
              <span className="text-2xl text-emerald-400 font-light">/</span>
              <input
                type="text"
                maxLength={2}
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={`w-16 h-14 text-center rounded-2xl bg-white/10 border ${
                  isError ? "border-rose-500 animate-shake" : "border-white/20"
                } text-xl font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors`}
              />
              <span className="text-2xl text-emerald-400 font-light">/</span>
              <input
                type="text"
                maxLength={4}
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`w-24 h-14 text-center rounded-2xl bg-white/10 border ${
                  isError ? "border-rose-500 animate-shake" : "border-white/20"
                } text-xl font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors`}
              />
            </div>

            {/* Check Button */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => validateDate(day, month, year)}
                className="px-6 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-medium text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Confirm Date
              </button>
              <button
                onClick={() => {
                  soundManager.playChime("hint");
                  setShowHints(!showHints);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-card-subtle text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Take A Hint</span>
              </button>
            </div>

            {/* Hint options cards */}
            {showHints && (
              <div className="grid grid-cols-2 gap-3 pt-4 animate-fadeIn">
                {hintOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    className="p-3.5 rounded-2xl glass-card-subtle hover:bg-emerald-500/20 hover:border-emerald-400/50 text-sm text-neutral-200 transition-all cursor-pointer"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Success reveal message */
          <div className="space-y-4 py-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2 pt-2">
              {successMessage.map((line, idx) => (
                <p
                  key={idx}
                  className="font-serif-poetic text-lg md:text-xl text-neutral-200 leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playChime("click");
                onComplete();
              }}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/60 text-emerald-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <span>NEXT CHAPTER</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
