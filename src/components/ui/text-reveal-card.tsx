"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMove(clientX: number) {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setWidthPercentage(pct);
    }
  }

  function mouseMoveHandler(event: React.MouseEvent<HTMLDivElement>) {
    handleMove(event.clientX);
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }

  function mouseEnterHandler() {
    setIsMouseOver(true);
  }

  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches && event.touches[0]) {
      handleMove(event.touches[0].clientX);
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1;

  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={cardRef}
      className={cn(
        "bg-card border border-border/80 dark:bg-[#090a0f] dark:border-white/[0.08] w-full rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-300 hover:border-emerald-500/40 select-none cursor-pointer",
        className
      )}
    >
      {children}

      <div className="h-32 sm:h-40 relative flex items-center overflow-hidden mt-4">
        {/* Revealed bright text layer */}
        <div
          style={{
            clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
            opacity: isMouseOver ? (widthPercentage > 0 ? 1 : 0) : 0,
            transition: isMouseOver ? "opacity 0.1s ease" : "clip-path 0.4s ease, opacity 0.4s ease",
          }}
          className="absolute inset-0 bg-card dark:bg-[#090a0f] z-20 flex items-center will-change-transform"
        >
          <p
            style={{
              textShadow: "0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.3)",
            }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-white dark:via-emerald-100 dark:to-teal-200 py-4 truncate"
          >
            {revealText}
          </p>
        </div>

        {/* Glowing Cursor Reveal Divider Line */}
        <div
          style={{
            left: `${widthPercentage}%`,
            transform: `rotate(${rotateDeg}deg)`,
            opacity: isMouseOver && widthPercentage > 0 ? 1 : 0,
            transition: isMouseOver ? "none" : "left 0.4s ease, opacity 0.4s ease",
          }}
          className="h-40 w-[3px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent absolute z-50 will-change-transform shadow-[0_0_14px_rgba(16,185,129,0.9)] pointer-events-none"
        />

        {/* Base text layer */}
        <div className="overflow-hidden w-full relative">
          <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-300 dark:text-zinc-700 py-4 truncate select-none">
            {text}
          </p>
          {mounted && <MemoizedStars />}
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-foreground text-lg sm:text-xl font-bold mb-2", className)}>
      {children}
    </h2>
  );
};

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-muted-foreground text-xs sm:text-sm max-w-lg leading-relaxed", className)}>
      {children}
    </p>
  );
};

const Stars = () => {
  const [stars, setStars] = useState<Array<{ top: number; left: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
          }}
          className="inline-block bg-emerald-500/40 dark:bg-slate-200 shadow-[0_0_4px_rgba(16,185,129,0.3)] dark:shadow-[0_0_4px_rgba(255,255,255,0.8)]"
        />
      ))}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
