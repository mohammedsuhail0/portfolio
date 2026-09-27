"use client";

import React, { useState } from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import {
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  Linkedin,
  Github,
  MapPin,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export function MobileContactTab() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#10b981", "#14b8a6", "#06b6d4"],
    });

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full flex flex-col justify-between py-2 select-none"
    >
      {/* 1. Header */}
      <div className="pb-1 border-b border-border/60">
        <h2 className="text-base font-black text-foreground tracking-tight">
          Direct Contact
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Open for software engineering roles &amp; ML collaborations
        </p>
      </div>

      {/* 2. Direct Channels */}
      <div className="flex-1 flex flex-col justify-center gap-2.5 py-2">
        {/* WhatsApp & Phone */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={PERSONAL_INFO.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-center active:scale-95 transition-transform shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">WhatsApp</span>
            <span className="text-[10px] font-mono text-muted-foreground">Instant chat</span>
          </a>

          <a
            href={PERSONAL_INFO.socials.phone}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-card hover:bg-secondary border border-border text-center active:scale-95 transition-transform shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary text-foreground flex items-center justify-center mb-1.5">
              <Phone className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-foreground">Phone Call</span>
            <span className="text-[10px] font-mono text-muted-foreground">Direct dial</span>
          </a>
        </div>

        {/* Copy Email Tile */}
        <button
          onClick={handleCopyEmail}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-xs hover:border-emerald-500/50 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
              <Mail className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-foreground">Email Address</span>
              <span className="text-[11px] font-mono text-muted-foreground truncate">
                {PERSONAL_INFO.email}
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Copy</span>
              </>
            )}
          </div>
        </button>

        {/* LinkedIn & GitHub */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-secondary active:scale-95 transition-transform shadow-xs"
          >
            <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
            <span>LinkedIn</span>
          </a>

          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-secondary active:scale-95 transition-transform shadow-xs"
          >
            <Github className="w-4 h-4 text-foreground shrink-0" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* 3. Footer indicator */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hyderabad, India</span>
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          Active Now
        </span>
      </div>
    </motion.div>
  );
}
