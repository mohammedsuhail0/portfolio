import React, { useState, useRef } from "react";
import { config } from "../../config";
import { FiRotateCcw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import "./MobileCareerCards.css";

type ExperienceItem = (typeof config.experiences)[0] & { uid: number };

export const MobileCareerCards: React.FC = () => {
  // Initialize deck with unique IDs for rock-solid DOM keys
  const [deck, setDeck] = useState<ExperienceItem[]>(() =>
    config.experiences.map((exp, i) => ({ ...exp, uid: i }))
  );
  const [history, setHistory] = useState<ExperienceItem[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dismissingUid, setDismissingUid] = useState<number | null>(null);
  const [dismissDirection, setDismissDirection] = useState<"left" | "right">("right");
  const [dismissY, setDismissY] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  // Total and active index counter
  const total = config.experiences.length;
  // Active top card is the last item in deck array
  const topCard = deck.length > 0 ? deck[deck.length - 1] : null;
  const secondCard = deck.length > 1 ? deck[deck.length - 2] : null;

  const threshold = 95; // Swipe trigger threshold (px)

  // Trigger dismissal: animate card off-screen then remove from DOM
  const dismissTopCard = (direction: "left" | "right", releaseY: number = 0) => {
    if (!topCard || isAnimating.current) return;
    isAnimating.current = true;

    const departingCard = topCard;
    setDismissingUid(departingCard.uid);
    setDismissDirection(direction);
    setDismissY(releaseY);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    // After animation duration, remove from deck and update history
    setTimeout(() => {
      setDeck((prev) => {
        const nextDeck = prev.filter((c) => c.uid !== departingCard.uid);
        // Cycle card to beginning so user can browse infinitely
        return [departingCard, ...nextDeck];
      });
      setHistory((prev) => [...prev, departingCard]);
      setDismissingUid(null);
      isAnimating.current = false;
    }, 350);
  };

  // Rewind: pull previous card back from history
  const handleRewind = () => {
    if (isAnimating.current || history.length === 0) {
      // If history is empty, shift last item in deck to top
      if (deck.length > 1 && !isAnimating.current) {
        isAnimating.current = true;
        setDeck((prev) => {
          const first = prev[0];
          const rest = prev.slice(1);
          return [...rest, first];
        });
        setTimeout(() => {
          isAnimating.current = false;
        }, 350);
      }
      return;
    }

    isAnimating.current = true;
    const prevCard = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    // Place back on top of deck
    setDeck((prev) => {
      const filtered = prev.filter((c) => c.uid !== prevCard.uid);
      return [...filtered, prevCard];
    });

    setTimeout(() => {
      isAnimating.current = false;
    }, 350);
  };

  // Pointer gesture handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating.current || !topCard) return;
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

  // Active milestone index (1-based for counter)
  const currentMilestoneIndex = topCard ? topCard.uid + 1 : 1;

  return (
    <div className="space-cards-deck-container">
      {/* Top Header & Pagination Track */}
      <div className="space-cards-topbar">
        <div className="space-cards-progress-pills">
          {config.experiences.map((_, i) => (
            <span
              key={i}
              className={`progress-pill ${i + 1 === currentMilestoneIndex ? "active" : i + 1 < currentMilestoneIndex ? "passed" : ""}`}
            />
          ))}
        </div>
        <span className="space-cards-counter">
          0{currentMilestoneIndex} / 0{total}
        </span>
      </div>

      {/* 3D Swipe Deck Stage */}
      <div className="space-cards-stage">
        {deck.map((exp) => {
          const isTop = topCard?.uid === exp.uid;
          const isSecond = secondCard?.uid === exp.uid;
          const isDismissing = dismissingUid === exp.uid;

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
            // Visual Transitions requirement: Smoothly scale up & brighten card underneath while dragging
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
              key={exp.uid}
              className={`space-card ${isTop ? "is-top-card" : ""} ${isDragging && isTop ? "is-dragging" : ""}`}
              style={cardStyle}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerEnd : undefined}
              onPointerCancel={isTop ? onPointerEnd : undefined}
            >
              {/* Dynamic Swipe Cues (on top card or during dismissal) */}
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

              {/* Card Inner Content */}
              <div className="space-card-inner">
                {/* Header */}
                <div className="card-top-row">
                  <div className="card-badge-glow">
                    <IoSparkles className="sparkle-icon" />
                    <span>MILESTONE {exp.uid + 1}</span>
                  </div>
                  <span className="card-period-tag">{exp.period}</span>
                </div>

                {/* Role & Company */}
                <h3 className="card-role-title">{exp.position}</h3>
                <div className="card-company-row">
                  <span className="company-dot"></span>
                  <h4 className="card-company-name">{exp.company}</h4>
                  <span className="card-loc-pill">{exp.location}</span>
                </div>

                {/* Description */}
                <p className="card-desc">{exp.description}</p>

                {/* Bullets */}
                {exp.responsibilities && (
                  <div className="card-bullets">
                    {exp.responsibilities.slice(0, 2).map((resp, i) => (
                      <div key={i} className="bullet-item">
                        <span className="bullet-arrow">▹</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && (
                  <div className="card-tech-tags">
                    {exp.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="space-cards-controls">
        <button
          type="button"
          className="action-circle-btn btn-rewind"
          onClick={handleRewind}
          aria-label="Rewind milestone"
          title="Rewind"
        >
          <FiRotateCcw />
        </button>

        <button
          type="button"
          className="action-circle-btn btn-left"
          onClick={() => dismissTopCard("left")}
          aria-label="Pass milestone"
        >
          <FiChevronLeft />
        </button>

        <div className="swipe-hint-pill">
          <span>Swipe or Tap</span>
        </div>

        <button
          type="button"
          className="action-circle-btn btn-right"
          onClick={() => dismissTopCard("right")}
          aria-label="Next milestone"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default MobileCareerCards;
