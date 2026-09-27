"use client";

import React, { useState } from "react";
import { TIMELINE_DATA, ITimelineItem } from "@/data/portfolioData";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Globe, MoveHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileProjectsTab() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const projects = TIMELINE_DATA.slice(0, 4); // 1. BroSync, 2. Smart Attendance, 3. NextPatient, 4. ShieldSense
  const currentProject: ITimelineItem = projects[currentIndex];

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers (Universal)
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX - touchEndX;
    if (touchEndX !== 0) {
      if (swipeDistance > 45) {
        handleNext();
      } else if (swipeDistance < -45) {
        handlePrev();
      }
    }
    touchStartX = 0;
    touchEndX = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-3 py-2 px-1 select-none pb-4"
    >
      {/* 1. Header & Navigation Controls */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-sm shadow-xs">
        <div>
          <h2 className="text-sm font-black text-foreground tracking-tight flex items-center gap-1.5">
            <span>Featured Work</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              0{currentIndex + 1}/0{projects.length}
            </span>
          </h2>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MoveHorizontal className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Swipe left or right</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            aria-label="Previous project"
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent border border-border flex items-center justify-center text-foreground active:scale-90 transition-transform shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next project"
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent border border-border flex items-center justify-center text-foreground active:scale-90 transition-transform shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Swipeable Project Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full relative overflow-hidden touch-pan-y"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40 || info.velocity.x < -300) {
                handleNext();
              } else if (info.offset.x > 40 || info.velocity.x > 300) {
                handlePrev();
              }
            }}
            className="w-full flex flex-col gap-3 rounded-2xl bg-card border border-border/80 p-3.5 shadow-md cursor-grab active:cursor-grabbing"
          >
            {/* Visual Image Preview */}
            <div className="relative aspect-[16/9] w-full rounded-xl bg-zinc-950 overflow-hidden border border-border/60 flex items-center justify-center">
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

              {/* Status Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/80 text-emerald-400 backdrop-blur-md border border-white/10">
                ● {currentProject.status}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md">
                {currentProject.category}
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-1.5 pt-0.5">
              <h3 className="text-base font-black text-foreground tracking-tight">
                {currentProject.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
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

            {/* Action Buttons: Chunky, Tactile, High-Contrast */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
              {currentProject.liveUrl ? (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              ) : (
                <div className="h-12 flex items-center justify-center px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-xs opacity-50">
                  <span>Demo Unavailable</span>
                </div>
              )}

              {currentProject.githubUrl ? (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-secondary/80 hover:bg-accent border border-border text-foreground font-bold text-xs sm:text-sm active:scale-95 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              ) : (
                <div className="h-12 flex items-center justify-center px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-xs opacity-50">
                  <span>Private Code</span>
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to project ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-7 bg-emerald-500"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
