"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";
import { PixelButton } from "@/components/ui/PixelButton";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { sounds } from "@/utils/sound";

interface GameHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenAddQuest?: () => void;
}

export function GameHeader({ activeTab, onTabChange, onOpenAddQuest }: GameHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { character, soundEnabled, toggleSound } = useGame();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleExit = async () => {
    await logout();
    router.push("/auth?mode=login");
  };

  const classIcons: Record<string, string> = {
    WARRIOR: "🛡️",
    MAGE: "🔮",
    PALADIN: "✨",
    ROGUE: "🗡️",
  };

  const heroIcon = user ? classIcons[user.heroClass] || "⚔️" : "⚔️";

  return (
    <header className="w-full mb-6 z-20 relative">
      {/* Stone HUD Slab */}
      <div className="pixel-slab p-3 sm:p-4 bg-slate-950/95 border-4 border-slate-700">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Hero Info & Level (Click to open Profile Dossier) */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between sm:justify-start">
            {/* Avatar Frame - Clickable */}
            <div
              onClick={() => {
                sounds.playClick();
                setIsProfileOpen(true);
              }}
              className="relative group cursor-pointer active:scale-95 transition-transform"
              title="Click to view Hero Profile & Tasks Completed"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-950 to-slate-900 border-4 border-amber-600 group-hover:border-yellow-400 flex items-center justify-center text-2xl sm:text-3xl shadow-[inset_2px_2px_0px_#fde047,-2px_2px_0px_#000] group-hover:shadow-[0_0_15px_#f59e0b] transition-all">
                {heroIcon}
              </div>
              <div className="absolute -bottom-2 -right-1 bg-amber-600 group-hover:bg-amber-500 border-2 border-black px-1.5 py-0.5 text-[10px] font-pixel text-yellow-200">
                L{character?.stats.level || 1}
              </div>
            </div>

            {/* Name, Title, and Level Bar - Clickable */}
            <div
              onClick={() => {
                sounds.playClick();
                setIsProfileOpen(true);
              }}
              className="flex-1 min-w-[180px] sm:min-w-[220px] cursor-pointer group"
              title="Click to view Hero Profile & Tasks Completed"
            >
              <div className="flex items-center gap-2">
                <span className="font-pixel text-sm sm:text-base text-yellow-400 group-hover:text-yellow-300 transition-colors truncate max-w-[140px] sm:max-w-[200px]">
                  {user?.name || "HERO OF THE REALM"}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-pixel text-amber-200/70 border border-amber-500/40 px-1.5 py-0.5 bg-amber-950/40 group-hover:border-amber-400 transition-colors">
                  {user?.title || "Dungeon Initiate"}
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-1 w-full max-w-[240px] sm:max-w-[280px]">
                <PixelProgressBar
                  current={character?.stats.currentXp || 0}
                  max={character?.stats.maxXp || 100}
                  variant="xp"
                  height="h-3.5"
                  showValues={true}
                  label="XP"
                />
              </div>
            </div>

            {/* Sound Toggle (Mobile Quick Access) */}
            <button
              onClick={toggleSound}
              className="lg:hidden p-2 bg-slate-900 border-2 border-slate-700 text-lg active:scale-95"
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>

          {/* Center: Desktop Navigation Buttons */}
          <nav className="hidden md:flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "QUESTS", label: "QUESTS", icon: "⚔️" },
              { id: "CHARACTER", label: "HERO", icon: "👤" },
              { id: "INVENTORY", label: "BAG", icon: "🎒" },
              { id: "ACHIEVEMENTS", label: "FEATS", icon: "🏆" },
              { id: "SHOP", label: "BAZAAR", icon: "🛒" },
            ].map((tab) => (
              <PixelButton
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? "gold" : "stone"}
                onClick={() => onTabChange?.(tab.id)}
                className="text-xs"
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </PixelButton>
            ))}
          </nav>

          {/* Right: Currency, Streak, Actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Gold Counter */}
            <div className="flex items-center gap-1.5 bg-amber-950/70 border-2 border-amber-600 px-3 py-1 text-yellow-300 font-pixel text-xs sm:text-sm shadow-inner">
              <span className="text-base">🪙</span>
              <span>{character?.stats.gold ?? 0}</span>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-rose-950/70 border-2 border-rose-600 px-3 py-1 text-rose-300 font-pixel text-xs sm:text-sm shadow-inner">
              <span className="text-base animate-pulse">🔥</span>
              <span>{character?.stats.streak ?? 0}D</span>
            </div>

            {/* Sound FX Toggle (Desktop) */}
            <button
              onClick={toggleSound}
              className="hidden lg:flex items-center justify-center w-8 h-8 bg-slate-850 border-2 border-slate-700 text-sm hover:border-yellow-500 active:scale-95 transition-all"
              title={soundEnabled ? "Sound ON (Click to Mute)" : "Sound MUTED (Click to Enable)"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>

            {/* Forging / Add Quest Action */}
            {onOpenAddQuest && (
              <PixelButton
                size="sm"
                variant="magic"
                onClick={onOpenAddQuest}
                className="text-xs py-2"
              >
                + FORGE QUEST
              </PixelButton>
            )}

            {/* Logout / Exit Dungeon */}
            <PixelButton
              size="sm"
              variant="danger"
              onClick={handleExit}
              className="text-xs px-2.5 sm:px-3 py-1.5"
              title="Exit Dungeon to Login"
            >
              🚪 EXIT
            </PixelButton>
          </div>

        </div>
      </div>

      {/* Hero Profile Modal (Name, Level, Tasks Completed) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNavigateToCharacter={() => onTabChange?.("CHARACTER")}
        onNavigateToQuests={() => onTabChange?.("QUESTS")}
      />
    </header>
  );
}
