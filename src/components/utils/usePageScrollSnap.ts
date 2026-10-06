import { useEffect } from "react";

/**
 * usePageScrollSnap
 * Ensures that scrolling through full-page intro sections (Hero -> About -> What I Do)
 * cleanly stops on each page, preventing momentum from skipping past the intro.
 */
export function usePageScrollSnap() {
  useEffect(() => {
    let isWheeling = false;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      // Allow browser zoom (Ctrl / Cmd + Wheel)
      if (e.ctrlKey || e.metaKey) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const aboutEl = document.querySelector(".about-section") as HTMLElement | null;
      const whatIdoEl = document.querySelector(".whatIDO") as HTMLElement | null;

      if (!aboutEl) return;

      const aboutTop = aboutEl.offsetTop;
      const whatIdoTop = whatIdoEl ? whatIdoEl.offsetTop : aboutTop + vh;

      // Filter out micro-scroll trackpad jitters
      if (Math.abs(e.deltaY) < 16) return;

      // 1. On HERO: Scrolling DOWN -> Stop cleanly on ABOUT
      if (scrollY < aboutTop * 0.45 && e.deltaY > 0) {
        if (isWheeling) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        isWheeling = true;
        window.scrollTo({ top: aboutTop, behavior: "smooth" });
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheeling = false;
        }, 750);
        return;
      }

      // 2. On ABOUT: Scrolling UP -> Stop cleanly on HERO (top: 0)
      if (Math.abs(scrollY - aboutTop) < vh * 0.35 && e.deltaY < 0) {
        if (isWheeling) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        isWheeling = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheeling = false;
        }, 750);
        return;
      }

      // 3. On ABOUT: Scrolling DOWN -> Stop cleanly on WHAT I DO
      if (Math.abs(scrollY - aboutTop) < vh * 0.35 && e.deltaY > 0) {
        if (isWheeling) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        isWheeling = true;
        window.scrollTo({ top: whatIdoTop, behavior: "smooth" });
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheeling = false;
        }, 750);
        return;
      }

      // 4. On WHAT I DO: Scrolling UP -> Stop cleanly on ABOUT
      if (whatIdoEl && Math.abs(scrollY - whatIdoTop) < vh * 0.35 && e.deltaY < 0) {
        if (isWheeling) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        isWheeling = true;
        window.scrollTo({ top: aboutTop, behavior: "smooth" });
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheeling = false;
        }, 750);
        return;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, []);
}
