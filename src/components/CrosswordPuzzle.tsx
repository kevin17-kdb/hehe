"use client";

import React, { useState, useEffect } from "react";
import { storyContent, CrosswordItem } from "@/lib/storyContent";
import { soundManager } from "@/lib/audioManager";
import confetti from "canvas-confetti";
import { Check, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface CrosswordPuzzleProps {
  onComplete: () => void;
}

export default function CrosswordPuzzle({ onComplete }: CrosswordPuzzleProps) {
  const { chapter, title, subtitle, crossword, completionMessage } =
    storyContent.waterfall;
  const [activeItem, setActiveItem] = useState<CrosswordItem>(crossword[0]);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [solvedItems, setSolvedItems] = useState<Record<number, boolean>>({});
  const [specialReaction, setSpecialReaction] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    soundManager.playAmbient("waterfall");
  }, []);

  const handleInputAnswer = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    setAnswers((prev) => ({ ...prev, [activeItem.id]: uppercaseVal }));

    // Clean match check
    const cleanInput = uppercaseVal.replace(/[^A-Z]/g, "");
    const cleanTarget = activeItem.answer.replace(/[^A-Z]/g, "");

    if (cleanInput === cleanTarget && !solvedItems[activeItem.id]) {
      soundManager.playChime("success");
      const updatedSolved = { ...solvedItems, [activeItem.id]: true };
      setSolvedItems(updatedSolved);

      if (activeItem.specialReaction) {
        setSpecialReaction(activeItem.specialReaction);
      }

      // Check if all items solved
      if (Object.keys(updatedSolved).length === crossword.length) {
        setAllComplete(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#0284c7", "#67e8f9"],
        });
      }
    }
  };

  const handleRevealLetter = () => {
    soundManager.playChime("hint");
    setShowHint(true);
    // Auto-fill target answer
    setAnswers((prev) => ({ ...prev, [activeItem.id]: activeItem.answer }));
    const updatedSolved = { ...solvedItems, [activeItem.id]: true };
    setSolvedItems(updatedSolved);
    if (activeItem.specialReaction) {
      setSpecialReaction(activeItem.specialReaction);
    }
    if (Object.keys(updatedSolved).length === crossword.length) {
      setAllComplete(true);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-4xl mx-auto">
      {/* Chapter header */}
      <span className="text-sky-400/80 text-xs font-mono tracking-widest uppercase mb-2">
        {chapter} • 3D Cascading Waterfall
      </span>
      <h2 className="font-serif-poetic text-3xl md:text-5xl text-neutral-100 font-semibold mb-2 text-glow">
        {title}
      </h2>
      <p className="text-neutral-300/80 text-sm max-w-md mx-auto mb-6 font-light">
        {subtitle}
      </p>

      {/* Crossword Questions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-6">
        {crossword.map((item) => {
          const isSolved = !!solvedItems[item.id];
          const isSelected = activeItem.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setShowHint(false);
                soundManager.playChime("click");
              }}
              className={`glass-panel p-4 rounded-2xl text-left cursor-pointer transition-all border ${
                isSelected
                  ? "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  : isSolved
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : "border-white/10 hover:border-sky-400/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-sky-300 font-medium">
                  Question {item.id}
                </span>
                {isSolved && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" /> Solved
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-200 font-light">{item.clue}</p>
              {isSolved && (
                <p className="text-xs font-mono text-emerald-300 mt-1 font-semibold tracking-wider">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Active input panel */}
      {!allComplete && (
        <div className="glass-panel w-full max-w-lg p-6 rounded-3xl mb-6 text-center space-y-4 border border-sky-400/30">
          <div className="text-xs text-sky-300 font-medium uppercase tracking-wider">
            {activeItem.clue}
          </div>

          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              placeholder="YOUR ANSWER..."
              value={answers[activeItem.id] || ""}
              onChange={(e) => handleInputAnswer(e.target.value)}
              className="w-full max-w-xs px-4 py-3 text-center rounded-2xl bg-white/10 border border-sky-400/30 text-lg font-mono text-white tracking-widest uppercase focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRevealLetter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card-subtle text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Reveal Clue / Auto-fill</span>
            </button>
          </div>

          {showHint && (
            <p className="text-xs text-sky-200 italic animate-fadeIn">
              {activeItem.hint}
            </p>
          )}

          {/* Reaction toast */}
          {specialReaction && (
            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-medium animate-fadeIn">
              {specialReaction}
            </div>
          )}
        </div>
      )}

      {/* Completion message */}
      {allComplete && (
        <div className="glass-panel max-w-xl w-full p-6 md:p-8 rounded-3xl text-center space-y-4 animate-fadeIn border border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.3)]">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto text-sky-300">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            {completionMessage.map((line, idx) => (
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
            className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-sky-500/30 to-teal-500/30 border border-sky-400/60 text-sky-100 font-medium text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer"
          >
            <span>NEXT CHAPTER</span>
            <ArrowRight className="w-4 h-4 text-sky-300" />
          </button>
        </div>
      )}
    </div>
  );
}
