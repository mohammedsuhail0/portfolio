"use client";

import React from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 border-t border-border/60 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="text-xl font-bold text-foreground flex items-center gap-1">
            <span>{PERSONAL_INFO.shortName}</span>
            <span className="text-purple-500">.</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. Made by Suhail.
          </p>
        </div>

        {/* Center Social Pills */}
        <div className="flex items-center gap-3">
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-xl bg-secondary/60 hover:bg-accent border border-border/80 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-xl bg-secondary/60 hover:bg-accent border border-border/80 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.email}
            aria-label="Email"
            className="p-2 rounded-xl bg-secondary/60 hover:bg-accent border border-border/80 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Back to top button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/60 hover:bg-accent border border-border/80 text-xs font-semibold text-foreground transition-all hover:scale-105 active:scale-95"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 text-purple-500" />
        </button>

      </div>
    </footer>
  );
}
