import React, { useState, useRef } from "react";
import { config } from "../../config";
import { FiExternalLink } from "react-icons/fi";
import "./MobileProjectCards.css";

type ProjectItem = (typeof config.projects)[0] & { uid: number };

export const MobileProjectCards: React.FC = () => {
  // Initialize deck with unique IDs for rock-solid DOM keys
  const [deck, setDeck] = useState<ProjectItem[]>(() =>
    config.projects.map((proj, i) => ({ ...proj, uid: i }))
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dismissingUid, setDismissingUid] = useState<number | null>(null);
  const [dismissDirection, setDismissDirection] = useState<"left" | "right">("right");
  const [dismissY, setDismissY] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  // Active top card is the last item in deck array
  const topCard = deck.length > 0 ? deck[deck.length - 1] : null;
  const secondCard = deck.length > 1 ? deck[deck.length - 2] : null;

  const threshold = 90; // Swipe trigger threshold (px)

  // Trigger dismissal: animate card off-screen then remove & cycle to back
  const dismissTopCard = (direction: "left" | "right", releaseY: number = 0) => {
    if (!topCard || isAnimating.current) return;
    isAnimating.current = true;

    const departingCard = topCard;
    setDismissingUid(departingCard.uid);
    setDismissDirection(direction);
    setDismissY(releaseY);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    // After animation duration, remove and cycle card to beginning for endless browsing
    setTimeout(() => {
      setDeck((prev) => {
        const nextDeck = prev.filter((c) => c.uid !== departingCard.uid);
        return [departingCard, ...nextDeck];
      });
      setDismissingUid(null);
      isAnimating.current = false;
    }, 350);
  };

  // Pointer gesture handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating.current || !topCard) return;
    // Don't drag if user clicked directly on the live link button
    if ((e.target as HTMLElement).closest(".project-card-link-btn")) return;

    activePointerId.current = e.pointerId;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || activePointerId.current !== e.pointerId) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = (e.clientY - startPos.current.y) * 0.22;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    if (!isDragging || activePointerId.current !== e.pointerId) return;
    setIsDragging(false);
    activePointerId.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (Math.abs(dragOffset.x) >= threshold) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      dismissTopCard(direction, dragOffset.y);
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Drag physics calculations
  const dragRatio = Math.min(Math.abs(dragOffset.x) / threshold, 1);
  const rotateDeg = dragOffset.x * 0.08;
  const cueOpacity = Math.min(Math.abs(dragOffset.x) / 60, 1);

  return (
    <div className="project-cards-deck-container">
      {/* 3D Swipe Deck Stage */}
      <div className="project-cards-stage">
        {deck.map((proj) => {
          const isTop = topCard?.uid === proj.uid;
          const isSecond = secondCard?.uid === proj.uid;
          const isDismissing = dismissingUid === proj.uid;

          // Split technologies string into individual badges
          const techList = proj.technologies
            ? proj.technologies.split(",").map((t) => t.trim()).slice(0, 4)
            : [];

          // Dynamic style calculation
          let cardStyle: React.CSSProperties = {};

          if (isDismissing) {
            const flyX = dismissDirection === "right" ? 540 : -540;
            const flyRot = dismissDirection === "right" ? 28 : -28;
            cardStyle = {
              transform: `translate3d(${flyX}px, ${dismissY}px, 0) rotate(${flyRot}deg)`,
              opacity: 0,
              transition: "transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.1), opacity 0.35s ease-out",
              zIndex: 30,
              pointerEvents: "none",
            };
          } else if (isTop && isDragging) {
            cardStyle = {
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`,
              transition: "none",
            };
          } else if (isSecond && isDragging) {
            const targetScale = 0.95 + dragRatio * 0.05;
            const targetY = 14 - dragRatio * 14;
            const targetOpacity = 0.82 + dragRatio * 0.18;
            cardStyle = {
              transform: `translate3d(0, ${targetY}px, 0) scale(${targetScale})`,
              opacity: targetOpacity,
              transition: "none",
            };
          }

          return (
            <div
              key={proj.uid}
              className={`project-swipe-card ${isTop ? "is-top-card" : ""} ${isDragging && isTop ? "is-dragging" : ""}`}
              style={cardStyle}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerEnd : undefined}
              onPointerCancel={isTop ? onPointerEnd : undefined}
            >
              {/* Dynamic Swipe Cues */}
              {isTop && dragOffset.x > 15 && (
                <div className="swipe-stamp stamp-right" style={{ opacity: cueOpacity }}>
                  NEXT ➔
                </div>
              )}
              {isTop && dragOffset.x < -15 && (
                <div className="swipe-stamp stamp-left" style={{ opacity: cueOpacity }}>
                  PASS ➔
                </div>
              )}
              {isDismissing && dismissDirection === "right" && (
                <div className="swipe-stamp stamp-right" style={{ opacity: 1 }}>
                  NEXT ➔
                </div>
              )}
              {isDismissing && dismissDirection === "left" && (
                <div className="swipe-stamp stamp-left" style={{ opacity: 1 }}>
                  PASS ➔
                </div>
              )}

              {/* Card Photo / Thumbnail Wrapper */}
              <div className="project-card-thumb">
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="project-thumb-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="project-thumb-placeholder" />
                )}
                <div className="project-card-overlay" />
                <span className="project-card-category">{proj.category}</span>
              </div>

              {/* Project Card Content */}
              <div className="project-card-content">
                <h3 className="project-card-title">{proj.title}</h3>
                <p className="project-card-desc">{proj.description}</p>

                {/* Tech Chips */}
                {techList.length > 0 && (
                  <div className="project-card-techs">
                    {techList.map((tech, i) => (
                      <span key={i} className="project-tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Project Live Link */}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-link-btn"
                  >
                    <span>View Project</span>
                    <FiExternalLink />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileProjectCards;
