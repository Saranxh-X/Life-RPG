"use client";

import React from "react";
import { sounds } from "@/utils/sound";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddQuest?: () => void;
}

export function MobileNav({ activeTab, onTabChange, onOpenAddQuest }: MobileNavProps) {
  const tabs = [
    { id: "QUESTS", label: "Quests", icon: "⚔️" },
    { id: "CHARACTER", label: "Hero", icon: "👤" },
    { id: "ADD", label: "+Forge", icon: "✨", special: true },
    { id: "INVENTORY", label: "Bag", icon: "🎒" },
    { id: "ACHIEVEMENTS", label: "Feats", icon: "🏆" },
    { id: "SHOP", label: "Shop", icon: "🛒" },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/98 border-t-4 border-slate-700 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          if (tab.special) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playScroll();
                  onOpenAddQuest?.();
                }}
                className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-none bg-purple-700 border-2 border-purple-400 text-white shadow-[0_0_12px_#a855f7] active:scale-95 transition-transform"
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[9px] font-pixel leading-tight mt-0.5">ADD</span>
              </button>
            );
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                onTabChange(tab.id);
              }}
              className={`flex flex-col items-center py-1 px-2 border-b-2 transition-all ${
                isActive
                  ? "border-amber-400 text-yellow-400 scale-105"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[10px] font-pixel mt-0.5 leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
