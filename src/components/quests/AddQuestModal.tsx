"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { QuestDifficulty, StatAttribute, QuestCategory } from "@/services/questService";
import { PixelButton } from "@/components/ui/PixelButton";

interface AddQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddQuestModal({ isOpen, onClose }: AddQuestModalProps) {
  const { createQuest } = useGame();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("EASY");
  const [attribute, setAttribute] = useState<StatAttribute>("STRENGTH");
  const [category, setCategory] = useState<QuestCategory>("DAILY");
  const [dueDate, setDueDate] = useState("Today");

  if (!isOpen) return null;

  // Reward auto-calculation based on difficulty
  const baseRewards: Record<QuestDifficulty, { xp: number; gold: number }> = {
    EASY: { xp: 40, gold: 20 },
    MEDIUM: { xp: 75, gold: 35 },
    HARD: { xp: 130, gold: 65 },
    BOSS: { xp: 260, gold: 150 },
  };

  const calculatedXp = baseRewards[difficulty].xp;
  const calculatedGold = baseRewards[difficulty].gold;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createQuest({
      title: title.trim(),
      description: description.trim() || "A noble trial recorded in the realm archives.",
      difficulty,
      attribute,
      category,
      xpReward: calculatedXp,
      goldReward: calculatedGold,
      dueDate,
    });

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      {/* Ancient Parchment Scroll Box */}
      <div className="parchment-box w-full max-w-lg p-6 sm:p-8 my-8 relative">
        
        {/* Wax Seal Accent */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-800 border-4 border-red-950 rounded-full flex items-center justify-center text-yellow-300 font-pixel text-xs shadow-lg transform rotate-12">
          ⚔️
        </div>

        {/* Scroll Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-amber-900/60">
          <h2 className="font-pixel text-xl sm:text-2xl text-amber-300 tracking-wider">
            FORGE A REALM QUEST
          </h2>
          <p className="font-body text-amber-200/80 text-lg">
            Inscribe a real-world undertaking into the scrolls of destiny.
          </p>
        </div>

        {/* Scroll Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quest Title */}
          <div>
            <label className="block font-pixel text-xs text-amber-300 mb-1.5">
              QUEST TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Slay the 30-Minute Gym Workout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#17110c] border-2 border-amber-800 p-2.5 text-yellow-100 font-body text-xl placeholder-amber-900/70 outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-pixel text-xs text-amber-300 mb-1.5">
              TRIAL LORE & NOTES
            </label>
            <textarea
              rows={3}
              placeholder="Describe the objective or steps required to conquer this trial..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#17110c] border-2 border-amber-800 p-2.5 text-yellow-100 font-body text-xl placeholder-amber-900/70 outline-none focus:border-amber-400"
            />
          </div>

          {/* Difficulty & Stat Affinity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block font-pixel text-xs text-amber-300 mb-1.5">
                DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                className="w-full bg-[#17110c] border-2 border-amber-800 p-2.5 text-yellow-200 font-pixel text-xs outline-none focus:border-amber-400"
              >
                <option value="EASY">COMMON (Easy)</option>
                <option value="MEDIUM">RARE (Medium)</option>
                <option value="HARD">EPIC (Hard)</option>
                <option value="BOSS">BOSS (Massive Goal)</option>
              </select>
            </div>

            {/* Stat Affinity */}
            <div>
              <label className="block font-pixel text-xs text-amber-300 mb-1.5">
                STAT AFFINITY
              </label>
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value as StatAttribute)}
                className="w-full bg-[#17110c] border-2 border-amber-800 p-2.5 text-yellow-200 font-pixel text-xs outline-none focus:border-amber-400"
              >
                <option value="STRENGTH">⚔️ STRENGTH (Body/Fitness)</option>
                <option value="INTELLIGENCE">🔮 INTELLECT (Study/Code)</option>
                <option value="VITALITY">🛡️ VITALITY (Health/Sleep)</option>
                <option value="DISCIPLINE">⚡ DISCIPLINE (Habits/Focus)</option>
              </select>
            </div>
          </div>

          {/* Category & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-amber-300 mb-1.5">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestCategory)}
                className="w-full bg-[#17110c] border-2 border-amber-800 p-2.5 text-yellow-200 font-pixel text-xs outline-none focus:border-amber-400"
              >
                <option value="DAILY">☀️ Daily Bounty</option>
                <option value="EPIC">⚔️ Epic Project</option>
                <option value="HABIT">🔄 Recurring Habit</option>
                <option value="BOSS">💀 Boss Raid</option>
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-amber-300 mb-1.5">
                TIMEFRAME
              </label>
              <input
                type="text"
                placeholder="Today / Friday / By Midnight"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#17110c] border-2 border-amber-800 p-2 text-yellow-100 font-body text-xl outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Rewards Preview Box */}
          <div className="bg-[#17110c]/80 border-2 border-amber-900 p-3 flex items-center justify-around text-center">
            <div>
              <div className="text-[10px] font-pixel text-emerald-400">XP REWARD</div>
              <div className="font-pixel text-sm text-emerald-300">+{calculatedXp} XP</div>
            </div>
            <div className="h-6 w-px bg-amber-900" />
            <div>
              <div className="text-[10px] font-pixel text-yellow-400">GOLD REWARD</div>
              <div className="font-pixel text-sm text-yellow-300">+{calculatedGold} 🪙</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <PixelButton
              type="button"
              variant="stone"
              onClick={onClose}
              className="text-xs py-2 px-4"
            >
              RETREAT
            </PixelButton>
            <PixelButton
              type="submit"
              variant="gold"
              className="text-xs py-2 px-6 shadow-md"
            >
              📜 SEAL & INSCRIBE
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
}
