// Shop Service - Grimwald's Dungeon Bazaar
import { ApiClient, API_CONFIG } from "./apiClient";
import { InventoryItem } from "./inventoryService";

export type ShopCategory = "THEMES" | "CONSUMABLES" | "GEAR" | "DECORATIONS";

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  icon: string;
  description: string;
  lore: string;
  themeId?: "obsidian" | "lava" | "emerald" | "celestial";
  inventoryItem?: InventoryItem;
  purchased?: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: "theme_obsidian",
    name: "Obsidian Crypt",
    category: "THEMES",
    price: 0,
    icon: "⬛",
    description: "The classic dark stone dungeon with amber torches.",
    lore: "Carved from ancient bedrock deep beneath the mortal world.",
    themeId: "obsidian",
    purchased: true,
  },
  {
    id: "theme_lava",
    name: "Lava Forge",
    category: "THEMES",
    price: 150,
    icon: "🌋",
    description: "Blazing crimson stones with dancing fire embers.",
    lore: "Infused with subterranean magma from Mount Doom's furnace.",
    themeId: "lava",
    purchased: false,
  },
  {
    id: "theme_emerald",
    name: "Emerald Ruins",
    category: "THEMES",
    price: 150,
    icon: "🌿",
    description: "Overgrown mossy masonry with green will-o'-the-wisps.",
    lore: "Forgotten elven sanctuaries reclaimed by the ancient forest.",
    themeId: "emerald",
    purchased: false,
  },
  {
    id: "theme_celestial",
    name: "Celestial Void",
    category: "THEMES",
    price: 250,
    icon: "🔮",
    description: "Deep starlight violet stone with arcane mana pulses.",
    lore: "Floating at the nexus where dreams and nightmare dimensions converge.",
    themeId: "celestial",
    purchased: false,
  },

  // Consumables & Buffs
  {
    id: "shop_xp_scroll",
    name: "Scroll of Ancient Wisdom",
    category: "CONSUMABLES",
    price: 80,
    icon: "📜",
    description: "Instantly grants 100 XP upon breaking the wax seal.",
    lore: "Penned by the high wizards of the Citadel before the Great Collapse.",
    purchased: false,
    inventoryItem: {
      id: "scroll_wisdom",
      name: "Scroll of Ancient Wisdom",
      type: "CONSUMABLE",
      rarity: "RARE",
      icon: "📜",
      description: "Break the seal to absorb 100 XP.",
      lore: "Contains concentrated mental clarity.",
      sellPrice: 40,
      quantity: 1,
    },
  },
  {
    id: "shop_freeze_shield",
    name: "Streak Freeze Aegis",
    category: "CONSUMABLES",
    price: 120,
    icon: "❄️",
    description: "Protects your daily streak for 1 day if you miss your quests.",
    lore: "Encased in permafrost from the northern glacial peaks.",
    purchased: false,
    inventoryItem: {
      id: "streak_shield",
      name: "Streak Freeze Aegis",
      type: "CONSUMABLE",
      rarity: "RARE",
      icon: "❄️",
      description: "Protects your streak flame from extinguishing.",
      lore: "A blessing from the Frost Monarch.",
      sellPrice: 60,
      quantity: 1,
    },
  },
  {
    id: "shop_coffee_haste",
    name: "Volcanic Espresso Brew",
    category: "CONSUMABLES",
    price: 35,
    icon: "☕",
    description: "Provides +4 Discipline and sharpens attention.",
    lore: "Single-origin beans roasted over volcanic vents.",
    purchased: false,
    inventoryItem: {
      id: "coffee_haste",
      name: "Volcanic Espresso Brew",
      type: "CONSUMABLE",
      rarity: "RARE",
      icon: "☕",
      description: "Grants hyperfocus and boosts speed.",
      lore: "Dark roast grounds harvested from volcanic slopes.",
      stats: { discipline: 4 },
      sellPrice: 20,
      quantity: 1,
    },
  },

  // Gear & Relics
  {
    id: "shop_obsidian_edge",
    name: "Obsidian Soulblade",
    category: "GEAR",
    price: 220,
    icon: "🗡️",
    description: "A fearsome blade radiating dark purple energy. (+12 STR, +6 DISC)",
    lore: "Forged to cleave through monumental challenges.",
    purchased: false,
    inventoryItem: {
      id: "obsidian_edge",
      name: "Obsidian Soulblade",
      type: "WEAPON",
      rarity: "EPIC",
      icon: "🗡️",
      description: "Razor sharp glass blade radiating purple power.",
      lore: "Forged in the deepest rift.",
      stats: { strength: 12, discipline: 6 },
      sellPrice: 110,
    },
  },
  {
    id: "shop_drake_pet",
    name: "Cinder Drake Hatchling",
    category: "DECORATIONS",
    price: 300,
    icon: "🐲",
    description: "A loyal mini-dragon companion perched upon your HUD.",
    lore: "Breathes tiny sparks whenever you conquer a tough quest.",
    purchased: false,
    inventoryItem: {
      id: "cinder_drake",
      name: "Cinder Drake Hatchling",
      type: "RELIC",
      rarity: "LEGENDARY",
      icon: "🐲",
      description: "Accompanies you through all dungeon corridors.",
      lore: "Loyal to task champions.",
      stats: { vitality: 8, strength: 8 },
      sellPrice: 150,
    },
  },
];

const STORAGE_SHOP_KEY = "life_rpg_shop_state";
const STORAGE_THEME_KEY = "life_rpg_active_theme";

export class ShopService {
  public static getActiveTheme(): string {
    if (typeof window === "undefined") return "obsidian";
    return localStorage.getItem(STORAGE_THEME_KEY) || "obsidian";
  }

  public static setActiveTheme(themeId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_THEME_KEY, themeId);
    document.documentElement.setAttribute("data-theme", themeId);
  }

  public static async getShopCatalog(): Promise<ShopItem[]> {
    if (!API_CONFIG.USE_MOCK) {
      return await ApiClient.request<ShopItem[]>("/shop");
    }

    if (typeof window === "undefined") return SHOP_ITEMS;

    const stored = localStorage.getItem(STORAGE_SHOP_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_SHOP_KEY, JSON.stringify(SHOP_ITEMS));
      return SHOP_ITEMS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SHOP_ITEMS;
    }
  }

  public static async purchaseItem(itemId: string): Promise<ShopItem> {
    await ApiClient.simulateDelay(200);

    const catalog = await this.getShopCatalog();
    const item = catalog.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");

    const updated = catalog.map((i) => {
      if (i.id === itemId) {
        return { ...i, purchased: true };
      }
      return i;
    });

    localStorage.setItem(STORAGE_SHOP_KEY, JSON.stringify(updated));
    return { ...item, purchased: true };
  }
}
