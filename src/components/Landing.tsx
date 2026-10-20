import "./styles/Landing.css";
import RevealHeroFace from "./RevealHeroFace";
import { lenis } from "./Navbar";

const Landing = () => {
  const handleScrollTo = (targetId: string) => {
    const targetSection = document.querySelector(targetId) as HTMLElement;
    if (targetSection) {
      if (lenis) {
        lenis.scrollTo(targetSection, { duration: 1.4 });
      } else {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="landing-section" id="landingDiv">
      {/* 1. Giant Layered Background Typography (Midground Behind Character) */}
      <div className="hero-giant-bg-text" aria-hidden="true">
        CREATIVE
      </div>

      {/* 2. Centerpiece Character Portrait with Astronaut Cursor Reveal */}
      <div className="hero-avatar-centerpiece">
        <RevealHeroFace variant="avatar" />
      </div>

      {/* 3. Hero Content Container (Left & Right UI Docks) */}
      <div className="landing-container">
        {/* LEFT COLUMN */}
        <div className="hero-col hero-left-col">
          <div className="hero-col-top">
            <div className="hero-kicker">
              <span className="hero-kicker-dot"></span>
              <span className="hero-kicker-text">FULL-STACK & AI SYSTEMS</span>
            </div>

            <h1 className="hero-headline-main">
              GIVE YOUR VISION A SYSTEM IT CAN ACTUALLY SCALE INTO
            </h1>

            <p className="hero-subtext">
              Engineering high-scale cloud architectures, autonomous AI pipelines, and pixel-crafted digital products with zero-latency precision.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="hero-btn-pill hero-btn-primary"
                onClick={() => handleScrollTo("#work")}
                data-cursor="disable"
              >
                <span>Explore Work</span>
                <span className="hero-btn-arrow">↗</span>
              </button>
              <button
                type="button"
                className="hero-btn-pill hero-btn-secondary"
                onClick={() => handleScrollTo("#contact")}
                data-cursor="disable"
              >
                Hire Me
              </button>
            </div>
          </div>

          {/* Bottom Left: Two frosted glass metric badges */}
          <div className="hero-col-bottom hero-badges-row">
            <div className="hero-metric-pill">
              <span className="hero-metric-bullet">•</span>
              <div className="hero-metric-info">
                <span className="hero-metric-label">HACKATHONS</span>
                <span className="hero-metric-val">SIH '24 Finalist</span>
              </div>
            </div>

            <div className="hero-metric-pill">
              <span className="hero-metric-bullet">•</span>
              <div className="hero-metric-info">
                <span className="hero-metric-label">SHIPPED</span>
                <span className="hero-metric-val">11+ Live Apps</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-col hero-right-col">
          <div className="hero-col-top">
            <div className="hero-role-block">
              <span className="hero-role-title">FULL-STACK</span>
              <span className="hero-role-title hero-role-highlight">ENGINEER</span>
            </div>

            <p className="hero-bio-text">
              Specialized in React, Next.js, Node.js, and GenAI workflows. Turning ambitious ideas into high-throughput, mission-ready production systems.
            </p>
          </div>

          {/* Bottom Right: Floating frosted glass feature card */}
          <div
            className="hero-col-bottom hero-partner-card"
            onClick={() => handleScrollTo("#about")}
            data-cursor="disable"
          >
            <div className="hero-partner-card-header">
              <span>Your Partner in Digital Innovation</span>
              <span className="hero-partner-arrow">↗</span>
            </div>
            <p className="hero-partner-card-desc">
              Smart India Hackathon Finalist • Certified in Data Science & Google AI/ML • 99.9% Uptime Mindset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
