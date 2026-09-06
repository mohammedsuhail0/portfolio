"use client";

import React, { useState } from "react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import {
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  TextRevealCard,
  TextRevealCardTitle,
  TextRevealCardDescription,
} from "@/components/ui/text-reveal-card";

export function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [hoveredText, setHoveredText] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(type);

    // Trigger subtle confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 },
      colors: ["#9333ea", "#6366f1", "#3b82f6"],
    });

    setTimeout(() => {
      setCopiedEmail(null);
    }, 2500);
  };

  const socialsList = [
    { name: "LinkedIn", href: PERSONAL_INFO.socials.linkedin, icon: Linkedin },
    { name: "GitHub", href: PERSONAL_INFO.socials.github, icon: Github },
    { name: "WhatsApp", href: PERSONAL_INFO.socials.whatsapp, icon: MessageCircle },
    { name: "Call Me", href: PERSONAL_INFO.socials.phone, icon: Phone },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/50">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 mb-2 block">
          Get In Touch
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-4">
          Need a <span className="text-purple-600 dark:text-purple-400">Developer</span> or an{" "}
          <span className="text-indigo-600 dark:text-indigo-400">AI/ML Engineer?</span>
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-full mb-6" />
        <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
          Whether you have an ambitious AI/ML project, an internship opportunity, or want to discuss full-stack development, feel free to connect!
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-full border border-border/60">
          <MapPin className="w-3.5 h-3.5 text-purple-500" />
          <span>{PERSONAL_INFO.locationFull}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Shoot me an email with copy button */}
          <div className="rounded-3xl border border-border/80 bg-card p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Shoot me an email
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Click below to copy my primary or secondary email directly to your clipboard.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              {/* Primary Gmail */}
              <button
                onClick={() => handleCopy(PERSONAL_INFO.email, "gmail")}
                className="w-full relative inline-flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all duration-200 active:scale-95"
              >
                <span className="truncate">{PERSONAL_INFO.email}</span>
                {copiedEmail === "gmail" ? (
                  <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 shrink-0 opacity-80" />
                )}
              </button>

              {/* Secondary Outlook */}
              {PERSONAL_INFO.secondaryEmail && (
                <button
                  onClick={() => handleCopy(PERSONAL_INFO.secondaryEmail, "outlook")}
                  className="w-full relative inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground bg-secondary/70 hover:bg-secondary border border-border/80 transition-all active:scale-95"
                >
                  <span className="truncate">{PERSONAL_INFO.secondaryEmail}</span>
                  {copiedEmail === "outlook" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Connect With Me On Socials & Phone */}
          <div className="rounded-3xl border border-border/80 bg-card p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Connect Directly
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Feel free to connect on LinkedIn, browse code on GitHub, or reach out directly on WhatsApp or Call.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
              {socialsList.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/60 hover:bg-accent border border-border/80 text-foreground text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 hover:border-purple-500/40"
                  >
                    <Icon className="w-4 h-4 text-purple-500" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aceternity UI Interactive Hover Text Reveal Card (As seen in Susmita Dey / Aceternity) */}
        <div className="flex items-center justify-center w-full">
          <TextRevealCard
            text="You know the business"
            revealText="I know the chemistry"
            className="w-full"
          >
            <TextRevealCardTitle>
              Sometimes, you just need to see it.
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              Hover to see it; maybe you&apos;d like to connect with me for your next project!
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>
      </div>
    </section>
  );
}
