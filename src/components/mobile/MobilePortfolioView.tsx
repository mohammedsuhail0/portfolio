"use client";

import React, { useState, useEffect } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav, MobileTab } from "./MobileBottomNav";
import { MobileHomeTab } from "./MobileHomeTab";
import { MobileProjectsTab } from "./MobileProjectsTab";
import { MobileSkillsTab } from "./MobileSkillsTab";
import { MobileContactTab } from "./MobileContactTab";
import { AnimatePresence } from "framer-motion";

export function MobilePortfolioView() {
  const [activeTab, setActiveTab] = useState<MobileTab>("home");

  // Attempt automatic fullscreen on user interaction
  useEffect(() => {
    const triggerFullscreen = () => {
      if (!document.fullscreenElement) {
        const docEl = document.documentElement as any;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
      }
    };

    window.addEventListener("touchstart", triggerFullscreen, { passive: true, once: true });
    window.addEventListener("click", triggerFullscreen, { passive: true, once: true });

    return () => {
      window.removeEventListener("touchstart", triggerFullscreen);
      window.removeEventListener("click", triggerFullscreen);
    };
  }, []);

  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-background text-foreground select-none z-30">
      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Fullscreen Toggle & IT '28 Tag */}
      <MobileHeader />

      {/* 2. Main Content Stage */}
      <main className="flex-1 w-full max-w-md mx-auto overflow-y-auto no-scrollbar px-3 py-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <MobileHomeTab
              key="home"
              onNavigateProjects={() => setActiveTab("projects")}
            />
          )}

          {activeTab === "projects" && (
            <MobileProjectsTab key="projects" />
          )}

          {activeTab === "skills" && (
            <MobileSkillsTab key="skills" />
          )}

          {activeTab === "contact" && (
            <MobileContactTab key="contact" />
          )}
        </AnimatePresence>
      </main>

      {/* 3. Bottom Menu (Always Visible with Logo Icons) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
