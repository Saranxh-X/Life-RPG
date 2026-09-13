"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CharacterService, CharacterData } from "@/services/characterService";
import { QuestService, Quest, QuestDifficulty, StatAttribute, QuestCategory } from "@/services/questService";
import { InventoryService, InventoryItem } from "@/services/inventoryService";
import { AchievementService, Achievement } from "@/services/achievementService";
import { ShopService, ShopItem } from "@/services/shopService";
import { sounds } from "@/utils/sound";

export interface FloatingRewardEvent {
  id: string;
  text: string;
  type: "xp" | "gold" | "streak";
  x?: number;
  y?: number;
}

interface GameContextType {
  // Character & Stats
  character: CharacterData | null;
  loading: boolean;
  allocateStatPoint: (attr: keyof CharacterData["attributes"]) => Promise<void>;

  // Quests
  quests: Quest[];
  completeQuest: (questId: string, eventPos?: { x: number; y: number }) => Promise<void>;
  createQuest: (questData: {
    title: string;
    description: string;
    difficulty: QuestDifficulty;
    attribute: StatAttribute;
    category: QuestCategory;
    xpReward: number;
    goldReward: number;
    dueDate?: string;
  }) => Promise<Quest>;
  deleteQuest: (questId: string) => Promise<void>;

  // Inventory
  inventory: InventoryItem[];
  equipItem: (itemId: string) => Promise<void>;
  useConsumable: (itemId: string) => Promise<void>;

  // Achievements
  achievements: Achievement[];
  claimAchievement: (achievementId: string) => Promise<void>;

  // Shop & Theme
  shopCatalog: ShopItem[];
  activeTheme: string;
  setTheme: (themeId: string) => void;
  purchaseItem: (itemId: string) => Promise<void>;

  // Level Up Modal State
  levelUpModal: {
    isOpen: boolean;
    level: number;
    pointsAwarded: number;
  };
  closeLevelUpModal: () => void;

  // Sound Engine
  soundEnabled: boolean;
  toggleSound: () => void;

  // Floating text rewards
  floatingRewards: FloatingRewardEvent[];
  removeFloatingReward: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [shopCatalog, setShopCatalog] = useState<ShopItem[]>([]);
  const [activeTheme, setActiveThemeState] = useState<string>("obsidian");
  const [loading, setLoading] = useState(true);

  // Sound state
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // Level Up Modal
  const [levelUpModal, setLevelUpModal] = useState<{
    isOpen: boolean;
    level: number;
    pointsAwarded: number;
  }>({
    isOpen: false,
    level: 1,
    pointsAwarded: 0,
  });

  // Floating rewards queue
  const [floatingRewards, setFloatingRewards] = useState<FloatingRewardEvent[]>([]);

  const addFloatingReward = useCallback((text: string, type: "xp" | "gold" | "streak", x?: number, y?: number) => {
    const id = `reward_${Date.now()}_${Math.random()}`;
    setFloatingRewards((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      removeFloatingReward(id);
    }, 1200);
  }, []);

