import React, { useState, useRef } from "react";
import { config } from "../../config";
import { FiRotateCcw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import "./MobileCareerCards.css";

type ExperienceItem = (typeof config.experiences)[0];

interface ExitingCardState {
  exp: ExperienceItem;
  index: number;
  direction: "left" | "right";
  startX: number;
  startY: number;
}

const SpaceCardBody: React.FC<{
  exp: ExperienceItem;
  index: number;
  preview?: boolean;
}> = ({ exp, index, preview = false }) => {
  return (
    <div className="space-card-inner">
      {/* Card Header */}
      <div className="card-top-row">
        <div className="card-badge-glow">
          <IoSparkles className="sparkle-icon" />
          <span>MILESTONE {index + 1}</span>
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
      <p className={`card-desc ${preview ? "preview-desc" : ""}`}>{exp.description}</p>

      {/* Responsibilities Highlights */}
      {!preview && exp.responsibilities && (
        <div className="card-bullets">
          {exp.responsibilities.slice(0, 2).map((resp, i) => (
            <div key={i} className="bullet-item">
              <span className="bullet-arrow">▹</span>
              <span>{resp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Technologies Chips */}
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
  );
};

export const MobileCareerCards: React.FC = () => {
  const experiences = config.experiences;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitingCard, setExitingCard] = useState<ExitingCardState | null>(null);
  const [justSwiped, setJustSwiped] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);

  // Trigger swipe card exit: the card flies away, and the next card comes forward
  const triggerSwipe = (direction: "left" | "right") => {
    if (exitingCard || isRewinding) return;

    const currentExp = experiences[currentIndex];
    const startX = dragOffset.x;
    const startY = dragOffset.y;

    // Snapshot the card that is flying off
    setExitingCard({
      exp: currentExp,
      index: currentIndex,
      direction,
      startX,
      startY,
    });

    // Reset drag immediately
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    // Immediately advance so the card beneath rises to the front
    setCurrentIndex((prev) => (prev + 1) % experiences.length);
    setJustSwiped(true);

    setTimeout(() => {
      setExitingCard(null);
      setJustSwiped(false);
    }, 340);
  };

  // Rewind to previous card
  const handleRewind = () => {
    if (exitingCard || isRewinding) return;
    setIsRewinding(true);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);

    setTimeout(() => {
      setIsRewinding(false);
    }, 320);
  };

  // Pointer drag gestures
  const onPointerDown = (e: React.PointerEvent) => {
    if (exitingCard || isRewinding) return;
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
    const deltaY = (e.clientY - startPos.current.y) * 0.2;
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

    const threshold = 60;
    if (dragOffset.x > threshold) {
      triggerSwipe("right");
    } else if (dragOffset.x < -threshold) {
      triggerSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const total = experiences.length;
  const currentExp = experiences[currentIndex];
  const nextExp1 = experiences[(currentIndex + 1) % total];
  const nextExp2 = experiences[(currentIndex + 2) % total];

  const rotateDeg = dragOffset.x * 0.08;
  const cueOpacity = Math.min(Math.abs(dragOffset.x) / 70, 1);
  const dragProgress = Math.min(Math.abs(dragOffset.x) / 110, 1);

  return (
    <div className="space-cards-deck-container">
      {/* Top Header & Pagination Track */}
      <div className="space-cards-topbar">
        <div className="space-cards-progress-pills">
          {experiences.map((_, i) => (
            <span
              key={i}
              className={`progress-pill ${i === currentIndex ? "active" : i < currentIndex ? "passed" : ""}`}
            />
          ))}
        </div>
        <span className="space-cards-counter">
          0{currentIndex + 1} / 0{total}
        </span>
      </div>

      {/* 3D Stack of Space Cards */}
      <div className="space-cards-stage">
        {/* Card 3 (Bottom Layer) */}
        {total > 2 && (
          <div
            key={`layer3-${(currentIndex + 2) % total}`}
            className={`space-card layer-3 ${justSwiped ? "step-up-3" : ""}`}
            style={{
              transform: isDragging
                ? `translate3d(0, ${22 - dragProgress * 11}px, -40px) scale(${0.88 + dragProgress * 0.06})`
                : undefined,
              opacity: isDragging ? 0.45 + dragProgress * 0.25 : undefined,
            }}
          >
            <SpaceCardBody exp={nextExp2} index={(currentIndex + 2) % total} preview />
          </div>
        )}

        {/* Card 2 (Middle Layer - Visible underneath top card) */}
        {total > 1 && (
          <div
            key={`layer2-${(currentIndex + 1) % total}`}
            className={`space-card layer-2 ${justSwiped ? "step-up-2" : ""}`}
            style={{
              transform: isDragging
                ? `translate3d(0, ${11 - dragProgress * 11}px, -20px) scale(${0.94 + dragProgress * 0.06})`
                : undefined,
              opacity: isDragging ? 0.75 + dragProgress * 0.25 : undefined,
            }}
          >
            <SpaceCardBody exp={nextExp1} index={(currentIndex + 1) % total} preview />
          </div>
        )}

        {/* Card 1 (Active Top Card - Fully Interactive) */}
        <div
          key={`active-${currentIndex}`}
          className={`space-card layer-top ${justSwiped ? "card-stepped-up" : ""} ${isRewinding ? "card-rewinding" : ""} ${isDragging ? "dragging" : ""}`}
          style={{
            transform: isDragging
              ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`
              : undefined,
            transition: isDragging ? "none" : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {/* Dynamic Drag Cues */}
          {dragOffset.x > 18 && (
            <div className="swipe-stamp stamp-right" style={{ opacity: cueOpacity }}>
              NEXT ➔
            </div>
          )}
          {dragOffset.x < -18 && (
            <div className="swipe-stamp stamp-left" style={{ opacity: cueOpacity }}>
              PASS ➔
            </div>
          )}

          <SpaceCardBody exp={currentExp} index={currentIndex} />
        </div>

        {/* Exiting Card (Flies away into space, never returns) */}
        {exitingCard && (
          <div
            key={`exit-${exitingCard.index}`}
            className={`space-card layer-exiting layer-exiting-${exitingCard.direction}`}
            style={
              {
                "--start-x": `${exitingCard.startX}px`,
                "--start-y": `${exitingCard.startY}px`,
                "--start-rot": `${exitingCard.startX * 0.08}deg`,
              } as React.CSSProperties
            }
          >
            {exitingCard.direction === "right" ? (
              <div className="swipe-stamp stamp-right" style={{ opacity: 1 }}>
                NEXT ➔
              </div>
            ) : (
              <div className="swipe-stamp stamp-left" style={{ opacity: 1 }}>
                PASS ➔
              </div>
            )}
            <SpaceCardBody exp={exitingCard.exp} index={exitingCard.index} />
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="space-cards-controls">
        <button
          type="button"
          className="action-circle-btn btn-rewind"
          onClick={handleRewind}
          aria-label="Previous card"
          title="Rewind"
        >
          <FiRotateCcw />
        </button>

        <button
          type="button"
          className="action-circle-btn btn-left"
          onClick={() => triggerSwipe("left")}
          aria-label="Swipe left"
        >
          <FiChevronLeft />
        </button>

        <div className="swipe-hint-pill">
          <span>Swipe or Tap</span>
        </div>

        <button
          type="button"
          className="action-circle-btn btn-right"
          onClick={() => triggerSwipe("right")}
          aria-label="Swipe right"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default MobileCareerCards;
