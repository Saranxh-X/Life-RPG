"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { ShopItem, ShopCategory } from "@/services/shopService";
import { PixelButton } from "@/components/ui/PixelButton";

export function ShopView() {
  const { shopCatalog, purchaseItem, activeTheme, setTheme, character } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "ALL">("ALL");

  const categories = [
    { id: "ALL", label: "ALL GOODS", icon: "🛒" },
    { id: "THEMES", label: "DUNGEON THEMES", icon: "🎨" },
    { id: "CONSUMABLES", label: "POTIONS & SCROLLS", icon: "🧪" },
    { id: "GEAR", label: "EQUIPMENT", icon: "⚔️" },
    { id: "DECORATIONS", label: "PETS & RELICS", icon: "🐲" },
  ];

  const filteredItems = selectedCategory === "ALL"
    ? shopCatalog
    : shopCatalog.filter((i) => i.category === selectedCategory);

  const playerGold = character?.stats.gold ?? 0;

  return (
    <div className="w-full space-y-6">
      {/* Merchant NPC Dialogue Header */}
      <div className="pixel-slab p-6 bg-slate-900/90 border-2 border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Merchant Portrait */}
          <div className="w-20 h-20 bg-amber-950 border-4 border-amber-600 flex items-center justify-center text-5xl shadow-lg relative flex-shrink-0">
            🧙‍♂️
            <div className="absolute -bottom-2 bg-slate-950 border border-amber-600 px-1.5 py-0.5 text-[9px] font-pixel text-yellow-300">
              MERCHANT
            </div>
          </div>

          {/* Dialogue Speech Bubble */}
          <div className="parchment-box p-4 flex-1 relative">
            <div className="font-pixel text-xs text-amber-300 mb-1">
              GRIMWALD THE DUNGEON PURVEYOR:
            </div>
            <p className="font-body text-yellow-100 text-xl leading-snug">
              "Ah, well met, noble task slayer! Come in from the dark corridors. My satchel holds arcane dungeon themes, enchanted brews, and legendary relics for those with the coin to spare."
            </p>
            <div className="absolute bottom-2 right-3 font-pixel text-xs text-amber-500 cursor-blink">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Wallet Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <PixelButton
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "gold" : "stone"}
              onClick={() => setSelectedCategory(cat.id as ShopCategory | "ALL")}
              className="text-xs whitespace-nowrap"
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
            </PixelButton>
          ))}
        </div>

        {/* Player Gold Wallet */}
        <div className="flex items-center gap-2 bg-amber-950/80 border-2 border-amber-500 px-4 py-2 font-pixel text-sm text-yellow-300 self-start sm:self-auto shadow-md">
          <span>COIN POUCH:</span>
          <span className="text-amber-400 font-bold text-base">🪙 {playerGold}G</span>
        </div>
      </div>

      {/* Goods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item: ShopItem) => {
          const isTheme = item.category === "THEMES";
          const isCurrentActiveTheme = isTheme && activeTheme === item.themeId;
          const canAfford = playerGold >= item.price;

          return (
            <div
              key={item.id}
              className={`pixel-slab p-5 flex flex-col justify-between transition-all ${
                isCurrentActiveTheme
                  ? "pixel-slab-magic ring-2 ring-purple-400"
                  : item.purchased
                  ? "border-slate-700 bg-slate-950/80"
                  : "border-slate-800 bg-slate-950/90 hover:border-amber-500"
              }`}
            >
              <div>
                {/* Item Top: Icon & Category */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="w-14 h-14 bg-slate-900 border-2 border-amber-600/80 flex items-center justify-center text-3xl shadow-inner">
                    {item.icon}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-pixel text-amber-300/80 bg-slate-900 border border-slate-800 px-2 py-0.5">
                      {item.category}
                    </span>
                    {isCurrentActiveTheme && (
                      <div className="text-[10px] font-pixel text-purple-300 mt-1">
                        ★ ACTIVE THEME
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Lore */}
                <h3 className="font-pixel text-base text-yellow-200 mb-1.5">
                  {item.name}
                </h3>
                <p className="font-body text-slate-300 text-lg leading-snug mb-3">
                  {item.description}
                </p>

                <p className="font-body text-amber-300/70 italic text-base bg-slate-950 p-2 border-l border-amber-800/60 mb-4">
                  "{item.lore}"
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between gap-3">
                <div className="text-sm font-pixel text-amber-400">
                  {item.purchased && isTheme ? (
                    <span className="text-emerald-400">UNLOCKED</span>
                  ) : item.price === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    <span>🪙 {item.price}G</span>
                  )}
                </div>

                <div>
                  {isTheme && item.purchased ? (
                    <PixelButton
                      size="sm"
                      variant={isCurrentActiveTheme ? "magic" : "gold"}
                      disabled={isCurrentActiveTheme}
                      onClick={() => item.themeId && setTheme(item.themeId)}
                      className="text-xs py-1.5"
                    >
                      {isCurrentActiveTheme ? "APPLIED" : "APPLY THEME"}
                    </PixelButton>
                  ) : item.purchased ? (
                    <PixelButton
                      size="sm"
                      variant="stone"
                      disabled={true}
                      className="text-xs py-1.5"
                    >
                      PURCHASED
                    </PixelButton>
                  ) : (
                    <PixelButton
                      size="sm"
                      variant={canAfford ? "gold" : "stone"}
                      disabled={!canAfford}
                      onClick={() => purchaseItem(item.id)}
                      className="text-xs py-1.5"
                    >
                      {canAfford ? "BUY GOODS" : "NEED GOLD"}
                    </PixelButton>
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
