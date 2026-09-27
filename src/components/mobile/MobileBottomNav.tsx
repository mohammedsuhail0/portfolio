"use client";

import React from "react";
import { motion } from "framer-motion";

export type MobileTab = "home" | "projects" | "skills" | "contact";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

const NAV_ITEMS: { id: MobileTab; label: string }[] = [
  { id: "home", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function MobileBottomNav({ activeTab, onSelectTab }: MobileBottomNavProps) {
  return (
    <nav className="w-full shrink-0 h-13 px-4 bg-background/95 backdrop-blur-md border-t border-border/80 flex items-center justify-around z-40 select-none">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className="relative h-full flex-1 flex flex-col items-center justify-center py-2 transition-colors active:opacity-70"
          >
            <span
              className={`text-xs font-mono uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "text-foreground font-extrabold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              {item.label}
            </span>

            {/* Clean Minimalist Underline Indicator (No Bubbly AI Pills) */}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute bottom-0 w-8 h-[2.5px] bg-emerald-500 rounded-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
