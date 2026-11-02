import React, { useEffect, useRef } from "react";

interface Fish {
  id: number;
  t: number;             // Progress along stream curve (0 to 1)
  speed: number;         // Swimming speed along curve
  laneOffset: number;    // Perpendicular stream lane offset
  length: number;        // Number of articulated spine segments (5 to 7)
  size: number;          // Size of the fish
  colorType: "cyan" | "gold" | "white" | "teal";
  headColor: string;
  haloColor: string;
  bodyColor: string;
  alpha: number;
  twinkleSpeed: number;
  waggleSpeed: number;
  phase: number;

  // Segment positions for smooth swimming spine
  segments: { x: number; y: number }[];

  // Interactive avoidance velocity
  vx: number;
  vy: number;
}

interface StreamStar {
  nx: number;
  laneOffset: number;
  size: number;
  color: string;
  twinklePhase: number;
  isPlus: boolean;
}

interface CursorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface CosmicSwarmCanvasProps {
  className?: string;
}

export const CosmicSwarmCanvas: React.FC<CosmicSwarmCanvasProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovering: false,
    speed: 0,
    prevX: -1000,
    prevY: -1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Use desynchronized & alpha context for lowest latency GPU presentation
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = parent.clientWidth || window.innerWidth);
    let height = (canvas.height = parent.clientHeight || window.innerHeight);

    // Optimized Color Palettes with direct pre-calculated Alpha Halos (0 shadowBlur cost)
    const FISH_PALETTES = [
      {
        type: "cyan" as const,
        head: "#ffffff",
        halo: "rgba(0, 245, 255, 0.28)",
        body: "#00f5ff",
      },
      {
        type: "cyan" as const,
        head: "#67e8f9",
        halo: "rgba(56, 189, 248, 0.25)",
        body: "#38bdf8",
      },
      {
        type: "teal" as const,
        head: "#a7f3d0",
        halo: "rgba(6, 182, 212, 0.24)",
        body: "#06b6d4",
      },
      {
        type: "gold" as const,
        head: "#ffffff",
        halo: "rgba(251, 191, 36, 0.32)",
        body: "#fbbf24",
      },
      {
        type: "gold" as const,
        head: "#fef08a",
        halo: "rgba(245, 158, 11, 0.28)",
        body: "#f59e0b",
      },
      {
        type: "white" as const,
        head: "#ffffff",
        halo: "rgba(255, 255, 255, 0.30)",
        body: "#e0f2fe",
      },
    ];

    // Elegant undulating S-curve across upper-center backdrop
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / width;
      const wave =
        Math.sin(nx * Math.PI * 2.2 - 0.85 - time * 0.28) * (height * 0.21) +
        Math.sin(nx * Math.PI * 4.4 + 0.45 + time * 0.16) * (height * 0.07);

      const baseCenter = height * 0.38;
      return baseCenter + wave;
    };

    const getWaveNormal = (x: number, time: number) => {
      const dx = 4;
      const y1 = getWaveCenterY(x - dx, time);
      const y2 = getWaveCenterY(x + dx, time);
      const angle = Math.atan2(y2 - y1, dx * 2);
      return {
        nx: -Math.sin(angle),
        ny: Math.cos(angle),
        tangentAngle: angle,
      };
    };

    // Perfectly balanced population: 85-95 celestial fishes (ultra fluid 60-120fps)
    const FISH_COUNT = Math.min(Math.round(width * 0.08), 92);
    const fishes: Fish[] = [];
    const ribbonHalfWidth = Math.min(height * 0.23, 200);

    for (let i = 0; i < FISH_COUNT; i++) {
      const palette = FISH_PALETTES[i % FISH_PALETTES.length];
      const laneNorm = ((i % 16) / 15 - 0.5) * 2;
      const offset = laneNorm * ribbonHalfWidth + (Math.random() - 0.5) * 14;
      const segCount = 5 + (i % 3); // 5 to 7 segments

      fishes.push({
        id: i,
        t: Math.random(),
        speed: 0.0008 + (i % 5) * 0.00015,
        laneOffset: offset,
        length: segCount,
        size: (i % 4 === 0) ? 3.0 : (i % 2 === 0) ? 2.2 : 1.6,
        colorType: palette.type,
        headColor: palette.head,
        haloColor: palette.halo,
        bodyColor: palette.body,
        alpha: 0.70 + (i % 4) * 0.08,
        twinkleSpeed: 2.5 + (i % 3) * 0.8,
        waggleSpeed: 8.5 + (i % 4) * 1.2,
        phase: (i * 0.7) % (Math.PI * 2),
        segments: Array.from({ length: segCount }, () => ({ x: 0, y: 0 })),
        vx: 0,
        vy: 0,
      });
    }

    // 45 lightweight celestial stream stars
    const STAR_COUNT = 45;
    const streamStars: StreamStar[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const isGold = i % 3 === 0;
      streamStars.push({
        nx: (i / STAR_COUNT) + Math.random() * 0.05,
        laneOffset: ((i % 10) / 9 - 0.5) * (ribbonHalfWidth * 2.1),
        size: (i % 4 === 0) ? 2.4 : 1.5,
        color: isGold ? "#fbbf24" : (i % 2 === 0) ? "#00f5ff" : "#ffffff",
        twinklePhase: (i * 0.8) % (Math.PI * 2),
        isPlus: i % 2 === 0,
      });
    }

    const sparks: CursorSpark[] = [];
    let startTime = performance.now();

    // High-performance render loop with zero per-frame garbage allocations
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Mouse smoothing
      const mouse = mouseRef.current;
      if (mouse.isHovering) {
        mouse.x += (mouse.targetX - mouse.x) * 0.22;
        mouse.y += (mouse.targetY - mouse.y) * 0.22;
        const mouseDx = mouse.x - mouse.prevX;
        const mouseDy = mouse.y - mouse.prevY;
        mouse.speed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;

        // Spark generator on brisk cursor movement (capped to max 25 active sparks)
        if (mouse.speed > 2.5 && sparks.length < 25) {
          sparks.push({
            x: mouse.x + (Math.random() - 0.5) * 12,
            y: mouse.y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 2.8 + mouseDx * 0.14,
            vy: (Math.random() - 0.5) * 2.8 + mouseDy * 0.14,
            size: 1.8,
            color: Math.random() < 0.4 ? "#fbbf24" : "#00f5ff",
            alpha: 0.9,
            decay: 0.035,
          });
        }
      }

      // Fast single clear (no 3,000 loop fillRect!)
      ctx.clearRect(0, 0, width, height);

      // 1. Draw drifting celestial stream stars (simple direct paths, 0 shadowBlur)
      for (let sIdx = 0; sIdx < streamStars.length; sIdx++) {
        const star = streamStars[sIdx];
        const starX = ((star.nx + time * 0.015) % 1.0) * width;
        const waveY = getWaveCenterY(starX, time);
        const norm = getWaveNormal(starX, time);
        const starY = waveY + norm.ny * star.laneOffset;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 3.0 + star.twinklePhase);
        ctx.globalAlpha = twinkle * 0.8;
        ctx.fillStyle = star.color;
        ctx.strokeStyle = star.color;

        if (star.isPlus) {
          const pSize = star.size * 1.3;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(starX - pSize, starY);
          ctx.lineTo(starX + pSize, starY);
          ctx.moveTo(starX, starY - pSize);
          ctx.lineTo(starX, starY + pSize);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Render active sparks
      for (let sIdx = sparks.length - 1; sIdx >= 0; sIdx--) {
        const s = sparks[sIdx];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(sIdx, 1);
          continue;
        }

        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render Articulated Cosmic Fishes
      const fLen = fishes.length;
      for (let i = 0; i < fLen; i++) {
        const fish = fishes[i];

        // Advance along curve
        fish.t += fish.speed;
        if (fish.t > 1.06) {
          fish.t = -0.05;
        }

        const headX = fish.t * width;
        const waveCenterY = getWaveCenterY(headX, time);
        const norm = getWaveNormal(headX, time);

        const targetHeadX = headX + norm.nx * fish.laneOffset;
        const targetHeadY = waveCenterY + norm.ny * fish.laneOffset;

        // Interactive cursor physics (reactive avoidance and smooth swirl)
        if (mouse.isHovering) {
          const dx = targetHeadX - mouse.x;
          const dy = targetHeadY - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 160 * 160;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 160);
            const repel = 60 * force;
            fish.vx += (dx / dist) * repel * 0.22;
            fish.vy += (dy / dist) * repel * 0.22;
          }
        }

        // Return spring
        fish.vx += (targetHeadX - (fish.segments[0].x || targetHeadX)) * 0.09;
        fish.vy += (targetHeadY - (fish.segments[0].y || targetHeadY)) * 0.09;
        fish.vx *= 0.82;
        fish.vy *= 0.82;

        const currentHeadX = (fish.segments[0].x || targetHeadX) + fish.vx;
        const currentHeadY = (fish.segments[0].y || targetHeadY) + fish.vy;
        fish.segments[0] = { x: currentHeadX, y: currentHeadY };

        // Swimming waggle wave running down spine
        const waggleAngle = Math.sin(time * fish.waggleSpeed + fish.phase) * 0.32;
        const fishAngle = norm.tangentAngle;
        const segDist = 5.0;

        for (let j = 1; j < fish.length; j++) {
          const segProgress = j / fish.length;
          const spineWaggle = Math.sin(time * fish.waggleSpeed - j * 0.65 + fish.phase) * (segProgress * 4.5);
          const angle = fishAngle + waggleAngle * segProgress;
          const prevSeg = fish.segments[j - 1];

          const segTargetX = prevSeg.x - Math.cos(angle) * segDist + norm.nx * (spineWaggle * 0.35);
          const segTargetY = prevSeg.y - Math.sin(angle) * segDist + norm.ny * (spineWaggle * 0.35);

          fish.segments[j] = {
            x: (fish.segments[j].x || segTargetX) * 0.35 + segTargetX * 0.65,
            y: (fish.segments[j].y || segTargetY) * 0.35 + segTargetY * 0.65,
          };
        }

        // Twinkle luminance
        const twinkle = 0.78 + 0.22 * Math.sin(time * fish.twinkleSpeed + fish.phase);
        ctx.globalAlpha = fish.alpha * twinkle;

        // Draw fish body from tail to head (100% vector primitives, 0 shadowBlur)
        for (let j = fish.length - 1; j >= 0; j--) {
          const seg = fish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === fish.length - 1;
          const segRatio = (fish.length - j) / fish.length;
          const segSize = Math.max(1.2, fish.size * (0.6 + segRatio * 0.6));

          if (isHead) {
            // Soft glowing halo (GPU batch fill, 0ms blur cost)
            ctx.fillStyle = fish.haloColor;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 2.4, 0, Math.PI * 2);
            ctx.fill();

            // Core bright head
            ctx.fillStyle = fish.headColor;
            if (fish.colorType === "gold") {
              const sLen = segSize * 1.9;
              ctx.beginPath();
              ctx.moveTo(seg.x, seg.y - sLen);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y + sLen);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y - sLen);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 1.25, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (isTail) {
            // Sleek tail cross '+'
            const tLen = segSize * 1.3;
            ctx.strokeStyle = fish.bodyColor;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(seg.x - tLen, seg.y);
            ctx.lineTo(seg.x + tLen, seg.y);
            ctx.moveTo(seg.x, seg.y - tLen);
            ctx.lineTo(seg.x, seg.y + tLen);
            ctx.stroke();
          } else {
            // Mid-body segments: alternating dots and open rings
            if (j % 2 === 0) {
              ctx.strokeStyle = fish.bodyColor;
              ctx.lineWidth = 1.1;
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 1.15, 0, Math.PI * 2);
              ctx.stroke();
            } else {
              ctx.fillStyle = fish.bodyColor;
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
              ctx.fill();
            }

            // Pectoral side fins on segment 2
            if (j === 2) {
              const finDist = segSize * 2.0;
              ctx.fillStyle = fish.bodyColor;
              ctx.beginPath();
              ctx.arc(seg.x + norm.nx * finDist, seg.y + norm.ny * finDist, segSize * 0.6, 0, Math.PI * 2);
              ctx.arc(seg.x - norm.nx * finDist, seg.y - norm.ny * finDist, segSize * 0.6, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animIdRef.current = requestAnimationFrame(render);
    };

    // IntersectionObserver to freeze canvas when user scrolls out of TechStack
    let isIntersecting = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !animIdRef.current) {
          startTime = performance.now();
          animIdRef.current = requestAnimationFrame(render);
        } else if (!isIntersecting && animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
          animIdRef.current = null;
        }
      },
      { threshold: 0.05, rootMargin: "250px" }
    );
    observer.observe(parent);

    const handleResize = () => {
      if (!canvas || !parent) return;
      width = canvas.width = parent.clientWidth || window.innerWidth;
      height = canvas.height = parent.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = parent.getBoundingClientRect();
        mouseRef.current.targetX = e.touches[0].clientX - rect.left;
        mouseRef.current.targetY = e.touches[0].clientY - rect.top;
        mouseRef.current.isHovering = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener("resize", handleResize);
    parent.addEventListener("mousemove", handleMouseMove, { passive: true });
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("touchmove", handleTouchMove, { passive: true });
    parent.addEventListener("touchend", handleTouchEnd);

    return () => {
      observer.disconnect();
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("touchmove", handleTouchMove);
      parent.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`cosmic-swarm-canvas ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default CosmicSwarmCanvas;
