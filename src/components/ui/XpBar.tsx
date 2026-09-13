"use client";

import React from "react";
import { PixelProgressBar } from "./PixelProgressBar";

interface XpBarProps {
  currentXp: number;
  maxXp: number;
  className?: string;
}

export function XpBar({ currentXp, maxXp, className = "" }: XpBarProps) {
  return (
    <PixelProgressBar
      current={currentXp}
      max={maxXp}
      variant="xp"
      label="XP"
      className={className}
    />
  );
}
