"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { InventoryItem } from "@/services/inventoryService";
import { PixelButton } from "@/components/ui/PixelButton";
import { sounds } from "@/utils/sound";

export function InventoryView() {
  const { inventory, equipItem, useConsumable, character } = useGame();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => {
    return inventory[0]?.id || null;
  });

  // Dynamically derive selectedItem from live inventory to guarantee instant reactivity
  const selectedItem = inventory.find((i) => i.id === selectedItemId) || null;

  const TOTAL_SLOTS = 20;
  const currentLevel = character?.stats.level || 1;

  // Build full grid array (items + empty slots + locked slots)
  const gridSlots = Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
    const isLocked = index >= 16 && currentLevel < 5;
    const item = inventory[index] || null;
    return {
      index,
      item,
      isLocked,
      unlockLevel: 5,
    };
  });

  const rarityColors = {
    COMMON: "border-slate-500 text-slate-300",
    RARE: "border-sky-500 text-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.3)]",
    EPIC: "border-purple-500 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]",
    LEGENDARY: "border-amber-400 text-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
  };

  const handleSlotClick = (item: InventoryItem | null, isLocked: boolean) => {
    if (isLocked) {
      sounds.playClick();
      alert(`This compartment is sealed! Reach Level 5 to unlock.`);
      return;
    }
    sounds.playClick();
    setSelectedItemId(item ? item.id : null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Bag Header */}
      <div className="pixel-slab p-4 bg-slate-900/90 border-2 border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-xl text-yellow-400 flex items-center gap-2">
            <span>🎒</span> ADVENTURER'S INVENTORY
          </h2>
          <p className="font-body text-slate-300 text-lg">
            Manage your weapons, armor, relics, and consumables. Click any slot to inspect.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-pixel">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-300">
            SLOTS: <span className="text-yellow-400">{inventory.length}</span> / {TOTAL_SLOTS}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4x5 Pixel Grid (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="pixel-slab p-5 bg-slate-900/90 border-2 border-slate-700">
            <h3 className="font-pixel text-sm text-amber-300 mb-3 flex items-center gap-2">
              <span>🗄️</span> SATCHEL COMPARTMENTS
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {gridSlots.map((slot) => {
                const isSelected = selectedItem?.id === slot.item?.id;

                if (slot.isLocked) {
                  return (
                    <div
                      key={slot.index}
                      onClick={() => handleSlotClick(null, true)}
                      className="aspect-square bg-slate-950/80 border-2 border-red-900/60 flex flex-col items-center justify-center text-center cursor-not-allowed hover:bg-red-950/30 transition-colors p-1"
                    >
                      <span className="text-xl">🔒</span>
                      <span className="text-[9px] font-pixel text-red-400/80 mt-1">LVL {slot.unlockLevel}</span>
                    </div>
                  );
                }

                if (!slot.item) {
                  return (
                    <div
                      key={slot.index}
                      onClick={() => handleSlotClick(null, false)}
                      className="aspect-square bg-slate-950 border-2 border-slate-800/80 hover:border-slate-600 transition-colors cursor-pointer"
                    />
                  );
                }

                const rarityStyle = rarityColors[slot.item.rarity];

                return (
                  <div
                    key={slot.index}
                    onClick={() => handleSlotClick(slot.item, false)}
                    className={`aspect-square bg-slate-950 border-2 p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all relative ${rarityStyle} ${
                      isSelected ? "ring-2 ring-yellow-400 scale-105" : "hover:scale-102"
                    }`}
                  >
                    {/* Equipped Tag */}
                    {slot.item.isEquipped && (
                      <span className="absolute top-0.5 right-0.5 bg-amber-500 text-black font-pixel text-[8px] px-1 leading-tight">
                        EQ
                      </span>
                    )}

                    {/* Quantity for consumables */}
                    {(slot.item.quantity || 1) > 1 && (
                      <span className="absolute bottom-0.5 right-1 font-pixel text-[10px] text-white">
                        x{slot.item.quantity}
                      </span>
                    )}

                    <div className="text-2xl sm:text-3xl my-auto select-none">
                      {slot.item.icon}
                    </div>

                    <div className="text-[9px] font-pixel truncate w-full text-center text-slate-300">
                      {slot.item.name.split(" ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Item Inspector Dialogue Box (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="parchment-box p-6 h-full flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-4">
                {/* Item Header */}
                <div className="flex items-center gap-4 pb-3 border-b-2 border-amber-900/60">
                  <div className="w-16 h-16 bg-[#17110c] border-2 border-amber-600 flex items-center justify-center text-4xl shadow-md">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <h3 className="font-pixel text-base text-yellow-200 leading-snug">
                      {selectedItem.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-pixel text-amber-400 bg-amber-950 px-1.5 py-0.5 border border-amber-800">
                        {selectedItem.rarity}
                      </span>
                      <span className="text-[10px] font-pixel text-amber-300">
                        {selectedItem.type}
                      </span>
                      {selectedItem.isEquipped ? (
                        <span className="text-[10px] font-pixel text-emerald-300 bg-emerald-950 px-2 py-0.5 border border-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                          ✓ EQUIPPED
                        </span>
                      ) : (
                        <span className="text-[10px] font-pixel text-slate-400 bg-slate-900 px-2 py-0.5 border border-slate-700">
                          IN SATCHEL
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description & Lore */}
                <div className="space-y-2">
                  <p className="font-body text-yellow-100 text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <p className="font-body text-amber-300/80 italic text-base bg-[#17110c]/70 p-2.5 border-l-2 border-amber-700">
                    "{selectedItem.lore}"
                  </p>
                </div>

                {/* Stat Modifiers */}
                {selectedItem.stats && (
                  <div className="bg-[#17110c] p-3 border border-amber-800/80">
                    <div className="text-[10px] font-pixel text-amber-400 mb-1.5">ATTRIBUTE BONUSES:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-pixel text-emerald-400">
                      {selectedItem.stats.strength && <div>+ {selectedItem.stats.strength} STRENGTH</div>}
                      {selectedItem.stats.intelligence && <div>+ {selectedItem.stats.intelligence} INTELLECT</div>}
                      {selectedItem.stats.vitality && <div>+ {selectedItem.stats.vitality} VITALITY</div>}
                      {selectedItem.stats.discipline && <div>+ {selectedItem.stats.discipline} DISCIPLINE</div>}
                    </div>
                  </div>
                )}

                {/* Value */}
                <div className="text-xs font-pixel text-yellow-300 flex items-center gap-1">
                  <span>Merchant Resale Value:</span>
                  <span className="text-amber-400">🪙 {selectedItem.sellPrice}G</span>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t-2 border-amber-900/60 flex items-center gap-3">
                  {selectedItem.type === "CONSUMABLE" ? (
                    <PixelButton
                      variant="gold"
                      onClick={() => useConsumable(selectedItem.id)}
                      className="w-full text-xs py-2.5"
                    >
                      🧪 CONSUME / USE
                    </PixelButton>
                  ) : selectedItem.isEquipped ? (
                    <PixelButton
                      variant="danger"
                      onClick={() => equipItem(selectedItem.id)}
                      className="w-full text-xs py-2.5 shadow-md"
                    >
                      ✕ UNEQUIP GEAR
                    </PixelButton>
                  ) : (
                    <PixelButton
                      variant="gold"
                      onClick={() => equipItem(selectedItem.id)}
                      className="w-full text-xs py-2.5 shadow-md"
                    >
                      🛡️ EQUIP GEAR
                    </PixelButton>
                  )}
                </div>
              </div>
            ) : (
              /* No Item Selected */
              <div className="text-center my-auto py-12">
                <div className="text-5xl mb-4 opacity-50">🔍</div>
                <h4 className="font-pixel text-sm text-amber-300 mb-2">ITEM INSPECTION</h4>
                <p className="font-body text-amber-200/70 text-lg max-w-xs mx-auto">
                  Click upon any bag slot on the left to examine its magical attributes, lore, and actions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
