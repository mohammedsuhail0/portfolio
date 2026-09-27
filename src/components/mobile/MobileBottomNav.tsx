"use client";

import React from "react";
import { User, Briefcase, Cpu, Send } from "lucide-react";
import { motion } from "framer-motion";

export type MobileTab = "home" | "projects" | "skills" | "contact";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

const NAV_ITEMS: { id: MobileTab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "skills", label: "Stack", icon: Cpu },
  { id: "contact", label: "Contact", icon: Send },
];

export function MobileBottomNav({ activeTab, onSelectTab }: MobileBottomNavProps) {
  return (
    <nav className="w-full shrink-0 h-16 px-2 bg-background/95 backdrop-blur-xl border-t border-border/80 flex items-center justify-around z-40 select-none pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className="relative flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95"
            aria-label={item.label}
          >
            {/* Active Logo Container */}
            <div
              className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                }`}
              />

              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-xs"
                />
              )}
            </div>

            <span
              className={`text-[10px] font-mono tracking-tight mt-0.5 transition-colors duration-150 ${
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground/80 font-medium"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
