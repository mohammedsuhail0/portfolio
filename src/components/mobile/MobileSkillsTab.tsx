"use client";

import React, { useState, useEffect } from "react";
import { SKILLS, ISkill } from "@/data/portfolioData";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiHuggingface,
  SiFastapi,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiDocker,
  SiGithub,
  SiLinux,
  SiFigma,
} from "react-icons/si";
import { Code2, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiHuggingface,
  SiFastapi,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiDocker,
  SiGithub,
  SiLinux,
  SiFigma,
};

// Real project & architecture mapping
const SKILL_DETAILS: Record<string, { summary: string; project: string }> = {
  Python: { summary: "Core AI modeling, predictive algorithms & backend logic", project: "ShieldSense & AI Agents" },
  PyTorch: { summary: "Deep learning neural architectures, training & tensor math", project: "Model Research & SIH '24" },
  TensorFlow: { summary: "Machine learning pipelines & data classification models", project: "Data Science Certifications" },
  "Scikit-Learn": { summary: "Statistical ML models, feature engineering & regressors", project: "Data Science & Triage" },
  "Hugging Face": { summary: "Transformer pipelines, tokenizers & open-source LLMs", project: "Vernacular Voice & Agents" },
  TypeScript: { summary: "Static type-safety, scalable full-stack state architecture", project: "BroSync & NextPatient" },
  "Next.js": { summary: "SSR App Router, Edge runtime & production full-stack systems", project: "BroSync & NextPatient" },
  "React.js": { summary: "Component lifecycle, responsive state hooks & fluid UIs", project: "Smart Attendance & BroSync" },
  "Tailwind CSS": { summary: "Design system tokens, modern typography & micro-interactions", project: "All Web Deployments" },
  FastAPI: { summary: "High-throughput asynchronous REST microservices & ML APIs", project: "ShieldSense Endpoints" },
  "Node.js": { summary: "Server-side runtimes, asynchronous I/O & API gateways", project: "Smart Attendance Backend" },
  PostgreSQL: { summary: "Relational data structures, SQL modeling & transaction safety", project: "Smart Attendance System" },
  MongoDB: { summary: "NoSQL document collections, dynamic schemas & rapid caching", project: "User Platform Profiles" },
  Redis: { summary: "In-memory caching, pub/sub queues & instant sync latency", project: "BroSync State Sync" },
  Supabase: { summary: "Postgres database auth, real-time channels & row-level security", project: "NextPatient Cloud" },
  Docker: { summary: "Reproducible container environments & cloud deployments", project: "Microservices Infrastructure" },
  "Git & GitHub": { summary: "Version control, collaborative workflows & CI/CD automation", project: "500+ Tracked Contributions" },
  Linux: { summary: "Server administration, bash workflows & production environments", project: "Server Hosting & Cloud" },
};

// Ring 1: Inner Orbit (AI/ML & Core: 5 tools)
const RING1_SKILLS: ISkill[] = [
  SKILLS.find((s) => s.name === "Python")!,
  SKILLS.find((s) => s.name === "PyTorch")!,
  SKILLS.find((s) => s.name === "TensorFlow")!,
  SKILLS.find((s) => s.name === "Scikit-Learn")!,
  SKILLS.find((s) => s.name === "Hugging Face")!,
].filter(Boolean);

// Ring 2: Middle Orbit (Web Systems & APIs: 6 tools)
const RING2_SKILLS: ISkill[] = [
  SKILLS.find((s) => s.name === "TypeScript")!,
  SKILLS.find((s) => s.name === "Next.js")!,
  SKILLS.find((s) => s.name === "React.js")!,
  SKILLS.find((s) => s.name === "Tailwind CSS")!,
  SKILLS.find((s) => s.name === "FastAPI")!,
  SKILLS.find((s) => s.name === "Node.js")!,
].filter(Boolean);

// Ring 3: Outer Orbit (Data, Cloud & DevOps: 7 tools)
const RING3_SKILLS: ISkill[] = [
  SKILLS.find((s) => s.name === "PostgreSQL")!,
  SKILLS.find((s) => s.name === "MongoDB")!,
  SKILLS.find((s) => s.name === "Redis")!,
  SKILLS.find((s) => s.name === "Supabase")!,
  SKILLS.find((s) => s.name === "Docker")!,
  SKILLS.find((s) => s.name === "Git & GitHub")!,
  SKILLS.find((s) => s.name === "Linux")!,
].filter(Boolean);

