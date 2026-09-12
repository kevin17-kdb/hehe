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
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

// Procedural Three.js 3D Background engine dynamically loaded
const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

export default function Home() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleRestart = () => {
    if (confirm("Would you like to re-experience our little journey from the beginning?")) {
      const reset = resetProgress();
      setProgress(reset);
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
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

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#030712]">
      {/* 3D WebGL Procedural Background */}
      <Background3D stage={progress.currentStage} />

      {/* Persistent Audio and Journey controls */}
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

      {/* Arctic Monkeys - I Wanna Be Yours Official Audio Stream */}
      {!isMuted && (
        <iframe
          src="https://www.youtube.com/embed/nyuo9-OjNNg?autoplay=1&loop=1&playlist=nyuo9-OjNNg&enablejsapi=1"
          allow="autoplay"
          className="hidden w-0 h-0 pointer-events-none opacity-0"
          title="Arctic Monkeys - I Wanna Be Yours"
        />
      )}

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
