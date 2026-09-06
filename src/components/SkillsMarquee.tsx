"use client";

import React, { useState } from "react";
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
  SiFastapi,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGithub,
  SiFigma,
} from "react-icons/si";
import { Cpu } from "lucide-react";

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiFastapi,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGithub,
  SiFigma,
};

export function SkillsMarquee() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "AI/ML", "Language", "Framework", "Database", "Tool"];

  const filteredSkills =
    activeCategory === "All"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  // Duplicate for smooth seamless loop
  const marqueeItems = [...SKILLS, ...SKILLS];

  return (
    <section id="skills" className="relative py-20 overflow-hidden bg-secondary/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 mb-2 block">
          Core Technologies &amp; Tools
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">
          Tech Stack &amp; Skills
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-full mx-auto mb-8" />
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Battle-tested toolset spanning deep learning, machine learning pipelines, and modern full-stack web architectures.
        </p>
      </div>

      {/* Infinite Auto-Scrolling Marquee Slider */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee-infinite flex gap-6 sm:gap-8 py-4">
          {marqueeItems.map((skill, index) => {
            const IconComponent = iconMap[skill.iconName] || Cpu;
            return (
              <div
                key={`${skill.name}-${index}`}
                className="group flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
              >
                <div
                  className="text-2xl sm:text-3xl transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                  style={{ color: skill.color }}
                >
                  <IconComponent />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-purple-500 transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">
                    {skill.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredSkills.map((skill) => {
            const IconComponent = iconMap[skill.iconName] || Cpu;
            return (
              <div
                key={skill.name}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/70 hover:border-purple-500/40 hover:bg-accent/40 transition-all duration-200"
              >
                <div className="text-xl" style={{ color: skill.color }}>
                  <IconComponent />
                </div>
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
