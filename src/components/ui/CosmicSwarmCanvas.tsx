import React, { useEffect, useRef } from "react";

interface StreamParticle {
  streamId: number;      // which streamline track it belongs to
  t: number;             // progress along the curve (0 to 1)
  speed: number;         // speed along the curve
  offset: number;        // displacement from track
  size: number;
  type: "dot" | "ring" | "plus" | "star";
  color: string;
  glowColor: string;
  alpha: number;
  twinkleSpeed: number;
  phase: number;

  // Real-time coordinates
  x: number;
  y: number;
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
  const particlesRef = useRef<StreamParticle[]>([]);
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

    // Exact palette from user reference:
    // Cyan (#00f5ff, #38bdf8), Turquoise (#06b6d4), Warm Amber Gold (#fbbf24, #f59e0b), Pure White (#ffffff)
    const PALETTE = [
      { color: "#38bdf8", glow: "rgba(56, 189, 248, 0.75)", type: "dot" as const },
      { color: "#00f5ff", glow: "rgba(0, 245, 255, 0.85)", type: "ring" as const },
      { color: "#06b6d4", glow: "rgba(6, 182, 212, 0.65)", type: "dot" as const },
      { color: "#67e8f9", glow: "rgba(103, 232, 249, 0.65)", type: "plus" as const },
      { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.85)", type: "star" as const }, // amber spark
      { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.75)", type: "plus" as const }, // warm gold
      { color: "#ffffff", glow: "rgba(255, 255, 255, 0.95)", type: "star" as const }, // bright star
      { color: "#22d3ee", glow: "rgba(34, 211, 238, 0.70)", type: "ring" as const },
    ];

    // Number of parallel streamline tracks in the school of fishes ribbon
    const STREAM_COUNT = 24;

    // Centerline equation matching the exact S-wave curve in reference image:
    // Enters left at ~0.35H -> dips to a trough at ~0.3W, 0.48H -> rises to a crest at ~0.7W, 0.16H -> exits at ~0.32H
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / width;
      const baseWave =
        Math.sin(nx * Math.PI * 2.1 - 0.7 - time * 0.35) * (height * 0.16) +
        Math.sin(nx * Math.PI * 4.2 + 0.4 + time * 0.22) * (height * 0.05);

