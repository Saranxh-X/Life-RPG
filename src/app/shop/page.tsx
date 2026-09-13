"use client";

import React, { useState, useEffect } from "react";
import { DungeonBackground } from "@/components/layout/DungeonBackground";
import { GameHeader } from "@/components/layout/GameHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { ShopView } from "@/components/shop/ShopView";
import { AddQuestModal } from "@/components/quests/AddQuestModal";
import { LevelUpModal } from "@/components/modals/LevelUpModal";
import { FloatingRewardsContainer } from "@/components/ui/FloatingReward";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ShopPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?mode=login");
    }
  }, [authLoading, user, router]);

  const handleTabChange = (tab: string) => {
    if (tab === "SHOP") return;
    router.push(`/dashboard`);
  };

  return (
    <main className="min-h-screen relative p-3 sm:p-6 lg:p-8 pb-20 md:pb-8 flex flex-col items-center">
      <DungeonBackground />
      <FloatingRewardsContainer />
      <LevelUpModal />
      <AddQuestModal isOpen={isAddQuestOpen} onClose={() => setIsAddQuestOpen(false)} />

      <div className="w-full max-w-7xl z-10 flex flex-col flex-1">
        <GameHeader
          activeTab="SHOP"
          onTabChange={handleTabChange}
          onOpenAddQuest={() => setIsAddQuestOpen(true)}
        />
        <div className="flex-1 w-full">
          <ShopView />
        </div>
      </div>

      <MobileNav
        activeTab="SHOP"
        onTabChange={handleTabChange}
        onOpenAddQuest={() => setIsAddQuestOpen(true)}
      />
    </main>
  );
}
