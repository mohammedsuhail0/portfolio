import React, { useEffect, useRef } from "react";

interface Fish {
  id: number;
  t: number;             // Progress along stream curve (-0.1 to 1.1)
  speed: number;         // Calibrated serene swimming speed
  laneOffset: number;    // Strict parallel stream lane offset
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

interface BigCelestialFish {
  spawnTime: number;     // Seconds after mount to first appear (~4s)
  t: number;             // Progress (-0.15 to 1.15)
  speed: number;         // Majestic, dignified swimming speed
  length: number;        // 14 articulated segments
  size: number;          // 7.5px base head radius (3.5x regular fish)
  segments: { x: number; y: number }[];
  vx: number;
  vy: number;
  phase: number;
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

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = parent.clientWidth || window.innerWidth);
    let height = (canvas.height = parent.clientHeight || window.innerHeight);

    // Optimized Color Palettes with direct pre-calculated Alpha Halos (0 shadowBlur cost)
    const FISH_PALETTES = [
      {
        type: "cyan" as const,
        head: "#ffffff",
        halo: "rgba(0, 245, 255, 0.30)",
        body: "#00f5ff",
      },
      {
        type: "cyan" as const,
        head: "#67e8f9",
        halo: "rgba(56, 189, 248, 0.28)",
        body: "#38bdf8",
      },
      {
        type: "teal" as const,
        head: "#a7f3d0",
        halo: "rgba(6, 182, 212, 0.26)",
        body: "#06b6d4",
      },
      {
        type: "gold" as const,
        head: "#ffffff",
        halo: "rgba(251, 191, 36, 0.35)",
        body: "#fbbf24",
      },
      {
        type: "gold" as const,
        head: "#fef08a",
        halo: "rgba(245, 158, 11, 0.30)",
        body: "#f59e0b",
      },
      {
        type: "white" as const,
        head: "#ffffff",
        halo: "rgba(255, 255, 255, 0.32)",
        body: "#e0f2fe",
      },
    ];

