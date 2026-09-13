"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HeroClass } from "@/services/authService";
import { PixelButton } from "@/components/ui/PixelButton";
import { DungeonBackground } from "@/components/layout/DungeonBackground";
import { RetroLoading } from "@/components/layout/RetroLoading";

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register, loginAsDemoHero } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [heroClass, setHeroClass] = useState<HeroClass>("WARRIOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "signup") {
        setIsLogin(false);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name.trim() || "BRAVE HERO", email, heroClass, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication ritual failed");
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await loginAsDemoHero();
    router.push("/dashboard");
  };

  if (loading) {
    return <RetroLoading message="OPENING THE DUNGEON GATES..." />;
  }

  const classes: { id: HeroClass; name: string; icon: string; stat: string; desc: string }[] = [
    { id: "WARRIOR", name: "WARRIOR", icon: "🛡️", stat: "+STR", desc: "Vanquisher of physical fatigue and workout goals." },
    { id: "MAGE", name: "MAGE", icon: "🔮", stat: "+INT", desc: "Master of code, deep reading, and arcane study." },
    { id: "PALADIN", name: "PALADIN", icon: "✨", stat: "+VIT", desc: "Guardian of vitality, restorative sleep, and wellness." },
    { id: "ROGUE", name: "ROGUE", icon: "🗡️", stat: "+DISC", desc: "Shadow tracker of strict habits and deadlines." },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative select-none">
      <DungeonBackground />

      <div className="z-10 w-full max-w-lg my-8">
        <div className="pixel-slab p-6 sm:p-8 bg-slate-950/95 border-4 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-slate-800">
            <Link href="/" className="inline-block text-4xl mb-2 hover:scale-110 transition-transform">
              🏰
            </Link>
            <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400">
              LIFE RPG
            </h1>
            <p className="font-body text-slate-300 text-xl mt-1">
              {isLogin ? "PRESENT YOUR CIPHER TO ENTER" : "FORGE YOUR HERO IDENTITY"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-950 border-2 border-red-700 text-red-300 font-pixel text-xs text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                {/* Hero Name */}
                <div>
                  <label className="block font-pixel text-xs text-yellow-300 mb-1.5">
                    HERO NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alistair the Bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-700 p-2.5 text-white font-body text-xl outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block font-pixel text-xs text-yellow-300 mb-1.5">
                    CHOOSE YOUR ARCHETYPE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        onClick={() => setHeroClass(cls.id)}
                        className={`p-2 border-2 cursor-pointer transition-all ${
                          heroClass === cls.id
                            ? "border-amber-400 bg-amber-950/60 ring-1 ring-yellow-400"
                            : "border-slate-800 bg-slate-900 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{cls.icon}</span>
                          <span className="font-pixel text-xs text-yellow-200">{cls.name}</span>
                        </div>
                        <div className="text-[10px] font-pixel text-emerald-400 mt-0.5">{cls.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email / Scroll */}
            <div>
              <label className="block font-pixel text-xs text-yellow-300 mb-1.5">
                SCROLL OF EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="hero@dungeon.realm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 p-2.5 text-white font-body text-xl outline-none focus:border-yellow-500"
              />
            </div>

            {/* Secret Word */}
            <div>
              <label className="block font-pixel text-xs text-yellow-300 mb-1.5">
                SECRET PASS-PHRASE
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 p-2.5 text-white font-body text-xl outline-none focus:border-yellow-500"
              />
            </div>

            {/* Action Buttons as requested */}
            <div className="pt-2">
              <PixelButton
                type="submit"
                variant="gold"
                size="lg"
                className="w-full text-sm sm:text-base py-3.5 shadow-lg"
              >
                {isLogin ? "🗝️ ENTER DUNGEON" : "⚔ BEGIN YOUR ADVENTURE"}
              </PixelButton>
            </div>

          </form>

          {/* Quick Demo Button */}
          <div className="mt-4 pt-4 border-t-2 border-slate-800 text-center">
            <PixelButton
              type="button"
              variant="stone"
              onClick={handleDemo}
              className="w-full text-xs py-2.5 text-amber-300"
            >
              ⚡ QUICK PLAY AS GUEST HERO
            </PixelButton>

            {/* Toggle Mode */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="font-body text-slate-300 hover:text-yellow-400 text-lg underline underline-offset-4"
              >
                {isLogin
                  ? "New to the realm? Forge a character"
                  : "Already registered? Enter with your cipher"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
