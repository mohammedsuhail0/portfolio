import React, { useState, useRef, useCallback, useEffect } from "react";
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

  const topCardRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  const stampRightRef = useRef<HTMLDivElement | null>(null);
  const stampLeftRef = useRef<HTMLDivElement | null>(null);

  const startPos = useRef({ x: 0, y: 0, time: 0 });
  const currentDelta = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isAnimating = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  // Active top card is the last item in deck array
  const topCard = deck.length > 0 ? deck[deck.length - 1] : null;

  const currentOrderIdx = topCard
    ? MOBILE_PROJECT_LIST.findIndex((p) => p.id === topCard.id) + 1
    : 1;

  const threshold = 75; // Swipe trigger threshold (px)

  // Fast, responsive spring fly-out dismissal
  const dismissCard = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !topCardRef.current) return;
    isAnimating.current = true;

    const topEl = topCardRef.current;
    const secEl = secondCardRef.current;
    const flyDist = window.innerWidth * 1.25;
    const flyX = direction === "right" ? flyDist : -flyDist;
    const flyRot = direction === "right" ? 22 : -22;

    // Zero-lag hardware accelerated transition
    topEl.style.transition = "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out";
    topEl.style.transform = `translate3d(${flyX}px, ${currentDelta.current.y}px, 0) rotate(${flyRot}deg)`;
    topEl.style.opacity = "0";

    if (secEl) {
      secEl.style.transition = "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.26s ease";
      secEl.style.transform = "translate3d(0, 0, 0) scale(1)";
      secEl.style.opacity = "1";
    }

    if (stampRightRef.current) stampRightRef.current.style.opacity = direction === "right" ? "1" : "0";
    if (stampLeftRef.current) stampLeftRef.current.style.opacity = direction === "left" ? "1" : "0";

    setTimeout(() => {
      // Re-order deck
      setDeck((prev) => {
        if (prev.length <= 1) return prev;
        const top = prev[prev.length - 1];
        return [top, ...prev.slice(0, prev.length - 1)];
      });

      // Reset inline styles after state changes to next card
      if (topEl) {
        topEl.style.transition = "";
        topEl.style.transform = "";
        topEl.style.opacity = "";
        topEl.classList.remove("is-dragging");
      }
      if (secEl) {
        secEl.style.transition = "";
        secEl.style.transform = "";
        secEl.style.opacity = "";
      }
      if (stampRightRef.current) stampRightRef.current.style.opacity = "0";
      if (stampLeftRef.current) stampLeftRef.current.style.opacity = "0";
      currentDelta.current = { x: 0, y: 0 };
      isAnimating.current = false;
    }, 270);
  }, []);

  const snapBack = useCallback(() => {
    const topEl = topCardRef.current;
    const secEl = secondCardRef.current;
    if (topEl) {
      topEl.style.transition = "transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.25)";
      topEl.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }
    if (secEl) {
      secEl.style.transition = "transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.28s ease";
      secEl.style.transform = "translate3d(0, 14px, 0) scale(0.95)";
      secEl.style.opacity = "0.82";
    }
    if (stampRightRef.current) stampRightRef.current.style.opacity = "0";
    if (stampLeftRef.current) stampLeftRef.current.style.opacity = "0";
    currentDelta.current = { x: 0, y: 0 };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating.current) return;
    // Don't drag if tapping interactive buttons / links
    if ((e.target as HTMLElement).closest("a, button, .project-card-actions")) return;

    activePointerId.current = e.pointerId;
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    currentDelta.current = { x: 0, y: 0 };

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const topEl = topCardRef.current;
    const secEl = secondCardRef.current;
    if (topEl) {
      topEl.classList.add("is-dragging");
      topEl.style.transition = "none";
    }
    if (secEl) {
      secEl.style.transition = "none";
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || activePointerId.current !== e.pointerId) return;

    const dx = e.clientX - startPos.current.x;
    const dy = (e.clientY - startPos.current.y) * 0.18;
    currentDelta.current = { x: dx, y: dy };

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (!isDragging.current) return;

        const curX = currentDelta.current.x;
        const curY = currentDelta.current.y;
        const rot = curX * 0.07;

        if (topCardRef.current) {
          topCardRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) rotate(${rot}deg)`;
        }

        if (secondCardRef.current) {
          const ratio = Math.min(Math.abs(curX) / 80, 1);
          const scale = 0.95 + ratio * 0.05;
          const y = 14 - ratio * 14;
          const op = 0.82 + ratio * 0.18;
          secondCardRef.current.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
          secondCardRef.current.style.opacity = `${op}`;
        }

        if (stampRightRef.current && stampLeftRef.current) {
          if (curX > 14) {
            stampRightRef.current.style.opacity = `${Math.min((curX - 14) / 45, 1)}`;
            stampLeftRef.current.style.opacity = "0";
          } else if (curX < -14) {
            stampLeftRef.current.style.opacity = `${Math.min((-curX - 14) / 45, 1)}`;
            stampRightRef.current.style.opacity = "0";
          } else {
            stampRightRef.current.style.opacity = "0";
            stampLeftRef.current.style.opacity = "0";
          }
        }
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || activePointerId.current !== e.pointerId) return;
    isDragging.current = false;
    activePointerId.current = null;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (topCardRef.current) {
      topCardRef.current.classList.remove("is-dragging");
    }

    const dx = currentDelta.current.x;
    const elapsed = Math.max(performance.now() - startPos.current.time, 1);
    const velocityX = Math.abs(dx) / elapsed; // px/ms
    const isFling = velocityX > 0.42 && Math.abs(dx) > 30;

    if (Math.abs(dx) >= threshold || isFling) {
      dismissCard(dx > 0 ? "right" : "left");
    } else {
      snapBack();
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div className="project-cards-deck-container">
      {/* 3D Swipe Deck Stage */}
      <div className="project-cards-stage">
        {deck.map((proj, idx) => {
          const isTop = idx === deck.length - 1;
          const isSecond = idx === deck.length - 2;

          // Split technologies string into individual badges
          const techList = proj.technologies
            ? proj.technologies.split(",").map((t) => t.trim()).slice(0, 4)
            : [];

          return (
            <div
              key={proj.uid}
              ref={isTop ? topCardRef : isSecond ? secondCardRef : null}
              className={`project-swipe-card ${isTop ? "is-top-card" : ""}`}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              {/* Dynamic Swipe Cues */}
              {isTop && (
                <>
                  <div
                    ref={stampRightRef}
                    className="swipe-stamp stamp-right"
                    style={{ opacity: 0 }}
                  >
                    NEXT ➔
                  </div>
                  <div
                    ref={stampLeftRef}
                    className="swipe-stamp stamp-left"
                    style={{ opacity: 0 }}
                  >
                    PASS ➔
                  </div>
                </>
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
          onClick={() => dismissCard("left")}
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
          onClick={() => dismissCard("right")}
          aria-label="Next card"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MobileProjectCards;
