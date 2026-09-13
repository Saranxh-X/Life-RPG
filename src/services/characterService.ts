// Character Service - Manages stats, leveling progression, equipment, and attribute points
import { ApiClient, API_CONFIG } from "./apiClient";
import { StatAttribute } from "./questService";

export interface CharacterStats {
  level: number;
  currentXp: number;
  maxXp: number;
  gold: number;
  streak: number;
  unallocatedPoints: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

export interface CharacterAttributes {
  strength: number;
  intelligence: number;
  vitality: number;
  discipline: number;
}

export interface EquippedGear {
  weapon: string | null;
  armor: string | null;
  shield: string | null;
  relic: string | null;
}

export interface CharacterData {
  stats: CharacterStats;
  attributes: CharacterAttributes;
  equipment: EquippedGear;
}

const STORAGE_CHARACTER_KEY = "life_rpg_character_data";

export const DEFAULT_CHARACTER: CharacterData = {
  stats: {
    level: 3,
    currentXp: 140,
    maxXp: 350,
    gold: 245,
    streak: 4,
    unallocatedPoints: 2,
    health: 120,
    maxHealth: 120,
    mana: 85,
    maxMana: 85,
  },
  attributes: {
    strength: 14,
    intelligence: 18,
    vitality: 12,
    discipline: 16,
  },
  equipment: {
    weapon: "iron_sword",
    armor: "leather_cuirass",
    shield: "wooden_buckler",
    relic: "amulet_of_focus",
  },
};

export class CharacterService {
  public static calculateMaxXp(level: number): number {
    return level * 100 + 50;
  }

  public static async getCharacter(): Promise<CharacterData> {
    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<CharacterData>("/character");
    }

    if (typeof window === "undefined") return DEFAULT_CHARACTER;

    const stored = localStorage.getItem(STORAGE_CHARACTER_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(DEFAULT_CHARACTER));
      return DEFAULT_CHARACTER;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CHARACTER;
    }
  }

  public static async addReward(
    xp: number,
    gold: number,
    attribute?: StatAttribute
  ): Promise<{ data: CharacterData; didLevelUp: boolean; newLevel: number }> {
    await ApiClient.simulateDelay(100);

    const current = await this.getCharacter();
    let { level, currentXp, unallocatedPoints } = current.stats;
    let didLevelUp = false;
    let maxXp = this.calculateMaxXp(level);

    let totalXp = currentXp + xp;

    while (totalXp >= maxXp) {
      totalXp -= maxXp;
      level += 1;
      unallocatedPoints += 2;
      didLevelUp = true;
      maxXp = this.calculateMaxXp(level);
    }

    const updatedAttributes = { ...current.attributes };
    if (attribute) {
      const key = attribute.toLowerCase() as keyof CharacterAttributes;
      if (updatedAttributes[key] !== undefined) {
        updatedAttributes[key] += 1;
      }
    }

    const updatedData: CharacterData = {
      ...current,
      stats: {
        ...current.stats,
        level,
        currentXp: totalXp,
        maxXp,
        gold: current.stats.gold + gold,
        unallocatedPoints,
        maxHealth: 100 + updatedAttributes.vitality * 5,
        health: 100 + updatedAttributes.vitality * 5,
        maxMana: 50 + updatedAttributes.intelligence * 5,
        mana: 50 + updatedAttributes.intelligence * 5,
      },
      attributes: updatedAttributes,
    };

    localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(updatedData));
    return { data: updatedData, didLevelUp, newLevel: level };
  }

  public static async allocatePoint(attr: keyof CharacterAttributes): Promise<CharacterData> {
    await ApiClient.simulateDelay(100);

    const current = await this.getCharacter();
    if (current.stats.unallocatedPoints <= 0) {
      throw new Error("No stat points available");
    }

    const updated: CharacterData = {
      ...current,
      stats: {
        ...current.stats,
        unallocatedPoints: current.stats.unallocatedPoints - 1,
      },
      attributes: {
        ...current.attributes,
        [attr]: current.attributes[attr] + 1,
      },
    };

    localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(updated));
    return updated;
  }

  public static async updateEquipment(slot: keyof EquippedGear, itemId: string | null): Promise<CharacterData> {
    const current = await this.getCharacter();
    const updated: CharacterData = {
      ...current,
      equipment: {
        ...current.equipment,
        [slot]: itemId,
      },
    };

    localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(updated));
    return updated;
  }

  public static async deductGold(amount: number): Promise<CharacterData> {
    const current = await this.getCharacter();
    if (current.stats.gold < amount) {
      throw new Error("Not enough gold in your pouch!");
    }

    const updated: CharacterData = {
      ...current,
      stats: {
        ...current.stats,
        gold: current.stats.gold - amount,
      },
    };

    localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(updated));
    return updated;
  }
}
