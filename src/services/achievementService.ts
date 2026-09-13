// Achievement Service - RPG Badges, Feats of Valor, and Rewards
import { ApiClient, API_CONFIG } from "./apiClient";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "COMBAT" | "MASTERY" | "WEALTH" | "DEDICATION";
  icon: string;
  currentProgress: number;
  maxProgress: number;
  xpReward: number;
  goldReward: number;
  unlocked: boolean;
  claimed: boolean;
}

const STORAGE_ACHIEVEMENTS_KEY = "life_rpg_achievements";

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    title: "First Blood",
    description: "Complete your very first quest bounty in the realm.",
    category: "COMBAT",
    icon: "🗡️",
    currentProgress: 1,
    maxProgress: 1,
    xpReward: 50,
    goldReward: 25,
    unlocked: true,
    claimed: true,
  },
  {
    id: "dungeon_crawler",
    title: "Dungeon Crawler",
    description: "Slay 5 active quest bounties.",
    category: "COMBAT",
    icon: "🏰",
    currentProgress: 3,
    maxProgress: 5,
    xpReward: 100,
    goldReward: 50,
    unlocked: false,
    claimed: false,
  },
  {
    id: "streak_flame",
    title: "Eternal Hearth",
    description: "Keep the flame alive with a 7-day streak.",
    category: "DEDICATION",
    icon: "🔥",
    currentProgress: 4,
    maxProgress: 7,
    xpReward: 150,
    goldReward: 80,
    unlocked: false,
    claimed: false,
  },
  {
    id: "mind_over_matter",
    title: "Mind Over Matter",
    description: "Raise Intelligence attribute to Rank 20.",
    category: "MASTERY",
    icon: "🔮",
    currentProgress: 18,
    maxProgress: 20,
    xpReward: 120,
    goldReward: 60,
    unlocked: false,
    claimed: false,
  },
  {
    id: "iron_will",
    title: "Iron Will",
    description: "Raise Discipline attribute to Rank 20.",
    category: "MASTERY",
    icon: "⚡",
    currentProgress: 16,
    maxProgress: 20,
    xpReward: 120,
    goldReward: 60,
    unlocked: false,
    claimed: false,
  },
  {
    id: "boss_slayer",
    title: "Legendary Executioner",
    description: "Conquer a Boss-tier quest difficulty.",
    category: "COMBAT",
    icon: "👑",
    currentProgress: 0,
    maxProgress: 1,
    xpReward: 200,
    goldReward: 120,
    unlocked: false,
    claimed: false,
  },
  {
    id: "hoarder",
    title: "Midas Touch",
    description: "Amass a fortune of 500 gold coins.",
    category: "WEALTH",
    icon: "💰",
    currentProgress: 245,
    maxProgress: 500,
    xpReward: 100,
    goldReward: 75,
    unlocked: false,
    claimed: false,
  },
  {
    id: "centurion",
    title: "Realm Centurion",
    description: "Complete 100 total quests across your adventure.",
    category: "DEDICATION",
    icon: "🛡️",
    currentProgress: 8,
    maxProgress: 100,
    xpReward: 500,
    goldReward: 300,
    unlocked: false,
    claimed: false,
  },
  {
    id: "early_riser",
    title: "Dawn Sentinel",
    description: "Conquer a daily bounty before the clock strikes 08:00.",
    category: "DEDICATION",
    icon: "🌅",
    currentProgress: 1,
    maxProgress: 1,
    xpReward: 80,
    goldReward: 40,
    unlocked: true,
    claimed: false,
  },
];

export class AchievementService {
  public static async getAchievements(): Promise<Achievement[]> {
    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<Achievement[]>("/achievements");
    }

    if (typeof window === "undefined") return INITIAL_ACHIEVEMENTS;

    const stored = localStorage.getItem(STORAGE_ACHIEVEMENTS_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public static async claimAchievement(id: string): Promise<{ achievement: Achievement }> {
    const list = await this.getAchievements();
    const target = list.find((a) => a.id === id);
    if (!target) throw new Error("Achievement not found");
    if (!target.unlocked) throw new Error("Achievement not unlocked yet");
    if (target.claimed) throw new Error("Reward already claimed");

    const updated = list.map((a) => (a.id === id ? { ...a, claimed: true } : a));
    localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(updated));
    return { achievement: { ...target, claimed: true } };
  }
}
