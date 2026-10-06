import "./styles/Landing.css";
import { config } from "../config";
import RevealHeroFace from "./RevealHeroFace";
import ProofStrip from "./ProofStrip";
import { lenis } from "./Navbar";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleHireMe = () => {
    const contactSection = document.querySelector("#contact") as HTMLElement;
    if (contactSection) {
      if (lenis) {
        lenis.scrollTo(contactSection, { duration: 1.4 });
      } else {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="landing-section" id="landingDiv">
      {/* Centerpiece Portrait with Cyborg Cursor Reveal */}
      <div className="hero-avatar-centerpiece">
        <RevealHeroFace variant="avatar" />
      </div>

      <div className="landing-container">
        {/* Left Side: OG Intro & Name */}
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            <span className="hero-name-first">{firstName.toUpperCase()}</span>
            {lastName && <span className="hero-name-last">{lastName.toUpperCase()}</span>}
          </h1>

          {/* Hero Action Buttons */}
          <div className="hero-actions-row">
            <button
              type="button"
              className="hero-btn-pill hero-btn-primary"
              onClick={handleHireMe}
              data-cursor="disable"
            >
              Hire Me
            </button>
            <a
              href="/Mohammed_Suhail_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-pill hero-btn-secondary"
              data-cursor="disable"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Right Side: OG Info & Roles */}
        <div className="landing-info">
          <h3>An</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">AI Engineer</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Full-Stack Developer</div>
          </h2>
        </div>
      </div>

      {/* Compact Proof Strip near bottom of Hero Viewport */}
      <div className="hero-proof-strip-dock">
        <ProofStrip variant="desktop" />
      </div>
    </div>
  );
};

export default Landing;
