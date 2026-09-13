"use client";

import React from "react";
import { useGame } from "@/context/GameContext";

export function FloatingRewardsContainer() {
  const { floatingRewards } = useGame();

  if (floatingRewards.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {floatingRewards.map((reward) => {
        const style: React.CSSProperties = reward.x && reward.y
          ? { left: `${reward.x}px`, top: `${reward.y}px` }
          : { left: "50%", top: "45%", transform: "translate(-50%, -50%)" };

        const colorClasses = {
          xp: "text-emerald-300 border-emerald-500 bg-emerald-950/90 shadow-[0_0_12px_#10b981]",
          gold: "text-yellow-300 border-yellow-500 bg-amber-950/90 shadow-[0_0_12px_#f59e0b]",
          streak: "text-rose-300 border-rose-500 bg-rose-950/90 shadow-[0_0_12px_#ef4444]",
        }[reward.type];

        return (
          <div
            key={reward.id}
            style={style}
            className={`fixed animate-float-reward font-pixel text-sm sm:text-base px-3 py-1 border-2 pixel-corners ${colorClasses}`}
          >
            {reward.text}
          </div>
        );
      })}
    </div>
  );
}
