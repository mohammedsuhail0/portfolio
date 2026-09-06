"use client";

import React from "react";
import Link from "next/link";
import { Spotlight } from "./Spotlight";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { ArrowDown, Rocket, Sparkles, Code2, Brain, Download } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Aceternity Spotlight Background Beam */}
      <Spotlight className="-top-36 left-0 md:left-64 md:-top-20" fill="#9333ea" />

      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center border border-border/70 rounded-3xl p-6 sm:p-10 lg:p-12 bg-card/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
          
          {/* Subtle decorative glow accents */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 shadow-inner"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>💼 {PERSONAL_INFO.statusBadge}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              Hello, I&apos;m{" "}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                {PERSONAL_INFO.name}.
              </span>
            </motion.h1>

            {/* Bio & Intro Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              An Information Technology undergrad (Class of 2028) specializing in{" "}
              <strong className="text-foreground font-semibold">Data Science &amp; Machine Learning</strong>, and{" "}
              <strong className="text-foreground font-semibold">Google Virtual Intern (AI/ML)</strong>. Focused on engineering
              efficient, intelligent systems and modern full-stack web architectures; based in{" "}
              <strong className="text-purple-500 font-semibold">{PERSONAL_INFO.location}!</strong>
            </motion.p>

            {/* Live Metric Counters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="py-2 w-full max-w-xl"
            >
              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/80">
                {PERSONAL_INFO.stats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center text-center ${
                      idx !== 0 ? "border-l border-border/60 pl-2" : ""
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {stat.label}
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-foreground my-0.5 text-purple-600 dark:text-purple-400">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.sublabel}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Hire Me!</span>
                <Rocket className="w-4 h-4 animate-bounce" />
              </a>

              <a
                href={PERSONAL_INFO.resumeUrl}
                download="Mohammed_Suhail_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              <Link
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm sm:text-base font-semibold text-foreground bg-secondary/80 hover:bg-accent border border-border rounded-xl shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Check My Work</span>
                <ArrowDown className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right Portrait Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-border/80 bg-card p-2.5 shadow-2xl">
                <div className="relative h-[380px] sm:h-[440px] w-full rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-end p-6 border border-purple-500/20">
                  
                  {/* Real Photo */}
                  <img
                    src="/suhail-hero-portrait.png"
                    alt={PERSONAL_INFO.name}
                    className="absolute inset-0 w-full h-full object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient shadow overlay for readable typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-purple-500/30 text-purple-200 border border-purple-400/30 backdrop-blur-md mb-2">
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span>{PERSONAL_INFO.role}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-0.5">
                      {PERSONAL_INFO.name}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                      Specialized in Data Science &bull; Google Virtual Intern (AI/ML)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