  const removeFloatingReward = useCallback((id: string) => {
    setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Initialize data
  useEffect(() => {
    async function initGameData() {
      try {
        const [charData, questList, invList, achList, shopList] = await Promise.all([
          CharacterService.getCharacter(),
          QuestService.getQuests(),
          InventoryService.getInventory(),
          AchievementService.getAchievements(),
          ShopService.getShopCatalog(),
        ]);

        setCharacter(charData);
        setQuests(questList);
        setInventory(invList);
        setAchievements(achList);
        setShopCatalog(shopList);

        const currentTheme = ShopService.getActiveTheme();
        setActiveThemeState(currentTheme);
        ShopService.setActiveTheme(currentTheme);

        setSoundEnabledState(sounds.isEnabled());
      } catch (err) {
        console.error("Error loading dungeon data", err);
      } finally {
        setLoading(false);
      }
    }

    initGameData();
  }, []);

  const toggleSound = () => {
    const enabled = sounds.toggleSound();
    setSoundEnabledState(enabled);
  };

  const setTheme = (themeId: string) => {
    ShopService.setActiveTheme(themeId);
    setActiveThemeState(themeId);
    sounds.playBlip();
  };

  // Quest Completion with rewards & level check
  const completeQuest = async (questId: string, eventPos?: { x: number; y: number }) => {
    try {
      const { quest, newlyCompleted } = await QuestService.toggleComplete(questId);
      setQuests((prev) => prev.map((q) => (q.id === questId ? quest : q)));

      if (newlyCompleted) {
        sounds.playQuestComplete();
        setTimeout(() => sounds.playCoin(), 250);

        // Spawn floating rewards
        addFloatingReward(`+${quest.xpReward} XP`, "xp", eventPos?.x, eventPos?.y);
        setTimeout(() => {
          addFloatingReward(`+${quest.goldReward} GOLD`, "gold", eventPos?.x, eventPos?.y);
        }, 150);

        // Award to character
        const { data: updatedChar, didLevelUp, newLevel } = await CharacterService.addReward(
          quest.xpReward,
          quest.goldReward,
          quest.attribute
        );
        setCharacter(updatedChar);

        // Check if level up triggered
        if (didLevelUp) {
          setTimeout(() => {
            sounds.playLevelUp();
            setLevelUpModal({
              isOpen: true,
              level: newLevel,
              pointsAwarded: 2,
            });
          }, 600);
        }
      } else {
        sounds.playClick();
      }
    } catch (err) {
      console.error("Failed to complete quest:", err);
    }
  };

  const createQuest = async (questData: {
    title: string;
    description: string;
    difficulty: QuestDifficulty;
    attribute: StatAttribute;
    category: QuestCategory;
    xpReward: number;
    goldReward: number;
    dueDate?: string;
  }) => {
    sounds.playScroll();
    const newQuest = await QuestService.createQuest(questData);
    setQuests((prev) => [newQuest, ...prev]);
    return newQuest;
  };

  const deleteQuest = async (questId: string) => {
    sounds.playClick();
    await QuestService.deleteQuest(questId);
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const allocateStatPoint = async (attr: keyof CharacterData["attributes"]) => {
    if (!character || character.stats.unallocatedPoints <= 0) return;
    sounds.playEquip();
    const updated = await CharacterService.allocatePoint(attr);
    setCharacter(updated);
  };

  const equipItem = async (itemId: string) => {
    sounds.playEquip();
    const updatedInv = await InventoryService.equipItem(itemId);
    setInventory(updatedInv);

    const equippedItem = updatedInv.find((i) => i.id === itemId);
    if (equippedItem) {
      let slot: "weapon" | "armor" | "shield" | "relic" | null = null;
      if (equippedItem.type === "WEAPON") slot = "weapon";
      if (equippedItem.type === "ARMOR") slot = "armor";
      if (equippedItem.type === "SHIELD") slot = "shield";
      if (equippedItem.type === "RELIC") slot = "relic";

      if (slot) {
        const updatedChar = await CharacterService.updateEquipment(
          slot,
          equippedItem.isEquipped ? itemId : null
        );
        setCharacter(updatedChar);
        addFloatingReward(equippedItem.isEquipped ? "EQUIPPED" : "UNEQUIPPED", "streak");
      }
    }
  };

  const useConsumable = async (itemId: string) => {
    try {
      sounds.playEquip();
      const { items, usedItem } = await InventoryService.useConsumable(itemId);
      setInventory(items);

      // Handle specific effects
      if (usedItem.id === "elixir_vitality" && character) {
        addFloatingReward("+30 HP", "streak");
      } else if (usedItem.id === "coffee_haste" && character) {
        addFloatingReward("+4 DISCIPLINE", "streak");
      } else if (usedItem.id === "scroll_wisdom" && character) {
        const { data: updatedChar, didLevelUp, newLevel } = await CharacterService.addReward(100, 0);
        setCharacter(updatedChar);
        addFloatingReward("+100 XP", "xp");
        if (didLevelUp) {
          sounds.playLevelUp();
          setLevelUpModal({ isOpen: true, level: newLevel, pointsAwarded: 2 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const claimAchievement = async (achievementId: string) => {
    try {
      const { achievement } = await AchievementService.claimAchievement(achievementId);
      setAchievements((prev) => prev.map((a) => (a.id === achievementId ? achievement : a)));

      sounds.playLevelUp();
      addFloatingReward(`+${achievement.xpReward} XP`, "xp");
      setTimeout(() => addFloatingReward(`+${achievement.goldReward} GOLD`, "gold"), 200);

      const { data: updatedChar, didLevelUp, newLevel } = await CharacterService.addReward(
        achievement.xpReward,
        achievement.goldReward
      );
      setCharacter(updatedChar);

      if (didLevelUp) {
        setLevelUpModal({ isOpen: true, level: newLevel, pointsAwarded: 2 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const purchaseItem = async (itemId: string) => {
    const item = shopCatalog.find((i) => i.id === itemId);
    if (!item || !character) return;

    if (character.stats.gold < item.price) {
      sounds.playClick();
      alert("Not enough gold in your coin pouch!");
      return;
    }

    try {
      sounds.playPurchase();
      const updatedChar = await CharacterService.deductGold(item.price);
      setCharacter(updatedChar);

      const purchasedItem = await ShopService.purchaseItem(itemId);
      setShopCatalog((prev) => prev.map((i) => (i.id === itemId ? purchasedItem : i)));

      // If theme, apply immediately
      if (item.themeId) {
        setTheme(item.themeId);
      }

      // If item delivers to inventory
      if (item.inventoryItem) {
        const updatedInv = await InventoryService.addItem(item.inventoryItem);
        setInventory(updatedInv);
      }

      addFloatingReward(`-${item.price} GOLD`, "gold");
    } catch (err) {
      console.error(err);
    }
  };

  const closeLevelUpModal = () => {
    sounds.playClick();
    setLevelUpModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <GameContext.Provider
      value={{
        character,
        loading,
        allocateStatPoint,
        quests,
        completeQuest,
        createQuest,
        deleteQuest,
        inventory,
        equipItem,
        useConsumable,
        achievements,
        claimAchievement,
        shopCatalog,
        activeTheme,
        setTheme,
        purchaseItem,
        levelUpModal,
        closeLevelUpModal,
        soundEnabled,
        toggleSound,
        floatingRewards,
        removeFloatingReward,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
