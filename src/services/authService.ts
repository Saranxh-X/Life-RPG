// Auth Service - Handles authentication, character creation, and guest hero demo
import { createClient } from "@/utils/supabase/client";

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
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return null;
    return this.profileFromUser(data.user);
  }

  public static async login(email: string, password: string): Promise<{ user: HeroProfile; token: string }> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user || !data.session) {
      throw new Error(error?.message || "Unable to enter the dungeon.");
    }

    return {
      user: this.profileFromUser(data.user),
      token: data.session.access_token,
    };
  }

  public static async register(
    name: string,
    email: string,
    heroClass: HeroClass,
    password: string
  ): Promise<{ user: HeroProfile | null; token: string | null }> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name || "BRAVE HERO",
          heroClass,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user ? this.profileFromUser(data.user) : null,
      token: data.session?.access_token ?? null,
    };
  }

  public static async loginAsDemoHero(): Promise<{ user: HeroProfile; token: string }> {
    const mockToken = "mock_jwt_demo_champion";
    return { user: DEFAULT_DEMO_HERO, token: mockToken };
  }

  public static async logout(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
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

  public static profileFromUser(user: { id: string; email?: string; created_at: string; user_metadata: Record<string, unknown> }): HeroProfile {
    const heroClass = user.user_metadata.heroClass;
    const validHeroClass: HeroClass =
      heroClass === "MAGE" || heroClass === "PALADIN" || heroClass === "ROGUE" ? heroClass : "WARRIOR";

    return {
      id: user.id,
      name: typeof user.user_metadata.username === "string" && user.user_metadata.username.trim()
        ? user.user_metadata.username
        : user.email?.split("@")[0].toUpperCase() || "HERO",
      email: user.email || "",
      heroClass: validHeroClass,
      title: "Dungeon Initiate",
      createdAt: user.created_at,
    };
  }
}
