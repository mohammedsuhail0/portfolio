"use client";

import React, { useState, useEffect, useRef } from "react";
import { TIMELINE_DATA, ITimelineItem } from "@/data/portfolioData";
import { Github, ExternalLink, Globe, FolderGit2, Maximize2, X, Eye, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TimelineSection() {
  const [activeItem, setActiveItem] = useState<ITimelineItem>(TIMELINE_DATA[0]);
  const [selectedGalleryProject, setSelectedGalleryProject] = useState<ITimelineItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [svgPath, setSvgPath] = useState<string>("");
  const [activeSvgPath, setActiveSvgPath] = useState<string>("");
  const [svgHeight, setSvgHeight] = useState<number>(1000);
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const openGalleryForProject = (item: ITimelineItem, startIndex: number = 0) => {
    setSelectedGalleryProject(item);
    setActiveImageIndex(startIndex);
  };

  // Calculate dynamic curved map path through each project node
  const updateCurvedMapPath = () => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;

    const positions = itemRefs.current.map((el, i) => {
      if (!el) {
        return { x: i % 2 === 0 ? 20 : 44, y: i * 160 + 30 };
      }
      const rect = el.getBoundingClientRect();
      const y = rect.top + window.scrollY - containerTop + 24; // Align with title top
      // Alternate wave for map road feel
      const x = i % 2 === 0 ? 22 : 46;
      return { x, y };
    });

    setNodePositions(positions);

    if (positions.length > 0) {
      const lastPos = positions[positions.length - 1];
      setSvgHeight(lastPos.y + 60);

      // Build smooth cubic bezier curve through all node points
      let path = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 0; i < positions.length - 1; i++) {
        const p0 = positions[i];
        const p1 = positions[i + 1];
        const midY = (p0.y + p1.y) / 2;
        path += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
      }
      setSvgPath(path);

      // Active path up to active item index
      const activeIdx = TIMELINE_DATA.findIndex((item) => item.id === activeItem.id);
      const currentIdx = activeIdx >= 0 ? activeIdx : 0;
      let activeP = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 0; i < currentIdx; i++) {
        const p0 = positions[i];
        const p1 = positions[i + 1];
        const midY = (p0.y + p1.y) / 2;
        activeP += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
      }
      setActiveSvgPath(activeP);
    }
  };

  useEffect(() => {
    updateCurvedMapPath();
    window.addEventListener("resize", updateCurvedMapPath);
    return () => window.removeEventListener("resize", updateCurvedMapPath);
  }, [activeItem]);

  // Real scroll effect: Track which project item is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.2,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index) && TIMELINE_DATA[index]) {
            setActiveItem(TIMELINE_DATA[index]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeUrl = activeItem.liveUrl || activeItem.githubUrl || "https://github.com/mohammedsuhail0";

  // Gallery array helper
  const galleryList = selectedGalleryProject?.gallery || 
    (selectedGalleryProject?.image ? [{ url: selectedGalleryProject.image, caption: selectedGalleryProject.title }] : []);

  const currentGalleryItem = galleryList[activeImageIndex] || galleryList[0];

  return (
    <section id="projects" className="relative py-24 sm:py-32 bg-background select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Section Header (Ayush Style: MILESTONES & Projects) */}
        <div className="flex flex-col mb-16 sm:mb-20">
          <p className="text-xs uppercase tracking-widest font-mono font-bold text-purple-600 dark:text-purple-400">
            MILESTONES
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mt-2">
            Projects
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mt-2 max-w-2xl font-normal">
            A quick recap of projects, hackathons, and engineering solutions built.
          </p>
        </div>

        {/* Dual Layout: Left Curved Map Timeline + Right Sticky Mac Browser Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Curved Map Path + Direct Text (NO CARDS, NO YEARS) */}
          <div ref={containerRef} className="lg:col-span-7 relative">
            
            {/* SVG Curved Map Path Route */}
            <svg
              className="absolute left-0 top-0 pointer-events-none z-0 overflow-visible"
              width="70"
              height={svgHeight}
              viewBox={`0 0 70 ${svgHeight}`}
              fill="none"
            >
              {/* Background Track Road */}
              {svgPath && (
                <path
                  d={svgPath}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-slate-200 dark:text-zinc-800"
                />
              )}

              {/* Active Glowing Map Stroke */}
              {activeSvgPath && (
                <path
                  d={activeSvgPath}
                  stroke="url(#map-gradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                />
              )}

              <defs>
                <linearGradient id="map-gradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Project List Items with Direct Typography */}
            <div className="space-y-16 sm:space-y-20 relative z-10">
              {TIMELINE_DATA.map((item, index) => {
                const isActive = activeItem.id === item.id;
                const pos = nodePositions[index] || { x: index % 2 === 0 ? 22 : 46, y: 0 };
                const hasImages = (item.gallery && item.gallery.length > 0) || Boolean(item.image);

                return (
                  <div
                    key={item.id}
                    data-index={index}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    onMouseEnter={() => setActiveItem(item)}
                    onClick={() => setActiveItem(item)}
                    className={`group relative pl-20 sm:pl-24 transition-all duration-300 cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-50 hover:opacity-85"
                    }`}
                  >
                    {/* Glowing Node Dot on Map Curve Track */}
                    <div
                      style={{
                        left: `${pos.x - 7}px`,
                        top: "22px",
                      }}
                      className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-purple-500 scale-150 ring-4 ring-purple-500/30 shadow-lg shadow-purple-500/80"
                          : "bg-slate-300 dark:bg-zinc-700 group-hover:bg-purple-400"
                      }`}
                    />

                    {/* Category Tag & Status */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.status}
                      </span>
                    </div>

                    {/* Project Name (Direct Text) */}
                    <h3
                      className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-foreground/80 group-hover:text-foreground"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Simple 1-sentence solution statement */}
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-secondary/70 text-muted-foreground border border-border/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Mobile image preview if available */}
                    {item.image && (
                      <div className="lg:hidden mt-4 rounded-xl overflow-hidden bg-zinc-950 p-2 border border-border shadow-md max-w-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.gallery && item.gallery.length > 0) {
                              openGalleryForProject(item, 0);
                            } else if (item.liveUrl) {
                              window.open(item.liveUrl, "_blank");
                            }
                          }}
                          className="w-full h-48 sm:h-56 object-contain rounded-lg bg-zinc-900 cursor-zoom-in"
                        />
                      </div>
                    )}

                    {/* Direct Action Buttons on Timeline Item */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-4">
                      {/* For image-based milestones: View More button */}
                      {hasImages && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openGalleryForProject(item, 0);
                          }}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-600/25 inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        >
                          <Images className="w-3.5 h-3.5" />
                          <span>View More</span>
                          {item.gallery && item.gallery.length > 1 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 ml-0.5">
                              {item.gallery.length}
                            </span>
                          )}
                        </button>
                      )}

                      {/* Live Demo button */}
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Code Repo button (only for code projects or if distinct repo) */}
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground bg-secondary/80 hover:bg-secondary border border-border/80 inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>View Repo</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Mac OS Browser Mockup Frame (Pure Image Viewport) */}
          <div className="lg:col-span-5 sticky top-24 z-30 hidden lg:block">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-slate-100 shadow-2xl overflow-hidden ring-1 ring-white/10">
              
              {/* Mac OS Window Header */}
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-3">
                {/* Window traffic light dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
                </div>

                {/* Back / Forward Controls */}
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <span>‹</span>
                  <span>›</span>
                </div>

                {/* URL Address Bar */}
                <div className="flex-1 max-w-xs mx-auto flex items-center justify-between px-3 py-1 rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-300 truncate">
                  <span className="truncate">🔒 {activeUrl.replace(/^https?:\/\//, "")}</span>
                </div>

                {/* External Action */}
                {activeItem.liveUrl ? (
                  <a
                    href={activeItem.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Live Project"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Mac OS Window Screen Viewport — PURE PROJECT IMAGE */}
              <div className="relative w-full aspect-[16/11] bg-zinc-950 flex items-center justify-center overflow-hidden group/screen select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full h-full flex items-center justify-center bg-zinc-950"
                  >
                    {activeItem.image ? (
                      <div
                        onClick={() => {
                          if (activeItem.gallery && activeItem.gallery.length > 0) {
                            openGalleryForProject(activeItem, 0);
                          } else if (activeItem.liveUrl) {
                            window.open(activeItem.liveUrl, "_blank");
                          } else if (activeItem.githubUrl) {
                            window.open(activeItem.githubUrl, "_blank");
                          }
                        }}
                        className="relative w-full h-full overflow-hidden cursor-pointer flex items-center justify-center bg-zinc-950"
                      >
                        <img
                          src={activeItem.image}
                          alt={activeItem.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/screen:scale-[1.02]"
                        />
                        {/* Hover Overlay with Quick Action */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/screen:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          {activeItem.liveUrl ? (
                            <span className="px-3.5 py-2 rounded-xl bg-purple-600/95 text-white font-semibold text-xs backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-transform duration-200 group-hover/screen:scale-105">
                              <Globe className="w-3.5 h-3.5" />
                              <span>Open Live Demo</span>
                              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                            </span>
                          ) : activeItem.gallery && activeItem.gallery.length > 0 ? (
                            <span className="px-3.5 py-2 rounded-xl bg-purple-600/95 text-white font-semibold text-xs backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-transform duration-200 group-hover/screen:scale-105">
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Gallery</span>
                            </span>
                          ) : (
                            <span className="px-3.5 py-2 rounded-xl bg-purple-600/95 text-white font-semibold text-xs backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-transform duration-200 group-hover/screen:scale-105">
                              <FolderGit2 className="w-3.5 h-3.5" />
                              <span>View GitHub Repo</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Placeholder when screenshot not uploaded yet */
                      <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-900/60 p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center mb-3 text-purple-400">
                          <Globe className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{activeItem.title}</p>
                        <p className="text-xs text-zinc-500 font-mono">Screenshot preview loading...</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div className="px-4 py-1.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Mohammed Suhail • Portfolio</span>
                <span className="text-emerald-400">● {activeItem.status}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Project Photos & Certificates Gallery Modal */}
      <AnimatePresence>
        {selectedGalleryProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[92vh] w-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Top Bar */}
              <div className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-purple-400 uppercase font-semibold block">
                    {selectedGalleryProject.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md sm:max-w-xl">
                    {selectedGalleryProject.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {galleryList.length > 1 && (
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">
                      {activeImageIndex + 1} / {galleryList.length}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryProject(null)}
                    className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Display Area with Navigation Arrows */}
              <div className="relative w-full h-[58vh] sm:h-[64vh] flex items-center justify-center p-3 bg-black/95 select-none">
                {currentGalleryItem && (
                  <img
                    key={currentGalleryItem.url}
                    src={currentGalleryItem.url}
                    alt={currentGalleryItem.caption || selectedGalleryProject.title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                  />
                )}

                {/* Left Arrow Button */}
                {galleryList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-lg backdrop-blur transition-all active:scale-90"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Right Arrow Button */}
                {galleryList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700/80 shadow-lg backdrop-blur transition-all active:scale-90"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Bottom Caption & Thumbnails */}
              <div className="p-3.5 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-zinc-200 font-medium text-center sm:text-left truncate max-w-xl">
                  {currentGalleryItem?.caption || selectedGalleryProject.title}
                </p>

                {/* Thumbnail selector if multiple pictures exist */}
                {galleryList.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                    {galleryList.map((img, idx) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-12 h-9 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? "border-purple-500 scale-105 shadow-md"
                            : "border-zinc-700 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


