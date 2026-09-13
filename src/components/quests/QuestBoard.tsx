"use client";

import React, { useState, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { QuestCard } from "./QuestCard";
import { PixelButton } from "@/components/ui/PixelButton";

interface QuestBoardProps {
  onOpenAddQuest: () => void;
}

export function QuestBoard({ onOpenAddQuest }: QuestBoardProps) {
  const { quests } = useGame();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "ALL", label: "ALL BOUNTIES", icon: "📜" },
    { id: "DAILY", label: "DAILY", icon: "☀️" },
    { id: "EPIC", label: "EPIC", icon: "⚔️" },
    { id: "BOSS", label: "BOSS RAIDS", icon: "💀" },
    { id: "HABIT", label: "HABITS", icon: "🔄" },
    { id: "COMPLETED", label: "CONQUERED", icon: "🏆" },
  ];

  const filteredQuests = useMemo(() => {
    return quests.filter((q) => {
      // Category filter
      if (activeCategory === "COMPLETED") {
        if (!q.completed) return false;
      } else if (activeCategory !== "ALL") {
        if (q.category !== activeCategory) return false;
        if (q.completed) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query) ||
          q.attribute.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [quests, activeCategory, searchQuery]);

  // Statistics
  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;
  const potentialXp = quests.filter((q) => !q.completed).reduce((sum, q) => sum + q.xpReward, 0);
  const potentialGold = quests.filter((q) => !q.completed).reduce((sum, q) => sum + q.goldReward, 0);

  return (
    <div className="w-full space-y-6">
      {/* Bounty Board Header Notice */}
      <div className="pixel-slab p-4 bg-slate-900/90 border-2 border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-xl sm:text-2xl text-yellow-400 flex items-center gap-2">
            <span>📜</span> REALM BOUNTY BOARD
          </h2>
          <p className="font-body text-slate-300 text-lg">
            Accept trials, vanquish real-world challenges, and harvest glorious rewards.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-pixel">
          <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 text-slate-300">
            ACTIVE: <span className="text-yellow-400">{activeCount}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 text-slate-300">
            COMPLETED: <span className="text-emerald-400">{completedCount}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 text-slate-300">
            AVAILABLE: <span className="text-emerald-300">+{potentialXp} XP</span> | <span className="text-yellow-300">+{potentialGold}G</span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <PixelButton
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? "gold" : "stone"}
              onClick={() => setActiveCategory(cat.id)}
              className="text-xs whitespace-nowrap"
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </PixelButton>
          ))}
        </div>

        {/* Search Input & Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Search bounties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-700 px-3 py-1.5 text-sm font-body text-white placeholder-slate-500 outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <PixelButton
            size="sm"
            variant="magic"
            onClick={onOpenAddQuest}
            className="text-xs whitespace-nowrap py-2"
          >
            + NEW BOUNTY
          </PixelButton>
        </div>
      </div>

      {/* Quests Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="pixel-slab p-12 text-center bg-slate-950/80 border-2 border-slate-700">
          <div className="text-5xl mb-4">📜</div>
          <h3 className="font-pixel text-lg text-yellow-400 mb-2">NO BOUNTIES FOUND</h3>
          <p className="font-body text-slate-400 text-xl max-w-md mx-auto mb-6">
            {searchQuery
              ? "No bounties match your arcane search query."
              : "The bounty board is peaceful for now. Forge a new quest to resume your training!"}
          </p>
          <PixelButton variant="gold" onClick={onOpenAddQuest}>
            + FORGE YOUR FIRST BOUNTY
          </PixelButton>
        </div>
      )}
    </div>
  );
}
