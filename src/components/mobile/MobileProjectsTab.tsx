"use client";

import React, { useState } from "react";
import { TIMELINE_DATA, ITimelineItem } from "@/data/portfolioData";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileProjectsTab() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const projects = TIMELINE_DATA.slice(0, 4); // 1. BroSync, 2. Smart Attendance, 3. NextPatient, 4. ShieldSense
  const currentProject: ITimelineItem = projects[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col justify-between py-2 select-none"
    >
      {/* 1. Header & Navigation Controls */}
      <div className="flex items-center justify-between pb-1 border-b border-border/60">
        <div>
          <h2 className="text-base font-black text-foreground tracking-tight">
            Selected Work
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Top production web apps &amp; systems
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-foreground active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-muted-foreground px-2">
            0{currentIndex + 1} / 0{projects.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next project"
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-foreground active:scale-90 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Active Project Stage */}
      <div className="flex-1 flex flex-col justify-between py-2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="h-full flex flex-col justify-between"
          >
            {/* Visual Image Preview */}
            <div className="relative aspect-[16/10] w-full rounded-2xl bg-zinc-950 overflow-hidden border border-border shadow-xs flex items-center justify-center">
              {currentProject.image ? (
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Globe className="w-8 h-8 text-emerald-500 mb-1" />
                  <span className="text-xs font-mono">Live Project</span>
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/80 text-emerald-400 backdrop-blur-md border border-white/10">
                ● {currentProject.status}
              </div>

              {/* Category */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md">
                {currentProject.category}
              </div>
            </div>

            {/* Project Details */}
            <div className="py-2 space-y-1.5">
              <h3 className="text-lg font-black text-foreground tracking-tight leading-snug">
                {currentProject.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {currentProject.description}
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentProject.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-secondary text-foreground border border-border/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Action Buttons & Progress Dots */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
        <div className="grid grid-cols-2 gap-2.5">
          {currentProject.liveUrl ? (
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          ) : (
            <div className="flex items-center justify-center py-3 px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-xs opacity-50">
              <span>Demo Unavailable</span>
            </div>
          )}

          {currentProject.githubUrl ? (
            <a
              href={currentProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary hover:bg-accent border border-border text-foreground font-bold text-xs active:scale-95 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </a>
          ) : (
            <div className="flex items-center justify-center py-3 px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-xs opacity-50">
              <span>Private Code</span>
            </div>
          )}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to project ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-6 bg-emerald-500"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
