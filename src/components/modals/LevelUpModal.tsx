"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { PixelButton } from "@/components/ui/PixelButton";

export function LevelUpModal() {
  const { levelUpModal, closeLevelUpModal } = useGame();

  if (!levelUpModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-hidden select-none">
      {/* Golden Radiating Sunburst Background Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,#f59e0b_0%,transparent_70%)] animate-pulse" />
      </div>

      {/* Main Modal Box with Screen Shake Animation */}
      <div className="relative level-up-shake pixel-slab-gold max-w-lg w-full p-8 text-center bg-slate-950/95 border-4 border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.6)]">
        
        {/* Floating Crown / Stars */}
        <div className="text-6xl mb-3 animate-bounce">
          👑
        </div>

        {/* Level Up Banner */}
        <h1 className="font-pixel text-3xl sm:text-4xl text-yellow-400 tracking-widest drop-shadow-[0_4px_0_#78350f] mb-2">
          LEVEL UP!
        </h1>

        <div className="inline-block bg-amber-500 text-black font-pixel text-sm sm:text-base px-4 py-1 mb-6 border-2 border-black font-bold">
          REACHED LEVEL {levelUpModal.level}
        </div>

        {/* Rewards Section */}
        <div className="parchment-box p-4 mb-6 text-left space-y-3">
          <div className="font-pixel text-xs text-amber-300 pb-2 border-b border-amber-900">
            HEROIC ADVANCEMENT REWARDS:
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <div className="font-pixel text-xs text-yellow-300">
                +{levelUpModal.pointsAwarded} ATTRIBUTE POINTS
              </div>
              <div className="font-body text-amber-200/80 text-base">
                Allocate in your Hero Character sheet to enhance your stats.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="font-pixel text-xs text-yellow-300">
                +50 BONUS GOLD COINS
              </div>
              <div className="font-body text-amber-200/80 text-base">
                Added directly to your satchel to spend at Grimwald's Bazaar.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">❤️</span>
            <div>
              <div className="font-pixel text-xs text-emerald-300">
                MAX HEALTH & MANA RESTORED
              </div>
              <div className="font-body text-amber-200/80 text-base">
                Your vitality surges with renewed purpose.
              </div>
            </div>
          </div>
        </div>

        {/* Close / Advance Action */}
        <PixelButton
          variant="gold"
          size="lg"
          onClick={closeLevelUpModal}
          className="w-full text-sm sm:text-base py-3.5 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
        >
          ⚔ CLAIM GLORY & ADVANCE
        </PixelButton>
      </div>
    </div>
  );
}
