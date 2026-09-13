"use client";

import React, { useState, useEffect } from "react";

const DUNGEON_TIPS = [
  "Tip: Vanquish your hardest bounty first thing in the morning to earn bonus Discipline.",
  "Tip: Potions in your inventory can be consumed anytime to gain extra focus and stamina.",
  "Tip: Maintaining your streak flame yields greater gold multipliers in the Dungeon Bazaar.",
  "Tip: Upgrading Intelligence increases your maximum Mana capacity for arcane spells.",
  "Tip: Equipment can be swapped inside your Bag to specialize your stat bonuses.",
];

export function RetroLoading({ message = "LOADING DUNGEON..." }: { message?: string }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * DUNGEON_TIPS.length));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#090910] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Stone Gate Frame */}
      <div className="pixel-slab p-8 max-w-md w-full border-4 border-slate-700 bg-slate-900/90 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        {/* Top Welcome Banner */}
        <div className="mb-4">
          <span className="font-pixel text-[11px] sm:text-xs text-amber-300 bg-amber-950/90 border border-amber-500 px-3 py-1 tracking-wider inline-block shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            ✨ WELCOME TO REAL LIFE RPG QUESTS ✨
          </span>
        </div>

        {/* Animated 16-Bit Icon */}
        <div className="text-5xl mb-4 animate-bounce">
          ⚔️
        </div>

        {/* Loading Message */}
        <h2 className="font-pixel text-xl sm:text-2xl text-yellow-400 mb-6 tracking-wide animate-pulse">
          {message}
        </h2>

        {/* Retro Segmented Bar */}
        <div className="pixel-bar-container h-5 w-full mb-6">
          <div className="pixel-bar-fill bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 w-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Parchment Lore Box */}
        <div className="parchment-box p-3 text-left">
          <div className="text-[11px] font-pixel text-amber-400 mb-1">ARCHIVIST SCROLL:</div>
          <p className="font-body text-base text-amber-200/90 leading-tight">
            {DUNGEON_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
