"use client";

import React from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { Download, MessageCircle, MapPin, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface MobileHomeTabProps {
  onNavigateProjects: () => void;
}

export function MobileHomeTab({ onNavigateProjects }: MobileHomeTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col justify-between py-1 select-none"
    >
      {/* 1. Profile Identity Header */}
      <div className="flex items-center gap-3 pt-0.5">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src="/suhail-hero-portrait.png"
              alt={PERSONAL_INFO.name}
              className="w-full h-full object-cover object-[center_20%] bg-zinc-900"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-background" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-foreground tracking-tight truncate">
            {PERSONAL_INFO.name}
          </h1>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
            Full-Stack Engineer
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>

      {/* 2. Professional Specialty & Background */}
      <div className="rounded-2xl bg-card border border-border/80 p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
            <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">ISL Engineering College</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-muted-foreground shrink-0">
            B.Tech IT &apos;28
          </span>
        </div>

        <p className="text-xs font-semibold text-foreground leading-snug">
          Specialising in AI-assisted development, rapid prototyping, and end-to-end application delivery.
        </p>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
          Studying <strong className="text-foreground">Information Technology</strong> at ISL Engineering College (Class of 2028). Certified in <strong className="text-foreground">Data Science by Fullstack Academy</strong>.
        </p>
      </div>

      {/* 3. Verified Credentials (ISL IT, Fullstack Academy Data Science, SIH Finalist) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-card border border-border/80 p-2 text-center shadow-xs">
          <div className="text-sm font-black text-foreground font-mono">ISL &apos;28</div>
          <div className="text-[10px] text-muted-foreground font-medium truncate">B.Tech in IT</div>
        </div>
        <div className="rounded-xl bg-card border border-border/80 p-2 text-center shadow-xs">
          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">Fullstack</div>
          <div className="text-[10px] text-muted-foreground font-medium truncate">Data Science</div>
        </div>
        <div className="rounded-xl bg-card border border-border/80 p-2 text-center shadow-xs">
          <div className="text-sm font-black text-teal-600 dark:text-teal-400 font-mono">SIH &apos;24</div>
          <div className="text-[10px] text-muted-foreground font-medium truncate">Finalist &bull; 14+</div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={PERSONAL_INFO.resumeUrl}
            download
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-foreground text-background font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Resume</span>
          </a>

          <a
            href={PERSONAL_INFO.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 active:scale-95 transition-transform"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>

        <button
          onClick={onNavigateProjects}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-accent border border-border text-foreground font-semibold text-xs transition-colors active:scale-[0.98]"
        >
          <span>View Featured Projects</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
        </button>
      </div>
    </motion.div>
  );
}
