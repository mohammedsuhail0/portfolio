import React, { useEffect, useState, useRef } from "react";
import "./styles/ProofStrip.css";

interface StatItem {
  value: string;
  targetNum?: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    // TODO: count the demo links that actually load in the Work section and use the true number (10 live demo links load, 1 repo link)
    value: "11+",
    targetNum: 11,
    suffix: "+",
    label: "LIVE APPS SHIPPED",
  },
  {
    value: "18",
    targetNum: 18,
    label: "PUBLIC REPOS",
  },
  {
    value: "5",
    targetNum: 5,
    label: "HACKATHONS BUILT",
  },
  {
    value: "GRADE O",
    label: "GOOGLE AI/ML INTERNSHIP",
  },
];

export const ProofStrip: React.FC<{ variant?: "desktop" | "mobile" }> = ({
  variant = "desktop",
}) => {
  const [counts, setCounts] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Under prefers-reduced-motion, show final values with no animation
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCounts({
        0: 11,
        1: 18,
        2: 5,
      });
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1200; // ms

          const animateCounts = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts({
              0: Math.round(easeProgress * 11),
              1: Math.round(easeProgress * 18),
              2: Math.round(easeProgress * 5),
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounts);
            }
          };

          requestAnimationFrame(animateCounts);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={containerRef}
      className={`proof-strip-wrapper proof-strip-${variant}`}
      aria-label="Key Proof Statistics"
    >
      {STATS.map((stat, idx) => {
        let displayVal = stat.value;
        if (stat.targetNum !== undefined) {
          const currentNum = counts[idx] ?? stat.targetNum;
          displayVal = `${stat.prefix || ""}${currentNum}${stat.suffix || ""}`;
        }

        return (
          <div key={idx} className="proof-stat-item">
            <span className="proof-stat-number">{displayVal}</span>
            <span className="proof-stat-label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProofStrip;
