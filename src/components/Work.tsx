import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // A6: Update progress bar and hide cue when user reaches the end
          const fill = document.querySelector<HTMLElement>(".work-progress-bar-fill");
          if (fill) fill.style.width = `${Math.min(self.progress * 100, 100)}%`;

          const cue = document.querySelector<HTMLElement>(".work-scroll-cue");
          if (cue) {
            if (self.progress >= 0.95) {
              cue.classList.add("is-hidden");
            } else {
              cue.classList.remove("is-hidden");
            }
          }
        },
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // A4: Fade out fixed left social icons while Work section is active
    const socialTrigger = ScrollTrigger.create({
      trigger: ".work-section",
      start: "top 60%",
      end: () => `+=${translateX + window.innerHeight * 0.8}`,
      onToggle: (self) => {
        gsap.to(".social-icons", {
          opacity: self.isActive ? 0 : 1,
          pointerEvents: self.isActive ? "none" : "auto",
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      timeline.kill();
      socialTrigger.kill();
      gsap.set(".social-icons", { opacity: 1, pointerEvents: "auto" });
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 6).map((project, index) => {
            const isGithub = project.link?.includes("github.com");
            const hasLink = Boolean(project.link);
            const liveUrl = !isGithub && hasLink ? project.link : (project as any).demo;
            const repoUrl = isGithub ? project.link : (project as any).repo || (project as any).github;

            return (
              <div className="work-box" key={project.id}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>0{index + 1}</h3>

                    <div>
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>
                  <h4>Tools and features</h4>
                  <p>{project.technologies}</p>

                  {/* A5: Visible Live Demo and Repo pill buttons */}
                  {(liveUrl || repoUrl) && (
                    <div className="work-buttons-row">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-btn-pill work-btn-primary"
                          data-cursor="disable"
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {repoUrl && (
                        <a
                          href={repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-btn-pill work-btn-secondary"
                          data-cursor="disable"
                        >
                          Repo ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <WorkImage image={project.image} alt={project.title} link={project.link} />
              </div>
            );
          })}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>

        {/* A6: Horizontal scroll cue with arrow and progress bar */}
        <div className="work-scroll-cue" aria-hidden="true">
          <div className="work-scroll-label">
            <span>Scroll</span>
            <span className="scroll-arrow">→</span>
          </div>
          <div className="work-progress-bar-track">
            <div className="work-progress-bar-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
