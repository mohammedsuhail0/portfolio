import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  // 1. Giant Background Typography Entrance ("CREATIVE")
  if (document.querySelector(".hero-giant-bg-text")) {
    gsap.fromTo(
      ".hero-giant-bg-text",
      {
        opacity: 0,
        scale: 0.92,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.6,
        ease: "power2.out",
        delay: 0.15,
      }
    );
  }

  // 2. Centerpiece Avatar Hologram Materialization (emerges from particle warp center)
  const avatarWrapper = document.querySelector(".hero-avatar-centerpiece .reveal-hero-wrapper, .mobile-hero-portrait-stage .reveal-hero-wrapper");
  if (avatarWrapper) {
    gsap.fromTo(
      avatarWrapper,
      {
        opacity: 0,
        scale: 0.88,
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

  // 3. Desktop Left Column UI Entrance
  if (document.querySelector(".hero-headline-main")) {
    gsap.fromTo(
      [".hero-kicker", ".hero-headline-main", ".hero-subtext"],
      { opacity: 0, y: 35, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.08, ease: "power2.out", delay: 0.25 }
    );

    gsap.fromTo(
      ".hero-headline-main",
      { textShadow: "0 0 35px rgba(56, 189, 248, 0.85)" },
      { textShadow: "0 0 0px rgba(56, 189, 248, 0)", duration: 1.8, ease: "power2.out", delay: 0.3 }
    );

    gsap.fromTo(
      ".hero-actions-row",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power2.out", delay: 0.45 }
    );

    gsap.fromTo(
      ".hero-metric-pill",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1.0, stagger: 0.1, ease: "power2.out", delay: 0.55 }
    );
  }

  // 4. Desktop Right Column UI Entrance
  if (document.querySelector(".hero-role-block")) {
    gsap.fromTo(
      [".hero-role-block", ".hero-bio-text"],
      { opacity: 0, y: 35, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.08, ease: "power2.out", delay: 0.35 }
    );

    gsap.fromTo(
      ".hero-partner-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", delay: 0.6 }
    );
  }

  // 5. Mobile Hero elements entrance
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

  // 6. Legacy fallback for split text if present
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
  }

  if (document.querySelector(".landing-h2-info")) {
    let TextProps = { type: "chars,lines", linesClass: "split-h2" };
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