      const baseCenter = height * 0.32;
      return baseCenter + baseWave;
    };

    // Calculate normal angle for perpendicular stream tracks
    const getWaveNormal = (x: number, time: number) => {
      const dx = 4;
      const y1 = getWaveCenterY(x - dx, time);
      const y2 = getWaveCenterY(x + dx, time);
      const angle = Math.atan2(y2 - y1, dx * 2);
      return { nx: -Math.sin(angle), ny: Math.cos(angle) };
    };

    // Build dense, structured school of particles aligned on parallel streamlines
    const PARTICLES_PER_STREAM = Math.min(Math.round(width * 0.038), 45);
    const particles: StreamParticle[] = [];

    const ribbonHalfWidth = Math.min(height * 0.16, 120);

    for (let s = 0; s < STREAM_COUNT; s++) {
      const streamNorm = (s / (STREAM_COUNT - 1)) * 2 - 1; // -1 to +1
      const streamOffset = streamNorm * ribbonHalfWidth;

      for (let i = 0; i < PARTICLES_PER_STREAM; i++) {
        const pData = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const t = (i / PARTICLES_PER_STREAM) + (Math.random() * 0.03);

        particles.push({
          streamId: s,
          t: t % 1.0,
          speed: 0.00045 + Math.random() * 0.00035 + (1 - Math.abs(streamNorm)) * 0.00015,
          offset: streamOffset + (Math.random() - 0.5) * 6,
          size: Math.random() < 0.2 ? 3.6 : Math.random() < 0.6 ? 2.4 : 1.6,
          type: pData.type,
          color: pData.color,
          glowColor: pData.glow,
          alpha: 0.55 + Math.random() * 0.45,
          twinkleSpeed: 1.8 + Math.random() * 2.8,
          phase: Math.random() * Math.PI * 2,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        });
      }
    }

    particlesRef.current = particles;
    let startTime = performance.now();

    // Main animation loop
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Smooth cursor interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.16;
      mouse.y += (mouse.targetY - mouse.y) * 0.16;

      const mouseDx = mouse.x - mouse.prevX;
      const mouseDy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      ctx.clearRect(0, 0, width, height);

      // Micro dot-grid in the background (carbon mesh)
      ctx.fillStyle = "rgba(255, 255, 255, 0.024)";
      const gridSpacing = 28;
      for (let gx = 0; gx < width; gx += gridSpacing) {
        for (let gy = 0; gy < height; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Cursor sparks generator
      if (mouse.isHovering && mouse.speed > 2.2 && sparksRef.current.length < 45) {
        sparksRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 16,
          y: mouse.y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 2.5 + mouseDx * 0.14,
          vy: (Math.random() - 0.5) * 2.5 + mouseDy * 0.14,
          size: Math.random() * 2.5 + 1.2,
          color: Math.random() < 0.45 ? "#fbbf24" : "#00f5ff",
          alpha: 0.9,
          decay: 0.028 + Math.random() * 0.02,
        });
      }

      // Render & update cursor sparks
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

      // Render School of Fish / Stream Particles
      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Advance along the streamline
        p.t += p.speed;
        if (p.t > 1.05) {
          p.t = -0.05;
        }

        const currentX = p.t * width;
        const centerY = getWaveCenterY(currentX, time);
        const norm = getWaveNormal(currentX, time);

        // Fish swimming undulating spine waggle
        const fishWaggle = Math.sin(time * 3.5 + p.t * 18 + p.phase) * 3.5;

        // Target streamline track point
        const targetX = currentX + norm.nx * (p.offset + fishWaggle);
        const targetY = centerY + norm.ny * (p.offset + fishWaggle);

        // Real-time interactive cursor physics
        if (mouse.isHovering) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius && dist > 0) {
            const force = (1 - dist / influenceRadius);
            const repelStrength = 65 * force;
            const swirlStrength = (mouse.speed * 0.45) * force;

            // Push outward from cursor (school of fish scattering)
            p.vx += (dx / dist) * repelStrength * 0.22;
            p.vy += (dy / dist) * repelStrength * 0.22;

            // Swirl in the direction of mouse movement
            p.vx += (-dy / dist) * swirlStrength * 0.12;
            p.vy += (dx / dist) * swirlStrength * 0.12;
          }
        }

        // Return to track via elastic spring
        p.vx += (targetX - p.x) * 0.088;
        p.vy += (targetY - p.y) * 0.088;

        // Damping
        p.vx *= 0.81;
        p.vy *= 0.81;

        p.x += p.vx;
        p.y += p.vy;

        // Twinkle luminance
        const twinkle = 0.7 + 0.3 * Math.sin(time * p.twinkleSpeed + p.phase);
        const finalAlpha = Math.min(1.0, Math.max(0.15, p.alpha * twinkle));

        ctx.save();
        ctx.globalAlpha = finalAlpha;

        // Render Halftone / ASCII Glyphs exactly matching reference
        switch (p.type) {
          case "ring": {
            // Glowing halftone ring '○'
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 1.45, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.3;
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = 6;
            ctx.stroke();
            break;
          }
          case "plus": {
            // ASCII '+' symbol
            const len = p.size * 1.6;
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.4;
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = 6;
            ctx.moveTo(p.x - len, p.y);
            ctx.lineTo(p.x + len, p.y);
            ctx.moveTo(p.x, p.y - len);
            ctx.lineTo(p.x, p.y + len);
            ctx.stroke();
            break;
          }
          case "star": {
            // Sparkling 4-point star '✦'
            const sLen = p.size * 2.2;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - sLen);
            ctx.quadraticCurveTo(p.x, p.y, p.x + sLen, p.y);
            ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + sLen);
            ctx.quadraticCurveTo(p.x, p.y, p.x - sLen, p.y);
            ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - sLen);
            ctx.fill();
            break;
          }
          default: {
            // Glowing circular dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = p.size > 2.2 ? 8 : 2;
            ctx.fill();
            break;
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
