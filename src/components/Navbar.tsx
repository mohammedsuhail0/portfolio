"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { Github, Linkedin, Mail, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navLinks = [
    { num: "01", name: "Home", href: "#home" },
    { num: "02", name: "Skills & Stack", href: "#skills" },
    { num: "03", name: "Projects & Journey", href: "#projects" },
    { num: "04", name: "Working Process", href: "#process" },
    { num: "05", name: "Get in Touch", href: "#contact" },
  ];

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Minimal Header Bar: Just Name on Left and Hamburger + Theme on Right */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/40 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Left: Clean Brand Name */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (window.location.hash) {
                window.history.replaceState(null, "", window.location.pathname);
              }
            }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground hover:text-purple-500 transition-colors flex items-center gap-1 group cursor-pointer text-left"
          >
            <span>{PERSONAL_INFO.shortName}</span>
            <span className="text-purple-500 transition-transform duration-300 group-hover:scale-150">.</span>
          </button>

          {/* Right: Theme Toggle & Animated 3-Line Hamburger */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Ayush-Style 3 Lines Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="relative z-50 w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1.5 p-2 bg-card/60 border border-border/80 backdrop-blur hover:bg-accent hover:border-purple-500/50 transition-all duration-300 group shadow-md"
            >
              <span
                className={`w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 transform ${
                  menuOpen ? "rotate-45 translate-y-2 bg-purple-400" : "group-hover:w-7"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : "group-hover:w-5"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 transform ${
                  menuOpen ? "-rotate-45 -translate-y-2 bg-purple-400" : "group-hover:w-7"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Ayush-Style Immersive Full-Screen Animated Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-zinc-50/98 dark:bg-zinc-950/98 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto text-zinc-900 dark:text-white transition-colors duration-300"
          >
            {/* Background decorative glow */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar inside overlay */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between pt-2">
              <span className="text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono font-bold">
                Navigation Menu
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Click link to navigate
              </span>
            </div>

            {/* Main Navigation Links List with Staggered Slide-In */}
            <div className="max-w-4xl mx-auto w-full my-auto py-10">
              <nav className="flex flex-col space-y-4 sm:space-y-6">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.08 * index,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.href);
                      }}
                      className="group flex items-baseline gap-4 sm:gap-8 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 hover:text-purple-600 dark:text-slate-300 dark:hover:text-white transition-all duration-300"
                    >
                      <span className="text-base sm:text-xl font-mono text-purple-600 dark:text-purple-400 font-bold opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        {item.num}.
                      </span>
                      <span className="relative">
                        <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-indigo-600 dark:group-hover:from-purple-400 dark:group-hover:via-pink-400 dark:group-hover:to-indigo-400 transition-all">
                          {item.name}
                        </span>
                        {/* Hover bottom bar */}
                        <span className="absolute left-0 bottom-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full rounded-full" />
                      </span>
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* Resume CTA inside full-screen menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-10 pt-6 border-t border-zinc-200 dark:border-slate-800/80 flex flex-wrap items-center gap-4"
              >
                <a
                  href={PERSONAL_INFO.resumeUrl}
                  download="Mohammed_Suhail_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              </motion.div>
            </div>

            {/* Bottom Footer inside overlay */}
            <div className="max-w-7xl mx-auto w-full pt-4 border-t border-zinc-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-600 dark:text-slate-400 font-mono">
                {PERSONAL_INFO.name} • {PERSONAL_INFO.role}
              </span>

              {/* Social links row */}
              <div className="flex items-center gap-5">
                <a
                  href={PERSONAL_INFO.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 flex items-center gap-1.5 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 flex items-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={PERSONAL_INFO.socials.email}
                  className="text-xs text-zinc-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
