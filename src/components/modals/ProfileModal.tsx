"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";
import { getHeroNameCooldown } from "@/services/authService";
import { sounds } from "@/utils/sound";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCharacter?: () => void;
  onNavigateToQuests?: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  onNavigateToCharacter,
  onNavigateToQuests,
}: ProfileModalProps) {
  const { user, changeHeroName } = useAuth();
  const { character, quests } = useGame();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");
  const [savingName, setSavingName] = useState(false);

  if (!isOpen) return null;

  const completedQuests = quests.filter((q) => q.completed);
  const totalQuests = quests.length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  const cooldown = getHeroNameCooldown(user?.lastNameChangeDate);

  const handleStartEdit = () => {
    sounds.playClick();
    if (!cooldown.allowed) {
      setNameError(`Rename sealed! Next available in ${cooldown.daysRemaining}d ${cooldown.hoursRemaining}h.`);
      return;
    }
    setNameInput(user?.name || "");
    setNameError("");
    setNameSuccess("");
    setIsEditingName(true);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");

    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setNameError("Hero name must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 25) {
      setNameError("Hero name cannot exceed 25 characters.");
      return;
    }

    try {
      setSavingName(true);
      await changeHeroName(trimmed);
      setNameSuccess("Hero moniker inscribed! Next rename available in 3 days.");
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(""), 4000);
    } catch (err: unknown) {
      setNameError(err instanceof Error ? err.message : "Failed to change name");
    } finally {
      setSavingName(false);
    }
  };

  const classIcons: Record<string, string> = {
    WARRIOR: "🛡️",
    MAGE: "🔮",
    PALADIN: "✨",
    ROGUE: "🗡️",
  };

  const heroIcon = user ? classIcons[user.heroClass] || "⚔️" : "⚔️";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto select-none">
      {/* 16-Bit Profile Modal Card */}
      <div className="pixel-slab-gold w-full max-w-lg p-6 sm:p-7 my-8 bg-slate-950/95 border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.4)] relative">
        
        {/* Close Corner Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-yellow-400 font-pixel text-base px-2 py-1 bg-slate-900 border border-slate-700 active:scale-95 transition-all"
          title="Close Profile"
        >
          ✕
        </button>

        {/* Modal Header: Avatar, Name & Level */}
        <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-800">
          {/* Avatar Frame */}
          <div className="relative">
            <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-950 to-slate-900 border-4 border-amber-500 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {heroIcon}
            </div>
            <div className="absolute -bottom-2 -right-1 bg-amber-600 border-2 border-black px-2 py-0.5 text-xs font-pixel text-yellow-200">
              LVL {character?.stats.level || 1}
            </div>
          </div>

          {/* Hero Identification */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-pixel text-amber-400">
              DUNGEON ADVENTURER DOSSIER
            </div>

            {!isEditingName ? (
              <div className="mt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-pixel text-xl sm:text-2xl text-yellow-300 leading-tight truncate">
                    {user?.name || "HERO OF THE REALM"}
                  </h2>

                  {cooldown.allowed ? (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="font-pixel text-[10px] text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 px-2 py-0.5 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                      title="Rename Hero (Once per 3 days)"
                    >
                      <span>✏️</span> RENAME
                    </button>
                  ) : (
                    <div
                      className="font-pixel text-[9px] text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 flex items-center gap-1"
                      title={`Name change sealed! Ready in ${cooldown.daysRemaining}d ${cooldown.hoursRemaining}h`}
                    >
                      <span>⏳</span> {cooldown.daysRemaining}D {cooldown.hoursRemaining}H COOLDOWN
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="font-pixel text-[11px] text-amber-200 bg-amber-950/80 border border-amber-600 px-2 py-0.5">
                    {user?.title || "Dungeon Initiate"}
                  </span>
                  <span className="font-pixel text-[11px] text-purple-300 bg-purple-950/80 border border-purple-700 px-2 py-0.5">
                    {user?.heroClass || "WARRIOR"}
                  </span>
                  {user?.lastNameChangeDate && (
                    <span className="font-body text-xs text-slate-400">
                      (Renamed: {new Date(user.lastNameChangeDate).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Inline Rename Form */
              <form onSubmit={handleSaveName} className="mt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={25}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter new hero moniker"
                    className="w-full bg-[#18110b] border-2 border-amber-600 px-2.5 py-1 text-sm font-pixel text-yellow-200 outline-none focus:border-yellow-400 placeholder-amber-800"
                    autoFocus
                  />
                  <PixelButton
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={savingName}
                    className="text-xs px-3 py-1 whitespace-nowrap"
                  >
                    {savingName ? "..." : "SEAL"}
                  </PixelButton>
                  <PixelButton
                    type="button"
                    variant="stone"
                    size="sm"
                    onClick={() => {
                      sounds.playClick();
                      setIsEditingName(false);
                      setNameError("");
                    }}
                    className="text-xs px-2.5 py-1"
                  >
                    ✕
                  </PixelButton>
                </div>
                <div className="text-[10px] font-pixel text-amber-400/90 leading-tight">
                  📜 Monikers may only be rechristened once every 3 days.
                </div>
              </form>
            )}

            {/* Success & Error alerts */}
            {nameSuccess && (
              <div className="mt-2 p-1.5 bg-emerald-950/90 border border-emerald-600 text-emerald-300 font-pixel text-[10px]">
                ✓ {nameSuccess}
              </div>
            )}
            {nameError && (
              <div className="mt-2 p-1.5 bg-red-950/90 border border-red-700 text-red-300 font-pixel text-[10px]">
                ⚠️ {nameError}
              </div>
            )}
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="my-4 bg-slate-900/90 p-3.5 border-2 border-slate-800">
          <div className="flex justify-between items-center text-xs font-pixel mb-1.5 text-slate-300">
            <span className="text-yellow-400">HERO LEVEL {character?.stats.level || 1}</span>
            <span className="text-emerald-400">
              {character?.stats.currentXp || 0} / {character?.stats.maxXp || 100} XP
            </span>
          </div>
          <PixelProgressBar
            current={character?.stats.currentXp || 0}
            max={character?.stats.maxXp || 100}
            variant="xp"
            height="h-4"
            showValues={false}
          />
        </div>

        {/* Core Stats / Wallet Overview */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center font-pixel text-xs">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <div className="text-amber-400 text-sm">🪙 {character?.stats.gold ?? 0}G</div>
            <div className="text-[10px] text-slate-400 mt-0.5">GOLD COINS</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <div className="text-rose-400 text-sm">🔥 {character?.stats.streak ?? 0} DAYS</div>
            <div className="text-[10px] text-slate-400 mt-0.5">STREAK FLAME</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <div className="text-emerald-400 text-sm">✓ {completedQuests.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">TASKS DONE</div>
          </div>
        </div>

        {/* Tasks Completed Section (Requested by User) */}
        <div className="parchment-box p-4 mb-5">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-amber-900/80">
            <div className="font-pixel text-xs text-amber-300 flex items-center gap-1.5">
              <span>📜</span> CONQUERED TASKS & BOUNTIES ({completedQuests.length})
            </div>
            <div className="font-pixel text-[10px] text-amber-400">
              {completionRate}% CLEAR RATE
            </div>
          </div>

          {completedQuests.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {completedQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="bg-[#18110b] border border-amber-900/80 p-2.5 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-emerald-400 text-sm font-pixel shrink-0">✓</span>
                    <div className="min-w-0">
                      <div className="font-pixel text-xs text-yellow-200 truncate">
                        {quest.title}
                      </div>
                      <div className="font-body text-xs text-amber-300/70 truncate">
                        {quest.attribute} • {quest.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-pixel text-[10px] text-emerald-400">
                      +{quest.xpReward} XP
                    </div>
                    <div className="font-pixel text-[10px] text-yellow-400">
                      +{quest.goldReward}G
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-amber-200/70">
              <div className="text-3xl mb-1">⚔️</div>
              <p className="font-body text-base">
                No bounties conquered yet. Accept a quest from the board and claim your glory!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {onNavigateToQuests && (
            <PixelButton
              variant="magic"
              size="sm"
              onClick={() => {
                onClose();
                onNavigateToQuests();
              }}
              className="text-xs py-2 flex-1"
            >
              ⚔️ VIEW QUESTS
            </PixelButton>
          )}

          {onNavigateToCharacter && (
            <PixelButton
              variant="gold"
              size="sm"
              onClick={() => {
                onClose();
                onNavigateToCharacter();
              }}
              className="text-xs py-2 flex-1"
            >
              👤 HERO STATS
            </PixelButton>
          )}

          <PixelButton
            variant="stone"
            size="sm"
            onClick={onClose}
            className="text-xs py-2 px-4"
          >
            DISMISS
          </PixelButton>
        </div>

      </div>
    </div>
  );
}
