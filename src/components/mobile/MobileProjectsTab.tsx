"use client";

import React, { useState, useMemo } from "react";
import { TIMELINE_DATA, ITimelineItem } from "@/data/portfolioData";
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Globe,
  MoveHorizontal,
  Layers,
  Sparkles,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter = "apps" | "all" | "ai" | "web" | "hackathons";

export function MobileProjectsTab() {
  const [filter, setFilter] = useState<CategoryFilter>("apps");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  // Filter projects by category
  const filteredProjects: ITimelineItem[] = useMemo(() => {
    switch (filter) {
      case "apps":
        // All production software applications with live demo or primary repo
        return TIMELINE_DATA.filter((p) => p.status === "Completed" || p.liveUrl);
      case "ai":
        return TIMELINE_DATA.filter(
          (p) =>
            p.category.toLowerCase().includes("ai") ||
            p.category.toLowerCase().includes("health") ||
            p.category.toLowerCase().includes("data science") ||
            p.id === "nextpatient" ||
            p.id === "shield-sense" ||
            p.id === "hackathon-sih"
        );
      case "web":
        return TIMELINE_DATA.filter(
          (p) =>
            p.category.toLowerCase().includes("full-stack") ||
            p.category.toLowerCase().includes("collaboration") ||
            p.category.toLowerCase().includes("web")
        );
      case "hackathons":
        return TIMELINE_DATA.filter(
          (p) => p.status === "Hackathon Participant" || p.status === "Milestone"
        );
      case "all":
      default:
        return TIMELINE_DATA;
    }
  }, [filter]);

  // Ensure index stays in bounds when switching filters
  const safeIndex = currentIndex >= filteredProjects.length ? 0 : currentIndex;
  const currentProject = filteredProjects[safeIndex] || TIMELINE_DATA[0];

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? filteredProjects.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === filteredProjects.length - 1 ? 0 : prev + 1
    );
  };

  const handleSelectFilter = (newFilter: CategoryFilter) => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  const handleSelectProject = (project: ITimelineItem) => {
    const idx = filteredProjects.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      setDirection(idx > safeIndex ? 1 : -1);
      setCurrentIndex(idx);
    }
    // Smooth scroll to top of showcase
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Touch Swipe Handlers (Universal fallback)
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

  const filterTabs: { id: CategoryFilter; label: string; count: number }[] = [
    {
      id: "apps",
      label: "Production Apps",
      count: TIMELINE_DATA.filter((p) => p.status === "Completed" || p.liveUrl).length,
    },
    {
      id: "ai",
      label: "AI & Health",
      count: TIMELINE_DATA.filter(
        (p) =>
          p.category.toLowerCase().includes("ai") ||
          p.category.toLowerCase().includes("health") ||
          p.category.toLowerCase().includes("data science")
      ).length,
    },
    {
      id: "web",
      label: "Full-Stack Web",
      count: TIMELINE_DATA.filter(
        (p) =>
          p.category.toLowerCase().includes("full-stack") ||
          p.category.toLowerCase().includes("collaboration") ||
          p.category.toLowerCase().includes("web")
      ).length,
    },
    {
      id: "hackathons",
      label: "Hackathons & Awards",
      count: TIMELINE_DATA.filter(
        (p) => p.status === "Hackathon Participant" || p.status === "Milestone"
      ).length,
    },
    { id: "all", label: "All Items", count: TIMELINE_DATA.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-3 py-2 px-1 select-none pb-8"
    >
      {/* 1. Header & Quick Controls */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-sm shadow-xs">
        <div>
          <h2 className="text-sm font-black text-foreground tracking-tight flex items-center gap-1.5">
            <span>Projects &amp; Apps</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
              {safeIndex + 1} / {filteredProjects.length}
            </span>
          </h2>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MoveHorizontal className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Swipe card or tap arrows</span>
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

      {/* 2. Category Filter Chips (Horizontal Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectFilter(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30"
                  : "bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/70"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* 3. Interactive Swipeable Featured Card */}
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
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md truncate max-w-[150px]">
                {currentProject.category}
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-1.5 pt-0.5">
              <h3 className="text-base font-black text-foreground tracking-tight leading-snug">
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
                <div className="h-12 flex items-center justify-center px-4 rounded-xl bg-secondary/50 text-muted-foreground font-semibold text-xs border border-border/60">
                  <span>Demo Internal</span>
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
                <div className="h-12 flex items-center justify-center px-4 rounded-xl bg-secondary/50 text-muted-foreground font-semibold text-xs border border-border/60">
                  <span>Official Record</span>
                </div>
              )}
            </div>

            {/* Progress Bar / Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {filteredProjects.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > safeIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to project ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    safeIndex === idx
                      ? "w-7 bg-emerald-500"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Complete Application Directory / Feed */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Complete Apps Catalog ({filteredProjects.length})</span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Tap to view in deck
          </span>
        </div>

        <div className="space-y-2">
          {filteredProjects.map((project, idx) => {
            const isSelected = project.id === currentProject.id;
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? "bg-card border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30"
                    : "bg-card/60 hover:bg-card border-border/70 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 overflow-hidden border border-border/60 shrink-0 flex items-center justify-center relative">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Globe className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-foreground truncate">
                        {project.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                      {project.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {project.tech.slice(0, 3).join(" • ")}
                    </span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 active:scale-95 transition-transform"
                      aria-label="Open Live Demo"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-secondary hover:bg-accent text-foreground border border-border active:scale-95 transition-transform"
                      aria-label="View Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
