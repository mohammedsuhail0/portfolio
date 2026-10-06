import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import "./MobileTechStack.css";

interface TechItem {
  id: string;
  name: string;
  category: "core" | "ai" | "frontend" | "backend";
  icon: string;
  role: string;
  highlight: string;
  docUrl: string;
}

const CATEGORIES = [
  { id: "all", label: "✨ All", filter: null },
  { id: "core", label: "🔥 Core", filter: "core" },
  { id: "ai", label: "🧠 AI & ML", filter: "ai" },
  { id: "frontend", label: "⚡ Frontend", filter: "frontend" },
  { id: "backend", label: "⚙️ Backend", filter: "backend" },
] as const;

const TECH_DATA: TechItem[] = [
  {
    id: "nextjs",
    name: "Next.js",
    category: "core",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    role: "Production App Architecture",
    highlight: "App Router, SSR, Server Actions & edge streaming in NextPatient & BroSync",
    docUrl: "https://nextjs.org",
  },
  {
    id: "python",
    name: "Python",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    role: "AI & ML Workflows",
    highlight: "Clinical simulations, predictive pipelines, and exploratory data modeling",
    docUrl: "https://python.org",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "core",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    role: "End-to-End Type Safety",
    highlight: "Strict typing across client and server with zero runtime overhead",
    docUrl: "https://www.typescriptlang.org",
  },
  {
    id: "react",
    name: "React 18",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    role: "Interactive Client UI",
    highlight: "Concurrent rendering, custom hooks, and reactive UI architectures",
    docUrl: "https://react.dev",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    role: "Async AI Services",
    highlight: "Blazing fast asynchronous endpoints with native Pydantic validation",
    docUrl: "https://fastapi.tiangolo.com",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    role: "Modern Responsive Styling",
    highlight: "Fluid space tokens, glassmorphism aesthetics, and atomic utility layouts",
    docUrl: "https://tailwindcss.com",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    role: "Scalable Backends",
    highlight: "REST APIs, WebSockets streaming, and microservice orchestration",
    docUrl: "https://nodejs.org",
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    role: "Deep Learning & Tensors",
    highlight: "Neural networks, image classifiers, and vision model prototyping",
    docUrl: "https://pytorch.org",
  },
  {
    id: "scikitlearn",
    name: "Scikit-Learn",
    category: "ai",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
    role: "Applied Machine Learning",
    highlight: "Certified Grade O Google AI/ML & Fullstack Academy predictive models",
    docUrl: "https://scikit-learn.org",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    role: "Relational Engine",
    highlight: "Complex queries, indexing strategies, and Supabase integration",
    docUrl: "https://www.postgresql.org",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    role: "Realtime Database & Auth",
    highlight: "Instant PostgreSQL APIs, row-level security, and realtime subscriptions",
    docUrl: "https://supabase.com",
  },
  {
    id: "docker",
    name: "Docker",
    category: "backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    role: "Container Architecture",
    highlight: "Isolated containerized services and reproducible production environments",
    docUrl: "https://docker.com",
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
    role: "3D & Shaders",
    highlight: "Interactive particle portraits, stellar starfields, and WebGL scenes",
    docUrl: "https://threejs.org",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "core",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
    role: "Global Edge Infrastructure",
    highlight: "Continuous delivery, edge networks, and instant deployment pipelines",
    docUrl: "https://vercel.com",
  },
];

export const MobileTechStack: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTechId, setSelectedTechId] = useState<string>("nextjs");

  const filteredTech =
    activeCategory === "all"
      ? TECH_DATA
      : TECH_DATA.filter((item) => item.category === activeCategory);

  const selectedTech =
    TECH_DATA.find((item) => item.id === selectedTechId) || TECH_DATA[0];

  const handleSurprise = () => {
    const randomIndex = Math.floor(Math.random() * TECH_DATA.length);
    setSelectedTechId(TECH_DATA[randomIndex].id);
  };

  return (
    <div className="mobile-tech-container">
      {/* Slide Heading */}
      <div className="mobile-tech-header">
        <h2 className="mobile-tech-title">Tech Arsenal</h2>
        <button
          type="button"
          onClick={handleSurprise}
          className="tech-random-btn"
          aria-label="Random Tech"
        >
          <IoSparkles />
          <span>Inspect</span>
        </button>
      </div>

      {/* Category Pills Scroller */}
      <div className="tech-category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`tech-cat-pill ${
              activeCategory === cat.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Spotlight Card (Displays details of tapped item) */}
      <div className="tech-spotlight-card">
        <div className="spotlight-left">
          <div className="spotlight-icon-wrap">
            <img
              src={selectedTech.icon}
              alt={selectedTech.name}
              className="spotlight-icon"
              loading="lazy"
            />
          </div>
          <div className="spotlight-meta">
            <div className="spotlight-title-row">
              <span className="spotlight-name">{selectedTech.name}</span>
              <span className="spotlight-role-badge">{selectedTech.role}</span>
            </div>
            <p className="spotlight-desc">{selectedTech.highlight}</p>
          </div>
        </div>

        <a
          href={selectedTech.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="spotlight-doc-btn"
          aria-label={`Official ${selectedTech.name} documentation`}
        >
          <FiExternalLink />
        </a>
      </div>

      {/* Touch-Interactive Grid */}
      <div className="tech-grid-scroll">
        {filteredTech.map((tech) => {
          const isSelected = tech.id === selectedTechId;
          return (
            <div
              key={tech.id}
              role="button"
              tabIndex={0}
              className={`tech-tile-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedTechId(tech.id)}
            >
              <div className="tech-tile-icon-box">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="tech-tile-icon"
                  loading="lazy"
                />
              </div>
              <span className="tech-tile-name">{tech.name}</span>
              <span className="tech-tile-sub">{tech.role.split(" ")[0]}</span>
              {isSelected && <span className="tech-active-glow" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTechStack;
