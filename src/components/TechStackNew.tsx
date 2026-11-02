import React, { useState } from "react";
import CosmicSwarmCanvas from "./ui/CosmicSwarmCanvas";
import "./styles/TechStackNew.css";

interface TechItem {
  id: string;
  name: string;
  category: "ai" | "fullstack" | "cloud";
  icon: string;
  role: string;
  invertOnDark?: boolean;
}

const TECH_ITEMS: TechItem[] = [
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    role: "Tensors & Neural Networks",
  },
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "fullstack",
    icon: "/images/nextBL.webp",
    role: "Production App Architecture",
  },
  {
    id: "redis",
    name: "Redis",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    role: "Low-Latency In-Memory Cache",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    role: "High-Throughput Services",
  },
  {
    id: "threejs",
    name: "WebGL / Three.js",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
    role: "Real-time 3D & Shaders",
    invertOnDark: true,
  },
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    role: "Containerized Deployments",
  },
  {
    id: "python",
    name: "Python",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    role: "Core AI & Data Engineering",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    role: "Strict End-to-End Type Safety",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    role: "Asynchronous Microservices",
  },
  {
    id: "react",
    name: "React 19",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    role: "Concurrent Client Systems",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    role: "Relational & Vector Data",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "ai",
    icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
    role: "Transformers & LLM Pipelines",
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    role: "Deep Learning & Vision",
  },
  {
    id: "aws",
    name: "AWS Cloud",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    role: "Cloud Infrastructure & Edge",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    role: "Adaptive Fluid Tokens",
  },
  {
    id: "linux",
    name: "Linux Kernel",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    role: "UNIX Shell & Server OS",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Systems" },
  { id: "ai", label: "AI & Intelligence" },
  { id: "fullstack", label: "Full-Stack Architecture" },
  { id: "cloud", label: "Data & Infrastructure" },
] as const;

export const TechStackNew: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const filteredItems = activeCategory === "all"
    ? TECH_ITEMS
    : TECH_ITEMS.filter((t) => t.category === activeCategory);

  return (
    <section className="techstack-cosmic-section" id="techstack">
      {/* Interactive Flowing Cosmic Swarm Canvas (matches the user's reference) */}
      <CosmicSwarmCanvas className="techstack-bg-canvas" />

      {/* Subtle top & bottom section gradient blends */}
      <div className="techstack-vignette-top" />
      <div className="techstack-vignette-bottom" />

      {/* Foreground Content */}
      <div className="techstack-container">
        {/* Header matching reference */}
        <div className="techstack-header-row">
          <div className="techstack-title-group">
            <span className="techstack-kicker">ENGINEERING ARSENAL</span>
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

        {/* Clean Tech Badges Grid */}
        <div className="techstack-grid">
          {filteredItems.map((tech) => (
            <div
              key={tech.id}
              className={`techstack-badge-card ${hoveredTech === tech.id ? "is-hovered" : ""}`}
              onMouseEnter={() => setHoveredTech(tech.id)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              <div className="techstack-badge-inner">
                <div className="techstack-badge-icon-wrap">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className={`techstack-badge-icon ${tech.invertOnDark ? "invert-dark" : ""}`}
                    loading="lazy"
                  />
                </div>
                <div className="techstack-badge-info">
                  <span className="techstack-badge-name">{tech.name}</span>
                  <span className="techstack-badge-role">{tech.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackNew;
