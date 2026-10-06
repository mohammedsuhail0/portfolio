import { useState, useRef, useCallback } from "react";
import { config } from "../../config";
import RevealHeroFace from "../RevealHeroFace";
import TechStackNew from "../TechStackNew";
import { useTheme } from "../../context/ThemeContext";
import {
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
  IoSparkles,
  IoSparklesOutline,
  IoBriefcase,
  IoBriefcaseOutline,
  IoFolder,
  IoFolderOutline,
  IoCodeSlash,
  IoCodeSlashOutline,
  IoMail,
  IoMailOutline,
} from "react-icons/io5";
import {
  FiSun,
  FiMoon,
  FiExternalLink,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./MobileContainer.css";

// Universally recognized popular icons (Ionicons v5) for mobile dock
const SLIDES = [
  { id: "hero", label: "Hero", activeIcon: IoHome, inactiveIcon: IoHomeOutline },
  { id: "about", label: "About", activeIcon: IoPerson, inactiveIcon: IoPersonOutline },
  { id: "skills", label: "Skills", activeIcon: IoSparkles, inactiveIcon: IoSparklesOutline },
  { id: "career", label: "Career", activeIcon: IoBriefcase, inactiveIcon: IoBriefcaseOutline },
  { id: "work", label: "Work", activeIcon: IoFolder, inactiveIcon: IoFolderOutline },
  { id: "stack", label: "Stack", activeIcon: IoCodeSlash, inactiveIcon: IoCodeSlashOutline },
  { id: "contact", label: "Contact", activeIcon: IoMail, inactiveIcon: IoMailOutline },
] as const;

export const MobileContainer = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [workIndex, setWorkIndex] = useState(0);
  const isTransitioningRef = useRef(false);
  const { theme, toggleTheme } = useTheme();

  // Touch gesture tracking for vertical swipe
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= SLIDES.length) return;
    setActiveSlide(index);
    isTransitioningRef.current = true;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 450);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isTransitioningRef.current) return;

    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    // Detect vertical swipe (must be dominant over horizontal)
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 42) {
      if (deltaY < 0 && activeSlide < SLIDES.length - 1) {
        // Swipe UP -> Next
        goToSlide(activeSlide + 1);
      } else if (deltaY > 0 && activeSlide > 0) {
        // Swipe DOWN -> Prev
        goToSlide(activeSlide - 1);
      }
    }
  };

  // Horizontal navigation for Works carousel
  const nextProject = () => {
    setWorkIndex((prev) => (prev + 1) % config.projects.length);
  };
  const prevProject = () => {
    setWorkIndex((prev) => (prev - 1 + config.projects.length) % config.projects.length);
  };

  const currentProject = config.projects[workIndex];

  return (
    <div
      className="mobile-app-root"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* -------------------------------------------------------------
          TRANSPARENT TOP STATUS BAR
          ------------------------------------------------------------- */}
      <header className="mobile-topbar">
        <div className="mobile-brand">
          <span className="brand-dot"></span>
          <span className="brand-name">SUHAIL</span>
        </div>



        <button
          type="button"
          onClick={toggleTheme}
          className="mobile-theme-btn"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
      </header>

      {/* -------------------------------------------------------------
          FULL-SCREEN SLIDES DECK (100dvh, ZERO SCROLL)
          ------------------------------------------------------------- */}
      <div
        className="mobile-slides-track"
        style={{
          transform: `translate3d(0, -${activeSlide * 100}%, 0)`,
        }}
      >
        {/* SLIDE 0: HERO */}
        <section className="mobile-slide hero-slide">
          {/* Top Text Header */}
          <div className="mobile-hero-header">

            <h2 className="hero-intro-hello">HELLO! I'M</h2>
            <h1 className="hero-intro-name">MOHAMMED SUHAIL</h1>
            <div className="hero-intro-roles">
              <span className="role-cyan">AI Engineer</span>
              <span className="role-bullet">•</span>
              <span className="role-white">Full-Stack Developer</span>
            </div>
          </div>

          {/* Majestically Anchored Hero Portrait with Astronaut Reveal */}
          <div className="mobile-hero-portrait-stage">
            <RevealHeroFace variant="avatar" />
          </div>

          {/* Floating Subtle Swipe Prompt */}
          <div
            className="mobile-swipe-indicator"
            onClick={() => goToSlide(1)}
            role="button"
            tabIndex={0}
          >
            <span className="swipe-txt">SWIPE UP</span>
            <span className="swipe-arrow">↑</span>
          </div>
        </section>

        {/* SLIDE 1: ABOUT */}
        <section className="mobile-slide about-slide">
          <div className="mobile-section-badge">02 // IDENTITY</div>
          <h2 className="mobile-slide-title">About Me</h2>

          <div className="mobile-card-glass about-card">
            <p className="about-bio">{config.about.description}</p>

            <div className="about-badges-grid">
              <div className="stat-pill">
                <span className="stat-icon">🎓</span>
                <div className="stat-info">
                  <strong>ISL Engineering College</strong>
                  <span>B.Tech IT • Class of 2028</span>
                </div>
              </div>
              <div className="stat-pill">
                <span className="stat-icon">🏆</span>
                <div className="stat-info">
                  <strong>Fullstack Academy</strong>
                  <span>Data Science Certificate of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: WHAT I DO */}
        <section className="mobile-slide skills-slide">
          <div className="mobile-section-badge">03 // CAPABILITIES</div>
          <h2 className="mobile-slide-title">What I Do</h2>

          <div className="skills-cards-stack">
            <div className="mobile-card-glass skill-feature-card">
              <div className="skill-card-top">
                <span className="skill-icon-glyph">⚡</span>
                <div className="skill-card-head">
                  <h3>Full-Stack Web Architecture</h3>
                  <span>Rapid Prototyping & Production Delivery</span>
                </div>
              </div>
              <p className="skill-card-desc">
                Architecting resilient applications with Next.js, React, Node.js, and PostgreSQL. Focused on clean code and scalable APIs.
              </p>
              <div className="skill-tags-row">
                <span>Next.js</span>
                <span>React</span>
                <span>TypeScript</span>
                <span>PostgreSQL</span>
                <span>Docker</span>
              </div>
            </div>

            <div className="mobile-card-glass skill-feature-card">
              <div className="skill-card-top">
                <span className="skill-icon-glyph">🧠</span>
                <div className="skill-card-head">
                  <h3>AI Systems & Data Science</h3>
                  <span>Machine Intelligence & Analytics</span>
                </div>
              </div>
              <p className="skill-card-desc">
                Integrating AI workflows, deep learning models, computer vision, and predictive pipelines into web interfaces.
              </p>
              <div className="skill-tags-row">
                <span>Python</span>
                <span>PyTorch</span>
                <span>TensorFlow</span>
                <span>OpenCV</span>
                <span>Scikit-Learn</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3: CAREER */}
        <section className="mobile-slide career-slide">
          <div className="mobile-section-badge">04 // EXPERIENCE</div>
          <h2 className="mobile-slide-title">Career Milestones</h2>

          <div className="career-timeline-mobile">
            {config.experiences.map((exp, idx) => (
              <div key={idx} className="timeline-node-mobile">
                <div className="node-marker">
                  <span className="node-dot"></span>
                  {idx < config.experiences.length - 1 && <span className="node-line"></span>}
                </div>
                <div className="node-content-glass">
                  <div className="node-header">
                    <h4>{exp.position}</h4>
                    <span className="node-year">{exp.period}</span>
                  </div>
                  <h5>{exp.company}</h5>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SLIDE 4: WORK (HORIZONTAL SWIPEABLE CAROUSEL) */}
        <section className="mobile-slide work-slide">
          <div className="mobile-section-badge">
            05 // PORTFOLIO ({workIndex + 1}/{config.projects.length})
          </div>
          <h2 className="mobile-slide-title">Featured Works</h2>

          <div className="mobile-project-carousel">
            <div className="project-display-card mobile-card-glass">
              {currentProject.image && (
                <div className="project-thumb-frame">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    loading="lazy"
                  />
                  <span className="project-cat-pill">{currentProject.category}</span>
                </div>
              )}

              <div className="project-details">
                <h3 className="project-name">{currentProject.title}</h3>
                <p className="project-desc">{currentProject.description}</p>
                <div className="project-tech-line">
                  {currentProject.technologies}
                </div>

                {currentProject.link && (
                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-live-btn"
                  >
                    <span>View Project</span>
                    <FiExternalLink />
                  </a>
                )}
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="carousel-controls">
              <button
                type="button"
                onClick={prevProject}
                className="carousel-btn"
                aria-label="Previous Project"
              >
                <FiChevronLeft />
              </button>
              <div className="carousel-dots">
                {config.projects.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === workIndex ? "active" : ""}`}
                    onClick={() => setWorkIndex(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextProject}
                className="carousel-btn"
                aria-label="Next Project"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>

        {/* SLIDE 5: TECH STACK */}
        <section className="mobile-slide stack-slide">
          <div className="mobile-section-badge">06 // INSTRUMENTARIUM</div>
          <div className="stack-scaled-wrapper">
            <TechStackNew />
          </div>
        </section>

        {/* SLIDE 6: CONTACT */}
        <section className="mobile-slide contact-slide">
          <div className="mobile-section-badge">07 // DISPATCH</div>
          <h2 className="mobile-slide-title">Let's Connect</h2>
          <p className="contact-lead">
            Open for software engineering roles, AI projects, and innovative collaborations.
          </p>

          <div className="contact-actions-grid">
            <a
              href={`mailto:${config.contact.email}`}
              className="mobile-action-card mail-card"
            >
              <div className="action-icon">
                <IoMail />
              </div>
              <div className="action-text">
                <strong>Email Direct</strong>
                <span>{config.contact.email}</span>
              </div>
            </a>

            <div className="social-action-row">
              <a
                href={config.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-action-btn"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>

              <a
                href={config.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-action-btn"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
            </div>

            <a
              href="/Mohammed_Suhail_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-download-btn"
            >
              <FiDownload />
              <span>Download Resume (PDF)</span>
            </a>
          </div>

          <div className="mobile-footer-signoff">
            <span>© {new Date().getFullYear()} Mohammed Suhail</span>
            <span className="dot-sep">•</span>
            <span>Hyderabad, India</span>
          </div>
        </section>
      </div>

      {/* -------------------------------------------------------------
          TRANSPARENT BOTTOM DOCK (LOGOS ONLY, POPULAR UNIVERSAL ICONS)
          ------------------------------------------------------------- */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        {SLIDES.map((slide, index) => {
          const isActive = activeSlide === index;
          const IconComponent = isActive ? slide.activeIcon : slide.inactiveIcon;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`dock-tab ${isActive ? "active" : ""}`}
              aria-label={slide.label}
            >
              <IconComponent className="dock-icon" />
              {isActive && <span className="dock-dot"></span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileContainer;
