import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import { config } from "../config";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" id="social">
        <span>
          <a
            href={config.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </span>
      </div>
      <div className="resume-group">
        <a
          className="resume-button"
          href="/Mohammed_Suhail_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Download Resume (PDF)"
        >
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
        <a
          className="resume-button cv-button"
          href="/Mohammed_Suhail_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Download Curriculum Vitae (PDF)"
        >
          <HoverLinks text="CV" />
          <span>
            <TbNotes />
          </span>
        </a>
      </div>
    </div>
  );
};

export default SocialIcons;
