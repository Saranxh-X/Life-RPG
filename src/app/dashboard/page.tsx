"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { DungeonBackground } from "@/components/layout/DungeonBackground";
import { GameHeader } from "@/components/layout/GameHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { RetroLoading } from "@/components/layout/RetroLoading";
import { QuestBoard } from "@/components/quests/QuestBoard";
import { AddQuestModal } from "@/components/quests/AddQuestModal";
import { CharacterView } from "@/components/character/CharacterView";
import { InventoryView } from "@/components/inventory/InventoryView";
import { AchievementsView } from "@/components/achievements/AchievementsView";
import { ShopView } from "@/components/shop/ShopView";
import { LevelUpModal } from "@/components/modals/LevelUpModal";
import { FloatingRewardsContainer } from "@/components/ui/FloatingReward";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, loginAsDemoHero } = useAuth();
  const { loading: gameLoading } = useGame();

  const [activeTab, setActiveTab] = useState<string>("QUESTS");
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);

  // If user is not logged in, return to the dungeon login page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?mode=login");
    }
  }, [authLoading, user, router]);

  if (authLoading || gameLoading) {
    return <RetroLoading message="LOADING DUNGEON CHAMBERS..." />;
  }

  return (
    <main className="min-h-screen relative p-3 sm:p-6 lg:p-8 pb-20 md:pb-8 flex flex-col items-center">
      {/* Dynamic Ambient Background */}
      <DungeonBackground />

      {/* Floating Micro-interaction Rewards */}
      <FloatingRewardsContainer />

      {/* Full-Screen Level Up Modal */}
      <LevelUpModal />

      {/* Add Quest Scroll Modal */}
      <AddQuestModal
        isOpen={isAddQuestOpen}
        onClose={() => setIsAddQuestOpen(false)}
      />

      {/* Inner Game Container */}
      <div className="w-full max-w-7xl z-10 flex flex-col flex-1">
        {/* Game HUD Header */}
        <GameHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddQuest={() => setIsAddQuestOpen(true)}
        />

        {/* Dynamic Main Stage */}
        <div className="flex-1 w-full animate-fadeIn">
          {activeTab === "QUESTS" && (
            <QuestBoard onOpenAddQuest={() => setIsAddQuestOpen(true)} />
          )}

          {activeTab === "CHARACTER" && <CharacterView />}

          {activeTab === "INVENTORY" && <InventoryView />}

          {activeTab === "ACHIEVEMENTS" && <AchievementsView />}

          {activeTab === "SHOP" && <ShopView />}
        </div>
      </div>

      {/* Mobile Bottom Controller Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddQuest={() => setIsAddQuestOpen(true)}
      />
    </main>
  );
}
