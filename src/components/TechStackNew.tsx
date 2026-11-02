import React, { useState } from "react";
import CosmicSwarmCanvas from "./ui/CosmicSwarmCanvas";
import "./styles/TechStackNew.css";

export type TechCategory = "all" | "rag" | "finetuning" | "datascience" | "fullstack" | "cloud";

interface TechItem {
  id: string;
  name: string;
  category: "rag" | "finetuning" | "datascience" | "fullstack" | "cloud";
  icon?: string;
  customSvg?: React.ReactNode;
  invertOnDark?: boolean;
}

// Custom crisp SVG icons for modern AI/ML technologies
const LangChainSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path
      d="M9 17H7A5 5 0 0 1 7 7h2m6 0h2a5 5 0 1 1 0 10h-2m-7-5h8"
      stroke="#22c55e"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
  </svg>
);

const LlamaIndexSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path
      d="M7 21V10l3-5h4l3 5v11H7z"
      fill="url(#llamaGrad)"
    />
    <circle cx="10" cy="10" r="1.5" fill="#ffffff" />
    <circle cx="14" cy="10" r="1.5" fill="#ffffff" />
    <path d="M10 15h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="llamaGrad" x1="7" y1="5" x2="17" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

const ChromaSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="8" cy="8" r="4.5" fill="#06b6d4" />
    <circle cx="16" cy="10" r="4" fill="#ec4899" />
    <circle cx="11" cy="16" r="4.5" fill="#eab308" />
  </svg>
);

const FAISSSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="6" cy="12" r="3" fill="#0284c7" />
    <circle cx="18" cy="7" r="2.5" fill="#38bdf8" />
    <circle cx="17" cy="17" r="2.5" fill="#38bdf8" />
    <line x1="8.5" y1="11" x2="15.5" y2="8" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="2 2" />
    <line x1="8.5" y1="13" x2="15" y2="16" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="2 2" />
  </svg>
);

const PeftLoRASvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <rect x="3" y="5" width="8" height="14" rx="2" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.15)" />
    <rect x="13" y="5" width="8" height="6" rx="1.5" stroke="#00f5ff" strokeWidth="1.8" fill="rgba(0,245,255,0.2)" />
    <rect x="13" y="13" width="8" height="6" rx="1.5" stroke="#38bdf8" strokeWidth="1.8" fill="rgba(56,189,248,0.2)" />
    <path d="M11 9h2m-2 6h2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const VLLMSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M4 7l8 10L20 7" stroke="#00f5ff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7l4 5 4-5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextJsSvg = () => (
  <svg viewBox="0 0 180 180" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <mask id="next-mask-pills" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black" />
    </mask>
    <g mask="url(#next-mask-pills)">
      <circle cx="90" cy="90" r="90" fill="black" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z" fill="white" />
      <rect x="115" y="54" width="12" height="72" fill="white" />
    </g>
  </svg>
);

const TECH_ITEMS: TechItem[] = [
  // ================= RAG & AGENTS =================
  {
    id: "langchain",
    name: "LangChain",
    category: "rag",
    customSvg: <LangChainSvg />,
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    category: "rag",
    customSvg: <LlamaIndexSvg />,
  },
  {
    id: "chroma",
    name: "ChromaDB",
    category: "rag",
    customSvg: <ChromaSvg />,
  },
  {
    id: "faiss",
    name: "FAISS",
    category: "rag",
    customSvg: <FAISSSvg />,
  },

  // ================= FINE-TUNING & LLMs =================
  {
    id: "pytorch",
    name: "PyTorch",
    category: "finetuning",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "finetuning",
    icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
  },
  {
    id: "peft",
    name: "LoRA / PEFT",
    category: "finetuning",
    customSvg: <PeftLoRASvg />,
  },
  {
    id: "vllm",
    name: "vLLM",
    category: "finetuning",
    customSvg: <VLLMSvg />,
  },

  // ================= DATA SCIENCE =================
  {
    id: "python",
    name: "Python",
    category: "datascience",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    id: "pandas",
    name: "Pandas",
    category: "datascience",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    id: "numpy",
    name: "NumPy",
    category: "datascience",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    id: "scikitlearn",
    name: "Scikit-learn",
    category: "datascience",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    id: "opencv",
    name: "OpenCV",
    category: "datascience",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
  },

  // ================= FULL-STACK & SYSTEMS =================
  {
    id: "nextjs",
    name: "Next.js",
    category: "fullstack",
    customSvg: <NextJsSvg />,
  },
  {
    id: "react",
    name: "React",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
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
    id: "tailwind",
    name: "Tailwind CSS",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    id: "cplusplus",
    name: "C++",
    category: "fullstack",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },

  // ================= CLOUD & DEVOPS =================
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    id: "redis",
    name: "Redis",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
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
];

const CATEGORIES: { id: TechCategory; label: string }[] = [
  { id: "all", label: "All Systems" },
  { id: "rag", label: "RAG & Agents" },
  { id: "finetuning", label: "Fine-Tuning" },
  { id: "datascience", label: "Data Science" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "cloud", label: "Cloud & DevOps" },
];

export const TechStackNew: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TechCategory>("all");

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
                {tech.customSvg ? (
                  tech.customSvg
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
