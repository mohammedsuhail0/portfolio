import React, { useEffect, useRef } from "react";

interface Fish {
  id: number;
  t: number;             // progress along the wave (0 to 1)
  speed: number;         // swimming speed
  streamOffset: number;  // perpendicular offset from curve centerline
  baseOffset: number;
  length: number;        // number of spine segments (6 to 10)
  size: number;          // base particle size
  colorType: "cyan" | "gold" | "white" | "teal";
  headColor: string;
  bodyColor: string;
  glowColor: string;
  alpha: number;
  twinkleSpeed: number;
  waggleSpeed: number;
  phase: number;

  // Segment positions for smooth spine trailing
  segments: { x: number; y: number }[];

  // Interactive avoidance velocity
  vx: number;
  vy: number;
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
    // Electric Cyan, Neon Turquoise, Amber Gold, Pure White Spark
    const FISH_PALETTES = [
      {
        type: "cyan" as const,
        head: "#ffffff",
        body: "#00f5ff",
        glow: "rgba(0, 245, 255, 0.75)",
      },
      {
        type: "cyan" as const,
        head: "#67e8f9",
        body: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.70)",
      },
      {
        type: "teal" as const,
        head: "#a7f3d0",
        body: "#06b6d4",
        glow: "rgba(6, 182, 212, 0.65)",
      },
      {
        type: "gold" as const,
        head: "#ffffff",
        body: "#fbbf24",
        glow: "rgba(251, 191, 36, 0.85)",
      },
      {
        type: "gold" as const,
        head: "#fde68a",
        body: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.75)",
      },
      {
        type: "white" as const,
        head: "#ffffff",
        body: "#e0f2fe",
        glow: "rgba(255, 255, 255, 0.90)",
      },
    ];

    // Centerline wave matching the reference image:
    // Flows through the upper half in a sweeping S-curve
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / width;
      const wave =
        Math.sin(nx * Math.PI * 2.15 - 0.75 - time * 0.32) * (height * 0.16) +
        Math.sin(nx * Math.PI * 4.3 + 0.5 + time * 0.20) * (height * 0.05);

      const baseCenter = height * 0.30;
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

    // Spawn 120-150 articulated fish swimming together in tight stream lanes
    const FISH_COUNT = Math.min(Math.round(width * 0.12), 140);
    const fishes: Fish[] = [];

    const ribbonHalfWidth = Math.min(height * 0.17, 130);

    for (let i = 0; i < FISH_COUNT; i++) {
      const palette = FISH_PALETTES[Math.floor(Math.random() * FISH_PALETTES.length)];
      // Streamline lanes distribution
      const r1 = Math.random();
      const r2 = Math.random();
      const offset = (r1 - r2) * ribbonHalfWidth;
      const segCount = 6 + Math.floor(Math.random() * 4); // 6 to 9 segments per fish

      fishes.push({
        id: i,
        t: Math.random(),
        speed: 0.00065 + Math.random() * 0.00055,
        streamOffset: offset,
        baseOffset: offset,
        length: segCount,
        size: Math.random() < 0.25 ? 3.4 : Math.random() < 0.65 ? 2.4 : 1.7,
        colorType: palette.type,
        headColor: palette.head,
        bodyColor: palette.body,
        glowColor: palette.glow,
        alpha: 0.65 + Math.random() * 0.35,
        twinkleSpeed: 2.0 + Math.random() * 3.0,
        waggleSpeed: 7.0 + Math.random() * 4.0,
        phase: Math.random() * Math.PI * 2,
        segments: Array.from({ length: segCount }, () => ({ x: 0, y: 0 })),
        vx: 0,
        vy: 0,
      });
    }

    fishesRef.current = fishes;
    let startTime = performance.now();

    // Render loop
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.16;
      mouse.y += (mouse.targetY - mouse.y) * 0.16;

      const mouseDx = mouse.x - mouse.prevX;
      const mouseDy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      ctx.clearRect(0, 0, width, height);

      // Micro carbon dot-grid in background
      ctx.fillStyle = "rgba(255, 255, 255, 0.024)";
      const gridSpacing = 28;
      for (let gx = 0; gx < width; gx += gridSpacing) {
        for (let gy = 0; gy < height; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Cursor sparks generator
      if (mouse.isHovering && mouse.speed > 2.0 && sparksRef.current.length < 50) {
        sparksRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 16,
          y: mouse.y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 2.8 + mouseDx * 0.15,
          vy: (Math.random() - 0.5) * 2.8 + mouseDy * 0.15,
          size: Math.random() * 2.4 + 1.2,
          color: Math.random() < 0.45 ? "#fbbf24" : "#00f5ff",
          alpha: 0.9,
          decay: 0.028 + Math.random() * 0.02,
        });
      }

      // Render sparks
      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const s = sparksRef.current[sIdx];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.91;
        s.vy *= 0.91;
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

      // Animate and render School of Fishes
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
        const targetHeadX = headX + norm.nx * fish.streamOffset;
        const targetHeadY = waveCenterY + norm.ny * fish.streamOffset;

        // Interactive cursor repulsion / school scattering
        if (mouse.isHovering) {
          const dx = targetHeadX - mouse.x;
          const dy = targetHeadY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius && dist > 0) {
            const force = (1 - dist / influenceRadius);
            const repelStrength = 70 * force;
            const swirlStrength = (mouse.speed * 0.45) * force;

            // Dart away from cursor
            fish.vx += (dx / dist) * repelStrength * 0.22;
            fish.vy += (dy / dist) * repelStrength * 0.22;

            // Swirl in direction of mouse motion
            fish.vx += (-dy / dist) * swirlStrength * 0.12;
            fish.vy += (dx / dist) * swirlStrength * 0.12;
          }
        }

        // Return to stream lane with smooth elastic spring
        fish.vx += (targetHeadX - (fish.segments[0].x || targetHeadX)) * 0.085;
        fish.vy += (targetHeadY - (fish.segments[0].y || targetHeadY)) * 0.085;

        fish.vx *= 0.82;
        fish.vy *= 0.82;

        const currentHeadX = (fish.segments[0].x || targetHeadX) + fish.vx;
        const currentHeadY = (fish.segments[0].y || targetHeadY) + fish.vy;

        fish.segments[0] = { x: currentHeadX, y: currentHeadY };

        // Swimming waggle wave running down the spine
        const waggleAngle = Math.sin(time * fish.waggleSpeed + fish.phase) * 0.35;
        const fishAngle = norm.tangentAngle;

        // Position spine segments trailing behind the head with realistic swimming waggle
        const segDist = 5.5;
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
        const finalAlpha = Math.min(1.0, Math.max(0.2, fish.alpha * twinkle));

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
              ctx.arc(seg.x, seg.y, segSize * 1.3, 0, Math.PI * 2);
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

    animIdRef.current = requestAnimationFrame(render);

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
