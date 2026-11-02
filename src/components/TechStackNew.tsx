import React, { useState } from "react";
import CosmicSwarmCanvas from "./ui/CosmicSwarmCanvas";
import "./styles/TechStackNew.css";

export type TechCategory = "all" | "rag" | "finetuning" | "datascience" | "fullstack" | "cloud";

interface TechItem {
  id: string;
  name: string;
  category: "rag" | "finetuning" | "datascience" | "fullstack" | "cloud";
  icon: React.ReactNode;
}

// ============================================================================
// SELF-CONTAINED HIGH-QUALITY VECTOR SVGS (100% Reliable, 0ms Network Latency)
// ============================================================================

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
    <path d="M7 21V10l3-5h4l3 5v11H7z" fill="url(#llamaGrad)" />
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

const PyTorchSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path
      d="M13.2 2.2a9 9 0 0 0-4.8 15.6l1.4-1.4a7 7 0 0 1 3.4-12.2V2.2z"
      fill="#EE4C2C"
    />
    <circle cx="14.8" cy="4.2" r="1.3" fill="#EE4C2C" />
    <path
      d="M10.8 21.8a9 9 0 0 0 4.8-15.6l-1.4 1.4a7 7 0 0 1-3.4 12.2v2z"
      fill="#EE4C2C"
    />
  </svg>
);

const HuggingFaceSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="12" cy="12" r="10" fill="#FFD21E" />
    <path d="M7 9a1.8 1.8 0 0 1 3.6 0M13.4 9a1.8 1.8 0 0 1 3.6 0" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 14.5c1.2 2 6.8 2 8 0" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="5" cy="13" r="1.5" fill="#FF8C00" />
    <circle cx="19" cy="13" r="1.5" fill="#FF8C00" />
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

const PythonSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path
      d="M11.9 2c-3.1 0-5 .9-5 2.5V7h5v1H5.4C3.5 8 2 9.7 2 11.9c0 2.2 1.4 3.7 3.5 3.7H7v-2.1c0-2.2 1.9-4 4.1-4h4.1V7.4c0-2.8-2.3-5.4-3.3-5.4zm-2.1 2.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"
      fill="#387EB8"
    />
    <path
      d="M12.1 22c3.1 0 5-.9 5-2.5V17h-5v-1h6.5c1.9 0 3.4-1.7 3.4-3.9 0-2.2-1.4-3.7-3.5-3.7H17v2.1c0 2.2-1.9 4-4.1 4H8.8v2.1c0 2.8 2.3 5.4 3.3 5.4zm2.1-2.2a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"
      fill="#FFE052"
    />
  </svg>
);

const PandasSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <rect x="4" y="4" width="4" height="16" rx="1" fill="#130754" />
    <rect x="10" y="7" width="4" height="13" rx="1" fill="#FFD43B" />
    <rect x="16" y="11" width="4" height="9" rx="1" fill="#E70488" />
  </svg>
);

const NumPySvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#4DABCF" />
    <path d="M12 2l9 5-9 5-9-5 9-5z" fill="#013243" opacity="0.4" />
    <text x="8" y="16" fill="#ffffff" fontWeight="bold" fontSize="9" fontFamily="sans-serif">N</text>
  </svg>
);

const ScikitSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="8" cy="12" r="5" fill="#3499CD" opacity="0.9" />
    <circle cx="15" cy="12" r="5.5" fill="#F89939" opacity="0.9" />
    <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
  </svg>
);

const OpenCVSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="12" cy="7" r="3.6" stroke="#ED1C24" strokeWidth="2.4" fill="none" />
    <circle cx="7" cy="16" r="3.6" stroke="#22B14C" strokeWidth="2.4" fill="none" />
    <circle cx="17" cy="16" r="3.6" stroke="#00A2E8" strokeWidth="2.4" fill="none" />
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

const ReactSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(0 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
  </svg>
);

const TypeScriptSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path d="M12.5 10H7v2h2.2v6.5h2V12h2.2V10zm4.5 1.8c-.8 0-1.4.3-1.8.8l1.2 1c.2-.3.4-.5.7-.5.4 0 .7.2.7.5 0 .3-.2.5-.7.7l-.8.3c-1.1.4-1.7 1-1.7 1.9 0 1.2 1 2 2.3 2 1 0 1.8-.4 2.3-1.1l-1.2-1c-.3.4-.6.6-1.1.6-.4 0-.7-.2-.7-.5 0-.3.2-.5.8-.7l.8-.3c1.2-.4 1.8-1 1.8-2 0-1.2-1-2-2.3-2z" fill="#ffffff" />
  </svg>
);

const FastAPISvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="12" cy="12" r="10" fill="#009688" />
    <path d="M13 3L6 14h5l-1 7 7-11h-5l1-7z" fill="#ffffff" />
  </svg>
);

const NodeSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="#539E43" />
    <path d="M12 4.5l6.5 3.8v7.4L12 19.5l-6.5-3.8V8.3L12 4.5z" fill="#333333" opacity="0.25" />
    <text x="6.5" y="15" fill="#ffffff" fontWeight="bold" fontSize="8" fontFamily="sans-serif">JS</text>
  </svg>
);

const WebGLSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M12 3l9 16H3l9-16z" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 8l4.5 8h-9L12 8z" fill="rgba(0, 245, 255, 0.4)" stroke="#00f5ff" strokeWidth="1.2" />
  </svg>
);

const TailwindSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path
      d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.3-1.8 3.8-1.4 1 .3 1.6 1 2.3 1.8 1.2 1.3 2.6 2.6 5.4 2.6 2.7 0 4.3-1.3 5-4-1 1.3-2.3 1.8-3.8 1.4-1-.3-1.6-1-2.3-1.8C16.2 7.3 14.8 6 12 6zM6 13c-2.7 0-4.3 1.3-5 4 1-1.3 2.3-1.8 3.8-1.4 1 .3 1.6 1 2.3 1.8 1.2 1.3 2.6 2.6 5.4 2.6 2.7 0 4.3-1.3 5-4-1 1.3-2.3 1.8-3.8 1.4-1-.3-1.6-1-2.3-1.8C10.2 14.3 8.8 13 6 13z"
      fill="#38BDF8"
    />
  </svg>
);

const CPlusPlusSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" fill="#00599C" />
    <text x="5" y="15" fill="#ffffff" fontWeight="bold" fontSize="9" fontFamily="sans-serif">C++</text>
  </svg>
);

const DockerSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <rect x="7" y="10" width="2.2" height="2" fill="#2496ED" />
    <rect x="10" y="10" width="2.2" height="2" fill="#2496ED" />
    <rect x="13" y="10" width="2.2" height="2" fill="#2496ED" />
    <rect x="10" y="7.5" width="2.2" height="2" fill="#2496ED" />
    <rect x="13" y="7.5" width="2.2" height="2" fill="#2496ED" />
    <path
      d="M21.5 13.5c-.4-.3-1.2-.4-1.8-.2-.3-.8-1-1.3-1.8-1.3H16v2h-1v-2H6.5c-.3 0-.5.2-.5.5v2H5c-.8 0-1.6.4-2 1-.4.6-.4 1.4 0 2 .8 1.2 2.5 2 5.5 2 4.5 0 7.8-1.5 9.5-4.5.8.1 1.6-.1 2.2-.6.7-.6 1.3-1.2 1.3-1.4 0-.1 0-.3-.5-.5z"
      fill="#2496ED"
    />
  </svg>
);

const PostgresSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="12" cy="12" r="10" fill="#336791" />
    <path
      d="M12 5c-3 0-5.5 2-5.5 5 0 2.2 1.3 4 3.2 4.7V17l2 1.5 1.5-1.5v-2.3c2.4-.6 4.3-2.6 4.3-5.2 0-3-2.5-4.5-5.5-4.5z"
      fill="#ffffff"
    />
    <circle cx="10" cy="9.5" r="1" fill="#336791" />
  </svg>
);

const RedisSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#DC382D" />
    <path d="M2 11l10 5 10-5" stroke="#A82820" strokeWidth="1.8" />
    <path d="M2 14l10 5 10-5" stroke="#A82820" strokeWidth="1.8" />
  </svg>
);

const AWSSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <rect width="24" height="24" rx="4" fill="#232F3E" />
    <text x="4.5" y="13" fill="#ffffff" fontWeight="900" fontSize="7" fontFamily="sans-serif">AWS</text>
    <path d="M5 16.5c4.5 2.5 9.5 2.5 14 0" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LinuxSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <ellipse cx="12" cy="13" rx="6" ry="8" fill="#F8B800" />
    <ellipse cx="12" cy="13" rx="4.5" ry="6.5" fill="#ffffff" />
    <circle cx="12" cy="7" r="4.2" fill="#1F2937" />
    <circle cx="10.5" cy="6.5" r="0.9" fill="#ffffff" />
    <circle cx="13.5" cy="6.5" r="0.9" fill="#ffffff" />
    <polygon points="11,7.5 13,7.5 12,9" fill="#FFA500" />
  </svg>
);

const GitHubSvg = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" className="techstack-pill-icon">
    <circle cx="12" cy="12" r="10" fill="#24292e" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1 0-.2-.3-.9.1-2 0 0 .7-.2 2.2.8a7.8 7.8 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.8.1 2 .6.6.8 1.3.8 2.1 0 3.2-1.9 3.8-3.7 4 .3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8 8 0 0 0 12 4z"
      fill="#ffffff"
    />
  </svg>
);

// ============================================================================
// TECH STACK DATA DEFINITION
// ============================================================================

const TECH_ITEMS: TechItem[] = [
  // ================= RAG & AGENTS =================
  {
    id: "langchain",
    name: "LangChain",
    category: "rag",
    icon: <LangChainSvg />,
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    category: "rag",
    icon: <LlamaIndexSvg />,
  },
  {
    id: "chroma",
    name: "ChromaDB",
    category: "rag",
    icon: <ChromaSvg />,
  },
  {
    id: "faiss",
    name: "FAISS",
    category: "rag",
    icon: <FAISSSvg />,
  },

  // ================= FINE-TUNING & LLMs =================
  {
    id: "pytorch",
    name: "PyTorch",
    category: "finetuning",
    icon: <PyTorchSvg />,
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    category: "finetuning",
    icon: <HuggingFaceSvg />,
  },
  {
    id: "peft",
    name: "LoRA / PEFT",
    category: "finetuning",
    icon: <PeftLoRASvg />,
  },
  {
    id: "vllm",
    name: "vLLM",
    category: "finetuning",
    icon: <VLLMSvg />,
  },

  // ================= DATA SCIENCE =================
  {
    id: "python",
    name: "Python",
    category: "datascience",
    icon: <PythonSvg />,
  },
  {
    id: "pandas",
    name: "Pandas",
    category: "datascience",
    icon: <PandasSvg />,
  },
  {
    id: "numpy",
    name: "NumPy",
    category: "datascience",
    icon: <NumPySvg />,
  },
  {
    id: "scikitlearn",
    name: "Scikit-learn",
    category: "datascience",
    icon: <ScikitSvg />,
  },
  {
    id: "opencv",
    name: "OpenCV",
    category: "datascience",
    icon: <OpenCVSvg />,
  },

  // ================= FULL-STACK & SYSTEMS =================
  {
    id: "nextjs",
    name: "Next.js",
    category: "fullstack",
    icon: <NextJsSvg />,
  },
  {
    id: "react",
    name: "React",
    category: "fullstack",
    icon: <ReactSvg />,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "fullstack",
    icon: <TypeScriptSvg />,
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "fullstack",
    icon: <FastAPISvg />,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "fullstack",
    icon: <NodeSvg />,
  },
  {
    id: "threejs",
    name: "WebGL",
    category: "fullstack",
    icon: <WebGLSvg />,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "fullstack",
    icon: <TailwindSvg />,
  },
  {
    id: "cplusplus",
    name: "C++",
    category: "fullstack",
    icon: <CPlusPlusSvg />,
  },

  // ================= CLOUD & DEVOPS =================
  {
    id: "docker",
    name: "Docker",
    category: "cloud",
    icon: <DockerSvg />,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    icon: <PostgresSvg />,
  },
  {
    id: "redis",
    name: "Redis",
    category: "cloud",
    icon: <RedisSvg />,
  },
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    icon: <AWSSvg />,
  },
  {
    id: "linux",
    name: "Linux",
    category: "cloud",
    icon: <LinuxSvg />,
  },
  {
    id: "github",
    name: "GitHub",
    category: "cloud",
    icon: <GitHubSvg />,
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
                {tech.icon}
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
