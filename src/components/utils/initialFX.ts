import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  // 1. Centerpiece Avatar Hologram Materialization (emerges from particle warp center)
  const avatarWrapper = document.querySelector(".hero-avatar-centerpiece .reveal-hero-wrapper, .mobile-hero-portrait-stage .reveal-hero-wrapper");
  if (avatarWrapper) {
    gsap.fromTo(
      avatarWrapper,
      {
        opacity: 0,
        scale: 0.86,
        transformOrigin: "center bottom",
        filter: "brightness(2.2) drop-shadow(0 0 50px rgba(56, 189, 248, 0.95)) blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "brightness(1) drop-shadow(0 0 0px rgba(56, 189, 248, 0)) blur(0px)",
        duration: 1.4,
        ease: "power2.out",
        delay: 0.1,
      }
    );
  }

  // Mobile Hero elements entrance
  if (document.querySelector(".hero-intro-name")) {
    gsap.fromTo(
      [".hero-intro-hello", ".hero-intro-name", ".hero-intro-roles"],
      { opacity: 0, y: 35, filter: "blur(5px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.1, ease: "power2.out", delay: 0.2 }
    );
    gsap.fromTo(
      ".hero-intro-name",
      { textShadow: "0 0 35px rgba(56, 189, 248, 0.95)" },
      { textShadow: "0 0 0px rgba(56, 189, 248, 0)", duration: 1.8, ease: "power2.out", delay: 0.25 }
    );
    gsap.fromTo(
      [".mobile-hero-actions", ".mobile-hero-proof-dock"],
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: "power2.out", delay: 0.55 }
    );
  }

  // 2. Desktop Name & Intro Typography with Cyan Glow Dissolve
  const selectors = [
    ".landing-info h3",
    ".landing-intro h2",
    ".hero-name-first",
    ".hero-name-last",
  ];
  const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));
  if (elements.length > 0) {
    var landingText = new TextSplitter(elements, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 70, filter: "blur(6px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.out",
        y: 0,
        stagger: 0.025,
        delay: 0.25,
      }
    );

    // Cyan energy aura on the name chars that matches SUHAIL particles
    gsap.fromTo(
      [".hero-name-first", ".hero-name-last"],
      { textShadow: "0 0 35px rgba(56, 189, 248, 0.95)" },
      {
        textShadow: "0 0 0px rgba(56, 189, 248, 0)",
        duration: 1.8,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }

  // 3. Desktop Action buttons & bottom proof strip
  gsap.fromTo(
    ".hero-actions-row",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power3.out",
      delay: 0.65,
    }
  );

  gsap.fromTo(
    ".hero-proof-strip-dock",
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.8,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  if (document.querySelector(".landing-h2-info")) {
    var landingText2 = new TextSplitter(".landing-h2-info", TextProps);
    gsap.fromTo(
      landingText2.chars,
      { opacity: 0, y: 70, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.out",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );

    var landingText3 = new TextSplitter(".landing-h2-info-1", TextProps);
    var landingText4 = new TextSplitter(".landing-h2-1", TextProps);
    var landingText5 = new TextSplitter(".landing-h2-2", TextProps);

    LoopText(landingText2, landingText3);
    LoopText(landingText4, landingText5);
  }

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.15,
    }
  );
}

function LoopText(Text1: TextSplitter, Text2: TextSplitter) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
