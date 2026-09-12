"use client";

import React from "react";
import { GameStage } from "@/lib/gameState";

interface Background3DProps {
  stage: GameStage;
}

const backgroundImages: Record<GameStage, string> = {
  opening: "/backgrounds/beach.jpg",
  aurora: "/backgrounds/aurora.jpg",
  sakura: "/backgrounds/sakura.jpg",
  waterfall: "/backgrounds/waterfall.jpg",
  nyc: "/backgrounds/nyc.jpg",
  mountain: "/backgrounds/waterfall.jpg",
  math: "/backgrounds/nyc.jpg",
  time: "/backgrounds/aurora.jpg",
  final: "/backgrounds/rainbow_beach.jpg",
};

export default function Background3D({ stage }: Background3DProps) {
  const currentBgImage = backgroundImages[stage];

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Pure High-Res Real Background Image */}
      <div
        key={stage}
        style={{
          backgroundImage: `url(${currentBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 w-full h-full transition-all duration-700 filter brightness-[0.8] contrast-[1.05]"
      />

      {/* Subtle soft dark vignette to keep all romantic typography perfectly legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
    </div>
  );
}
