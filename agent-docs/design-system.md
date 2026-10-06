# DESIGN SYSTEM & UI GUIDELINES

This document outlines the strict design rules, color tokens, typography scales, and accessibility constraints for Mohammed Suhail's portfolio.

---

## 1. Color Tokens & Theme Palette

| Token / Usage | Hex / RGBA | Description |
|---|---|---|
| **Deep Space Canvas** | `#030712` / `#050814` | Primary viewport background |
| **Glass Card Background** | `rgba(7, 12, 24, 0.95)` | Base for swipe cards and modal containers |
| **Glass Card Border** | `rgba(56, 189, 248, 0.22)` | Subtle cyan border stroke |
| **Cyan / Sky Accent** | `#38bdf8` | Primary active accent, glow, and links |
| **Cyan Muted** | `#7dd3fc` | Tech chips text, secondary icons |
| **Gold / Amber Accent** | `#fbbf24` / `#f59e0b` | Certificate badges, milestone indicators |
| **High Contrast Body Text** | `#cbd5e1` / `#e2e8f0` | Body copy complying with WCAG AA (>4.5:1) |
| **Heading White** | `#ffffff` | Primary titles, bold headings |

---

## 2. Typography & Contrast Rules
- **Font Families**: `"Geist", "Inter", -apple-system, sans-serif` for headings and prose; `monospace` for tech chips, category pills, and code identifiers.
- **Strict WCAG AA Compliance**:
  - Never use dim `#64748b` or dark gray text directly on dark backgrounds.
  - Body text must use `#cbd5e1` or lighter.
  - Hero and header subtitles must use clean line heights (`1.5` to `1.6`) with subtle text shadows (`0 1px 3px rgba(0,0,0,0.8)`).

---

## 3. Button & Pill Standards
1. **Primary Glowing Button**:
   - `background: rgba(56, 189, 248, 0.14)`
   - `border: 1px solid rgba(56, 189, 248, 0.4)`
   - `box-shadow: 0 0 14px rgba(56, 189, 248, 0.18)`
   - `border-radius: 10px`
2. **Certificate Action Button**:
   - `background: rgba(245, 158, 11, 0.15)`
   - `border: 1px solid rgba(245, 158, 11, 0.5)`
   - `color: #fbbf24`
   - `box-shadow: 0 0 14px rgba(245, 158, 11, 0.15)`
3. **No Overlapping Badges**:
   - Do NOT add redundant static pill badges (e.g. "IDENTITY", "CAPABILITIES", "DISPATCH") on mobile screens. Keep headings clear and centered.
   - Proof strip at bottom of hero must be fully transparent without bulky opaque border pills.

---

## 4. Responsive Breakpoints
- **Desktop**: `>= 1024px` (Full Three.js starfield, particle hero, GSAP horizontal pin-scroll).
- **Tablet**: `768px - 1023px` (Balanced layouts, touch fallbacks).
- **Mobile**: `<= 767px` (Strictly routes to `MobileContainer`, 100dvh snap view, touch dock, 3D swipe cards deck).
