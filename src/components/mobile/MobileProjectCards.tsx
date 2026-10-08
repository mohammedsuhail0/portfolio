import React, { useState, useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import "./MobileProjectCards.css";

export interface MobileProjectData {
  id: number;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  link?: string;
  certificateBadge?: string;
  certificateUrl?: string;
}

// Mobile project priority sequence requested by user:
// 1. Projects with certificates (ShieldSense, NextPatient, Data Science Rental Analytics)
// 2. Followed by: NovaClass (Smart Attendance), BroSync, ArogyaMitr
// 3. Followed by recent projects: Secure Exam Portal, VitaForge, MaternaGuard, BUILDR, NRCHS
export const MOBILE_PROJECT_LIST: MobileProjectData[] = [
  // 1. Certified Projects
  {
    id: 4,
    title: "ShieldSense (AI Security Agent)",
    category: "Cybersecurity / AI Agent",
    technologies: "Next.js, TypeScript, Threat Intelligence API, TailwindCSS",
    image: "/projects/shield-sense.png",
    description: "Autonomous AI cybersecurity threat intelligence agent built for SPEC's Industry Hack 2026, delivering real-time vulnerability scanning, automated perimeter defenses, and incident triage.",
    link: "https://shieldsense-security-agent.vercel.app",
    certificateBadge: "🏆 Industry Hack Cert",
    certificateUrl: "/certificates/industry-hack-stpeters-certificate.png",
  },
  {
    id: 1,
    title: "NextPatient",
    category: "Clinical AI / OSCE",
    technologies: "Next.js, TypeScript, AI OSCE Engine, TailwindCSS, Vercel",
    image: "/projects/nextpatient.png",
    description: "Clinical AI OSCE Simulation Station built for iQOO Health-Tech Hackathon delivering realistic patient dialogue, diagnostic evaluation checklists, and real-time medical simulation.",
    link: "https://nextpatient-app.vercel.app/",
    certificateBadge: "🏆 iQOO Hackathon",
  },
  {
    id: 10,
    title: "Hyderabad Rental Analytics",
    category: "Data Science & ML",
    technologies: "Python, Pandas, NumPy, Matplotlib, Scikit-learn, EDA",
    image: "/projects/house-rental-analytics.png",
    description: "In-depth exploratory data analysis and price prediction modeling on Hyderabad real-estate rental trends across key localities. Awarded Certificate of Excellence.",
    link: "https://github.com/mohammedsuhail0/house-rental-analytics",
    certificateBadge: "📜 Data Science Cert",
    certificateUrl: "/certificates/fsa-data-science-certificate.jpg",
  },

  // 2. Core Priority Projects: NovaClass, BroSync, ArogyaMitr
  {
    id: 3,
    title: "NovaClass (Smart Attendance)",
    category: "Smart Classroom / Attendance",
    technologies: "Next.js, React, WebAuthn, Node.js, MongoDB, TailwindCSS",
    image: "/projects/smart-attendance.png",
    description: "Automated institutional attendance and smart classroom platform with biometric verification, short-lived tokens, and live analytics dashboards.",
    link: "https://smart-attendance-ecru-nu.vercel.app",
  },
  {
    id: 2,
    title: "BroSync (Seamless)",
    category: "Real-Time Collaboration",
    technologies: "Next.js, WebSockets, Node.js, Canvas API, TailwindCSS",
    image: "/projects/seamless-brosync.png",
    description: "High-performance real-time collaboration canvas with zero-latency synchronized state, multiplayer interactions, and instant workspace sharing.",
    link: "https://brosync.vercel.app/",
  },
  {
    id: 5,
    title: "ArogyaMitr (SIH PS 26133)",
    category: "Healthcare / SIH",
    technologies: "Next.js, TypeScript, GeoLocation, REST APIs, TailwindCSS",
    image: "/projects/sih-arogyamitr.png",
    description: "Built for Smart India Hackathon PS 26133: Centralized healthcare access and emergency bed tracking platform connecting patients with regional hospitals in real time.",
    link: "https://mahahealthconnect.vercel.app",
  },

  // 3. Recent Featured Projects
  {
    id: 6,
    title: "Secure Online Exam Portal",
    category: "EdTech / Security",
    technologies: "React, Node.js, Express, Proctoring, MongoDB",
    image: "/projects/secure-exam-portal.png",
    description: "Secure, tamper-resistant online examination portal with automated anti-cheat detection, timer enforcement, and instantaneous test result computation.",
    link: "https://secure-online-exam-portal-zt.vercel.app",
  },
  {
    id: 7,
    title: "VitaForge",
    category: "Health & Fitness",
    technologies: "React, TypeScript, Nutrition & Workout API, TailwindCSS",
    image: "/projects/fitness-tracker.png",
    description: "Comprehensive fitness tracking and workout companion application with custom routine planners, caloric tracking, and progress charts.",
    link: "https://excersise-iota.vercel.app",
  },
  {
    id: 8,
    title: "MaternaGuard",
    category: "Healthcare / AI",
    technologies: "React, TypeScript, Health Analytics, TailwindCSS",
    image: "/projects/ai-maternity-nanny.png",
    description: "AI-assisted maternal and infant care health monitor providing scheduled vitals tracking, symptom guidance, and pediatric milestones.",
    link: "https://frontend-pied-pi-riv3w4y14c.vercel.app",
  },
  {
    id: 9,
    title: "BUILDR",
    category: "Developer Tools",
    technologies: "Next.js, TypeScript, UI Components, TailwindCSS",
    image: "/projects/builder-app.png",
    description: "Modular application builder and UI scaffolding workspace enabling creators to assemble and preview web components rapidly.",
    link: "https://buildr-liart.vercel.app",
  },
  {
    id: 11,
    title: "New Rosary Convent High School",
    category: "Web Development",
    technologies: "HTML5, CSS3, JavaScript, Responsive Web Architecture",
    image: "/projects/nrchs-custom-theme.png",
    description: "Custom digital presence and institutional portal for New Rosary Convent High School featuring notice boards, admissions flow, and curriculum overviews.",
    link: "https://newrosaryconvent.in",
  },
];

type ProjectItem = MobileProjectData & { uid: number };

export const MobileProjectCards: React.FC = () => {
  // Initialize deck in reverse order so MOBILE_PROJECT_LIST[0] is rendered at the top (:nth-last-child(1))
  const [deck, setDeck] = useState<ProjectItem[]>(() =>
    [...MOBILE_PROJECT_LIST].reverse().map((proj, i) => ({ ...proj, uid: i }))
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dismissingUid, setDismissingUid] = useState<number | null>(null);
  const [dismissDirection, setDismissDirection] = useState<"left" | "right">("right");
  const [dismissY, setDismissY] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);

  // Active top card is the last item in deck array
  const topCard = deck.length > 0 ? deck[deck.length - 1] : null;
  const secondCard = deck.length > 1 ? deck[deck.length - 2] : null;

  const currentOrderIdx = topCard
    ? MOBILE_PROJECT_LIST.findIndex((p) => p.id === topCard.id) + 1
    : 1;

  const threshold = 90; // Swipe trigger threshold (px)

  // Trigger dismissal: animate card off-screen then remove & cycle to back
  const dismissTopCard = (direction: "left" | "right", releaseY: number = 0) => {
    if (!topCard || dismissingUid !== null) return;

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
    }, 320);
  };

  // Pointer gesture handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (dismissingUid !== null || !topCard) return;
    if ((e.target as HTMLElement).closest(".project-card-actions a, .project-card-link-btn, .project-card-cert-btn")) return;

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
    }
    setDragOffset({ x: 0, y: 0 });
  };

  // Touch gesture handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    if (dismissingUid !== null || !topCard) return;
    if ((e.target as HTMLElement).closest(".project-card-actions a, .project-card-link-btn, .project-card-cert-btn")) return;
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = (touch.clientY - startPos.current.y) * 0.22;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragOffset.x) >= threshold) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      dismissTopCard(direction, dragOffset.y);
    }
    setDragOffset({ x: 0, y: 0 });
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
              onTouchStart={isTop ? onTouchStart : undefined}
              onTouchMove={isTop ? onTouchMove : undefined}
              onTouchEnd={isTop ? onTouchEnd : undefined}
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
                {proj.certificateBadge && (
                  <span className="project-card-cert-badge">
                    {proj.certificateBadge}
                  </span>
                )}
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

                {/* Action Buttons: Live Demo & Certificate */}
                <div className="project-card-actions">
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link-btn"
                    >
                      <span>Live Demo</span>
                      <FiExternalLink />
                    </a>
                  )}
                  {proj.certificateUrl && (
                    <a
                      href={proj.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-cert-btn"
                    >
                      <span>Certificate 📜</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Deck Counter & Nav Controls */}
      <div className="project-deck-hint">
        <button
          type="button"
          className="deck-nav-btn prev-btn"
          onClick={() => dismissTopCard("left")}
          aria-label="Previous card"
        >
          ‹
        </button>
        <span className="deck-hint-text">
          Swipe or tap to explore ({currentOrderIdx} of {MOBILE_PROJECT_LIST.length})
        </span>
        <button
          type="button"
          className="deck-nav-btn next-btn"
          onClick={() => dismissTopCard("right")}
          aria-label="Next card"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MobileProjectCards;
