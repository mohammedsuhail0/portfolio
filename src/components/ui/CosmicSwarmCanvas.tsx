import React, { useEffect, useRef } from "react";

// ============================================================================
// COSMIC SWARM CANVAS: DENSE BIOLUMINESCENT SPACE FISH & CYBER WAVE STREAM
// Faithfully matches reference image: thick, luminous ribbon of cyan & gold
// ============================================================================

interface StreamParticle {
  lane: number;
  laneNorm: number;
  t: number;
  speed: number;
  size: number;
  colorType: "cyan" | "teal" | "gold" | "white";
  color: string;
  halo: string;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isStar: boolean;
  starRotation: number;
}

interface Fish {
  id: number;
  t: number;
  speed: number;
  laneNorm: number;
  length: number;
  size: number;
  headColor: string;
  haloColor: string;
  bodyColor: string;
  alpha: number;
  waggleSpeed: number;
  phase: number;
  segments: { x: number; y: number }[];
  vx: number;
  vy: number;
}

interface BigFish {
  spawnTime: number;
  t: number;
  speed: number;
  length: number;
  size: number;
  phase: number;
  segments: { x: number; y: number }[];
  vx: number;
  vy: number;
}

interface StardustSpark {
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

  const mouseRef = useRef({
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    isHovering: false,
    speed: 0,
    prevX: -2000,
    prevY: -2000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // =========================================================================
    // S-CURVE WAVE PATH (Replicates exact sine crest & trough of Reference Image)
    // =========================================================================
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / (width || 1);
      // Harmonious wave: trough at nx ~0.18, crest at nx ~0.65
      const primary = -Math.sin((nx - 0.18) * Math.PI * 1.55 - time * 0.09) * (height * 0.22);
      const secondary = Math.sin(nx * Math.PI * 3.1 + 0.35 - time * 0.09) * (height * 0.045);
      const baseCenter = height * 0.35;
      return baseCenter + primary + secondary;
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

    // Ribbon configuration: 32 dense parallel streamlines
    const TOTAL_LANES = 32;
    const ribbonHalfWidth = Math.min(height * 0.21, 185);

    // =========================================================================
    // 1. DENSE STREAM PARTICLES (Matches the luminous cyber ribbon in reference)
    // =========================================================================
    // 650 to 800 particles creating a thick, glowing, continuous stream
    const STREAM_PARTICLE_COUNT = Math.min(Math.round(width * 0.46), 780);
    const streamParticles: StreamParticle[] = [];

    for (let i = 0; i < STREAM_PARTICLE_COUNT; i++) {
      const lane = i % TOTAL_LANES;
      const laneNorm = (lane / (TOTAL_LANES - 1) - 0.5) * 2;
      const t = (i / STREAM_PARTICLE_COUNT) + (Math.random() - 0.5) * 0.02;

      // Golden veins winding naturally through the cyan ribbon (like reference image)
      const isGoldVein = Math.sin(t * Math.PI * 5.5 + laneNorm * 2.2) > 0.42;
      const isStar = i % 14 === 0;

      let colorType: "cyan" | "teal" | "gold" | "white" = "cyan";
      let color = "#00f5ff";
      let halo = "rgba(0, 245, 255, 0.32)";

      if (isGoldVein) {
        colorType = "gold";
        color = i % 2 === 0 ? "#fbbf24" : "#f59e0b";
        halo = "rgba(251, 191, 36, 0.36)";
      } else if (isStar) {
        colorType = "white";
        color = "#ffffff";
        halo = "rgba(255, 255, 255, 0.50)";
      } else if (i % 3 === 0) {
        colorType = "teal";
        color = "#06b6d4";
        halo = "rgba(6, 182, 212, 0.28)";
      } else if (i % 3 === 1) {
        colorType = "cyan";
        color = "#38bdf8";
        halo = "rgba(56, 189, 248, 0.30)";
      }

      streamParticles.push({
        lane,
        laneNorm,
        t: Math.random(),
        speed: 0.00028 + (i % 8) * 0.000045,
        size: isStar ? 2.8 : (i % 4 === 0 ? 2.5 : i % 2 === 0 ? 1.9 : 1.3),
        colorType,
        color,
        halo,
        alpha: 0.70 + (i % 5) * 0.06,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 1.6 + Math.random() * 2.0,
        isStar,
        starRotation: Math.random() * Math.PI,
      });
    }

    // =========================================================================
    // 2. CELESTIAL SPACE FISHES (Articulated swimming bioluminescent entities)
    // =========================================================================
    const FISH_COUNT = Math.min(Math.round(width * 0.06), 75);
    const fishes: Fish[] = [];

    const FISH_PALETTES = [
      {
        head: "#ffffff",
        halo: "rgba(0, 245, 255, 0.38)",
        body: "#00f5ff",
      },
      {
        head: "#67e8f9",
        halo: "rgba(56, 189, 248, 0.32)",
        body: "#38bdf8",
      },
      {
        head: "#a7f3d0",
        halo: "rgba(6, 182, 212, 0.30)",
        body: "#06b6d4",
      },
      {
        head: "#ffffff",
        halo: "rgba(251, 191, 36, 0.42)",
        body: "#fbbf24",
      },
      {
        head: "#fef08a",
        halo: "rgba(245, 158, 11, 0.34)",
        body: "#f59e0b",
      },
    ];

    for (let i = 0; i < FISH_COUNT; i++) {
      const palette = FISH_PALETTES[i % FISH_PALETTES.length];
      const laneNorm = ((i % TOTAL_LANES) / (TOTAL_LANES - 1) - 0.5) * 2;
      const segCount = 6 + (i % 3);
      const initT = Math.random();

      const initX = initT * width;
      const initWaveY = getWaveCenterY(initX, 0);
      const initNorm = getWaveNormal(initX, 0);
      const offset = Math.sign(laneNorm) * Math.pow(Math.abs(laneNorm), 1.05) * ribbonHalfWidth;
      const initHeadX = initX + initNorm.nx * offset;
      const initHeadY = initWaveY + initNorm.ny * offset;
      const initAngle = initNorm.tangentAngle;
      const segDist = 5.2;

      const segments = Array.from({ length: segCount }, (_, sIdx) => ({
        x: initHeadX - Math.cos(initAngle) * (sIdx * segDist),
        y: initHeadY - Math.sin(initAngle) * (sIdx * segDist),
      }));

      fishes.push({
        id: i,
        t: initT,
        speed: 0.00038 + (i % 6) * 0.00005,
        laneNorm,
        length: segCount,
        size: i % 4 === 0 ? 3.0 : i % 2 === 0 ? 2.4 : 1.8,
        headColor: palette.head,
        haloColor: palette.halo,
        bodyColor: palette.body,
        alpha: 0.85 + (i % 4) * 0.04,
        waggleSpeed: 4.6 + (i % 4) * 0.5,
        phase: (i * 0.7) % (Math.PI * 2),
        segments,
        vx: 0,
        vy: 0,
      });
    }

    // =========================================================================
    // 3. THE BIG CELESTIAL ALPHA FISH (Appears after 3.2s, majestic 18s cruise)
    // =========================================================================
    const BIG_FISH_SEG_COUNT = 15;
    const bigFish: BigFish = {
      spawnTime: 3.2,
      t: -0.12,
      speed: 0.00085,
      length: BIG_FISH_SEG_COUNT,
      size: 7.8,
      phase: 0,
      segments: Array.from({ length: BIG_FISH_SEG_COUNT }, () => ({ x: -200, y: -200 })),
      vx: 0,
      vy: 0,
    };

    const sparks: StardustSpark[] = [];
    const startTime = performance.now();
    let animId: number;

    const drawSparkleStar = (cx: number, cy: number, size: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.fillStyle = color;

      ctx.beginPath();
      const s = size * 1.8;
      const inner = size * 0.28;
      for (let p = 0; p < 4; p++) {
        const ang = (p * Math.PI) / 2;
        ctx.lineTo(Math.cos(ang) * s, Math.sin(ang) * s);
        const inAng = ang + Math.PI / 4;
        ctx.lineTo(Math.cos(inAng) * inner, Math.sin(inAng) * inner);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // =========================================================================
    // MAIN HIGH-PERFORMANCE RENDER LOOP (60-120fps GPU Composite)
    // =========================================================================
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;

      // Mouse smoothing
      const mouse = mouseRef.current;
      if (mouse.isHovering) {
        mouse.x += (mouse.targetX - mouse.x) * 0.2;
        mouse.y += (mouse.targetY - mouse.y) * 0.2;
        const mdx = mouse.x - mouse.prevX;
        const mdy = mouse.y - mouse.prevY;
        mouse.speed = Math.sqrt(mdx * mdx + mdy * mdy);
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;

        if (mouse.speed > 2.5 && sparks.length < 24) {
          sparks.push({
            x: mouse.x + (Math.random() - 0.5) * 14,
            y: mouse.y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 2.5 + mdx * 0.12,
            vy: (Math.random() - 0.5) * 2.5 + mdy * 0.12,
            size: 1.6,
            color: Math.random() < 0.4 ? "#fbbf24" : "#00f5ff",
            alpha: 0.85,
            decay: 0.032,
          });
        }
      }

      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------------
      // LAYER 1: DENSE STREAM PARTICLES (CYBER RIVER OF LIGHT)
      // -----------------------------------------------------------------------
      const pLen = streamParticles.length;
      for (let i = 0; i < pLen; i++) {
        const p = streamParticles[i];
        p.t += p.speed;
        if (p.t > 1.06) p.t = -0.06;

        const px = p.t * width;
        const waveY = getWaveCenterY(px, time);
        const norm = getWaveNormal(px, time);
        const offset = Math.sign(p.laneNorm) * Math.pow(Math.abs(p.laneNorm), 1.05) * ribbonHalfWidth;
        const py = waveY + norm.ny * offset;

        let edgeAlpha = 1.0;
        if (p.t < 0.06) edgeAlpha = Math.max(0, (p.t + 0.06) / 0.12);
        else if (p.t > 0.94) edgeAlpha = Math.max(0, (1.06 - p.t) / 0.12);

        const twinkle = 0.68 + 0.32 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const finalAlpha = p.alpha * twinkle * edgeAlpha;

        ctx.globalAlpha = finalAlpha;

        if (p.isStar) {
          drawSparkleStar(px, py, p.size, p.color, p.starRotation + time * 0.4);
        } else {
          ctx.fillStyle = p.halo;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // -----------------------------------------------------------------------
      // LAYER 2: INTERACTIVE CURSOR SPARKS
      // -----------------------------------------------------------------------
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

      // -----------------------------------------------------------------------
      // LAYER 3: REGULAR CELESTIAL SPACE FISHES
      // -----------------------------------------------------------------------
      const fLen = fishes.length;
      for (let i = 0; i < fLen; i++) {
        const fish = fishes[i];
        fish.t += fish.speed;

        if (fish.t > 1.08) {
          fish.t = -0.08 - Math.random() * 0.04;
          fish.vx = 0;
          fish.vy = 0;

          const wrapX = fish.t * width;
          const wrapWaveY = getWaveCenterY(wrapX, time);
          const wrapNorm = getWaveNormal(wrapX, time);
          const offset = Math.sign(fish.laneNorm) * Math.pow(Math.abs(fish.laneNorm), 1.05) * ribbonHalfWidth;
          const wrapHeadX = wrapX + wrapNorm.nx * offset;
          const wrapHeadY = wrapWaveY + wrapNorm.ny * offset;
          const wrapAngle = wrapNorm.tangentAngle;
          const segDist = 5.2;

          for (let j = 0; j < fish.length; j++) {
            fish.segments[j].x = wrapHeadX - Math.cos(wrapAngle) * (j * segDist);
            fish.segments[j].y = wrapHeadY - Math.sin(wrapAngle) * (j * segDist);
          }
        }

        const headX = fish.t * width;
        const waveCenterY = getWaveCenterY(headX, time);
        const norm = getWaveNormal(headX, time);
        const offset = Math.sign(fish.laneNorm) * Math.pow(Math.abs(fish.laneNorm), 1.05) * ribbonHalfWidth;

        const targetHeadX = headX + norm.nx * offset;
        const targetHeadY = waveCenterY + norm.ny * offset;

        // Interactive cursor physics
        if (mouse.isHovering) {
          const dx = targetHeadX - mouse.x;
          const dy = targetHeadY - mouse.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 150 * 150;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 150);
            const repel = 45 * force;
            fish.vx += (dx / dist) * repel * 0.16;
            fish.vy += (dy / dist) * repel * 0.16;
          }
        }

        fish.vx += (targetHeadX - (fish.segments[0].x || targetHeadX)) * 0.09;
        fish.vy += (targetHeadY - (fish.segments[0].y || targetHeadY)) * 0.09;
        fish.vx *= 0.84;
        fish.vy *= 0.84;

        const currentHeadX = (fish.segments[0].x || targetHeadX) + fish.vx;
        const currentHeadY = (fish.segments[0].y || targetHeadY) + fish.vy;
        fish.segments[0] = { x: currentHeadX, y: currentHeadY };

        const waggleAngle = Math.sin(time * fish.waggleSpeed + fish.phase) * 0.28;
        const fishAngle = norm.tangentAngle;
        const segDist = 5.2;

        for (let j = 1; j < fish.length; j++) {
          const segProgress = j / fish.length;
          const spineWaggle = Math.sin(time * fish.waggleSpeed - j * 0.65 + fish.phase) * (segProgress * 3.6);
          const angle = fishAngle + waggleAngle * segProgress;
          const prevSeg = fish.segments[j - 1];

          const segTargetX = prevSeg.x - Math.cos(angle) * segDist + norm.nx * (spineWaggle * 0.32);
          const segTargetY = prevSeg.y - Math.sin(angle) * segDist + norm.ny * (spineWaggle * 0.32);

          fish.segments[j] = {
            x: (fish.segments[j].x || segTargetX) * 0.32 + segTargetX * 0.68,
            y: (fish.segments[j].y || segTargetY) * 0.32 + segTargetY * 0.68,
          };
        }

        let edgeAlpha = 1.0;
        if (fish.t < 0.06) edgeAlpha = Math.max(0, (fish.t + 0.08) / 0.14);
        else if (fish.t > 0.94) edgeAlpha = Math.max(0, (1.08 - fish.t) / 0.14);

        const twinkle = 0.8 + 0.2 * Math.sin(time * 2.0 + fish.phase);
        ctx.globalAlpha = fish.alpha * twinkle * edgeAlpha;

        for (let j = fish.length - 1; j >= 0; j--) {
          const seg = fish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === fish.length - 1;
          const segRatio = (fish.length - j) / fish.length;
          const segSize = Math.max(1.2, fish.size * (0.6 + segRatio * 0.6));

          if (isHead) {
            ctx.fillStyle = fish.haloColor;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = fish.headColor;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 1.3, 0, Math.PI * 2);
            ctx.fill();
          } else if (isTail) {
            const tLen = segSize * 1.4;
            ctx.strokeStyle = fish.bodyColor;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(seg.x - tLen, seg.y);
            ctx.lineTo(seg.x + tLen, seg.y);
            ctx.moveTo(seg.x, seg.y - tLen);
            ctx.lineTo(seg.x, seg.y + tLen);
            ctx.stroke();
          } else {
            ctx.fillStyle = fish.bodyColor;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // -----------------------------------------------------------------------
      // LAYER 4: THE BIG CELESTIAL ALPHA FISH
      // -----------------------------------------------------------------------
      if (time >= bigFish.spawnTime) {
        bigFish.t += bigFish.speed;

        if (bigFish.t > 1.15) {
          bigFish.spawnTime = time + 8.0;
          bigFish.t = -0.15;
        }

        const bX = bigFish.t * width;
        const bWaveY = getWaveCenterY(bX, time);
        const bNorm = getWaveNormal(bX, time);

        const targetHeadX = bX;
        const targetHeadY = bWaveY;

        bigFish.vx += (targetHeadX - (bigFish.segments[0].x || targetHeadX)) * 0.08;
        bigFish.vy += (targetHeadY - (bigFish.segments[0].y || targetHeadY)) * 0.08;
        bigFish.vx *= 0.85;
        bigFish.vy *= 0.85;

        const currentHeadX = (bigFish.segments[0].x || targetHeadX) + bigFish.vx;
        const currentHeadY = (bigFish.segments[0].y || targetHeadY) + bigFish.vy;
        bigFish.segments[0] = { x: currentHeadX, y: currentHeadY };

        const bWaggleAngle = Math.sin(time * 3.2) * 0.22;
        const bFishAngle = bNorm.tangentAngle;
        const bSegDist = 8.5;

        for (let j = 1; j < bigFish.length; j++) {
          const segProgress = j / bigFish.length;
          const spineWaggle = Math.sin(time * 3.2 - j * 0.45) * (segProgress * 6.0);
          const angle = bFishAngle + bWaggleAngle * segProgress;
          const prevSeg = bigFish.segments[j - 1];

          const segTargetX = prevSeg.x - Math.cos(angle) * bSegDist + bNorm.nx * (spineWaggle * 0.35);
          const segTargetY = prevSeg.y - Math.sin(angle) * bSegDist + bNorm.ny * (spineWaggle * 0.35);

          bigFish.segments[j] = {
            x: (bigFish.segments[j].x || segTargetX) * 0.3 + segTargetX * 0.7,
            y: (bigFish.segments[j].y || segTargetY) * 0.3 + segTargetY * 0.7,
          };
        }

        let bEdgeAlpha = 1.0;
        if (bigFish.t < 0.06) bEdgeAlpha = Math.max(0, (bigFish.t + 0.15) / 0.21);
        else if (bigFish.t > 0.94) bEdgeAlpha = Math.max(0, (1.15 - bigFish.t) / 0.21);

        ctx.globalAlpha = 0.95 * bEdgeAlpha;

        for (let j = bigFish.length - 1; j >= 0; j--) {
          const seg = bigFish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === bigFish.length - 1;
          const segRatio = (bigFish.length - j) / bigFish.length;
          const segSize = Math.max(2.5, bigFish.size * (0.45 + segRatio * 0.55));

          if (isHead) {
            ctx.fillStyle = "rgba(0, 245, 255, 0.42)";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 3.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "rgba(251, 191, 36, 0.48)";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 2.0, 0, Math.PI * 2);
            ctx.fill();

            drawSparkleStar(seg.x, seg.y, segSize * 1.4, "#ffffff", time * 0.8);
          } else if (isTail) {
            const tLen = segSize * 2.4;
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(seg.x - tLen, seg.y);
            ctx.lineTo(seg.x + tLen, seg.y);
            ctx.moveTo(seg.x, seg.y - tLen);
            ctx.lineTo(seg.x, seg.y + tLen);
            ctx.stroke();
          } else {
            ctx.fillStyle = j % 3 === 0 ? "#fbbf24" : "#00f5ff";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
            ctx.fill();

            if (j >= 3 && j <= 6) {
              const finSpan = (8 - j) * 4.5;
              ctx.strokeStyle = "rgba(0, 245, 255, 0.55)";
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(seg.x + bNorm.nx * finSpan, seg.y + bNorm.ny * finSpan);
              ctx.lineTo(seg.x, seg.y);
              ctx.lineTo(seg.x - bNorm.nx * finSpan, seg.y - bNorm.ny * finSpan);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const m = mouseRef.current;
      m.targetX = clientX;
      m.targetY = clientY;
      m.isHovering = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    };

    canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
};

export default CosmicSwarmCanvas;
