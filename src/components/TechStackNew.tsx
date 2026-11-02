import React, { useState } from "react";
import CosmicSwarmCanvas from "./ui/CosmicSwarmCanvas";
import "./styles/TechStackNew.css";

interface TechItem {
  id: string;
  name: string;
  category: "ai" | "fullstack" | "cloud";
  icon: string;
  isCustomNext?: boolean;
  invertOnDark?: boolean;
}

const TECH_ITEMS: TechItem[] = [
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "fullstack",
    icon: "",
    isCustomNext: true,
  },
  {
    id: "redis",
    name: "Redis",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    id: "threejs",
    name: "WebGL",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
    invertOnDark: true,
  },
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    id: "python",
    name: "Python",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  {
    id: "react",
    name: "React",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "ai",
    icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    id: "linux",
    name: "Linux",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  {
    id: "github",
    name: "GitHub",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    invertOnDark: true,
  },
  {
    id: "cplusplus",
    name: "C++",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tech badges" },
  { id: "ai", label: "AI & ML" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "cloud", label: "Cloud & Infra" },
] as const;

export const TechStackNew: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = activeCategory === "all"
    ? TECH_ITEMS
    : TECH_ITEMS.filter((t) => t.category === activeCategory);

  return (
    <section className="techstack-cosmic-section" id="techstack">
      {/* Interactive School of Space Fishes / Cosmic Swarm Canvas */}
      <CosmicSwarmCanvas className="techstack-bg-canvas" />

      {/* Top & bottom subtle section gradient blends */}
      <div className="techstack-vignette-top" />
      <div className="techstack-vignette-bottom" />

      {/* Foreground Content */}
      <div className="techstack-container">
        {/* Header row exactly matching reference image */}
        <div className="techstack-header-row">
          <div className="techstack-title-group">
            <h2 className="techstack-main-title">SYSTEMS & CORE FRAMEWORKS</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="techstack-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`techstack-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Compact Horizontal Pills Grid (matching user reference) */}
        <div className="techstack-pill-grid">
          {filteredItems.map((tech) => (
            <div
              key={tech.id}
              className="techstack-pill-card"
            >
              <div className="techstack-pill-icon-wrap">
                {tech.isCustomNext ? (
                  <svg viewBox="0 0 180 180" width="100%" height="100%" fill="none" className="techstack-pill-icon">
                    <mask id={`next-mask-${tech.id}`} mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                      <circle cx="90" cy="90" r="90" fill="black" />
                    </mask>
                    <g mask={`url(#next-mask-${tech.id})`}>
                      <circle cx="90" cy="90" r="90" fill="black" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z" fill="white" />
                      <rect x="115" y="54" width="12" height="72" fill="white" />
                    </g>
                  </svg>
                ) : (
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className={`techstack-pill-icon ${tech.invertOnDark ? "invert-dark" : ""}`}
                    loading="lazy"
                  />
                )}
              </div>
              <span className="techstack-pill-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackNew;
