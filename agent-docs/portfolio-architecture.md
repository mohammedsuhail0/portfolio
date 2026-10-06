# TECHNICAL PORTFOLIO ARCHITECTURE

This document details the software architecture, rendering pipelines, and mobile vs. desktop separation in Mohammed Suhail's portfolio repository.

---

## 1. High-Level Technology Stack
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **3D Graphics**: Three.js, React Three Fiber (R3F), @react-three/drei
- **Animation & Physics**: GSAP 3 (ScrollTrigger), Lenis smooth-scroll
- **Routing**: React Router DOM
- **Deployment Target**: Vercel (`https://mohammed-suhail.vercel.app/`)

---

## 2. Responsive Dual Architecture: Desktop vs. Mobile

The application detects viewport width and user-agent context to deliver two tailored experiences:

```tsx
// src/App.tsx
{isMobile ? <MobileContainer /> : <MainContainer />}
```

### A. Desktop Experience (`MainContainer.tsx`)
- **Three.js Particle Canvas**: Centered interactive 3D particle cloud / cyber portrait reacting to cursor movement.
- **Starfield Background**: Dynamic Three.js starfield layer across deep space coordinates.
- **Lenis Smooth Scrolling**: Interpolated inertial scrolling with page snapping on primary sections.
- **Horizontal "Work" Section (`Work.tsx`)**:
  - Uses `gsap.to(..., { xPercent: -100 * (cards.length - 1), ease: "none", scrollTrigger: { pin: true, scrub: 1 } })`.
  - Social rail fixed on left is programmed to auto-fade out when the horizontal work section is in view to prevent card screenshot overlap.
  - Cards formatted to 16:10 aspect ratio with visible `Live Demo ↗` and `Repo ↗` action pill buttons.
  - "Scroll →" indicator with animated progress bar tied to ScrollTrigger progress.

### B. Mobile Experience (`MobileContainer.tsx`)
- **Zero-Jitter 100dvh Vertical Stack**:
  - Uses modern CSS dynamic viewport units (`100dvh`) to avoid mobile browser address bar jumpiness.
  - Track positioned using `transform: translate3d(0, -${activeSlide * 100}dvh, 0)` with high-performance cubic-bezier easing.
  - Dominant vertical touch gesture recognition (`Math.abs(deltaY) > Math.abs(deltaX)`).
- **Dock Navigation**:
  - Floating bottom dock with high-contrast active indicator dots.
  - Fast single-tap switching to any slide (Home, What I Do, Career, Projects, Stack, Contact).

---

## 3. Mobile 3D Swipe Deck Architecture (`MobileProjectCards.tsx`)

A pure React & CSS 3D card deck optimized for 60fps hardware acceleration on iOS and Android devices.

### CSS Spatial Stacking
```css
.project-swipe-card:nth-last-child(1) {
  z-index: 10;
  transform: translate3d(0, 0, 0) scale(1);
  opacity: 1;
}

.project-swipe-card:nth-last-child(2) {
  z-index: 5;
  transform: translate3d(0, 14px, 0) scale(0.95);
  opacity: 0.82;
}

.project-swipe-card:nth-last-child(3) {
  z-index: 2;
  transform: translate3d(0, 28px, 0) scale(0.90);
  opacity: 0.55;
}
```

### Drag & Dismissal Physics
1. **Pointer & Touch Listeners**: Attaches `onPointerDown`/`onTouchStart`, `onPointerMove`/`onTouchMove`, and `onPointerUp`/`onTouchEnd`.
2. **Dynamic Transforms**:
   - `deltaX` generates rotational tilt: `rotate(${deltaX * 0.08}deg)`.
   - Card underneath scales up smoothly: `targetScale = 0.95 + dragRatio * 0.05`.
3. **Threshold Dismissal**:
   - When swipe crosses 90px threshold, card transitions off-screen (`translate3d(±540px, 0, 0)`).
   - After 320ms, the card is popped from top and prepended to the array for infinite circular browsing.
4. **Action Isolation**:
   - Link clicks on `.project-card-actions a` stop event bubbling and skip drag initialization.

---

## 4. Mobile Interactive Tech Arsenal (`MobileTechStack.tsx`)

Replaces microscopic desktop logo walls with a touch-friendly interactive HUD:
- **Category Filter Tabs**: ALL, FRONTEND, BACKEND, AI / DATA, CLOUD.
- **Spotlight HUD Panel**: Tapping any icon loads its full technical proficiency card with icon preview, description, and technology tags.
- **Touch Feedback**: `transform: scale(0.92)` on active touch with cyan glowing borders.
