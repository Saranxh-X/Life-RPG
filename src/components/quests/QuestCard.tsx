"use client";

import React, { useState } from "react";
import { Quest } from "@/services/questService";
import { useGame } from "@/context/GameContext";
import { PixelButton } from "@/components/ui/PixelButton";

interface QuestCardProps {
  quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
  const { completeQuest, deleteQuest } = useGame();
  const [slashing, setSlashing] = useState(false);

  const difficultyConfig = {
    EASY: { label: "COMMON", color: "text-emerald-400 border-emerald-600 bg-emerald-950/60" },
    MEDIUM: { label: "RARE", color: "text-sky-400 border-sky-600 bg-sky-950/60" },
    HARD: { label: "EPIC", color: "text-purple-400 border-purple-600 bg-purple-950/60" },
    BOSS: { label: "BOSS 💀", color: "text-amber-300 border-amber-500 bg-amber-950/80 shadow-[0_0_10px_#f59e0b]" },
  }[quest.difficulty];

  const attributeConfig = {
    STRENGTH: { label: "STRENGTH", icon: "⚔️", text: "text-red-400" },
    INTELLIGENCE: { label: "INTELLECT", icon: "🔮", text: "text-indigo-400" },
    VITALITY: { label: "VITALITY", icon: "🛡️", text: "text-emerald-400" },
    DISCIPLINE: { label: "DISCIPLINE", icon: "⚡", text: "text-amber-400" },
  }[quest.attribute];

  const handleComplete = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSlashing(true);
    completeQuest(quest.id, { x: rect.left + 50, y: rect.top - 20 });
    setTimeout(() => setSlashing(false), 500);
  };

  const isBoss = quest.difficulty === "BOSS";

  return (
    <div
      className={`relative pixel-slab p-4 sm:p-5 transition-all group ${
        isBoss ? "pixel-slab-gold" : quest.completed ? "opacity-60 grayscale-[40%]" : "hover:border-slate-400"
      }`}
    >
      {/* Sword Slash VFX overlay */}
      {slashing && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="slash-effect text-6xl text-amber-300 drop-shadow-[0_0_16px_#f59e0b]">
            ⚔️
          </div>
        </div>
      )}

      {/* Top Meta: Difficulty & Attribute */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Difficulty Badge */}
          <span
            className={`font-pixel text-[10px] sm:text-xs px-2 py-0.5 border-2 ${difficultyConfig.color}`}
          >
            {difficultyConfig.label}
          </span>

          {/* Stat Affinity */}
          <span
            className={`flex items-center gap-1 font-pixel text-[10px] sm:text-xs px-2 py-0.5 bg-slate-900 border border-slate-700 ${attributeConfig.text}`}
          >
            <span>{attributeConfig.icon}</span>
            <span>{attributeConfig.label}</span>
          </span>
        </div>

        {/* Due Date or Category */}
        <div className="flex items-center gap-2">
          {quest.dueDate && (
            <span className="font-pixel text-[10px] text-amber-300/80 bg-slate-900 px-1.5 py-0.5 border border-slate-800">
              ⌛ {quest.dueDate}
            </span>
          )}
          {/* Delete action */}
          <button
            onClick={() => deleteQuest(quest.id)}
            title="Abandon Quest"
            className="text-slate-500 hover:text-red-400 text-xs px-1 hover:scale-110 active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Quest Title & Description */}
      <div className="mb-4">
        <h3
          className={`font-pixel text-base sm:text-lg mb-1.5 leading-snug ${
            quest.completed ? "line-through text-slate-400" : isBoss ? "text-amber-300" : "text-yellow-100"
          }`}
        >
          {quest.title}
        </h3>
        <p className="font-body text-slate-300 text-lg leading-relaxed line-clamp-3">
          {quest.description}
        </p>
      </div>

      {/* Rewards & Complete Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-2 border-slate-800/80">
        {/* Rewards */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-pixel text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-1">
            <span>✨</span>
            <span>+{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 font-pixel text-xs text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-1">
            <span>🪙</span>
            <span>+{quest.goldReward}G</span>
          </div>
        </div>

        {/* Complete / Status Button */}
        <div>
          {quest.completed ? (
            <PixelButton
              size="sm"
              variant="stone"
              onClick={handleComplete}
              className="w-full sm:w-auto text-xs py-2 text-emerald-300"
            >
              ✓ COMPLETED (UNDO)
            </PixelButton>
          ) : (
            <PixelButton
              size="sm"
              variant={isBoss ? "gold" : "magic"}
              onClick={handleComplete}
              className="w-full sm:w-auto text-xs py-2 shadow-lg"
            >
              ⚔ COMPLETE BOUNTY
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
