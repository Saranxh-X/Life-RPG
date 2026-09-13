"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Flame,
  Heart,
  Palette,
  Shield,
  Sparkles,
  Sword,
  Trophy,
  Zap,
  Coins,
} from "lucide-react";
import { QuestList } from "./QuestList";

type Profile = {
  username: string | null;
  level: number;
  current_xp: number;
  gold: number;
  strength: number;
  intellect: number;
  discipline: number;
  health: number;
  creativity: number;
};
type Quest = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
};

export function DashboardWorkspace({
  initialProfile,
  initialQuests,
}: {
  initialProfile: Profile;
  initialQuests: Quest[];
}) {
  const [profile, setProfile] = useState(initialProfile);
  const xpNeeded = Math.floor(500 * Math.pow(1.2, profile.level - 1));
  const xpPercent = Math.min(100, (profile.current_xp / xpNeeded) * 100);
  const stats = [
    {
      name: "Strength",
      value: profile.strength,
      icon: Sword,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
    {
      name: "Intellect",
      value: profile.intellect,
      icon: Brain,
      color: "text-sky-300",
      bg: "bg-sky-300/10",
    },
    {
      name: "Discipline",
      value: profile.discipline,
      icon: Zap,
      color: "text-amber-300",
      bg: "bg-amber-300/10",
    },
    {
      name: "Health",
      value: profile.health,
      icon: Heart,
      color: "text-emerald-300",
      bg: "bg-emerald-300/10",
    },
    {
      name: "Creativity",
      value: profile.creativity,
      icon: Palette,
      color: "text-fuchsia-300",
      bg: "bg-fuchsia-300/10",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.3em] text-primary">
            Command center
          </p>
          <h1 className="mt-2 text-4xl font-bold text-foreground">
            Good hunting, {profile.username || "Adventurer"}.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Small actions compound into legendary progress.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flame className="h-4 w-4 text-orange-400" /> Your next victory is
          waiting.
        </div>
      </div>

      <section className="glass-panel gold-glow relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-primary/70 bg-[#1b2636] text-4xl font-bold text-primary shadow-[0_0_35px_rgba(213,168,75,.22)]">
            <Shield className="absolute h-11 w-11 opacity-15" />
            <span>{(profile.username || "A").charAt(0).toUpperCase()}</span>
            <span className="absolute -bottom-2 rounded-full border border-primary/60 bg-background px-2 py-0.5 text-[10px] font-bold text-primary">
              LVL {profile.level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.2em] text-primary">
                  The wayfinder
                </p>
                <h2 className="text-2xl font-bold">
                  Level {profile.level} Adventurer
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background/50 px-3 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />{" "}
                {profile.current_xp} / {xpNeeded} XP
              </div>
            </div>
            <div className="xp-shimmer mt-5 h-3 rounded-full bg-background/80">
              <motion.div
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-primary"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>
                {xpNeeded - profile.current_xp} XP until level{" "}
                {profile.level + 1}
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Coins className="h-3 w-3" /> {profile.gold} gold
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_1.55fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-muted-foreground">
                Character sheet
              </p>
              <h2 className="mt-1 text-2xl font-bold">Core attributes</h2>
            </div>
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="glass-panel group rounded-xl p-4 transition-transform hover:-translate-y-1"
                >
                  <div
                    className={`mb-5 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.name}
                  </p>
                  <div className="mt-3 h-1 rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${Math.min(100, stat.value * 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <div id="quests">
          <QuestList
            initialQuests={initialQuests}
            onProfileChange={(patch) =>
              setProfile((current) => ({ ...current, ...patch }))
            }
          />
        </div>
      </div>
    </div>
  );
}
