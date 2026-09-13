// Auth Service - Handles authentication, character creation, and guest hero demo
import { ApiClient, API_CONFIG } from "./apiClient";

export type HeroClass = "WARRIOR" | "MAGE" | "PALADIN" | "ROGUE";

export interface HeroProfile {
  id: string;
  name: string;
  email: string;
  heroClass: HeroClass;
  title: string;
  avatarUrl?: string;
  createdAt: string;
  lastNameChangeDate?: string;
}

export const NAME_CHANGE_COOLDOWN_DAYS = 3;
export const NAME_CHANGE_COOLDOWN_MS = NAME_CHANGE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export function getHeroNameCooldown(lastNameChangeDate?: string): {
  allowed: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  nextAvailableDate?: Date;
} {
  if (!lastNameChangeDate) {
    return { allowed: true, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
  }

  const lastChange = new Date(lastNameChangeDate).getTime();
  const nextAvailable = lastChange + NAME_CHANGE_COOLDOWN_MS;
  const now = Date.now();

  if (now >= nextAvailable) {
    return { allowed: true, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
  }

  const diffMs = nextAvailable - now;
  const daysRemaining = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hoursRemaining = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutesRemaining = Math.ceil((diffMs % (60 * 60 * 1000)) / (60 * 1000));

  return {
    allowed: false,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    nextAvailableDate: new Date(nextAvailable),
  };
}

const STORAGE_USER_KEY = "life_rpg_hero_profile";

const DEFAULT_DEMO_HERO: HeroProfile = {
  id: "hero-retro-001",
  name: "Geralt the Persistent",
  email: "hero@dungeon.realm",
  heroClass: "WARRIOR",
  title: "Novice Dungeon Crawler",
  createdAt: new Date().toISOString(),
};

export class AuthService {
  public static async getCurrentUser(): Promise<HeroProfile | null> {
    if (typeof window === "undefined") return null;

    if (!API_CONFIG.USE_MOCK) {
      try {
        return await ApiClient.request<HeroProfile>("/auth/me");
      } catch {
        return null;
      }
    }

    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  public static async login(email: string, password?: string): Promise<{ user: HeroProfile; token: string }> {
    await ApiClient.simulateDelay(400);

    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    }

    // Mock Login
    let user: HeroProfile;
    const existing = localStorage.getItem(STORAGE_USER_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      user = { ...parsed, email };
    } else {
      user = {
        id: `hero_${Date.now()}`,
        name: email.split("@")[0].toUpperCase() || "HERO",
        email,
        heroClass: "WARRIOR",
        title: "Dungeon Initiate",
        createdAt: new Date().toISOString(),
      };
    }

    const mockToken = `mock_jwt_dungeon_${Date.now()}`;
    ApiClient.setToken(mockToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return { user, token: mockToken };
  }

  public static async register(
    name: string,
    email: string,
    heroClass: HeroClass,
    password?: string
  ): Promise<{ user: HeroProfile; token: string }> {
    await ApiClient.simulateDelay(500);

    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, heroClass, password }),
      });
    }

    const classTitles: Record<HeroClass, string> = {
      WARRIOR: "Ironclad Vanguard",
      MAGE: "Arcane Apprentice",
      PALADIN: "Keeper of the Light",
      ROGUE: "Shadow Prowler",
    };

    const user: HeroProfile = {
      id: `hero_${Date.now()}`,
      name: name || "UNKNOWN HERO",
      email,
      heroClass,
      title: classTitles[heroClass] || "Dungeon Initiate",
      createdAt: new Date().toISOString(),
    };

    const mockToken = `mock_jwt_dungeon_${Date.now()}`;
    ApiClient.setToken(mockToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return { user, token: mockToken };
  }

  public static async loginAsDemoHero(): Promise<{ user: HeroProfile; token: string }> {
    await ApiClient.simulateDelay(300);
    const mockToken = "mock_jwt_demo_champion";
    ApiClient.setToken(mockToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(DEFAULT_DEMO_HERO));
    return { user: DEFAULT_DEMO_HERO, token: mockToken };
  }

  public static async logout(): Promise<void> {
    ApiClient.removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }

  public static async updateProfile(updates: Partial<HeroProfile>): Promise<HeroProfile> {
    const current = await this.getCurrentUser();
    if (!current) throw new Error("No active hero");
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
    return updated;
  }

  public static async changeHeroName(newName: string): Promise<HeroProfile> {
    const current = await this.getCurrentUser();
    if (!current) throw new Error("No active hero");

    const cooldown = getHeroNameCooldown(current.lastNameChangeDate);
    if (!cooldown.allowed) {
      throw new Error(
        `Name change ritual is sealed! You may change your name again in ${cooldown.daysRemaining}d ${cooldown.hoursRemaining}h.`
      );
    }

    const trimmed = newName.trim();
    if (trimmed.length < 2) {
      throw new Error("Hero name must be at least 2 characters long.");
    }
    if (trimmed.length > 25) {
      throw new Error("Hero name cannot exceed 25 characters.");
    }

    const updated: HeroProfile = {
      ...current,
      name: trimmed,
      lastNameChangeDate: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
    return updated;
  }
}
