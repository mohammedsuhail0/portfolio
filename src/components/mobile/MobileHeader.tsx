"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { Maximize2, Minimize2 } from "lucide-react";

export function MobileHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="w-full shrink-0 h-13 px-4 py-2 bg-background/95 backdrop-blur-md border-b border-border/70 flex items-center justify-between z-40 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-border/80 shadow-xs">
          <img
            src="/suhail-hero-portrait.png"
            alt={PERSONAL_INFO.name}
            className="w-full h-full object-cover object-[center_20%] bg-zinc-900"
          />
        </div>
        <div className="flex items-baseline">
          <span className="text-base font-extrabold tracking-tight text-foreground font-mono">
            suhail
          </span>
          <span className="text-emerald-500 text-lg font-black leading-none">.</span>
        </div>
      </div>

      {/* Right: Clean minimal text + Fullscreen Toggle + Theme Toggle */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-mono font-medium text-muted-foreground">
          ISL IT &apos;28
        </span>

        <div className="h-4 w-[1px] bg-border" />

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
