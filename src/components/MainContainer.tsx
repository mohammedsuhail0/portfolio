import { useEffect, useState, Suspense, lazy } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import { usePageScrollSnap } from "./utils/usePageScrollSnap";
import MobileContainer from "./mobile/MobileContainer";

import { useLoading } from "../context/LoadingProvider";

const Scene = lazy(() => import("./Character/Scene"));

const MainContainer = () => {
  usePageScrollSnap();
  const { isLoading } = useLoading();

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.innerWidth <= 768;
  });

  useEffect(() => {
    const resizeHandler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !isLoading) {
        setSplitText();
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isLoading]);

  return (
    <div className="container-main">
      {/* Global Starfield Background across complete website */}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      {isMobile ? (
        /* Mobile Version: Strict 100dvh, Zero Native Scroll, Swipe Deck & Bottom Dock */
        <MobileContainer />
      ) : (
        /* Desktop Version: Full Screen Layout with Smooth Scroll */
        <>
          <Cursor />
          <Navbar />
          <SocialIcons />
          <div className="container-main">
            <Landing />
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <TechStackNew />
            <CallToAction />
            <Contact />
          </div>
        </>
      )}
    </div>
  );
};

export default MainContainer;