const ALL_SKILLS_LIST = [...RING1_SKILLS, ...RING2_SKILLS, ...RING3_SKILLS];

export function MobileSkillsTab() {
  const [selectedSkill, setSelectedSkill] = useState<ISkill>(RING1_SKILLS[0]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-cycle the active spotlight if not manually paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSelectedSkill((prev) => {
        const currentIndex = ALL_SKILLS_LIST.findIndex((s) => s.name === prev.name);
        const nextIndex = (currentIndex + 1) % ALL_SKILLS_LIST.length;
        return ALL_SKILLS_LIST[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const ActiveIcon = selectedSkill ? ICON_MAP[selectedSkill.iconName] || Code2 : Code2;
  const activeDetail = SKILL_DETAILS[selectedSkill.name] || {
    summary: selectedSkill.category,
    project: "Production Projects",
  };

  const centerCoord = 138;
  const r1 = 48;  // Inner
  const r2 = 86;  // Middle
  const r3 = 122; // Outer

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-3 py-2 px-1 select-none pb-4"
    >
      {/* 1. Header (Clean text only, No revolving pill buttons) */}
      <div className="pb-1 border-b border-border/60">
        <h2 className="text-base font-black text-foreground tracking-tight">
          Tech Constellation
        </h2>
        <p className="text-[11px] text-muted-foreground">
          3-Ring planetary orbits ({ALL_SKILLS_LIST.length} technologies) &bull; Tap any logo to inspect
        </p>
      </div>

      {/* 2. 3-Ring Revolving Planetary Constellation */}
      <div className="flex-1 flex items-center justify-center relative my-1">
        <div className="relative w-[276px] h-[276px] flex items-center justify-center">
          
          {/* Orbital Starlight Guide Paths */}
          <div className="absolute w-[244px] h-[244px] rounded-full border border-border/70 dark:border-border/60 pointer-events-none shadow-[0_0_20px_-4px_rgba(16,185,129,0.06)]" />
          <div className="absolute w-[172px] h-[172px] rounded-full border border-border/55 dark:border-border/45 pointer-events-none" />
          <div className="absolute w-[96px] h-[96px] rounded-full border border-border/40 dark:border-border/30 pointer-events-none" />

          {/* Ambient Nucleus Energy Aura */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-cyan-500/25 blur-xl animate-nucleus-pulse pointer-events-none" />

          {/* Center Core: Active Spotlight Nucleus */}
          <div className="absolute z-30 flex items-center justify-center pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSkill.name}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.16 }}
                onClick={() => setIsPaused(!isPaused)}
                className="w-17 h-17 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-lg flex flex-col items-center justify-center p-1.5 text-center cursor-pointer active:scale-95 transition-transform"
                style={{
                  boxShadow: `0 0 20px -3px ${selectedSkill.color}35`,
                }}
              >
                <div
                  className="text-xl mb-0.5 transition-colors"
                  style={{ color: selectedSkill.color }}
                >
                  <ActiveIcon />
                </div>
                <span className="text-[10px] font-black text-foreground leading-none truncate max-w-[56px]">
                  {selectedSkill.name}
                </span>
                <span className="text-[7.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight mt-0.5 truncate max-w-[56px]">
                  {selectedSkill.category}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RING 1 (Inner: 5 AI/ML tools revolving clockwise: 22s) */}
          <div
            className={`absolute inset-0 z-20 pointer-events-none ${
              isPaused ? "pause-orbit" : "animate-orbit-ring1"
            }`}
          >
            {RING1_SKILLS.map((skill, index) => {
              const angle = (2 * Math.PI * index) / RING1_SKILLS.length - Math.PI / 2;
              const x = centerCoord + r1 * Math.cos(angle) - 15;
              const y = centerCoord + r1 * Math.sin(angle) - 15;
              const Icon = ICON_MAP[skill.iconName] || Code2;
              const isSelected = selectedSkill.name === skill.name;

              return (
                <div
                  key={skill.name}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  className="absolute pointer-events-auto"
                >
                  <div className={isPaused ? "pause-orbit" : "animate-orbit-ring1-counter"}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setIsPaused(true);
                      }}
                      className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center text-sm transition-all duration-150 active:scale-125 backdrop-blur-md ${
                        isSelected
                          ? "bg-foreground text-background scale-115 ring-2 ring-emerald-500 shadow-md"
                          : "bg-card/90 hover:bg-card border border-border text-foreground shadow-2xs"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 0 14px ${skill.color}60`
                          : `0 3px 10px -2px ${skill.color}25`,
                      }}
                      aria-label={skill.name}
                    >
                      <div style={{ color: isSelected ? undefined : skill.color }}>
                        <Icon />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RING 2 (Middle: 6 Web/API tools revolving counter-clockwise: 34s) */}
          <div
            className={`absolute inset-0 z-15 pointer-events-none ${
              isPaused ? "pause-orbit" : "animate-orbit-ring2"
            }`}
          >
            {RING2_SKILLS.map((skill, index) => {
              const angle = (2 * Math.PI * index) / RING2_SKILLS.length - Math.PI / 2;
              const x = centerCoord + r2 * Math.cos(angle) - 16;
              const y = centerCoord + r2 * Math.sin(angle) - 16;
              const Icon = ICON_MAP[skill.iconName] || Code2;
              const isSelected = selectedSkill.name === skill.name;

              return (
                <div
                  key={skill.name}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  className="absolute pointer-events-auto"
                >
                  <div className={isPaused ? "pause-orbit" : "animate-orbit-ring2-counter"}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setIsPaused(true);
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all duration-150 active:scale-125 backdrop-blur-md ${
                        isSelected
                          ? "bg-foreground text-background scale-115 ring-2 ring-emerald-500 shadow-md"
                          : "bg-card/90 hover:bg-card border border-border text-foreground shadow-2xs"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 0 14px ${skill.color}60`
                          : `0 3px 10px -2px ${skill.color}25`,
                      }}
                      aria-label={skill.name}
                    >
                      <div style={{ color: isSelected ? undefined : skill.color }}>
                        <Icon />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RING 3 (Outer: 7 Cloud/DB/DevOps tools revolving clockwise: 46s) */}
          <div
            className={`absolute inset-0 z-10 pointer-events-none ${
              isPaused ? "pause-orbit" : "animate-orbit-ring3"
            }`}
          >
            {RING3_SKILLS.map((skill, index) => {
              const angle = (2 * Math.PI * index) / RING3_SKILLS.length - Math.PI / 2;
              const x = centerCoord + r3 * Math.cos(angle) - 16;
              const y = centerCoord + r3 * Math.sin(angle) - 16;
              const Icon = ICON_MAP[skill.iconName] || Code2;
              const isSelected = selectedSkill.name === skill.name;

              return (
                <div
                  key={skill.name}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  className="absolute pointer-events-auto"
                >
                  <div className={isPaused ? "pause-orbit" : "animate-orbit-ring3-counter"}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setIsPaused(true);
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all duration-150 active:scale-125 backdrop-blur-md ${
                        isSelected
                          ? "bg-foreground text-background scale-115 ring-2 ring-emerald-500 shadow-md"
                          : "bg-card/90 hover:bg-card border border-border text-foreground shadow-2xs"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 0 14px ${skill.color}60`
                          : `0 3px 10px -2px ${skill.color}25`,
                      }}
                      aria-label={skill.name}
                    >
                      <div style={{ color: isSelected ? undefined : skill.color }}>
                        <Icon />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Real-Time Tech Inspector Console */}
      <div className="rounded-2xl bg-card border border-border/80 p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedSkill.color }}
            />
            <span className="text-xs font-bold text-foreground">
              {selectedSkill.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              &bull; {selectedSkill.category}
            </span>
          </div>

          {/* Subtle click to resume hint */}
          {isPaused ? (
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Resume Motion</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
              <span>Auto-Tracking</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {activeDetail.summary}
        </p>

        <div className="pt-1 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="text-foreground font-semibold">Production Work:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate">
            {activeDetail.project}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
