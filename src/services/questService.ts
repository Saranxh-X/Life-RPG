// Quest Service - Quest management, bounties, and rewards
import { ApiClient, API_CONFIG } from "./apiClient";

export type QuestDifficulty = "EASY" | "MEDIUM" | "HARD" | "BOSS";
export type StatAttribute = "STRENGTH" | "INTELLIGENCE" | "VITALITY" | "DISCIPLINE";
export type QuestCategory = "DAILY" | "EPIC" | "HABIT" | "BOSS";

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  attribute: StatAttribute;
  category: QuestCategory;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  repeatable?: boolean;
}

const STORAGE_QUESTS_KEY = "life_rpg_quests";

export const INITIAL_QUESTS: Quest[] = [
  {
    id: "q-1",
    title: "Slay the Morning Sloth",
    description: "Rise before the tavern roosters call and complete a 20-minute bodyweight trial.",
    difficulty: "EASY",
    attribute: "STRENGTH",
    category: "DAILY",
    xpReward: 40,
    goldReward: 20,
    completed: false,
    dueDate: "Today",
  },
  {
    id: "q-2",
    title: "Tome of Forbidden Knowledge",
    description: "Delve into ancient texts for 45 minutes of uninterrupted deep reading or coding.",
    difficulty: "MEDIUM",
    attribute: "INTELLIGENCE",
    category: "DAILY",
    xpReward: 75,
    goldReward: 35,
    completed: false,
    dueDate: "Today",
  },
  {
    id: "q-3",
    title: "The Elixir of Hydration",
    description: "Consume 8 vials of pure mountain water throughout the solar cycle.",
    difficulty: "EASY",
    attribute: "VITALITY",
    category: "HABIT",
    xpReward: 30,
    goldReward: 15,
    completed: false,
  },
  {
    id: "q-4",
    title: "Vanquish the Siren of Distraction",
    description: "Work with crystal focus for 2 consecutive Pomodoro cycles with all scrying orbs silenced.",
    difficulty: "HARD",
    attribute: "DISCIPLINE",
    category: "EPIC",
    xpReward: 120,
    goldReward: 60,
    completed: false,
    dueDate: "Tomorrow",
  },
  {
    id: "q-5",
    title: "Gorgon of the Unfiled Scrolls (BOSS)",
    description: "Conquer the mountainous backlog of taxes, emails, and pending bureaucratic scrolls.",
    difficulty: "BOSS",
    attribute: "DISCIPLINE",
    category: "BOSS",
    xpReward: 250,
    goldReward: 150,
    completed: false,
    dueDate: "This Week",
  },
  {
    id: "q-6",
    title: "Sanctum Cleansing Ritual",
    description: "Vanquish dust bunnies and organize the warrior's chamber desk completely.",
    difficulty: "EASY",
    attribute: "VITALITY",
    category: "DAILY",
    xpReward: 50,
    goldReward: 25,
    completed: true,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export class QuestService {
  public static async getQuests(): Promise<Quest[]> {
    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<Quest[]>("/quests");
    }

    if (typeof window === "undefined") return INITIAL_QUESTS;

    const stored = localStorage.getItem(STORAGE_QUESTS_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(INITIAL_QUESTS));
      return INITIAL_QUESTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_QUESTS;
    }
  }

  public static async createQuest(questData: Omit<Quest, "id" | "completed" | "completedAt">): Promise<Quest> {
    await ApiClient.simulateDelay(250);

    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<Quest>("/quests", {
        method: "POST",
        body: JSON.stringify(questData),
      });
    }

    const current = await this.getQuests();
    const newQuest: Quest = {
      ...questData,
      id: `quest_${Date.now()}`,
      completed: false,
    };

    const updated = [newQuest, ...current];
    localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(updated));
    return newQuest;
  }

  public static async toggleComplete(questId: string): Promise<{ quest: Quest; newlyCompleted: boolean }> {
    await ApiClient.simulateDelay(150);

    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<{ quest: Quest; newlyCompleted: boolean }>(`/quests/${questId}/complete`, {
        method: "PATCH",
      });
    }

    const current = await this.getQuests();
    let newlyCompleted = false;
    let targetQuest: Quest | null = null;

    const updated = current.map((q) => {
      if (q.id === questId) {
        const willBeComplete = !q.completed;
        newlyCompleted = willBeComplete;
        targetQuest = {
          ...q,
          completed: willBeComplete,
          completedAt: willBeComplete ? new Date().toISOString() : undefined,
        };
        return targetQuest;
      }
      return q;
    });

    if (!targetQuest) throw new Error("Quest not found");

    localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(updated));
    return { quest: targetQuest, newlyCompleted };
  }

  public static async deleteQuest(questId: string): Promise<void> {
    await ApiClient.simulateDelay(150);

    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request(`/quests/${questId}`, {
        method: "DELETE",
      });
    }

    const current = await this.getQuests();
    const updated = current.filter((q) => q.id !== questId);
    localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(updated));
  }
}
