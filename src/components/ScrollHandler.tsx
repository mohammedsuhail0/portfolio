"use client";

import { useEffect } from "react";

export function ScrollHandler() {
  useEffect(() => {
    // Disable automatic browser scroll restoration on refresh
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // If page was loaded with a hash or remembered scroll, scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      // Clean hash from address bar on fresh reload so it doesn't anchor-jump
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      // Double-check after DOM hydration
      const timeoutId = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return null;
}
