"use client";

import React from "react";

interface PixelProgressBarProps {
  current: number;
  max: number;
  variant?: "xp" | "hp" | "mana" | "gold" | "stat";
  label?: string;
  showValues?: boolean;
  height?: string;
  className?: string;
}

export function PixelProgressBar({
  current,
  max,
  variant = "xp",
  label,
  showValues = true,
  height = "h-5",
  className = "",
}: PixelProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (current / max) * 100 : 0));

  const variantStyles = {
    xp: {
      barBg: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400",
      borderGlow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      textColor: "text-emerald-300",
    },
    hp: {
      barBg: "bg-gradient-to-r from-red-700 via-red-600 to-rose-400",
      borderGlow: "shadow-[0_0_8px_rgba(239,68,68,0.5)]",
      textColor: "text-red-300",
    },
    mana: {
      barBg: "bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-400",
      borderGlow: "shadow-[0_0_8px_rgba(168,85,247,0.5)]",
      textColor: "text-purple-300",
    },
    gold: {
      barBg: "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300",
      borderGlow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      textColor: "text-amber-300",
    },
    stat: {
      barBg: "bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-400",
      borderGlow: "shadow-[0_0_8px_rgba(59,130,246,0.5)]",
      textColor: "text-sky-300",
    },
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-xs font-pixel mb-1 text-slate-300">
          <span>{label}</span>
          {showValues && (
            <span className={variantStyles.textColor}>
              {current} / {max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}

      <div className={`pixel-bar-container ${height} w-full ${variantStyles.borderGlow}`}>
        <div
          className={`pixel-bar-fill ${variantStyles.barBg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
