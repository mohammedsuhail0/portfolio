import { useState, useRef } from "react";
import { useLoading } from "../context/LoadingProvider";
import { ParticleTextEffect } from "./ui/particle-text-effect";

const SUHAIL_WORDS = [
  "WELCOME",
  "FULL-STACK",
  "AI SYSTEMS",
  "SUHAIL"
];

const Loading = ({ percent: _percent }: { percent?: number } = {}) => {
  const { setIsLoading } = useLoading();
  const [isLeaving, setIsLeaving] = useState(false);
  const enteredRef = useRef(false);

  const handleEnter = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setIsLeaving(true);

    import("./utils/initialFX").then((module) => {
      // Start hero materialization while the shockwave expands across screen
      setTimeout(() => {
        if (module.initialFX) {
          module.initialFX();
        }
      }, 200);

      // Once the cosmic hyperspace fade finishes, fully remove preloader from DOM
      setTimeout(() => {
        setIsLoading(false);
      }, 880);
    });
  };

  return (
    <div
      className={`particle-loader-root ${isLeaving ? "is-leaving" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#000000",
        transition: "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease-out",
        transform: isLeaving ? "scale(1.15)" : "scale(1)",
        filter: isLeaving ? "blur(8px)" : "blur(0px)",
        opacity: isLeaving ? 0 : 1,
        pointerEvents: isLeaving ? "none" : "auto",
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <ParticleTextEffect
        words={SUHAIL_WORDS}
        isPreloader={true}
        onComplete={handleEnter}
      />
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let interval = setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
