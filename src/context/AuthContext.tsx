"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService, HeroProfile, HeroClass } from "@/services/authService";
import { sounds } from "@/utils/sound";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
  user: HeroProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    heroClass: HeroClass,
    password: string,
  ) => Promise<boolean>;
  loginAsDemoHero: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<HeroProfile>) => Promise<void>;
  changeHeroName: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<HeroProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    AuthService.getCurrentUser()
      .then((profile) => {
        if (mounted) setUser(profile);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          return;
        }

        setUser(AuthService.profileFromUser(session.user));
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login(email, password);
    setUser(res.user);
    sounds.playLevelUp();
  };

  const register = async (
    name: string,
    email: string,
    heroClass: HeroClass,
    password: string,
  ) => {
    const res = await AuthService.register(name, email, heroClass, password);
    setUser(res.user);
    if (res.user) sounds.playLevelUp();
    return Boolean(res.user);
  };

  const loginAsDemoHero = async () => {
    const res = await AuthService.loginAsDemoHero();
    setUser(res.user);
    sounds.playLevelUp();
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    sounds.playClick();
  };

  const updateProfile = async (updates: Partial<HeroProfile>) => {
    const updated = await AuthService.updateProfile(updates);
    setUser(updated);
  };

  const changeHeroName = async (newName: string) => {
    const updated = await AuthService.changeHeroName(newName);
    setUser(updated);
    sounds.playScroll();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginAsDemoHero,
        logout,
        updateProfile,
        changeHeroName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
