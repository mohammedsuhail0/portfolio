"use client";

import React, { useState } from "react";
import { WORKING_STEPS } from "@/data/portfolioData";
import { Plus, CheckCircle2, ArrowRight } from "lucide-react";

export function WorkingStyleSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/50">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 mb-2 block">
          Methodology &amp; Workflow
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">
          My <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Style</span> of Working on <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Projects</span>
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-full mb-6" />
        <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
          A disciplined, outcome-driven process ensuring every project is well-architected, thoroughly tested, and delivered on time.
        </p>
      </div>

      {/* 3 Step Interactive Canvas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {WORKING_STEPS.map((step, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={step.stepNumber}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-3xl border border-border/80 bg-card p-8 sm:p-10 h-[380px] sm:h-[420px] flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 group cursor-pointer shadow-lg hover:shadow-2xl hover:border-purple-500/50"
            >
              {/* Corner cross decorations like Susmita's cards */}
              <Plus className="absolute top-3 left-3 w-4 h-4 text-muted-foreground/40 group-hover:text-purple-500 transition-colors" />
              <Plus className="absolute top-3 right-3 w-4 h-4 text-muted-foreground/40 group-hover:text-purple-500 transition-colors" />
              <Plus className="absolute bottom-3 left-3 w-4 h-4 text-muted-foreground/40 group-hover:text-purple-500 transition-colors" />
              <Plus className="absolute bottom-3 right-3 w-4 h-4 text-muted-foreground/40 group-hover:text-purple-500 transition-colors" />

              {/* Animated Matrix dot pattern revealed on hover */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%), radial-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px)",
                  backgroundSize: "100% 100%, 18px 18px",
                }}
              />

              {/* Default State: Center Spinning Conic Button Badge */}
              <div
                className={`absolute z-10 transition-all duration-300 transform ${
                  isHovered
                    ? "opacity-0 scale-75 pointer-events-none -translate-y-8"
                    : "opacity-100 scale-100 translate-y-0"
                }`}
              >
                <div className="relative inline-flex overflow-hidden rounded-full p-[2px] shadow-xl">
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#9333EA_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-lg font-bold text-purple-100 backdrop-blur-3xl">
                    {step.stepNumber}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-mono">
                  Hover to explore
                </p>
              </div>

              {/* Hover State: Revealed Title and Detailed Description */}
              <div
                className={`relative z-20 space-y-4 px-2 transition-all duration-500 transform ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {step.stepNumber}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
