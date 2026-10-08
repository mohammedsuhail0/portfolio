import React, { useRef, useEffect, useCallback } from "react";
import "./styles/RevealHeroFace.css";

interface Props {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "avatar" | "card";
}

export const RevealHeroFace: React.FC<Props> = ({
  className = "",
  width,
  height,
  variant = "avatar",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyberLayerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const animIdRef = useRef<number | null>(null);
  const currentOpacityRef = useRef(0);

  const startLoop = useCallback(() => {
    if (animIdRef.current !== null) return;

    const revealRadius = 165;

    const loop = () => {
      const targetOpacity = isHoveredRef.current ? 1 : 0;
      currentOpacityRef.current += (targetOpacity - currentOpacityRef.current) * 0.16;

      if (!isHoveredRef.current && currentOpacityRef.current < 0.005) {
        currentOpacityRef.current = 0;
        if (cyberLayerRef.current) {
          cyberLayerRef.current.style.opacity = "0";
        }
        animIdRef.current = null;
        return; // Fully sleep when idle to preserve 60fps/120Hz
      }

      // Smooth lerp damping following cursor
      const factor = 0.25;
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * factor;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * factor;

      const px = Math.round(currentRef.current.x);
      const py = Math.round(currentRef.current.y);
      const op = currentOpacityRef.current.toFixed(3);

      if (cyberLayerRef.current) {
        const maskGradient = `radial-gradient(circle ${revealRadius}px at ${px}px ${py}px, black 0%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.35) 80%, transparent 100%)`;
        cyberLayerRef.current.style.webkitMaskImage = maskGradient;
        cyberLayerRef.current.style.maskImage = maskGradient;
        cyberLayerRef.current.style.opacity = op;
      }

      animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);
  }, []);

  // Track cursor movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    if (!isHoveredRef.current) {
      currentRef.current = { x, y };
      isHoveredRef.current = true;
      startLoop();
    }
  }, [startLoop]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };
    currentRef.current = { x, y };
    isHoveredRef.current = true;
    startLoop();
  }, [startLoop]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    startLoop();
  }, [startLoop]);

  // Mobile touch movement
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    mouseRef.current = { x, y };
    isHoveredRef.current = true;
    startLoop();
  }, [startLoop]);

  const handleTouchEnd = useCallback(() => {
    isHoveredRef.current = false;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    return () => {
      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`reveal-hero-wrapper ${variant === "card" ? "mode-card" : "mode-avatar"} ${className}`}
      style={{ width, height }}
    >
      <div
        className="reveal-hero-container avatar-frame"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Layer 1: Base Plain Authentic Portrait (Pristine, 100% natural) */}
        <div className="reveal-layer base-layer">
          <img
            src="/suhail-transparent.png"
            alt="Mohammed Suhail"
            className="reveal-portrait-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Layer 2: Pragmata Astronaut Suit (Direct cursor reveal with feathered blend) */}
        <div
          ref={cyberLayerRef}
          className="reveal-layer cyber-layer"
          style={{ opacity: 0 }}
        >
          <img
            src="/suhail-astronaut-transparent.png"
            alt="Mohammed Suhail - Astronaut Space Suit"
            className="reveal-portrait-img cyber-img"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default RevealHeroFace;
