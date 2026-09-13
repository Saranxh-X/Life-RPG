"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeQuest, deleteQuest } from "@/app/actions/quests";
import { CheckCircle, Trash2, Plus } from "lucide-react";
import { AddQuestModal } from "./AddQuestModal";
import confetti from "canvas-confetti";

type Quest = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
};

type ProfilePatch = {
  level: number;
  current_xp: number;
  gold: number;
  strength: number;
  intellect: number;
  discipline: number;
  health: number;
  creativity: number;
};

export function QuestList({
  initialQuests,
  onProfileChange,
}: {
  initialQuests: Quest[];
  onProfileChange: (profile: ProfilePatch) => void;
}) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);

  const handleComplete = async (id: string) => {
    setIsCompleting(id);

    // Optimistic UI update
    const quest = quests.find((q) => q.id === id);
    setQuests(quests.filter((q) => q.id !== id));

    try {
      const result = await completeQuest(id);

      if (result.error) {
        // Revert on error
        if (quest) setQuests((prev) => [...prev, quest]);
        alert(result.error);
      } else {
        // Success animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#fbbf24", "#8b5cf6"],
        });

        if (result.leveledUp) {
          setTimeout(() => {
            alert(`🎉 Level Up! You are now level ${result.newLevel}!`);
          }, 500);
        }
        if (result.profile) onProfileChange(result.profile);
      }
    } catch {
      if (quest) setQuests((prev) => [...prev, quest]);
    }

    setIsCompleting(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to abandon this quest?")) return;

    const quest = quests.find((q) => q.id === id);
    setQuests(quests.filter((q) => q.id !== id));

    const result = await deleteQuest(id);
    if (result.error && quest) {
      setQuests((prev) => [...prev, quest]);
    }
  };

  const categoryColors: Record<string, string> = {
    strength: "text-red-400 border-red-400/20 bg-red-400/10",
    intellect: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    discipline: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
    health: "text-green-400 border-green-400/20 bg-green-400/10",
    creativity: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  };

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-muted-foreground">
            Quest log
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold">
            <span className="text-primary">✦</span> Active quests
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {quests.length} remaining
        </p>
      </div>
      <div className="glass-panel rounded-2xl p-4 md:p-5">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Accept a quest
          </button>
        </div>
      </div>

      {quests.length === 0 ? (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            Quest Log Empty
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            You have no active quests. Add a new task to continue your journey
            and earn XP!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {quests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${categoryColors[quest.category.toLowerCase()] || "text-muted-foreground border-border bg-secondary"}`}
                    >
                      {quest.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      {quest.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground truncate text-lg">
                    {quest.title}
                  </h3>
                  {quest.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {quest.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-green-400">
                      +{quest.xp_reward} XP
                    </div>
                    <div className="text-xs font-bold text-accent">
                      +{quest.gold_reward} Gold
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-border pl-4">
                    <button
                      onClick={() => handleComplete(quest.id)}
                      disabled={isCompleting === quest.id}
                      className="p-2 rounded-full hover:bg-green-500/20 text-muted-foreground hover:text-green-500 transition-colors"
                      title="Complete Quest"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(quest.id)}
                      className="p-2 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      title="Abandon Quest"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
