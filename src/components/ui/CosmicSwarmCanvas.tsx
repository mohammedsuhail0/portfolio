import React, { useEffect, useRef } from "react";

interface Particle {
  t: number;             // progress along the curve (0 to 1+)
  speed: number;         // speed along the curve
  offset: number;        // perpendicular displacement from ribbon centerline
  targetOffset: number;
  size: number;          // particle visual size
  type: "dot" | "ring" | "plus" | "star"; // ASCII / halftone glyph type
  color: string;         // primary render color
  glowColor: string;
  alpha: number;         // base alpha
  twinkleSpeed: number;  // flicker oscillation rate
  phase: number;

  // Real-time physical position & dynamics
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Spark {
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
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);

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

    // Color palette matching the user's reference:
    // Electric Cyan, Bright Turquoise, Luminous Amber Gold, Pure White Sparks
    const PALETTE = [
      { color: "#38bdf8", glow: "rgba(56, 189, 248, 0.65)", type: "dot" as const },
      { color: "#00f5ff", glow: "rgba(0, 245, 255, 0.75)", type: "ring" as const },
      { color: "#06b6d4", glow: "rgba(6, 182, 212, 0.55)", type: "dot" as const },
      { color: "#2dd4bf", glow: "rgba(45, 212, 191, 0.50)", type: "plus" as const },
      { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.75)", type: "star" as const }, // amber gold
      { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.65)", type: "plus" as const }, // warm gold
      { color: "#ffffff", glow: "rgba(255, 255, 255, 0.85)", type: "star" as const }, // bright star
      { color: "#67e8f9", glow: "rgba(103, 232, 249, 0.55)", type: "ring" as const },
    ];

    // Compute ribbon centerline curve across the section
    const getRibbonCenterY = (x: number, time: number) => {
      const normX = x / width;
      // Majestic sweeping curve arcing high across upper-mid of the section
      const wave1 = Math.sin(normX * Math.PI * 2.3 - time * 0.45) * (height * 0.22);
      const wave2 = Math.cos(normX * Math.PI * 4.6 + time * 0.28) * (height * 0.09);
      const wave3 = Math.sin(normX * Math.PI * 6.8 - time * 0.6) * (height * 0.04);
      const baseCenter = height * 0.32;
      return baseCenter + wave1 + wave2 + wave3;
    };

    // Ribbon normal angle for perpendicular thickness
    const getRibbonNormal = (x: number, time: number) => {
      const dx = 4;
      const y1 = getRibbonCenterY(x - dx, time);
      const y2 = getRibbonCenterY(x + dx, time);
      const angle = Math.atan2(y2 - y1, dx * 2);
      return { nx: -Math.sin(angle), ny: Math.cos(angle) };
    };

    // Dense particle population (~800 particles) for high-fidelity cosmic river
    const PARTICLE_COUNT = Math.min(Math.round(width * 0.65), 850);
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pData = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      // Gaussian distribution around the ribbon center
      const r1 = Math.random();
      const r2 = Math.random();
      const spread = (r1 - r2) * (height * 0.26);

      particles.push({
        t: Math.random(),
        speed: 0.00035 + Math.random() * 0.00055,
        offset: spread,
        targetOffset: spread,
        size: Math.random() < 0.2 ? 3.6 : Math.random() < 0.6 ? 2.3 : 1.5,
        type: pData.type,
        color: pData.color,
        glowColor: pData.glow,
        alpha: 0.5 + Math.random() * 0.5,
        twinkleSpeed: 1.5 + Math.random() * 3.0,
        phase: Math.random() * Math.PI * 2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    }

    particlesRef.current = particles;
    let startTime = performance.now();

    // Render loop
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      const mouseDx = mouse.x - mouse.prevX;
      const mouseDy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      ctx.clearRect(0, 0, width, height);

      // Micro dot-grid in the background (matches carbon grid aesthetic)
      ctx.fillStyle = "rgba(255, 255, 255, 0.024)";
      const gridSpacing = 28;
      for (let gx = 0; gx < width; gx += gridSpacing) {
        for (let gy = 0; gy < height; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Spawn interactive trailing sparks when cursor moves fast
      if (mouse.isHovering && mouse.speed > 2.5 && sparksRef.current.length < 50) {
        sparksRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 20,
          y: mouse.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 3 + mouseDx * 0.15,
          vy: (Math.random() - 0.5) * 3 + mouseDy * 0.15,
          size: Math.random() * 2.5 + 1.2,
          color: Math.random() < 0.4 ? "#fbbf24" : "#00f5ff",
          alpha: 0.9,
          decay: 0.025 + Math.random() * 0.02,
        });
      }

      // Render & update cursor sparks
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

      // Render main cosmic swarm ribbon
      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Advance along the sine wave
        p.t += p.speed;
        if (p.t > 1.05) {
          p.t = -0.05;
        }

        const currentX = p.t * width;
        const centerY = getRibbonCenterY(currentX, time);
        const norm = getRibbonNormal(currentX, time);

        // Ribbon target position
        const targetX = currentX + norm.nx * p.offset;
        const targetY = centerY + norm.ny * p.offset;

        // Interactive cursor physics: hydrodynamic deflector & swirl
        if (mouse.isHovering) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius && dist > 0) {
            const force = (1 - dist / influenceRadius);
            const repelStrength = 65 * force;
            const swirlStrength = (mouse.speed * 0.45) * force;

            // Push outward from cursor
            p.vx += (dx / dist) * repelStrength * 0.22;
            p.vy += (dy / dist) * repelStrength * 0.22;

            // Fluid swirl following mouse momentum
            p.vx += (-dy / dist) * swirlStrength * 0.12;
            p.vy += (dx / dist) * swirlStrength * 0.12;
          }
        }

        // Return to ribbon centerline via elastic spring
        p.vx += (targetX - p.x) * 0.085;
        p.vy += (targetY - p.y) * 0.085;

        // Damping
        p.vx *= 0.81;
        p.vy *= 0.81;

        p.x += p.vx;
        p.y += p.vy;

        // Shimmering twinkle factor
        const twinkle = 0.65 + 0.35 * Math.sin(time * p.twinkleSpeed + p.phase);
        const finalAlpha = Math.min(1.0, Math.max(0.12, p.alpha * twinkle));

        ctx.save();
        ctx.globalAlpha = finalAlpha;

        // Render Halftone / ASCII Glyphs matching reference
        switch (p.type) {
          case "ring": {
            // Glowing halftone ring '○'
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 1.45, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.3;
            ctx.stroke();
            break;
          }
          case "plus": {
            // ASCII '+' symbol
            const len = p.size * 1.6;
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.4;
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

    // Attach mouse listeners to the parent section so interaction works anywhere
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

    // Initial positioning
    particles.forEach((p) => {
      const currentX = p.t * width;
      const centerY = getRibbonCenterY(currentX, 0);
      const norm = getRibbonNormal(currentX, 0);
      p.x = currentX + norm.nx * p.offset;
      p.y = centerY + norm.ny * p.offset;
    });

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
