# ⚔️ Life RPG — 16-Bit Retro Dungeon Productivity Experience

> *"Turn your real-world obligations into legendary dungeon bounties. Slay tasks, harvest XP, stockpile gold, and level up your life."*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Style](https://img.shields.io/badge/Aesthetic-16--Bit_Dungeon_RPG-d97706?style=for-the-badge)](https://github.com/Saranxh-X/Life-RPG)

---

## 🏰 Overview

**Life RPG** is a gamified productivity web application designed from the ground up as an authentic, immersive **16-bit classic dungeon RPG game**—completely avoiding generic modern SaaS dashboards and corporate design clichés.

Featuring dark stone dungeon backdrops, animated twin wall torches with pixel flame animations, rising embers, multi-step pixel bevels, retro parchment scrolls, and an in-house Web Audio 8-bit synthesizer engine, every real-world task completed directly advances your in-game hero.

---

## ✨ Key Features & Mechanics

### 1. 🏰 Dungeon Entrance & Authentication
- **Dungeon Gate Portal**: Ancient stone archway with torch sconces and gate animations.
- **Hero Archetype Selection**: Choose from 4 classes during character creation:
  - 🛡️ **Warrior** (`+Strength` affinity)
  - 🔮 **Mage** (`+Intelligence` affinity)
  - ✨ **Paladin** (`+Vitality` affinity)
  - 🗡️ **Rogue** (`+Discipline` affinity)
- **⚡ 1-Click Guest Hero Demo**: Instantly explore the dungeon realm without form-filling.
- **Authentic Action Buttons**: `🗝️ ENTER DUNGEON` (Login) & `⚔ BEGIN YOUR ADVENTURE` (Signup).

---

### 2. 🎮 Responsive Game HUD (`GameHeader`)
- **Hero Avatar & Profile**: Class-specific portrait, Level badge, and custom title.
- **Animated XP Bar**: Segmented 16-bit progress bar displaying current XP, max XP, and percentage.
- **Currency & Streak**: Live gold pouch counter (`🪙 245G`) and animated daily streak flame (`🔥 4D`).
- **Sound FX Toggle**: Global `🔊 / 🔇` sound switcher persisting to storage.
- **Mobile Controller**: Compact top HUD with a fixed bottom retro controller action bar (`⚔️ Quests`, `👤 Hero`, `✨ Add`, `🎒 Bag`, `🏆 Feats`, `🛒 Shop`).

---

### 3. 📜 Realm Bounty Board & Quests
- **Bounty Categories**: Filters for `ALL`, `DAILY`, `EPIC`, `BOSS RAIDS 💀`, `HABITS`, and `CONQUERED`.
- **Difficulty Tiers**:
  - `COMMON` (Easy — +40 XP, +20G)
  - `RARE` (Medium — +75 XP, +35G)
  - `EPIC` (Hard — +130 XP, +65G)
  - `BOSS 💀` (Legendary — +260 XP, +150G with golden filigree framing)
- **Stat Affinities**: Tagged with `⚔️ STRENGTH`, `🔮 INTELLECT`, `🛡️ VITALITY`, or `⚡ DISCIPLINE`.
- **Micro-Interactions**: Clicking `⚔ COMPLETE BOUNTY` triggers a sword-slash animation, coin chime, audio fanfare, and floating `+XP` / `+Gold` flyouts.

---

### 4. 👑 Full-Screen "LEVEL UP!" Fanfare
- Triggers whenever XP surpasses the required threshold (`level * 100 + 50`).
- Features a screen rumble shake effect (`level-up-shake`), radiating golden sunburst aura, celebratory particles, and an authentic 6-note 8-bit arpeggio.
- Grants **+2 Attribute Points**, **+50 Bonus Gold**, and restores Health & Mana pools to full.

---

### 5. 📊 Hero Character Sheet & Stat Meters
- **4 Core RPG Attributes**:
  - **Strength**: Powers physical fitness, workouts, and stamina.
  - **Intelligence**: Governs coding, deep reading, and studying.
  - **Vitality**: Fortifies sleep quality, hydration, nutrition, and HP pool.
  - **Discipline**: Bolsters daily streaks, willpower, and time management.
- **Stat Point Allocation**: Spend earned unallocated points with `+1` upgrade buttons.
- **Hero Paperdoll**: Equipment slots for Weapon, Chest Armor, Off-hand Shield, and Arcane Relic with live attribute bonuses.

---

### 6. 🎒 20-Slot Pixel Grid Inventory
- **Interactive Satchel Grid**: Items with rarity borders (`Common`, `Rare`, `Epic`, `Legendary`) and level-locked slots (LVL 5+).
- **Item Inspector Dialogue**: Detailed lore backstory, attribute buffs, and resale value.
- **Dynamic Equip / Unequip**:
  - Equipping an item immediately displays an animated green `✓ EQUIPPED` badge and switches the action button to `✕ UNEQUIP GEAR` (red/danger).
  - Unequipping immediately updates the satchel grid (`EQ` badge), clears the hero paperdoll slot, and turns the button back to `🛡️ EQUIP GEAR` (gold).
- **Consumables**: Potions, Elixirs of Vitality, and Brews of Haste.

---

### 7. 👤 Adventurer Dossier & 3-Day Rename System
- Clicking the hero avatar or name in the HUD opens the **Adventurer Dossier** modal.
- Displays: **Hero Name**, **Level & XP Progress**, and a **Full List of Conquered Tasks/Bounties** with clear rate.
- **3-Day Moniker Rename System**:
  - Heroes can rechristen their character name once every 3 days.
  - Enforced by a 72-hour timer (`lastNameChangeDate`).
  - During the cooldown, the UI displays `⏳ XD YH COOLDOWN` and seals the rename ritual until the cooldown expires.

---

### 8. 🏆 Achievements & Feats
- 9+ Curated RPG Achievements across Combat, Mastery, Dedication, and Wealth.
- Progress meters tracking quest completions, streak days, stat milestones, and gold stockpiles.
- Interactive `CLAIM REWARD` buttons providing bonus XP and gold upon completion.

---

### 9. 🛒 Grimwald's Dungeon Bazaar & Live Theme Switcher
- **NPC Merchant**: "Grimwald the Dungeon Purveyor" with speech bubble dialogue.
- **4 Dungeon Themes (Instant CSS Switching)**:
  - ⬛ **Obsidian Crypt** (Classic dark stone with amber torches)
  - 🌋 **Lava Forge** (Fiery crimson bedrock with dancing volcanic embers)
  - 🌿 **Emerald Ruins** (Forgotten mossy stone with green will-o'-the-wisps)
  - 🔮 **Celestial Void** (Starlight violet stone with arcane pulses)
- **Goods**: Themes, XP boost scrolls, streak freeze shields, espresso brews, and dragon hatchling companions.

---

### 10. 🔊 Web Audio API 8-Bit Synthesizer Engine
- Zero external audio files or network requests needed!
- Uses browser-native Web Audio API oscillators to generate authentic retro 8-bit sound effects:
  - Button blips & clicks
  - High-pitched coin chimes
  - Heroic quest completion arpeggios
  - Full-scale victory level-up fanfares
  - Equipment equip/unequip rustles
  - Parchment scroll rolls
  - Includes a global mute switch (`🔊 / 🔇`) on the HUD.

---

## 🛠️ Architecture & Tech Stack

```
Life RPG
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/               # Dungeon Login / Signup
│   │   ├── dashboard/          # Main Quest Hub & Tabs
│   │   ├── character/          # Direct Route: Hero Sheet
│   │   ├── inventory/          # Direct Route: 20-Slot Satchel
│   │   ├── achievements/       # Direct Route: Trophies
│   │   ├── shop/               # Direct Route: Grimwald's Bazaar
│   │   ├── globals.css         # 16-Bit Pixel Borders, Torches, Themes
│   │   └── page.tsx            # Landing & Dungeon Gate
│   ├── components/
│   │   ├── character/          # CharacterView & Paperdoll
│   │   ├── inventory/          # InventoryView & Item Inspector
│   │   ├── achievements/       # AchievementsView & Badges
│   │   ├── layout/             # DungeonBackground, GameHeader, MobileNav, RetroLoading
│   │   ├── modals/             # LevelUpModal, ProfileModal
│   │   ├── quests/             # QuestBoard, QuestCard, AddQuestModal
│   │   ├── shop/               # ShopView & Merchant NPC
│   │   └── ui/                 # PixelButton, PixelProgressBar, FloatingReward
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication & Hero Profile Provider
│   │   └── GameContext.tsx     # Quests, Inventory, Stats, Theme & Rewards State
│   ├── services/               # Decoupled REST-Ready Service Layer
│   │   ├── apiClient.ts        # API client with toggleable mock mode
│   │   ├── authService.ts      # Auth & 3-day name change cooldown
│   │   ├── questService.ts     # Quests CRUD & Bounties
│   │   ├── characterService.ts # Stats, leveling formula & equipment
│   │   ├── inventoryService.ts # Inventory slots & equipping
│   │   ├── achievementService.ts # Badges & reward claims
│   │   └── shopService.ts      # Catalog, purchases & themes
│   └── utils/
│       └── sound.ts            # Web Audio API 8-bit sound synthesizer
```

### 🔌 Backend-Ready Architecture
The frontend is architected with a decoupled `src/services/` layer. All state and actions communicate through Promise-based service interfaces mirroring REST API conventions (`/api/auth`, `/api/quests`, `/api/character`, `/api/shop`, `/api/achievements`).

To connect to a Node.js + Express + MongoDB + JWT backend, simply set `USE_MOCK: false` in `src/services/apiClient.ts`!

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** / **pnpm** / **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Saranxh-X/Life-RPG.git
   cd Life-RPG
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
npm run start
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ⚔️ Author

Crafted with dedication by **[Saranxh-X](https://github.com/Saranxh-X)**.
May your bounties be conquered and your attributes ascend! 🏰✨
