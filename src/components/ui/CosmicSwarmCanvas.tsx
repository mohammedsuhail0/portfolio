import React, { useEffect, useRef } from "react";

interface Fish {
  id: number;
  t: number;             // Progress along stream curve (0 to 1)
  speed: number;         // Swimming speed along curve
  laneOffset: number;    // Perpendicular stream lane offset
  targetOffset: number;
  length: number;        // Number of articulated spine segments (5 to 9)
  size: number;          // Size of the fish
  colorType: "cyan" | "gold" | "white" | "teal";
  headColor: string;
  bodyColor: string;
  glowColor: string;
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
  nx: number;            // Normalized x position (0 to 1)
  laneOffset: number;    // Perpendicular stream lane offset
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
  const fishesRef = useRef<Fish[]>([]);
  const starsRef = useRef<StreamStar[]>([]);
  const sparksRef = useRef<CursorSpark[]>([]);

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

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = parent.clientWidth || window.innerWidth);
    let height = (canvas.height = parent.clientHeight || window.innerHeight);

    // Color palettes matching reference:
    // Glowing Electric Cyan, Neon Turquoise, Radiant Amber Gold, Pure White Spark
    const FISH_PALETTES = [
      {
        type: "cyan" as const,
        head: "#ffffff",
        body: "#00f5ff",
        glow: "rgba(0, 245, 255, 0.85)",
      },
      {
        type: "cyan" as const,
        head: "#67e8f9",
        body: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.80)",
      },
      {
        type: "teal" as const,
        head: "#a7f3d0",
        body: "#06b6d4",
        glow: "rgba(6, 182, 212, 0.75)",
      },
      {
        type: "gold" as const,
        head: "#ffffff",
        body: "#fbbf24",
        glow: "rgba(251, 191, 36, 0.90)",
      },
      {
        type: "gold" as const,
        head: "#fef08a",
        body: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.85)",
      },
      {
        type: "white" as const,
        head: "#ffffff",
        body: "#e0f2fe",
        glow: "rgba(255, 255, 255, 0.95)",
      },
    ];

    // Elegant undulating S-curve across the upper-center backdrop
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / width;
      const wave =
        Math.sin(nx * Math.PI * 2.2 - 0.85 - time * 0.28) * (height * 0.21) +
        Math.sin(nx * Math.PI * 4.4 + 0.45 + time * 0.16) * (height * 0.07);

      const baseCenter = height * 0.38; // Sweeps across upper half & behind top of tech cards
      return baseCenter + wave;
    };

    // Wave normal (perpendicular vector) for stream lanes
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

    // Dense celestial river of 260-300 articulated space fishes
    const FISH_COUNT = Math.min(Math.round(width * 0.22), 280);
    const fishes: Fish[] = [];

    // Ribbon half-width creates multiple streaming lanes
    const ribbonHalfWidth = Math.min(height * 0.24, 210);

    for (let i = 0; i < FISH_COUNT; i++) {
      const palette = FISH_PALETTES[Math.floor(Math.random() * FISH_PALETTES.length)];
      // Distributed across ~18 parallel lanes
      const laneIndex = Math.floor(Math.random() * 18);
      const laneNorm = (laneIndex / 17 - 0.5) * 2; // -1 to 1
      const offset = laneNorm * ribbonHalfWidth + (Math.random() - 0.5) * 16;
      const segCount = 5 + Math.floor(Math.random() * 4); // 5 to 8 segments per fish

      fishes.push({
        id: i,
        t: Math.random(),
        speed: 0.00075 + Math.random() * 0.00065,
        laneOffset: offset,
        targetOffset: offset,
        length: segCount,
        size: Math.random() < 0.25 ? 3.4 : Math.random() < 0.65 ? 2.4 : 1.7,
        colorType: palette.type,
        headColor: palette.head,
        bodyColor: palette.body,
        glowColor: palette.glow,
        alpha: 0.70 + Math.random() * 0.30,
        twinkleSpeed: 2.2 + Math.random() * 3.5,
        waggleSpeed: 8.0 + Math.random() * 4.0,
        phase: Math.random() * Math.PI * 2,
        segments: Array.from({ length: segCount }, () => ({ x: 0, y: 0 })),
        vx: 0,
        vy: 0,
      });
    }

    // Static/drifting celestial starbursts and micro-crosses embedded in the stream
    const STAR_COUNT = 140;
    const streamStars: StreamStar[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const isGold = Math.random() < 0.30;
      streamStars.push({
        nx: Math.random(),
        laneOffset: (Math.random() - 0.5) * (ribbonHalfWidth * 2.2),
        size: Math.random() < 0.3 ? 2.8 : 1.6,
        color: isGold ? "#fbbf24" : Math.random() < 0.6 ? "#00f5ff" : "#ffffff",
        twinklePhase: Math.random() * Math.PI * 2,
        isPlus: Math.random() < 0.45,
      });
    }

    fishesRef.current = fishes;
    starsRef.current = streamStars;
    let startTime = performance.now();

    // Render loop
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      const mouseDx = mouse.x - mouse.prevX;
      const mouseDy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      ctx.clearRect(0, 0, width, height);

      // Micro carbon dot-grid in background
      ctx.fillStyle = "rgba(255, 255, 255, 0.026)";
      const gridSpacing = 26;
      for (let gx = 0; gx < width; gx += gridSpacing) {
        for (let gy = 0; gy < height; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Render drifting Stream Stars (pluses and sparkling diamond dots)
      for (let sIdx = 0; sIdx < streamStars.length; sIdx++) {
        const star = streamStars[sIdx];
        const starX = ((star.nx + time * 0.02) % 1.0) * width;
        const waveY = getWaveCenterY(starX, time);
        const norm = getWaveNormal(starX, time);
        const starY = waveY + norm.ny * star.laneOffset;

        const twinkle = 0.5 + 0.5 * Math.sin(time * 3.0 + star.twinklePhase);
        ctx.save();
        ctx.globalAlpha = twinkle * 0.85;
        ctx.fillStyle = star.color;
        ctx.strokeStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 6;

        if (star.isPlus) {
          const pSize = star.size * 1.5;
          ctx.lineWidth = 1.1;
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
        ctx.restore();
      }

      // Cursor sparks generator
      if (mouse.isHovering && mouse.speed > 1.8 && sparksRef.current.length < 60) {
        sparksRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 14,
          y: mouse.y + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 3.2 + mouseDx * 0.18,
          vy: (Math.random() - 0.5) * 3.2 + mouseDy * 0.18,
          size: Math.random() * 2.4 + 1.2,
          color: Math.random() < 0.45 ? "#fbbf24" : "#00f5ff",
          alpha: 0.95,
          decay: 0.026 + Math.random() * 0.02,
        });
      }

      // Render sparks
      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const s = sparksRef.current[sIdx];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparksRef.current.splice(sIdx, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Animate and render School of Space Fishes
      const fLen = fishes.length;
      for (let i = 0; i < fLen; i++) {
        const fish = fishes[i];

        // Advance along the curve
        fish.t += fish.speed;
        if (fish.t > 1.08) {
          fish.t = -0.06;
        }

        const headX = fish.t * width;
        const waveCenterY = getWaveCenterY(headX, time);
        const norm = getWaveNormal(headX, time);

        // Target head position with stream lane offset
        const targetHeadX = headX + norm.nx * fish.laneOffset;
        const targetHeadY = waveCenterY + norm.ny * fish.laneOffset;

        // Interactive cursor repulsion / school scattering
        if (mouse.isHovering) {
          const dx = targetHeadX - mouse.x;
          const dy = targetHeadY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius && dist > 0) {
            const force = (1 - dist / influenceRadius);
            const repelStrength = 75 * force;
            const swirlStrength = (mouse.speed * 0.48) * force;

            // Dart away from cursor
            fish.vx += (dx / dist) * repelStrength * 0.24;
            fish.vy += (dy / dist) * repelStrength * 0.24;

            // Swirl in direction of mouse motion
            fish.vx += (-dy / dist) * swirlStrength * 0.14;
            fish.vy += (dx / dist) * swirlStrength * 0.14;
          }
        }

        // Return to stream lane with smooth elastic spring
        fish.vx += (targetHeadX - (fish.segments[0].x || targetHeadX)) * 0.088;
        fish.vy += (targetHeadY - (fish.segments[0].y || targetHeadY)) * 0.088;

        fish.vx *= 0.82;
        fish.vy *= 0.82;

        const currentHeadX = (fish.segments[0].x || targetHeadX) + fish.vx;
        const currentHeadY = (fish.segments[0].y || targetHeadY) + fish.vy;

        fish.segments[0] = { x: currentHeadX, y: currentHeadY };

        // Swimming waggle wave running down the spine
        const waggleAngle = Math.sin(time * fish.waggleSpeed + fish.phase) * 0.35;
        const fishAngle = norm.tangentAngle;

        // Position spine segments trailing behind the head with realistic swimming waggle
        const segDist = 5.2;
        for (let j = 1; j < fish.length; j++) {
          const segProgress = j / fish.length;
          const spineWaggle = Math.sin(time * fish.waggleSpeed - j * 0.6 + fish.phase) * (segProgress * 5.0);

          // Position along swimming heading
          const angle = fishAngle + waggleAngle * segProgress;
          const prevSeg = fish.segments[j - 1];

          // Compute target segment position behind previous segment
          const segTargetX = prevSeg.x - Math.cos(angle) * segDist + norm.nx * (spineWaggle * 0.4);
          const segTargetY = prevSeg.y - Math.sin(angle) * segDist + norm.ny * (spineWaggle * 0.4);

          // Smooth segment follow
          fish.segments[j] = {
            x: (fish.segments[j].x || segTargetX) * 0.4 + segTargetX * 0.6,
            y: (fish.segments[j].y || segTargetY) * 0.4 + segTargetY * 0.6,
          };
        }

        // Twinkle luminance
        const twinkle = 0.75 + 0.25 * Math.sin(time * fish.twinkleSpeed + fish.phase);
        const finalAlpha = Math.min(1.0, Math.max(0.25, fish.alpha * twinkle));

        ctx.save();
        ctx.globalAlpha = finalAlpha;

        // Draw the articulated fish body from tail to head
        for (let j = fish.length - 1; j >= 0; j--) {
          const seg = fish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === fish.length - 1;
          const segRatio = (fish.length - j) / fish.length; // 1 at head, near 0 at tail
          const segSize = Math.max(1.2, fish.size * (0.55 + segRatio * 0.65));

          if (isHead) {
            // Bright Glowing Fish Head
            ctx.fillStyle = fish.headColor;
            ctx.shadowColor = fish.glowColor;
            ctx.shadowBlur = 10;

            if (fish.colorType === "gold") {
              // 4-point golden star for gold fish head
              const sLen = segSize * 2.2;
              ctx.beginPath();
              ctx.moveTo(seg.x, seg.y - sLen);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y + sLen);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y - sLen);
              ctx.fill();
            } else {
              // Luminous head circle
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 1.35, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (isTail) {
            // Fin-like small cross '+' on the tail
            const tLen = segSize * 1.4;
            ctx.strokeStyle = fish.bodyColor;
            ctx.lineWidth = 1.2;
            ctx.shadowColor = fish.glowColor;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(seg.x - tLen, seg.y);
            ctx.lineTo(seg.x + tLen, seg.y);
            ctx.moveTo(seg.x, seg.y - tLen);
            ctx.lineTo(seg.x, seg.y + tLen);
            ctx.stroke();
          } else {
            // Mid-body segments: alternating dots and open rings '○'
            if (j % 2 === 0) {
              // Open ring glyph
              ctx.strokeStyle = fish.bodyColor;
              ctx.lineWidth = 1.2;
              ctx.shadowColor = fish.glowColor;
              ctx.shadowBlur = 5;
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 1.2, 0, Math.PI * 2);
              ctx.stroke();
            } else {
              // Solid dot glyph
              ctx.fillStyle = fish.bodyColor;
              ctx.shadowColor = fish.glowColor;
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
              ctx.fill();
            }

            // Pectoral side fins on segment 2
            if (j === 2) {
              const finDist = segSize * 2.2;
              ctx.fillStyle = fish.bodyColor;
              ctx.beginPath();
              ctx.arc(seg.x + norm.nx * finDist, seg.y + norm.ny * finDist, segSize * 0.65, 0, Math.PI * 2);
              ctx.arc(seg.x - norm.nx * finDist, seg.y - norm.ny * finDist, segSize * 0.65, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(render);
    };

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
      { threshold: 0.05, rootMargin: "300px" }
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
    parent.addEventListener("mousemove", handleMouseMove);
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
