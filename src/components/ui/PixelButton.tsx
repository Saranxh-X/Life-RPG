"use client";

import React from "react";
import { sounds } from "@/utils/sound";

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "stone" | "magic" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  sound?: boolean;
}

export function PixelButton({
  children,
  variant = "gold",
  size = "md",
  sound = true,
  className = "",
  onClick,
  disabled,
  ...props
}: PixelButtonProps) {
  const variantClasses = {
    gold: "pixel-btn-gold",
    stone: "pixel-btn-stone",
    magic: "pixel-btn-magic",
    danger: "pixel-btn-danger",
    emerald: "pixel-btn-emerald",
  }[variant];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base sm:text-lg",
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (sound) {
      sounds.playClick();
    }
    onClick?.(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`pixel-btn ${variantClasses} ${sizeClasses} ${
        disabled ? "opacity-50 cursor-not-allowed filter grayscale" : "active:scale-[0.98]"
      } ${className}`}
    >
      {children}
    </button>
  );
}
