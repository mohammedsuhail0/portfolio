import "./styles/Landing.css";
import { config } from "../config";
import RevealHeroFace from "./RevealHeroFace";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

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
    </div>
  );
};

export default Landing;
