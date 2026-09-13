"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PixelButton } from "@/components/ui/PixelButton";
import { DungeonBackground } from "@/components/layout/DungeonBackground";
import { RetroLoading } from "@/components/layout/RetroLoading";

export default function Home() {
  const router = useRouter();
  const { user, loginAsDemoHero } = useAuth();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoLogin = async () => {
    setLoadingDemo(true);
    await loginAsDemoHero();
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  if (loadingDemo) {
    return <RetroLoading message="PREPARING DEMO HERO..." />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative p-4 overflow-hidden select-none">
      <DungeonBackground />

      <div className="z-10 text-center max-w-3xl w-full flex flex-col items-center py-10">
        
        {/* Dungeon Gate Crest */}
        <div className="text-6xl sm:text-7xl mb-4 animate-pulse">
          🏰
        </div>

        {/* Top Welcome Banner */}
        <div className="mb-3">
          <span className="font-pixel text-xs sm:text-sm text-amber-300 bg-amber-950/90 border-2 border-amber-600 px-4 py-1.5 shadow-[0_0_15px_rgba(245,158,11,0.35)] tracking-wider inline-block">
            ⚔️ WELCOME TO REAL LIFE RPG QUESTS ⚔️
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl text-yellow-400 font-pixel tracking-wider drop-shadow-[0_4px_0_#78350f] mb-4">
          LIFE RPG
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 font-body max-w-xl mb-8 leading-relaxed">
          Turn your real-world obligations into legendary dungeon bounties.
          Earn XP, accumulate gold, grow your attributes, and conquer your goals.
        </p>

        {/* Stone Portal Panel with Actions */}
        <div className="pixel-slab p-6 sm:p-8 bg-slate-950/90 border-4 border-slate-700 w-full max-w-lg mb-8 space-y-4">
          
          {user ? (
            <div className="space-y-4">
              <div className="font-pixel text-sm text-yellow-300">
                WELCOME BACK, {user.name}!
              </div>
              <Link href="/dashboard" className="block">
                <PixelButton variant="gold" size="lg" className="w-full text-base py-3">
                  ⚔ RETURN TO THE DUNGEON
                </PixelButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Instant 1-Click Demo Entrance */}
              <PixelButton
                variant="gold"
                size="lg"
                onClick={handleDemoLogin}
                className="w-full text-base py-3.5 shadow-lg"
              >
                ⚡ QUICK START AS GUEST HERO
              </PixelButton>

              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="px-3 text-xs font-pixel text-slate-500">OR</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Login & Signup Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/auth?mode=login" className="block">
                  <PixelButton variant="stone" size="md" className="w-full text-xs py-2.5">
                    🗝️ ENTER DUNGEON
                  </PixelButton>
                </Link>
                <Link href="/auth?mode=signup" className="block">
                  <PixelButton variant="magic" size="md" className="w-full text-xs py-2.5">
                    ✨ BEGIN YOUR ADVENTURE
                  </PixelButton>
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl text-center">
          <div className="bg-slate-950/80 border border-slate-800 p-2.5">
            <div className="text-2xl mb-1">⚔️</div>
            <div className="font-pixel text-[10px] text-yellow-300">RPG BOUNTIES</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5">
            <div className="text-2xl mb-1">📊</div>
            <div className="font-pixel text-[10px] text-yellow-300">4 STAT METERS</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5">
            <div className="text-2xl mb-1">🎒</div>
            <div className="font-pixel text-[10px] text-yellow-300">PIXEL BAG</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5">
            <div className="text-2xl mb-1">👑</div>
            <div className="font-pixel text-[10px] text-yellow-300">LEVEL UP FANFARE</div>
          </div>
        </div>

      </div>
    </main>
  );
}
