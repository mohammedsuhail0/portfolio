import { useState, useRef } from "react";
import { useLoading } from "../context/LoadingProvider";
import { ParticleTextEffect } from "./ui/particle-text-effect";
import BlueFlameTransition from "./ui/BlueFlameTransition";

const SUHAIL_WORDS = [
  "WELCOME",
  "FULL-STACK",
  "AI SYSTEMS",
  "SUHAIL"
];

const Loading = ({ percent: _percent }: { percent?: number } = {}) => {
  const { setIsLoading } = useLoading();
  const flameProgParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("flameProg") : null;
  const forcedProgress = flameProgParam !== null ? parseFloat(flameProgParam) : undefined;
  const [isFlameActive, setIsFlameActive] = useState(forcedProgress !== undefined);
  const enteredRef = useRef(false);

  const handleStartFlame = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    console.log("🔥 Blue flame ignited!");
    setIsFlameActive(true);

    import("./utils/initialFX").then((module) => {
      // Trigger hero materialization as the blue flame portal burns open
      setTimeout(() => {
        if (module.initialFX) {
          module.initialFX();
        }
      }, 150);
    });
  };

  const handleFlameComplete = () => {
    // When the blue flame clears all corners, remove preloader from DOM
    setIsLoading(false);
  };

  return (
    <>
      <div
        className="particle-loader-root"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          backgroundColor: "#000000",
          pointerEvents: isFlameActive ? "none" : "auto",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: isFlameActive ? "none" : "block",
        }}
      >
        <ParticleTextEffect
          words={SUHAIL_WORDS}
          isPreloader={true}
          onComplete={handleStartFlame}
        />
      </div>

      {/* The Burning Blue Flame Shader Portal (Reveals the website from the center outward) */}
      <BlueFlameTransition
        isActive={isFlameActive}
        onComplete={handleFlameComplete}
        duration={1000}
        forcedProgress={forcedProgress}
      />
    </>
  );
};

export default Loading;
