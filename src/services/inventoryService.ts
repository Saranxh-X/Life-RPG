// Inventory Service - Manages pixel-grid inventory, item usage, and equipment
import { ApiClient, API_CONFIG } from "./apiClient";

export type ItemRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type ItemType = "WEAPON" | "ARMOR" | "SHIELD" | "RELIC" | "CONSUMABLE" | "BADGE";

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  description: string;
  lore: string;
  stats?: {
    strength?: number;
    intelligence?: number;
    vitality?: number;
    discipline?: number;
  };
  sellPrice: number;
  quantity?: number;
  isEquipped?: boolean;
}

const STORAGE_INVENTORY_KEY = "life_rpg_inventory_items";

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: "iron_sword",
    name: "Iron Broadsword",
    type: "WEAPON",
    rarity: "COMMON",
    icon: "⚔️",
    description: "A trusty forged blade carried by dungeon novices.",
    lore: "Its serrated steel edge has vanquished many procrastination monsters.",
    stats: { strength: 4 },
    sellPrice: 25,
    isEquipped: true,
  },
  {
    id: "leather_cuirass",
    name: "Hardened Cuirass",
    type: "ARMOR",
    rarity: "COMMON",
    icon: "🛡️",
    description: "Sturdy boiled leather providing vital organ protection.",
    lore: "Smells of campfire smoke and relentless determination.",
    stats: { vitality: 3, discipline: 2 },
    sellPrice: 30,
    isEquipped: true,
  },
  {
    id: "wooden_buckler",
    name: "Dungeon Buckler",
    type: "SHIELD",
    rarity: "COMMON",
    icon: "🪵",
    description: "Oak planks bound with raw iron studs.",
    lore: "Absorbs blows from stray interruptions.",
    stats: { vitality: 2 },
    sellPrice: 15,
    isEquipped: true,
  },
  {
    id: "amulet_of_focus",
    name: "Amulet of Arcane Focus",
    type: "RELIC",
    rarity: "RARE",
    icon: "🧿",
    description: "Pulsates with a steady indigo shimmer.",
    lore: "Whispers focus incantations into the wearer's mind during study.",
    stats: { intelligence: 5, discipline: 3 },
    sellPrice: 70,
    isEquipped: true,
  },
  {
    id: "elixir_vitality",
    name: "Elixir of Vitality",
    type: "CONSUMABLE",
    rarity: "COMMON",
    icon: "🧪",
    description: "Restores spirit and cures fatigue from late-night vigils.",
    lore: "Brewed from mountain roots and blessed spring dew.",
    sellPrice: 10,
    quantity: 3,
  },
  {
    id: "coffee_haste",
    name: "Brew of Haste",
    type: "CONSUMABLE",
    rarity: "RARE",
    icon: "☕",
    description: "Grants hyperfocus and boosts task completion speed.",
    lore: "Dark roast grounds harvested from volcanic slopes.",
    stats: { discipline: 4 },
    sellPrice: 20,
    quantity: 2,
  },
  {
    id: "obsidian_edge",
    name: "Obsidian Soulblade",
    type: "WEAPON",
    rarity: "EPIC",
    icon: "🗡️",
    description: "Razor sharp glass blade that radiates purple dark-energy.",
    lore: "Forged in the deepest dungeon rift to slice through monumental projects.",
    stats: { strength: 12, discipline: 6 },
    sellPrice: 180,
    isEquipped: false,
  },
  {
    id: "tome_chronos",
    name: "Chronos Grimoire",
    type: "RELIC",
    rarity: "LEGENDARY",
    icon: "📖",
    description: "Bends time in favor of the studious hero.",
    lore: "An artifact ancient as the dungeon itself, penned by the Master Archivist.",
    stats: { intelligence: 15, discipline: 10 },
    sellPrice: 450,
    isEquipped: false,
  },
];

export class InventoryService {
  public static async getInventory(): Promise<InventoryItem[]> {
    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<InventoryItem[]>("/inventory");
    }

    if (typeof window === "undefined") return INITIAL_ITEMS;

    const stored = localStorage.getItem(STORAGE_INVENTORY_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_INVENTORY_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ITEMS;
    }
  }

  public static async equipItem(itemId: string): Promise<InventoryItem[]> {
    const items = await this.getInventory();
    const target = items.find((i) => i.id === itemId);
    if (!target) throw new Error("Item not found");

    const updated = items.map((item) => {
      // Unequip previous item of same type
      if (item.type === target.type && item.id !== target.id) {
        return { ...item, isEquipped: false };
      }
      if (item.id === target.id) {
        return { ...item, isEquipped: !item.isEquipped };
      }
      return item;
    });

    localStorage.setItem(STORAGE_INVENTORY_KEY, JSON.stringify(updated));
    return updated;
  }

  public static async useConsumable(itemId: string): Promise<{ items: InventoryItem[]; usedItem: InventoryItem }> {
    const items = await this.getInventory();
    const target = items.find((i) => i.id === itemId);
    if (!target || target.type !== "CONSUMABLE") throw new Error("Item is not consumable");

    let updated: InventoryItem[];
    if ((target.quantity || 1) > 1) {
      updated = items.map((i) => (i.id === itemId ? { ...i, quantity: (i.quantity || 1) - 1 } : i));
    } else {
      updated = items.filter((i) => i.id !== itemId);
    }

    localStorage.setItem(STORAGE_INVENTORY_KEY, JSON.stringify(updated));
    return { items: updated, usedItem: target };
  }

  public static async addItem(item: InventoryItem): Promise<InventoryItem[]> {
    const items = await this.getInventory();
    const existing = items.find((i) => i.id === item.id && i.type === "CONSUMABLE");

    let updated: InventoryItem[];
    if (existing) {
      updated = items.map((i) =>
        i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
      );
    } else {
      updated = [...items, item];
    }

    localStorage.setItem(STORAGE_INVENTORY_KEY, JSON.stringify(updated));
    return updated;
  }
}
