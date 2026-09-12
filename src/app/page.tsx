"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  GameStage,
  GameProgress,
  initialProgress,
  loadSavedProgress,
  saveProgress,
  resetProgress,
} from "@/lib/gameState";
import { soundManager } from "@/lib/audioManager";
import OpeningScene from "@/components/OpeningScene";
import AuroraPuzzle from "@/components/AuroraPuzzle";
import SakuraPuzzle from "@/components/SakuraPuzzle";
import CrosswordPuzzle from "@/components/CrosswordPuzzle";
import NYCScene from "@/components/NYCScene";
import MiniGame from "@/components/MiniGame";
import MathPuzzle from "@/components/MathPuzzle";
import FinalTimePuzzle from "@/components/FinalTimePuzzle";
import BeachScene from "@/components/BeachScene";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// Procedural Three.js 3D Background engine dynamically loaded
const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

const CHAPTER_LIST: Array<{ id: GameStage; name: string; chapter: string }> = [
  { id: "opening", chapter: "Prologue", name: "Phi Phi Haven" },
  { id: "aurora", chapter: "Chapter 1", name: "Northern Lights" },
  { id: "sakura", chapter: "Chapter 2", name: "Sakura Garden" },
  { id: "waterfall", chapter: "Chapter 3", name: "Cascading Waterfall" },
  { id: "nyc", chapter: "Chapter 4", name: "NYC Midnight" },
  { id: "mountain", chapter: "Chapter 5", name: "Emerald Mountain" },
  { id: "math", chapter: "Chapter 6", name: "Mathematical Proof" },
  { id: "time", chapter: "Chapter 7", name: "The Quiet Hour" },
  { id: "final", chapter: "Finale", name: "Rainbow Beach" },
];

export default function Home() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    // Check url search params: ?resume=true to resume, otherwise start at opening
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("resume") === "true") {
      const loaded = loadSavedProgress();
      setProgress(loaded);
    } else {
      // Always start fresh from the opening poem
      setProgress(initialProgress);
    }

    // Browsers block autoplay until the user first clicks or taps
    const startAudioOnInteraction = () => {
      const audio = document.getElementById("bg-music-player") as HTMLAudioElement | null;
      if (audio) {
        audio.play().catch(() => {});
      }
      soundManager.playMusic();
      window.removeEventListener("click", startAudioOnInteraction);
      window.removeEventListener("keydown", startAudioOnInteraction);
      window.removeEventListener("touchstart", startAudioOnInteraction);
    };

    window.addEventListener("click", startAudioOnInteraction);
    window.addEventListener("keydown", startAudioOnInteraction);
    window.addEventListener("touchstart", startAudioOnInteraction);

    return () => {
      window.removeEventListener("click", startAudioOnInteraction);
      window.removeEventListener("keydown", startAudioOnInteraction);
      window.removeEventListener("touchstart", startAudioOnInteraction);
    };
  }, []);

  const updateStage = (nextStage: GameStage) => {
    setIsTransitioning(true);
    soundManager.playChime("click");

    setTimeout(() => {
      setProgress((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, currentStage: nextStage };
        saveProgress(updated);
        return updated;
      });
      setIsTransitioning(false);
    }, 600);
  };

  const handleSelectStageDirectly = (targetStage: GameStage) => {
    setIsNavOpen(false);
    if (progress?.currentStage === targetStage) return;
    updateStage(targetStage);
  };

  const handleRestart = () => {
    if (confirm("Would you like to re-experience our little journey from the beginning?")) {
      const reset = resetProgress();
      setProgress(reset);
      setIsNavOpen(false);
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    const audio = document.getElementById("bg-music-player") as HTMLAudioElement | null;
    if (audio) {
      if (next) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    }
  };

  if (!progress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-neutral-300">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-serif-poetic text-lg text-emerald-200 tracking-wider">
          Opening our little story...
        </span>
      </div>
    );
  }

  const currentChapterInfo = CHAPTER_LIST.find((c) => c.id === progress.currentStage) || CHAPTER_LIST[0];

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#030712]">
      {/* 3D WebGL Procedural Background */}
      <Background3D stage={progress.currentStage} />

      {/* Top Left: Direct Chapter / Page Selector */}
      <div className="fixed top-6 left-6 z-50">
        <div className="relative">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel hover:bg-white/10 text-neutral-200 cursor-pointer transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/15 text-xs font-medium backdrop-blur-md"
            title="Navigate to any Chapter directly"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-neutral-400 hidden sm:inline">{currentChapterInfo.chapter}:</span>
            <span className="text-white font-medium">{currentChapterInfo.name}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                isNavOpen ? "rotate-180 text-sky-300" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu to jump anywhere */}
          {isNavOpen && (
            <div className="absolute top-12 left-0 w-64 p-2 rounded-2xl glass-panel border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-fadeIn space-y-1 z-50 max-h-[80vh] overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-white/10 flex items-center justify-between">
                <span>Jump To Page / Chapter</span>
                <Sparkles className="w-3 h-3 text-sky-400" />
              </div>

              {CHAPTER_LIST.map((ch, idx) => {
                const isActive = progress.currentStage === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectStageDirectly(ch.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-500/20 text-sky-200 border border-sky-400/40 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {ch.chapter}
                      </span>
                      <span>{ch.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Persistent Audio and Journey controls (Top Right) */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-2 rounded-full glass-panel hover:bg-white/10 text-neutral-200 cursor-pointer transition-colors shadow-lg text-xs"
          title={isMuted ? "Unmute Music" : "Mute Music"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-neutral-400" />
              <span className="hidden sm:inline text-neutral-400">Music Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline text-rose-200 font-serif italic">♪ Arctic Monkeys - I Wanna Be Yours</span>
            </>
          )}
        </button>

        {progress.currentStage !== "opening" && (
          <button
            onClick={handleRestart}
            className="p-2.5 rounded-full glass-panel hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer transition-colors shadow-lg"
            title="Restart Journey"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Arctic Monkeys - I Wanna Be Yours Original Audio File */}
      <audio
        id="bg-music-player"
        src="/music/i_wanna_be_yours.mp3"
        loop
        autoPlay
        playsInline
        muted={isMuted}
      />

      {/* Transition Overlay */}
      <div
        className={`fixed inset-0 bg-black pointer-events-none z-40 transition-opacity duration-700 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Main Interactive Stage Container */}
      <div className="relative z-10 w-full min-h-screen">
        {progress.currentStage === "opening" && (
          <OpeningScene onStart={() => updateStage("aurora")} />
        )}

        {progress.currentStage === "aurora" && (
          <AuroraPuzzle onComplete={() => updateStage("sakura")} />
        )}

        {progress.currentStage === "sakura" && (
          <SakuraPuzzle onComplete={() => updateStage("waterfall")} />
        )}

        {progress.currentStage === "waterfall" && (
          <CrosswordPuzzle onComplete={() => updateStage("nyc")} />
        )}

        {progress.currentStage === "nyc" && (
          <NYCScene onComplete={() => updateStage("mountain")} />
        )}

        {progress.currentStage === "mountain" && (
          <MiniGame onComplete={() => updateStage("math")} />
        )}

        {progress.currentStage === "math" && (
          <MathPuzzle onComplete={() => updateStage("time")} />
        )}

        {progress.currentStage === "time" && (
          <FinalTimePuzzle onComplete={() => updateStage("final")} />
        )}

        {progress.currentStage === "final" && (
          <BeachScene onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
