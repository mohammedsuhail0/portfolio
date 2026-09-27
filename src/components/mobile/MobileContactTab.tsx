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
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export function MobileContactTab() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#10b981", "#14b8a6", "#06b6d4"],
    });

    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-3 py-2 px-1 select-none pb-4"
    >
      {/* 1. Header Card */}
      <div className="p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-sm shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-foreground tracking-tight">
            Direct Contact
          </h2>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available Now
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Open for full-stack engineering roles, rapid prototyping, and software collaborations.
        </p>
      </div>

      {/* 2. Primary Direct Channels (WhatsApp & Phone) */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={PERSONAL_INFO.socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-center active:scale-95 transition-all shadow-xs group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-black text-foreground">WhatsApp</span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">Instant Chat</span>
        </a>

        <a
          href={PERSONAL_INFO.socials.phone}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card hover:bg-secondary border border-border text-center active:scale-95 transition-all shadow-xs group"
        >
          <div className="w-11 h-11 rounded-xl bg-secondary text-foreground flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs font-black text-foreground">Phone Call</span>
          <span className="text-[10px] font-mono text-muted-foreground">Direct Dial</span>
        </a>
      </div>

      {/* 3. Email Copy Card */}
      <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Mail className="w-4 h-4 text-emerald-500" />
          <span>Email Addresses</span>
        </div>

        {/* Primary Email */}
        <button
          onClick={() => handleCopy(PERSONAL_INFO.email, "gmail")}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/70 hover:bg-secondary border border-border text-left transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] text-muted-foreground font-mono">Primary (Gmail)</span>
            <span className="text-xs font-mono font-bold text-foreground truncate">
              {PERSONAL_INFO.email}
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-lg bg-background text-[11px] font-mono font-semibold flex items-center gap-1.5 shrink-0 border border-border">
            {copiedType === "gmail" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Copy</span>
              </>
            )}
          </div>
        </button>

        {/* Secondary Email */}
        {PERSONAL_INFO.secondaryEmail && (
          <button
            onClick={() => handleCopy(PERSONAL_INFO.secondaryEmail, "outlook")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/70 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[10px] text-muted-foreground font-mono">Secondary (Outlook)</span>
              <span className="text-xs font-mono font-bold text-foreground truncate">
                {PERSONAL_INFO.secondaryEmail}
              </span>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-background text-[11px] font-mono font-semibold flex items-center gap-1.5 shrink-0 border border-border">
              {copiedType === "outlook" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Copy</span>
                </>
              )}
            </div>
          </button>
        )}
      </div>

      {/* 4. Social Links Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={PERSONAL_INFO.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 flex items-center justify-center gap-2 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-secondary active:scale-95 transition-transform shadow-xs"
        >
          <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
          <span>LinkedIn</span>
        </a>

        <a
          href={PERSONAL_INFO.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 flex items-center justify-center gap-2 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-secondary active:scale-95 transition-transform shadow-xs"
        >
          <Github className="w-4 h-4 text-foreground shrink-0" />
          <span>GitHub</span>
        </a>
      </div>

      {/* 5. Location & Active Status Bar */}
      <div className="p-3 rounded-xl bg-card/60 border border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>{PERSONAL_INFO.location}</span>
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          Hyderabad, India
        </span>
      </div>
    </motion.div>
  );
}
