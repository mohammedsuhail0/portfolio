import React, { useState, useRef } from "react";
import { config } from "../../config";
import { FiRotateCcw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import "./MobileCareerCards.css";

export const MobileCareerCards: React.FC = () => {
  const experiences = config.experiences;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);

  // Trigger swipe card exit
  const triggerSwipe = (direction: "left" | "right") => {
    if (exitDirection) return;
    setExitDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % experiences.length);
      setExitDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 320);
  };

  // Rewind to previous card
  const handleRewind = () => {
    if (exitDirection) return;
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
    setDragOffset({ x: 0, y: 0 });
    setExitDirection(null);
  };

  // Pointer drag gestures
  const onPointerDown = (e: React.PointerEvent) => {
    if (exitDirection) return;
    // Capture pointer for smooth tracking
    activePointerId.current = e.pointerId;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || activePointerId.current !== e.pointerId) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = (e.clientY - startPos.current.y) * 0.25; // Gentle vertical drag play
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    if (!isDragging || activePointerId.current !== e.pointerId) return;
    setIsDragging(false);
    activePointerId.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const threshold = 65; // Distance to trigger card dismissal
    if (dragOffset.x > threshold) {
      triggerSwipe("right");
    } else if (dragOffset.x < -threshold) {
      triggerSwipe("left");
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Calculate deck visible cards
  const total = experiences.length;
  const currentExp = experiences[currentIndex];
  const nextExp1 = experiences[(currentIndex + 1) % total];
  const nextExp2 = experiences[(currentIndex + 2) % total];

  // Drag rotation and swipe cue intensity
  const rotateDeg = dragOffset.x * 0.08;
  const cueOpacity = Math.min(Math.abs(dragOffset.x) / 75, 1);
  const dragProgress = Math.min(Math.abs(dragOffset.x) / 100, 1);

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
            className="space-card layer-3"
            style={{
              transform: `translate3d(0, ${24 - dragProgress * 12}px, -40px) scale(${0.88 + dragProgress * 0.06})`,
              opacity: 0.45 + dragProgress * 0.25,
            }}
          >
            <div className="space-card-inner">
              <div className="card-top-row">
                <span className="card-period-tag">{nextExp2.period}</span>
              </div>
              <h3 className="card-role-title">{nextExp2.position}</h3>
              <h4 className="card-company-name">{nextExp2.company}</h4>
            </div>
          </div>
        )}

        {/* Card 2 (Middle Layer) */}
        {total > 1 && (
          <div
            className="space-card layer-2"
            style={{
              transform: `translate3d(0, ${12 - dragProgress * 12}px, -20px) scale(${0.94 + dragProgress * 0.06})`,
              opacity: 0.75 + dragProgress * 0.25,
            }}
          >
            <div className="space-card-inner">
              <div className="card-top-row">
                <span className="card-period-tag">{nextExp1.period}</span>
                <span className="card-loc-tag">{nextExp1.location}</span>
              </div>
              <h3 className="card-role-title">{nextExp1.position}</h3>
              <h4 className="card-company-name">{nextExp1.company}</h4>
              <p className="card-desc-snippet">{nextExp1.description}</p>
            </div>
          </div>
        )}

        {/* Card 1 (Active Top Card - Fully Interactive) */}
        <div
          className={`space-card layer-top ${exitDirection ? `swiped-${exitDirection}` : ""} ${isDragging ? "dragging" : ""}`}
          style={{
            transform: exitDirection
              ? `translate3d(${exitDirection === "right" ? 440 : -440}px, ${dragOffset.y}px, 0) rotate(${exitDirection === "right" ? 24 : -24}deg)`
              : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`,
            opacity: exitDirection ? 0 : 1,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {/* Dynamic Swipe Cues */}
          {dragOffset.x > 15 && (
            <div className="swipe-stamp stamp-right" style={{ opacity: cueOpacity }}>
              NEXT ➔
            </div>
          )}
          {dragOffset.x < -15 && (
            <div className="swipe-stamp stamp-left" style={{ opacity: cueOpacity }}>
              PASS ➔
            </div>
          )}

          <div className="space-card-inner">
            {/* Card Header */}
            <div className="card-top-row">
              <div className="card-badge-glow">
                <IoSparkles className="sparkle-icon" />
                <span>MILESTONE {currentIndex + 1}</span>
              </div>
              <span className="card-period-tag">{currentExp.period}</span>
            </div>

            {/* Role & Company */}
            <h3 className="card-role-title">{currentExp.position}</h3>
            <div className="card-company-row">
              <span className="company-dot"></span>
              <h4 className="card-company-name">{currentExp.company}</h4>
              <span className="card-loc-pill">{currentExp.location}</span>
            </div>

            {/* Description */}
            <p className="card-desc">{currentExp.description}</p>

            {/* Responsibilities Highlights */}
            {currentExp.responsibilities && (
              <div className="card-bullets">
                {currentExp.responsibilities.slice(0, 2).map((resp, i) => (
                  <div key={i} className="bullet-item">
                    <span className="bullet-arrow">▹</span>
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Technologies Chips */}
            {currentExp.technologies && (
              <div className="card-tech-tags">
                {currentExp.technologies.slice(0, 4).map((tech, i) => (
                  <span key={i} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Cosmic Action Bar */}
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
