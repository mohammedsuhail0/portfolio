"use client";

import React from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { Download, MessageCircle, MapPin, ArrowRight, GraduationCap, Award, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface MobileHomeTabProps {
  onNavigateProjects: () => void;
}

export function MobileHomeTab({ onNavigateProjects }: MobileHomeTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-3 py-2 px-1 select-none pb-4"
    >
      {/* 1. Profile Identity Header Card */}
      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-sm shadow-xs">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-md">
            <img
              src="/suhail-hero-portrait.png"
              alt={PERSONAL_INFO.name}
              className="w-full h-full object-cover object-[center_20%] bg-zinc-900"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-foreground tracking-tight truncate">
              {PERSONAL_INFO.name}
            </h1>
          </div>
          <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 truncate">
            {PERSONAL_INFO.role}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>

      {/* 2. Professional Background Bento Card */}
      <div className="rounded-2xl bg-card border border-border/80 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{PERSONAL_INFO.college}</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-secondary">
            B.Tech IT &apos;28
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
          {PERSONAL_INFO.headline}
        </p>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Studying <strong className="text-foreground">Information Technology</strong> at ISL Engineering College (Class of 2028). Certified in <strong className="text-foreground">Data Science by Fullstack Academy</strong>.
        </p>
      </div>

      {/* 3. Verified Credentials Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-card border border-border/80 p-3 text-center shadow-xs flex flex-col justify-center">
          <span className="text-xs text-muted-foreground font-medium">Degree</span>
          <div className="text-sm font-black text-foreground font-mono mt-0.5">ISL &apos;28</div>
          <div className="text-[10px] text-muted-foreground truncate">B.Tech in IT</div>
        </div>

        <div className="rounded-xl bg-card border border-border/80 p-3 text-center shadow-xs flex flex-col justify-center">
          <span className="text-xs text-muted-foreground font-medium">Certified</span>
          <div className="text-sm font-black text-emerald-500 dark:text-emerald-400 font-mono mt-0.5">Fullstack</div>
          <div className="text-[10px] text-muted-foreground truncate">Data Science</div>
        </div>

        <div className="rounded-xl bg-card border border-border/80 p-3 text-center shadow-xs flex flex-col justify-center">
          <span className="text-xs text-muted-foreground font-medium">Domain</span>
          <div className="text-sm font-black text-teal-500 dark:text-teal-400 font-mono mt-0.5">Full-Stack</div>
          <div className="text-[10px] text-muted-foreground truncate">AI-Assisted</div>
        </div>
      </div>

      {/* 4. Action Buttons (Chunky, Tactile & Prominent) */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={PERSONAL_INFO.resumeUrl}
            download="Mohammed_Suhail_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-foreground text-background font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Resume</span>
          </a>

          <a
            href={PERSONAL_INFO.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>

        <button
          onClick={onNavigateProjects}
          className="h-12 w-full flex items-center justify-center gap-2 px-4 rounded-xl bg-secondary/80 hover:bg-accent border border-border text-foreground font-bold text-xs sm:text-sm transition-all active:scale-[0.98]"
        >
          <span>Explore Featured Projects</span>
          <ArrowRight className="w-4 h-4 text-emerald-500" />
        </button>
      </div>
    </motion.div>
  );
}
