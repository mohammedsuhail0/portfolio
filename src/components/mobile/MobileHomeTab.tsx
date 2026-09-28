"use client";

import React from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import {
  Download,
  MessageCircle,
  MapPin,
  ArrowRight,
  GraduationCap,
  Award,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface MobileHomeTabProps {
  onNavigateProjects: () => void;
}

export function MobileHomeTab({ onNavigateProjects }: MobileHomeTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-3.5 py-2 px-1 select-none pb-8"
    >
      {/* 1. Atmospheric Hero Presentation Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-card/90 via-card/60 to-card/90 border border-border/80 p-5 shadow-lg backdrop-blur-xl overflow-hidden">
        {/* Ambient Corner Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Top Row: Avatar & Live Badge */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-md bg-zinc-950">
                <img
                  src="/suhail-hero-portrait.png"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover object-[center_18%]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-card" />
              </span>
            </div>

            {/* Availability Pill */}
            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for work</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Headline & Identity */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">
              {PERSONAL_INFO.name}
            </h1>
            <div className="inline-block">
              <span className="text-sm font-extrabold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                {PERSONAL_INFO.role}
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground/90 leading-relaxed pt-1">
              {PERSONAL_INFO.headline}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bento Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 text-center shadow-xs flex flex-col justify-center items-center">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground">College</span>
          <div className="text-base font-black text-foreground font-mono mt-0.5">ISL &apos;28</div>
          <span className="text-[10px] text-muted-foreground truncate">B.Tech in IT</span>
        </div>

        <div className="rounded-2xl bg-card border border-border/80 p-3.5 text-center shadow-xs flex flex-col justify-center items-center">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground">Certified</span>
          <div className="text-base font-black text-emerald-500 dark:text-emerald-400 font-mono mt-0.5">Data Sci</div>
          <span className="text-[10px] text-muted-foreground truncate">Fullstack Acad.</span>
        </div>

        <div className="rounded-2xl bg-card border border-border/80 p-3.5 text-center shadow-xs flex flex-col justify-center items-center">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground">Shipped</span>
          <div className="text-base font-black text-teal-500 dark:text-teal-400 font-mono mt-0.5">11+ Apps</div>
          <span className="text-[10px] text-muted-foreground truncate">Live Systems</span>
        </div>
      </div>

      {/* 3. Verified Credentials Card */}
      <div className="rounded-2xl bg-card border border-border/80 p-4 shadow-xs space-y-2.5">
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
          Academic &amp; Professional Background
        </span>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">ISL Engineering College</span>
              <span className="text-muted-foreground text-[11px]">B.Tech in Information Technology &bull; Class of 2028</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1.5 border-t border-border/60">
            <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">Fullstack Academy Center of Excellence</span>
              <span className="text-muted-foreground text-[11px]">Certified in Data Science &bull; Certificate of Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Flagship Project Spotlight (NextPatient with real screenshot) */}
      <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Featured Project Spotlight</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Live Production
          </span>
        </div>

        {/* Real Screenshot Preview */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-zinc-950 border border-border/70 flex items-center justify-center">
          <img
            src="/projects/nextpatient.png"
            alt="NextPatient UI"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
            <span className="font-bold tracking-tight">NextPatient (Clinical AI)</span>
            <span className="text-[10px] font-mono text-emerald-300">OSCE Simulation</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Real-time clinical OSCE workstation featuring interactive AI patients, live telemetry (HR, BP, SpO2), STAT orders, and NCBI StatPearls RAG triage.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="https://nextpatient-app.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open NextPatient</span>
          </a>

          <button
            onClick={onNavigateProjects}
            className="h-11 flex items-center justify-center gap-1.5 rounded-xl bg-secondary/80 hover:bg-accent border border-border text-foreground font-bold text-xs active:scale-95 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>All 11+ Projects</span>
          </button>
        </div>
      </div>

      {/* 5. Primary Action Buttons (Chunky & Tactile) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
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
          <span>WhatsApp Me</span>
        </a>
      </div>
    </motion.div>
  );
}
