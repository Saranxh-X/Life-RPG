"use client";

import React, { useState, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";

export function AchievementsView() {
  const { achievements, claimAchievement } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: "ALL FEATS", icon: "🏆" },
    { id: "COMBAT", label: "COMBAT", icon: "⚔️" },
    { id: "MASTERY", label: "MASTERY", icon: "🔮" },
    { id: "DEDICATION", label: "DEDICATION", icon: "🔥" },
    { id: "WEALTH", label: "WEALTH", icon: "💰" },
  ];

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === "ALL") return achievements;
    return achievements.filter((a) => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const claimedCount = achievements.filter((a) => a.claimed).length;

  return (
    <div className="w-full space-y-6">
      {/* Achievements Header */}
      <div className="pixel-slab p-4 bg-slate-900/90 border-2 border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-xl text-yellow-400 flex items-center gap-2">
            <span>🏆</span> HEROIC FEATS & TROPHIES
          </h2>
          <p className="font-body text-slate-300 text-lg">
            Record of legendary milestones achieved throughout your dungeon journey.
          </p>
        </div>

        <div className="flex items-center gap-3 font-pixel text-xs">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-300">
            UNLOCKED: <span className="text-yellow-400">{unlockedCount}</span> / {achievements.length}
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-300">
            CLAIMED: <span className="text-emerald-400">{claimedCount}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <PixelButton
            key={cat.id}
            size="sm"
            variant={selectedCategory === cat.id ? "gold" : "stone"}
            onClick={() => setSelectedCategory(cat.id)}
            className="text-xs whitespace-nowrap"
          >
            <span className="mr-1.5">{cat.icon}</span>
            {cat.label}
          </PixelButton>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredAchievements.map((ach) => {
          const isReadyToClaim = ach.unlocked && !ach.claimed;

          return (
            <div
              key={ach.id}
              className={`pixel-slab p-5 flex flex-col justify-between transition-all ${
                ach.claimed
                  ? "border-slate-700 bg-slate-950/70 opacity-80"
                  : isReadyToClaim
                  ? "pixel-slab-gold ring-2 ring-yellow-400"
                  : "border-slate-800 bg-slate-950/90 grayscale-[40%]"
              }`}
            >
              <div>
                {/* Badge Top: Icon & Category */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-14 h-14 border-2 flex items-center justify-center text-3xl ${
                      ach.unlocked
                        ? "bg-amber-950/80 border-amber-500 shadow-[0_0_12px_#f59e0b]"
                        : "bg-slate-900 border-slate-700 opacity-50"
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-pixel text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5">
                      {ach.category}
                    </span>
                    {ach.claimed && (
                      <div className="text-[10px] font-pixel text-emerald-400 mt-1">
                        ✓ CLAIMED
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-pixel text-base text-yellow-300 mb-1.5">
                  {ach.title}
                </h3>
                <p className="font-body text-slate-300 text-lg leading-snug mb-4">
                  {ach.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <PixelProgressBar
                    current={ach.currentProgress}
                    max={ach.maxProgress}
                    variant={ach.unlocked ? "xp" : "stat"}
                    height="h-3"
                    showValues={true}
                    label="PROGRESS"
                  />
                </div>
              </div>

              {/* Reward & Action */}
              <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs font-pixel text-amber-300">
                  <span>+{ach.xpReward} XP</span> | <span>+{ach.goldReward}G</span>
                </div>

                <div>
                  {isReadyToClaim ? (
                    <PixelButton
                      size="sm"
                      variant="gold"
                      onClick={() => claimAchievement(ach.id)}
                      className="text-xs py-1.5 animate-pulse shadow-md"
                    >
                      🏆 CLAIM REWARD
                    </PixelButton>
                  ) : ach.claimed ? (
                    <span className="text-xs font-pixel text-slate-500">
                      HONORED
                    </span>
                  ) : (
                    <span className="text-xs font-pixel text-slate-500">
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
