import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Render state for position & opacity
  const [renderState, setRenderState] = useState({
    x: 0,
    y: 0,
    opacity: 0,
  });

  // Track cursor movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    if (!isHovered) {
      currentRef.current = { x, y };
    }
    setIsHovered(true);
  }, [isHovered]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };
    currentRef.current = { x, y };
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Mobile touch movement
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    mouseRef.current = { x, y };
    setIsHovered(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Smooth damping loop for cursor tracking
  useEffect(() => {
    let animId: number;
    let currentOpacity = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);

      const targetOpacity = isHovered ? 1 : 0;
      currentOpacity += (targetOpacity - currentOpacity) * 0.16;

      if (currentOpacity < 0.005) {
        if (renderState.opacity !== 0) {
          setRenderState((prev) => ({ ...prev, opacity: 0 }));
        }
        return;
      }

      // Smooth lerp damping following cursor
      const factor = 0.25;
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * factor;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * factor;

      setRenderState({
        x: Math.round(currentRef.current.x),
        y: Math.round(currentRef.current.y),
        opacity: Number(currentOpacity.toFixed(3)),
      });
    };

    loop();

    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const revealRadius = 165;

  const cyberMaskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(circle ${revealRadius}px at ${renderState.x}px ${renderState.y}px, black 0%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.35) 80%, transparent 100%)`,
    maskImage: `radial-gradient(circle ${revealRadius}px at ${renderState.x}px ${renderState.y}px, black 0%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.35) 80%, transparent 100%)`,
    opacity: renderState.opacity,
    transition: "opacity 0.2s ease-out",
  };

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
          className="reveal-layer cyber-layer"
          style={cyberMaskStyle}
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
