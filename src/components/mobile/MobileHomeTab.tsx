"use client";

import React from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import {
  Download,
  MessageCircle,
  MapPin,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

interface MobileHomeTabProps {
  onNavigateProjects: () => void;
}

export function MobileHomeTab({ onNavigateProjects }: MobileHomeTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col justify-center gap-2.5 px-1 py-1 select-none"
    >
      {/* 1. Sleek Compact Identity Header */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-zinc-950 shadow-sm">
            <img
              src="/suhail-hero-portrait.png"
              alt={PERSONAL_INFO.name}
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-card" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-black text-foreground tracking-tight truncate">
              {PERSONAL_INFO.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </span>
          </div>

          <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 truncate">
            {PERSONAL_INFO.role}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>

      {/* 2. Professional Identity & Academic Bento Card */}
      <div className="rounded-2xl bg-card border border-border/80 p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
            <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">ISL Engineering College</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded bg-secondary shrink-0">
            B.Tech IT &apos;28
          </span>
        </div>

        <p className="text-xs font-semibold text-foreground leading-snug">
          {PERSONAL_INFO.headline}
        </p>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Studying <strong className="text-foreground">Information Technology</strong> at ISL Engineering College (Class of 2028). Certified in <strong className="text-foreground">Data Science by Fullstack Academy</strong>.
        </p>
      </div>

      {/* 3. Verified Credentials Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-card border border-border/80 p-2.5 text-center shadow-xs">
          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground block">Degree</span>
          <div className="text-sm font-black text-foreground font-mono mt-0.5">ISL &apos;28</div>
          <div className="text-[10px] text-muted-foreground truncate">B.Tech in IT</div>
        </div>

        <div className="rounded-xl bg-card border border-border/80 p-2.5 text-center shadow-xs">
          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground block">Certified</span>
          <div className="text-sm font-black text-emerald-500 dark:text-emerald-400 font-mono mt-0.5">Data Sci</div>
          <div className="text-[10px] text-muted-foreground truncate">Fullstack Acad.</div>
        </div>

        <div className="rounded-xl bg-card border border-border/80 p-2.5 text-center shadow-xs">
          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground block">Shipped</span>
          <div className="text-sm font-black text-teal-500 dark:text-teal-400 font-mono mt-0.5">11+ Apps</div>
          <div className="text-[10px] text-muted-foreground truncate">Production</div>
        </div>
      </div>

      {/* 4. Action Buttons (Chunky, Tactile & High-Contrast) */}
      <div className="flex flex-col gap-2 pt-0.5">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={PERSONAL_INFO.resumeUrl}
            download="Mohammed_Suhail_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-2 px-3 rounded-xl bg-foreground text-background font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Resume</span>
          </a>

          <a
            href={PERSONAL_INFO.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>

        <button
          onClick={onNavigateProjects}
          className="h-11 w-full flex items-center justify-center gap-2 px-3 rounded-xl bg-secondary/80 hover:bg-accent border border-border text-foreground font-bold text-xs transition-all active:scale-[0.98]"
        >
          <span>View Featured Projects (11+ Apps)</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
        </button>
      </div>
    </motion.div>
  );
}
