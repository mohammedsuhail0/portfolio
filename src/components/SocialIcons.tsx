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
      <a
        className="resume-button"
        href="/Mohammed_Suhail_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
