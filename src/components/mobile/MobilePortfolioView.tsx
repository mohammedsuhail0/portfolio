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
      {/* 1. Header with Fullscreen Toggle & IT '28 Tag */}
      <MobileHeader />

      {/* 2. Main Content Stage */}
      <main className="flex-1 w-full max-w-md mx-auto overflow-y-auto no-scrollbar px-3 py-1 flex flex-col relative">
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

      {/* 3. Bottom Menu (Always Visible) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
