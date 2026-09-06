"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const RANDOM_LANGUAGES_POOL = [
  { text: "నమస్కారం", lang: "Telugu" },
  { text: "नमस्ते", lang: "Hindi" },
  { text: "آداب", lang: "Urdu" },
  { text: "Bonjour", lang: "French" },
  { text: "Hola", lang: "Spanish" },
  { text: "Ciao", lang: "Italian" },
  { text: "こんにちは", lang: "Japanese" },
  { text: "안녕하세요", lang: "Korean" },
  { text: "Guten Tag", lang: "German" },
  { text: "Olá", lang: "Portuguese" },
  { text: "Merhaba", lang: "Turkish" },
  { text: "வணக்கம்", lang: "Tamil" },
  { text: "Nǐ Hǎo", lang: "Mandarin" },
];

export function Preloader() {
  const [greetings, setGreetings] = useState([
    { text: "Hello", lang: "English" },
    { text: "السلام عليكم", lang: "Arabic / Urdu" },
    { text: "నమస్కారం", lang: "Telugu" },
    { text: "Bonjour", lang: "French" },
    { text: "suhail.", lang: "Portfolio" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Hello -> 2. Assalamo Alaikum (MUST) -> 3 & 4. Two Random World Languages -> 5. suhail.
    const shuffledRandoms = [...RANDOM_LANGUAGES_POOL].sort(() => Math.random() - 0.5);
    const activeSequence = [
      { text: "Hello", lang: "English" },
      { text: "السلام عليكم", lang: "Arabic / Urdu" },
      shuffledRandoms[0],
      shuffledRandoms[1],
      { text: "suhail.", lang: "Portfolio" },
    ];
    setGreetings(activeSequence);

    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    // Greeting text cycle - comfortably readable (~580ms per word)
    const totalWords = activeSequence.length;
    const wordInterval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < totalWords - 1) {
          return prev + 1;
        }
        clearInterval(wordInterval);
        return prev;
      });
    }, 580);

    // End loading after completion (allow suhail. to display clearly for ~900ms)
    const endTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 3200);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(endTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  const currentItem = greetings[currentIndex] || greetings[0];
  const isFinalWord = currentIndex === greetings.length - 1;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: "-100vh",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white select-none overflow-hidden transition-colors duration-300 px-4"
        >
          {/* Ambient Background Glow (Adaptive for Light & Dark) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Center Content: Animated Greeting & Language Tag */}
          <div className="flex flex-col items-center justify-center text-center z-10">
            {/* Pulsing indicator pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-semibold text-purple-700 dark:text-purple-300 mb-6 shadow-sm dark:shadow-md"
            >
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span>{isFinalWord ? "MOHAMMED SUHAIL" : currentItem.lang}</span>
            </motion.div>

            {/* Cycling Greeting Word */}
            <div className="h-20 sm:h-28 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentItem.text}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center justify-center drop-shadow-sm"
                >
                  <span className="font-extrabold">{currentItem.text}</span>
                  {isFinalWord && (
                    <span className="text-purple-600 dark:text-purple-400 animate-pulse ml-1 font-black">.</span>
                  )}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Sub-label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-3 tracking-wide"
            >
              AI/ML Engineer &bull; Full-Stack Developer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
