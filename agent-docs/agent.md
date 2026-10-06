# AI AGENT BRIEFING & CONTINUITY GUIDE: MOHAMMED SUHAIL PORTFOLIO

> **CRITICAL DIRECTIVE FOR FUTURE AI SESSIONS:**
> Read this document and the accompanying guides in `agent-docs/` completely before modifying, refactoring, or building any new components or portfolios for this user.

---

## 1. Owner & Profile Identity
- **Name**: Mohammed Suhail
- **Role**: Full-Stack Engineer & AI Systems Developer
- **Degree**: B.Tech in Information Technology, ISL Engineering College (Class of 2024–2028), Hyderabad, India
- **Core Domain**: High-performance full-stack web applications, AI-assisted development pipelines, real-time collaboration platforms, and clinical/security automation.
- **Production URL**: [https://mohammed-suhail.vercel.app/](https://mohammed-suhail.vercel.app/)
- **GitHub**: [https://github.com/mohammedsuhail0](https://github.com/mohammedsuhail0)
- **LinkedIn**: [https://linkedin.com/in/mohammed-suhail-b39883274](https://linkedin.com/in/mohammed-suhail-b39883274)
- **Email**: `mdsuhailtab.1@gmail.com`

---

## 2. Global Inviolable Rules
1. **Never Invent Facts or URLs**: Use ONLY verified repositories, hackathon milestones, and live URLs recorded in `projects-credentials.md` and `src/config.ts`. Never hallucinate awards, rankings, or fake demo links.
2. **Strictly Forbidden Terms**: Never use the words `"vibe"`, `"vibe coder"`, or `"vibe coding"` anywhere in code, comments, alt text, or copywriting.
3. **Preserve Visual Identity**: Dark space/cyber theme with subtle cyan/sky-blue glows (`#38bdf8`), purple accents, deep dark backgrounds (`#070c18` / `#05070f`), and frosted glassmorphism (`backdrop-filter: blur(28px)`). Do not add neon gradients or mismatching themes.
4. **Desktop vs. Mobile Separation**:
   - Desktop uses `MainContainer.tsx` (Three.js starfield, particle hero, GSAP horizontal pin-scroll).
   - Mobile uses `MobileContainer.tsx` (100dvh vertical slide snap, touch dock, and 3D swipe decks). Never bleed mobile overrides into desktop or break desktop horizontal scroll.
5. **No Secrets in Client Code**: Never commit API keys, private tokens, or credentials.
6. **Local Verification Before Production**: Always run `npm run build` with zero TypeScript errors and verify locally before committing or deploying.

---

## 3. High-Priority Features & Lessons Learned

### A. Mobile 3D Swipe Deck Mechanics (`MobileProjectCards.tsx`)
- **Depth Hierarchy**: Built with CSS absolute positioning and `:nth-last-child` matching.
  - `:nth-last-child(1)` is the **top visible card** (`scale(1)`, `z-index: 10`).
  - `:nth-last-child(2)` is underneath (`scale(0.95)`, `y: 14px`).
  - `:nth-last-child(3)` is the third card (`scale(0.90)`, `y: 28px`).
- **Deck Ordering Rule**: Because `:nth-last-child(1)` matches the LAST child in the rendered DOM array, the initial array passed into `deck` state MUST be reversed (`[...list].reverse()`) so item index 0 renders at the top of the deck!
- **Dismissal & Cycle**: On swipe threshold (90px) or arrow click, animate the top card off-screen (320ms transition), remove it from the top, and prepend it to the beginning of the deck array (`[departingCard, ...nextDeck]`) for infinite cycling.
- **Link Clicks vs Drag Capture**: Never allow `setPointerCapture` to block clicks on `.project-card-actions a`, `Live Demo`, or `Certificate` links. Check target before initiating drag.

### B. Project Prioritization Order (User Requirement)
1. **Certified Projects First**:
   - `ArogyaMitr (SIH PS 26133)` (Smart India Hackathon Finalist with Team Punk Records)
   - `NextPatient` (Clinical AI OSCE Simulation for iQOO Health-Tech Hackathon)
   - `Hyderabad Rental Analytics` (Full Stack Academy Data Science Specialization - Certificate of Excellence)
2. **Core Priority Products (If No Certificate)**:
   - `NovaClass (Smart Attendance)` (Tokenized biometric institutional attendance)
   - `BroSync (Seamless)` (Real-time collaboration canvas)
   - `ShieldSense (AI Security Agent)` (Autonomous AI cybersecurity monitoring agent)
3. **Recent Featured Projects**:
   - `Secure Online Exam Portal`, `VitaForge`, `MaternaGuard`, `BUILDR`, `New Rosary Convent High School`.

### C. Text Contrast & Mobile Cleanliness
- **WCAG AA Compliance**: Body text must maintain at least 4.5:1 contrast against dark backgrounds (`#cbd5e1` or `#e2e8f0`).
- **No Floating Badges**: Keep mobile hero and section headers clean. Remove redundant pills like `"IDENTITY"` or `"CAPABILITIES"` to avoid crowding small mobile viewports.
- **Stats Strip**: Hero stats strip must remain transparent with clean borders, avoiding bulky opaque pill containers.

---

## 4. Key File Map

| Path | Purpose |
|---|---|
| `src/config.ts` | Source of truth for portfolio info, work history, projects list, skills, and links |
| `src/components/MainContainer.tsx` | Desktop portfolio orchestrator with Three.js scenes and GSAP animations |
| `src/components/Work.tsx` | Desktop horizontal pin-scrolling project cards with progress cue |
| `src/components/TechStackNew.tsx` | Desktop 3D purple-glow tech arsenal |
| `src/components/mobile/MobileContainer.tsx` | Mobile 100dvh snap container with bottom dock navigation |
| `src/components/mobile/MobileProjectCards.tsx` | Mobile 3D Tinder-style swipeable project cards deck |
| `src/components/mobile/MobileTechStack.tsx` | Mobile interactive touch-to-inspect tech grid with category filters |
| `src/components/mobile/MobileCareerCards.tsx` | Mobile timeline milestone cards |
| `public/certificates/` | Verified certificate image assets (SIH, IIT Bombay, Fullstack Academy, Google) |
| `public/projects/` | High-res project preview screenshots |

---

## 5. Next Steps Checklist for New Threads
- [ ] Run `npm install` and `npm run dev -- --port 3000` to verify clean local execution.
- [ ] Read `agent-docs/projects-credentials.md` before making any copy or URL changes.
- [ ] Test any mobile UI changes at `390px` viewport width (e.g., iPhone 14/15/16).
- [ ] Test desktop horizontal scrolling at `1440px` to verify no ScrollTrigger regressions.
- [ ] Run `npm run build` to confirm zero TypeScript compilation errors.
