"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";

export function CharacterView() {
  const { user } = useAuth();
  const { character, allocateStatPoint, inventory } = useGame();

  if (!character) return null;

  const { stats, attributes, equipment } = character;

  // Find equipped items
  const equippedWeapon = inventory.find((i) => i.id === equipment.weapon);
  const equippedArmor = inventory.find((i) => i.id === equipment.armor);
  const equippedShield = inventory.find((i) => i.id === equipment.shield);
  const equippedRelic = inventory.find((i) => i.id === equipment.relic);

  const statConfigs = [
    {
      key: "strength" as const,
      name: "STRENGTH",
      icon: "⚔️",
      value: attributes.strength,
      color: "bg-red-600",
      desc: "Powers physical fitness, workouts, and energy levels.",
    },
    {
      key: "intelligence" as const,
      name: "INTELLIGENCE",
      icon: "🔮",
      value: attributes.intelligence,
      color: "bg-indigo-600",
      desc: "Governs deep focus, reading, programming, and learning capacity.",
    },
    {
      key: "vitality" as const,
      name: "VITALITY",
      icon: "🛡️",
      value: attributes.vitality,
      color: "bg-emerald-600",
      desc: "Fortifies sleep quality, hydration, nutrition, and health pool.",
    },
    {
      key: "discipline" as const,
      name: "DISCIPLINE",
      icon: "⚡",
      value: attributes.discipline,
      color: "bg-amber-600",
      desc: "Bolsters daily habit streaks, time management, and willpower.",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Hero Header Overview */}
      <div className="pixel-slab p-6 bg-slate-900/90 border-2 border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-slate-950 border-4 border-amber-500 flex items-center justify-center text-4xl shadow-[0_0_16px_rgba(245,158,11,0.3)]">
              {user?.heroClass === "WARRIOR" && "🛡️"}
              {user?.heroClass === "MAGE" && "🔮"}
              {user?.heroClass === "PALADIN" && "✨"}
              {user?.heroClass === "ROGUE" && "🗡️"}
              {!user && "⚔️"}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-pixel text-xl sm:text-2xl text-yellow-400">
                  {user?.name || "HERO"}
                </h2>
                <span className="font-pixel text-xs bg-amber-950/80 border border-amber-600 text-yellow-200 px-2 py-0.5">
                  LEVEL {stats.level}
                </span>
              </div>
              <p className="font-pixel text-xs text-amber-300/80 mt-1">
                {user?.title || "Dungeon Initiate"} • {user?.heroClass || "WARRIOR"}
              </p>
              <p className="font-body text-slate-300 text-base mt-1">
                Adventure started: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Vitals: HP & Mana Bars */}
          <div className="w-full md:w-72 space-y-3">
            <PixelProgressBar
              current={stats.health}
              max={stats.maxHealth}
              variant="hp"
              label="HEALTH POINTS (HP)"
              height="h-4"
            />
            <PixelProgressBar
              current={stats.mana}
              max={stats.maxMana}
              variant="mana"
              label="MANA POOL (MP)"
              height="h-4"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: 4 Core RPG Stats (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pixel-slab p-5 bg-slate-900/90 border-2 border-slate-700">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-800">
              <div>
                <h3 className="font-pixel text-base text-yellow-400 flex items-center gap-2">
                  <span>📊</span> ATTRIBUTE METERS
                </h3>
                <p className="font-body text-slate-300 text-base">
                  Completing affinity bounties or leveling up builds your stats.
                </p>
              </div>

              {/* Unallocated Points Badge */}
              {stats.unallocatedPoints > 0 && (
                <div className="font-pixel text-xs bg-amber-500 text-black px-2.5 py-1 animate-pulse border border-black shadow-md">
                  +{stats.unallocatedPoints} POINT{stats.unallocatedPoints > 1 ? "S" : ""} READY
                </div>
              )}
            </div>

            {/* Stat Bars List */}
            <div className="space-y-4">
              {statConfigs.map((st) => {
                const maxDisplay = 50; // Cap visual reference
                return (
                  <div key={st.key} className="bg-slate-950/80 p-3.5 border-2 border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{st.icon}</span>
                        <span className="font-pixel text-xs sm:text-sm text-slate-200">
                          {st.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-pixel text-sm sm:text-base text-yellow-400 font-bold">
                          RANK {st.value}
                        </span>

                        {stats.unallocatedPoints > 0 && (
                          <PixelButton
                            size="sm"
                            variant="gold"
                            onClick={() => allocateStatPoint(st.key)}
                            className="px-2 py-0.5 text-xs font-pixel"
                            title="Upgrade attribute"
                          >
                            +1
                          </PixelButton>
                        )}
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="pixel-bar-container h-4 w-full">
                      <div
                        className={`pixel-bar-fill ${st.color}`}
                        style={{ width: `${Math.min(100, (st.value / maxDisplay) * 100)}%` }}
                      />
                    </div>

                    <p className="font-body text-slate-400 text-sm mt-1.5 leading-snug">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Equipment Paperdoll (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pixel-slab p-5 bg-slate-900/90 border-2 border-slate-700">
            <h3 className="font-pixel text-base text-yellow-400 flex items-center gap-2 mb-2 pb-2 border-b-2 border-slate-800">
              <span>🛡️</span> HERO PAPERDOLL & GEAR
            </h3>
            <p className="font-body text-slate-300 text-base mb-4">
              Equip weapons, armor, and relics from your Bag to gain bonuses.
            </p>

            <div className="space-y-3">
              {/* Weapon Slot */}
              <div className="flex items-center gap-3 p-3 bg-slate-950 border-2 border-slate-800">
                <div className="w-12 h-12 bg-slate-900 border-2 border-amber-600/70 flex items-center justify-center text-2xl">
                  {equippedWeapon ? equippedWeapon.icon : "⚔️"}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-pixel text-slate-400">MAIN HAND WEAPON</div>
                  <div className="font-pixel text-xs text-yellow-300">
                    {equippedWeapon ? equippedWeapon.name : "None Equipped"}
                  </div>
                  {equippedWeapon?.stats && (
                    <div className="text-[11px] font-pixel text-emerald-400">
                      {equippedWeapon.stats.strength && `+${equippedWeapon.stats.strength} STR `}
                      {equippedWeapon.stats.discipline && `+${equippedWeapon.stats.discipline} DISC`}
                    </div>
                  )}
                </div>
              </div>

              {/* Armor Slot */}
              <div className="flex items-center gap-3 p-3 bg-slate-950 border-2 border-slate-800">
                <div className="w-12 h-12 bg-slate-900 border-2 border-amber-600/70 flex items-center justify-center text-2xl">
                  {equippedArmor ? equippedArmor.icon : "🛡️"}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-pixel text-slate-400">CHEST ARMOR</div>
                  <div className="font-pixel text-xs text-yellow-300">
                    {equippedArmor ? equippedArmor.name : "None Equipped"}
                  </div>
                  {equippedArmor?.stats && (
                    <div className="text-[11px] font-pixel text-emerald-400">
                      {equippedArmor.stats.vitality && `+${equippedArmor.stats.vitality} VIT `}
                      {equippedArmor.stats.discipline && `+${equippedArmor.stats.discipline} DISC`}
                    </div>
                  )}
                </div>
              </div>

              {/* Shield Slot */}
              <div className="flex items-center gap-3 p-3 bg-slate-950 border-2 border-slate-800">
                <div className="w-12 h-12 bg-slate-900 border-2 border-amber-600/70 flex items-center justify-center text-2xl">
                  {equippedShield ? equippedShield.icon : "🪵"}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-pixel text-slate-400">OFF-HAND SHIELD</div>
                  <div className="font-pixel text-xs text-yellow-300">
                    {equippedShield ? equippedShield.name : "None Equipped"}
                  </div>
                  {equippedShield?.stats && (
                    <div className="text-[11px] font-pixel text-emerald-400">
                      {equippedShield.stats.vitality && `+${equippedShield.stats.vitality} VIT`}
                    </div>
                  )}
                </div>
              </div>

              {/* Relic Slot */}
              <div className="flex items-center gap-3 p-3 bg-slate-950 border-2 border-slate-800">
                <div className="w-12 h-12 bg-slate-900 border-2 border-purple-600/70 flex items-center justify-center text-2xl">
                  {equippedRelic ? equippedRelic.icon : "🧿"}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-pixel text-slate-400">ARCANE RELIC</div>
                  <div className="font-pixel text-xs text-purple-300">
                    {equippedRelic ? equippedRelic.name : "None Equipped"}
                  </div>
                  {equippedRelic?.stats && (
                    <div className="text-[11px] font-pixel text-purple-400">
                      {equippedRelic.stats.intelligence && `+${equippedRelic.stats.intelligence} INT `}
                      {equippedRelic.stats.discipline && `+${equippedRelic.stats.discipline} DISC`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
