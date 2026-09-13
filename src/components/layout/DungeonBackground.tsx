"use client";

import React, { useMemo } from "react";

export function DungeonBackground() {
  // Generate a fixed set of floating ember particles with pseudo-random offsets
  const embers = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 2) % 96}%`,
      delay: `${(i * 0.4) % 6}s`,
      duration: `${5 + ((i * 1.7) % 5)}s`,
      size: i % 3 === 0 ? "5px" : i % 2 === 0 ? "3px" : "4px",
      isMagic: i % 5 === 0,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dungeon Stone Brick Texture */}
      <div className="absolute inset-0 dungeon-stone-pattern opacity-90" />

      {/* Vignette Overlay for Moody Dungeon Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,10,0.85)_80%)]" />

      {/* Floating Ember & Mana Particles */}
      {embers.map((e) => (
        <div
          key={e.id}
          className="ember-particle"
          style={{
            left: e.left,
            animationDelay: e.delay,
            animationDuration: e.duration,
            width: e.size,
            height: e.size,
            backgroundColor: e.isMagic ? "#c084fc" : "#f59e0b",
            boxShadow: e.isMagic ? "0 0 8px #a855f7" : "0 0 8px #f59e0b",
          }}
        />
      ))}

      {/* Left Wall Torch (Fixed on desktop) */}
      <aside aria-label="Left Dungeon Torch" className="hidden lg:flex flex-col items-center absolute top-28 left-6 z-10 select-none">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-500/20 blur-xl torch-glow" />

        {/* 16-Bit Pixel Flame SVG */}
        <div className="torch-flame relative z-10 w-12 h-14">
          <svg viewBox="0 0 24 28" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">
            {/* Outer Flame (Orange) */}
            <path d="M10 0 H14 V4 H18 V12 H20 V20 H16 V24 H8 V20 H4 V12 H6 V4 H10 Z" fill="#ea580c" />
            {/* Mid Flame (Amber/Gold) */}
            <path d="M10 4 H14 V8 H16 V16 H14 V20 H10 V16 H8 V8 H10 Z" fill="#f59e0b" />
            {/* Inner Core (Bright Yellow/White) */}
            <path d="M11 8 H13 V12 H14 V16 H10 V12 H11 Z" fill="#fef08a" />
          </svg>
        </div>

        {/* Iron Torch Sconce & Bracket */}
        <div className="w-6 h-6 bg-slate-800 border-2 border-slate-600 shadow-[inset_1px_1px_0px_#94a3b8,-2px_2px_0px_#0f172a] -mt-1" />
        <div className="w-3 h-10 bg-slate-900 border-l-2 border-r-2 border-slate-700 shadow-md" />
        <div className="w-10 h-3 bg-slate-800 border-2 border-slate-600" />
      </aside>

      {/* Right Wall Torch (Fixed on desktop) */}
      <aside aria-label="Right Dungeon Torch" className="hidden lg:flex flex-col items-center absolute top-28 right-6 z-10 select-none">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/20 blur-xl torch-glow" />

        {/* 16-Bit Pixel Flame SVG */}
        <div className="torch-flame relative z-10 w-12 h-14" style={{ animationDelay: "0.2s" }}>
          <svg viewBox="0 0 24 28" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">
            <path d="M10 0 H14 V4 H18 V12 H20 V20 H16 V24 H8 V20 H4 V12 H6 V4 H10 Z" fill="#ea580c" />
            <path d="M10 4 H14 V8 H16 V16 H14 V20 H10 V16 H8 V8 H10 Z" fill="#f59e0b" />
            <path d="M11 8 H13 V12 H14 V16 H10 V12 H11 Z" fill="#fef08a" />
          </svg>
        </div>

        {/* Iron Torch Sconce & Bracket */}
        <div className="w-6 h-6 bg-slate-800 border-2 border-slate-600 shadow-[inset_1px_1px_0px_#94a3b8,-2px_2px_0px_#0f172a] -mt-1" />
        <div className="w-3 h-10 bg-slate-900 border-l-2 border-r-2 border-slate-700 shadow-md" />
        <div className="w-10 h-3 bg-slate-800 border-2 border-slate-600" />
      </aside>
    </div>
  );
}