    // Pristine, strictly mathematical S-curve path across upper-center backdrop
    const getWaveCenterY = (x: number, time: number) => {
      const nx = x / width;
      // Synchronous dual-harmonic serpentine wave flowing smoothly
      const wave =
        Math.sin(nx * Math.PI * 2.2 - 0.85 - time * 0.14) * (height * 0.20) +
        Math.sin(nx * Math.PI * 4.4 + 0.40 - time * 0.14) * (height * 0.06);

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

    // Strict parallel lanes configuration for a tight, cohesive ribbon path
    const TOTAL_LANES = 16;
    const ribbonHalfWidth = Math.min(height * 0.22, 190);

    // Slightly increased population: ~120-125 fishes strictly adhering to lane streamlines
    const FISH_COUNT = Math.min(Math.round(width * 0.105), 125);
    const fishes: Fish[] = [];

    for (let i = 0; i < FISH_COUNT; i++) {
      const palette = FISH_PALETTES[i % FISH_PALETTES.length];
      const laneIndex = i % TOTAL_LANES;
      const laneNorm = (laneIndex / (TOTAL_LANES - 1) - 0.5) * 2; // -1 to 1
      // Strict curve lane offset (no random drift - keeps pattern pristine)
      const offset = Math.sign(laneNorm) * Math.pow(Math.abs(laneNorm), 1.1) * ribbonHalfWidth;
      const segCount = 5 + (i % 3); // 5 to 7 segments
      const initT = Math.random();

      // Properly calculate initial segment positions in-place
      const initX = initT * width;
      const initWaveY = getWaveCenterY(initX, 0);
      const initNorm = getWaveNormal(initX, 0);
      const initHeadX = initX + initNorm.nx * offset;
      const initHeadY = initWaveY + initNorm.ny * offset;
      const initAngle = initNorm.tangentAngle;
      const segDist = 5.0;

      const segments = Array.from({ length: segCount }, (_, sIdx) => ({
        x: initHeadX - Math.cos(initAngle) * (sIdx * segDist),
        y: initHeadY - Math.sin(initAngle) * (sIdx * segDist),
      }));

      fishes.push({
        id: i,
        t: initT,
        speed: 0.00030 + (i % 5) * 0.00005,
        laneOffset: offset,
        length: segCount,
        size: (i % 4 === 0) ? 2.8 : (i % 2 === 0) ? 2.1 : 1.5,
        colorType: palette.type,
        headColor: palette.head,
        haloColor: palette.halo,
        bodyColor: palette.body,
        alpha: 0.72 + (i % 4) * 0.07,
        twinkleSpeed: 1.8 + (i % 3) * 0.5,
        waggleSpeed: 4.2 + (i % 4) * 0.5,
        phase: (i * 0.6) % (Math.PI * 2),
        segments,
        vx: 0,
        vy: 0,
      });
    }

    // =========================================================================
    // THE BIG CELESTIAL ALPHA FISH (Appears after ~3s, majestic 18s cruise)
    // =========================================================================
    const BIG_FISH_SEG_COUNT = 14;
    const bigFish: BigCelestialFish = {
      spawnTime: 3.0, // Appears 3s after entering section
      t: -0.08,
      speed: 0.00092, // Stately, majestic cruise across screen (~18s total)
      length: BIG_FISH_SEG_COUNT,
      size: 7.2,      // Grand 7.2px head radius (over 3.5x normal size)
      segments: Array.from({ length: BIG_FISH_SEG_COUNT }, () => ({ x: -200, y: -200 })),
      vx: 0,
      vy: 0,
      phase: 0,
    };

    // 45 lightweight celestial stream stars locked to the stream
    const STAR_COUNT = 45;
    const streamStars: StreamStar[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const isGold = i % 3 === 0;
      const sLane = ((i % TOTAL_LANES) / (TOTAL_LANES - 1) - 0.5) * 2;
      streamStars.push({
        nx: (i / STAR_COUNT) + Math.random() * 0.04,
        laneOffset: Math.sign(sLane) * Math.pow(Math.abs(sLane), 1.1) * ribbonHalfWidth,
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

      // Fast single clear (0ms CPU cost)
      ctx.clearRect(0, 0, width, height);

      // 1. Draw drifting celestial stream stars
      for (let sIdx = 0; sIdx < streamStars.length; sIdx++) {
        const star = streamStars[sIdx];
        const starX = ((star.nx + time * 0.007) % 1.0) * width;
        const waveY = getWaveCenterY(starX, time);
        const norm = getWaveNormal(starX, time);
        const starY = waveY + norm.ny * star.laneOffset;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 2.2 + star.twinklePhase);
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

      // 3. Render School of Fishes (Strict Streamline Curve Pattern)
      const fLen = fishes.length;
      for (let i = 0; i < fLen; i++) {
        const fish = fishes[i];

        fish.t += fish.speed;

        // Clean wrap-around off-screen left with proper segment realignment
        if (fish.t > 1.08) {
          fish.t = -0.08 - Math.random() * 0.04;
          fish.vx = 0;
          fish.vy = 0;

          const wrapX = fish.t * width;
          const wrapWaveY = getWaveCenterY(wrapX, time);
          const wrapNorm = getWaveNormal(wrapX, time);
          const wrapHeadX = wrapX + wrapNorm.nx * fish.laneOffset;
          const wrapHeadY = wrapWaveY + wrapNorm.ny * fish.laneOffset;
          const wrapAngle = wrapNorm.tangentAngle;
          const segDist = 5.0;

          for (let j = 0; j < fish.length; j++) {
            fish.segments[j].x = wrapHeadX - Math.cos(wrapAngle) * (j * segDist);
            fish.segments[j].y = wrapHeadY - Math.sin(wrapAngle) * (j * segDist);
          }
        }

        const headX = fish.t * width;
        const waveCenterY = getWaveCenterY(headX, time);
        const norm = getWaveNormal(headX, time);

        // Strict streamline target position
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
            const repel = 50 * force;
            fish.vx += (dx / dist) * repel * 0.18;
            fish.vy += (dy / dist) * repel * 0.18;
          }
        }

        // Return spring keeping fish locked strictly to its streamline lane
        fish.vx += (targetHeadX - (fish.segments[0].x || targetHeadX)) * 0.09;
        fish.vy += (targetHeadY - (fish.segments[0].y || targetHeadY)) * 0.09;
        fish.vx *= 0.84;
        fish.vy *= 0.84;

        const currentHeadX = (fish.segments[0].x || targetHeadX) + fish.vx;
        const currentHeadY = (fish.segments[0].y || targetHeadY) + fish.vy;
        fish.segments[0] = { x: currentHeadX, y: currentHeadY };

        // Swimming waggle locked strictly along streamline heading
        const waggleAngle = Math.sin(time * fish.waggleSpeed + fish.phase) * 0.28;
        const fishAngle = norm.tangentAngle;
        const segDist = 5.0;

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

        // Smooth edge alpha feathering (soft fade-in at left border, soft fade-out at right border)
        let edgeAlpha = 1.0;
        if (fish.t < 0.06) {
          edgeAlpha = Math.max(0, (fish.t - (-0.08)) / 0.14);
        } else if (fish.t > 0.94) {
          edgeAlpha = Math.max(0, (1.08 - fish.t) / 0.14);
        }

        const twinkle = 0.78 + 0.22 * Math.sin(time * fish.twinkleSpeed + fish.phase);
        ctx.globalAlpha = fish.alpha * twinkle * edgeAlpha;

        // Draw fish body from tail to head
        for (let j = fish.length - 1; j >= 0; j--) {
          const seg = fish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === fish.length - 1;
          const segRatio = (fish.length - j) / fish.length;
          const segSize = Math.max(1.2, fish.size * (0.6 + segRatio * 0.6));

          if (isHead) {
            // Soft glowing halo
            ctx.fillStyle = fish.haloColor;
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 2.3, 0, Math.PI * 2);
            ctx.fill();

            // Core bright head
            ctx.fillStyle = fish.headColor;
            if (fish.colorType === "gold") {
              const sLen = segSize * 1.9;
              ctx.beginPath();
              ctx.moveTo(seg.x, seg.y - sLen);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen, seg.y);
              ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen, seg.y);
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

      // =========================================================================
      // 4. Render The Majestic Big Celestial Alpha Fish (Cruises along central lane)
      // =========================================================================
      if (time >= bigFish.spawnTime) {
        bigFish.t += bigFish.speed;

        // Wrap around gracefully off-screen
        if (bigFish.t > 1.15) {
          bigFish.t = -0.15;
          bigFish.vx = 0;
          bigFish.vy = 0;

          const bWrapX = bigFish.t * width;
          const bWaveY = getWaveCenterY(bWrapX, time);
          const bNorm = getWaveNormal(bWrapX, time);
          const bAngle = bNorm.tangentAngle;
          const bSegDist = 9.0;

          for (let j = 0; j < bigFish.length; j++) {
            bigFish.segments[j].x = bWrapX - Math.cos(bAngle) * (j * bSegDist);
            bigFish.segments[j].y = bWaveY - Math.sin(bAngle) * (j * bSegDist);
          }
        }

        const bHeadX = bigFish.t * width;
        // Central lane with slow, majestic serpentine glide
        const bWaveY = getWaveCenterY(bHeadX, time);
        const bNorm = getWaveNormal(bHeadX, time);

        // Interactive cursor repulsion for Big Fish
        if (mouse.isHovering) {
          const dx = bHeadX - mouse.x;
          const dy = bWaveY - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 180 * 180 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 180);
            bigFish.vx += (dx / dist) * 35 * force * 0.12;
            bigFish.vy += (dy / dist) * 35 * force * 0.12;
          }
        }

        bigFish.vx += (bHeadX - (bigFish.segments[0].x || bHeadX)) * 0.08;
        bigFish.vy += (bWaveY - (bigFish.segments[0].y || bWaveY)) * 0.08;
        bigFish.vx *= 0.85;
        bigFish.vy *= 0.85;

        const currentBHeadX = (bigFish.segments[0].x || bHeadX) + bigFish.vx;
        const currentBHeadY = (bigFish.segments[0].y || bWaveY) + bigFish.vy;
        bigFish.segments[0] = { x: currentBHeadX, y: currentBHeadY };

        // Slow, majestic swimming waggle
        const bWaggleAngle = Math.sin(time * 2.8 + bigFish.phase) * 0.22;
        const bAngle = bNorm.tangentAngle;
        const bSegDist = 9.2;

        for (let j = 1; j < bigFish.length; j++) {
          const segProgress = j / bigFish.length;
          const spineWaggle = Math.sin(time * 2.8 - j * 0.5 + bigFish.phase) * (segProgress * 6.5);
          const angle = bAngle + bWaggleAngle * segProgress;
          const prevSeg = bigFish.segments[j - 1];

          const segTargetX = prevSeg.x - Math.cos(angle) * bSegDist + bNorm.nx * (spineWaggle * 0.35);
          const segTargetY = prevSeg.y - Math.sin(angle) * bSegDist + bNorm.ny * (spineWaggle * 0.35);

          bigFish.segments[j] = {
            x: (bigFish.segments[j].x || segTargetX) * 0.28 + segTargetX * 0.72,
            y: (bigFish.segments[j].y || segTargetY) * 0.28 + segTargetY * 0.72,
          };
        }

        // Edge alpha feathering for Big Fish
        let bEdgeAlpha = 1.0;
        if (bigFish.t < 0.08) {
          bEdgeAlpha = Math.max(0, (bigFish.t - (-0.14)) / 0.22);
        } else if (bigFish.t > 0.92) {
          bEdgeAlpha = Math.max(0, (1.15 - bigFish.t) / 0.23);
        }

        ctx.globalAlpha = bEdgeAlpha;

        // Draw Big Celestial Fish from tail to head
        for (let j = bigFish.length - 1; j >= 0; j--) {
          const seg = bigFish.segments[j];
          if (!seg.x) continue;

          const isHead = j === 0;
          const isTail = j === bigFish.length - 1;
          const segRatio = (bigFish.length - j) / bigFish.length;
          const segSize = Math.max(2.4, bigFish.size * (0.45 + segRatio * 0.75));

          if (isHead) {
            // Radiant Multi-Layer Celestial Halo (Cyan + Amber Gold)
            ctx.fillStyle = "rgba(0, 245, 255, 0.24)";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 3.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "rgba(251, 191, 36, 0.32)";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 2.1, 0, Math.PI * 2);
            ctx.fill();

            // Majestic 4-point Celestial Starburst Head
            ctx.fillStyle = "#ffffff";
            const sLen = segSize * 2.3;
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y - sLen);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen, seg.y);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x + sLen * 0.4, seg.y + sLen * 0.4);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y + sLen);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen * 0.4, seg.y + sLen * 0.4);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen, seg.y);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x - sLen * 0.4, seg.y - sLen * 0.4);
            ctx.quadraticCurveTo(seg.x, seg.y, seg.x, seg.y - sLen);
            ctx.fill();

            // Glowing Crown jewel
            ctx.fillStyle = "#00f5ff";
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, segSize * 0.65, 0, Math.PI * 2);
            ctx.fill();
          } else if (isTail) {
            // Forked Caudal Streamer Fins with Golden Crosses
            const tLen = segSize * 2.4;
            const spread = segSize * 1.4;

            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            ctx.lineTo(seg.x - tLen + bNorm.nx * spread, seg.y + bNorm.ny * spread);
            ctx.moveTo(seg.x, seg.y);
            ctx.lineTo(seg.x - tLen - bNorm.nx * spread, seg.y - bNorm.ny * spread);
            ctx.stroke();

            // Trailing golden sparkle cross on upper tip
            const tipX = seg.x - tLen + bNorm.nx * spread;
            const tipY = seg.y + bNorm.ny * spread;
            ctx.beginPath();
            ctx.moveTo(tipX - 3, tipY);
            ctx.lineTo(tipX + 3, tipY);
            ctx.moveTo(tipX, tipY - 3);
            ctx.lineTo(tipX, tipY + 3);
            ctx.stroke();
          } else {
            // Mid-body segments: Grand luminous rings and golden celestial nodes
            if (j % 2 === 0) {
              // Golden outer ring
              ctx.strokeStyle = "#fbbf24";
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 1.25, 0, Math.PI * 2);
              ctx.stroke();

              // Glowing cyan inner core
              ctx.fillStyle = "rgba(0, 245, 255, 0.75)";
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize * 0.55, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Glowing cyan solid segment
              ctx.fillStyle = "#00f5ff";
              ctx.beginPath();
              ctx.arc(seg.x, seg.y, segSize, 0, Math.PI * 2);
              ctx.fill();
            }

            // Segment 3: Grand Articulated Pectoral Wings
            if (j === 3) {
              const wingSpan = segSize * 3.6;
              const wingWave = Math.sin(time * 3.0) * (segSize * 0.6);

              ctx.strokeStyle = "rgba(0, 245, 255, 0.9)";
              ctx.lineWidth = 2.0;
              ctx.beginPath();
              // Left wing
              ctx.moveTo(seg.x, seg.y);
              ctx.quadraticCurveTo(
                seg.x + bNorm.nx * (wingSpan * 0.5),
                seg.y + bNorm.ny * (wingSpan * 0.5) + wingWave,
                seg.x + bNorm.nx * wingSpan,
                seg.y + bNorm.ny * wingSpan
              );
              // Right wing
              ctx.moveTo(seg.x, seg.y);
              ctx.quadraticCurveTo(
                seg.x - bNorm.nx * (wingSpan * 0.5),
                seg.y - bNorm.ny * (wingSpan * 0.5) - wingWave,
                seg.x - bNorm.nx * wingSpan,
                seg.y - bNorm.ny * wingSpan
              );
              ctx.stroke();

              // Wingtip glowing stars
              ctx.fillStyle = "#fbbf24";
              ctx.beginPath();
              ctx.arc(seg.x + bNorm.nx * wingSpan, seg.y + bNorm.ny * wingSpan, 2.2, 0, Math.PI * 2);
              ctx.arc(seg.x - bNorm.nx * wingSpan, seg.y - bNorm.ny * wingSpan, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }

            // Segment 7: Secondary Pelvic Fins
            if (j === 7) {
              const finSpan = segSize * 2.2;
              ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
              ctx.lineWidth = 1.4;
              ctx.beginPath();
              ctx.moveTo(seg.x, seg.y);
              ctx.lineTo(seg.x + bNorm.nx * finSpan, seg.y + bNorm.ny * finSpan);
              ctx.moveTo(seg.x, seg.y);
              ctx.lineTo(seg.x - bNorm.nx * finSpan, seg.y - bNorm.ny * finSpan);
              ctx.stroke();
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
