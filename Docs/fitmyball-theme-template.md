# FitMyBall — Theme UI Template

**Purpose:** This document defines the complete dark theme for the FitMyBall application. It is derived from the brand logo and hero video, and replaces the previous light-theme color system. Pass this document to Claude Code as the authoritative reference for all visual styling.

**Brand Assets Referenced:**
- Logo: "FitMyBall" in bright blue on deep navy, tagline "Data-Driven Golf Ball Fitting"
- Hero Video: Futuristic golf ball with cyan/blue energy ring, holographic data overlays, glowing particle effects on near-black background

**Design Direction:** Dark, futuristic, data-driven. Think Trackman launch monitor meets premium sports tech. The app should feel like a high-end fitting studio, not a country club brochure.

---

## 1. Color System

All colors are extracted from the logo and hero video. The palette is organized by role, not by hue.

### 1.1 Surface Colors (Backgrounds)

These create the layered depth of the dark UI. Lighter surfaces float above darker ones.

```
--surface-base:      #030712   /* Page background — near-black with blue undertone */
--surface-card:      #0A1628   /* Cards, panels, containers */
--surface-elevated:  #111D35   /* Hover states, dropdowns, popovers */
--surface-active:    #1A2744   /* Active/pressed states, input backgrounds */
--surface-highlight: #1E3A5F   /* Selected items, focus rings, active tabs */
```

**Tailwind config mapping:**
```js
colors: {
  surface: {
    base: '#030712',
    card: '#0A1628',
    elevated: '#111D35',
    active: '#1A2744',
    highlight: '#1E3A5F',
  }
}
```

### 1.2 Brand Colors (Primary — Blue)

Derived from the logo text color (#2378D8). This is the primary action color for CTAs, links, and interactive elements.

```
--brand-primary:     #2563EB   /* Primary buttons, main CTAs */
--brand-hover:       #3B82F6   /* Hover state */
--brand-active:      #1D4ED8   /* Active/pressed state */
--brand-muted:       #1E40AF   /* Less prominent brand uses */
--brand-subtle:      #172554   /* Brand-tinted backgrounds (e.g., selected card) */
```

### 1.3 Accent Colors (Cyan Glow)

Derived from the video's energy ring and holographic effects. Use sparingly for highlights, data visualization accents, and "glow" effects.

```
--accent-cyan:       #22D3EE   /* Primary accent — highlights, active indicators */
--accent-cyan-dim:   #06B6D4   /* Dimmer accent for borders, secondary highlights */
--accent-cyan-bright:#67E8F9   /* Bright glow effects, animated elements */
--accent-cyan-subtle:#083344   /* Cyan-tinted background for callout areas */
```

### 1.4 Text Colors

```
--text-primary:      #F1F5F9   /* Main body text, headings — slate-100 */
--text-secondary:    #94A3B8   /* Supporting text, descriptions — slate-400 */
--text-muted:        #64748B   /* Tertiary text, timestamps, captions — slate-500 */
--text-disabled:     #475569   /* Disabled state text — slate-600 */
--text-on-brand:     #FFFFFF   /* Text on brand-blue buttons */
--text-on-cyan:      #030712   /* Text on cyan accent backgrounds */
```

### 1.5 Border Colors

```
--border-subtle:     #1E293B   /* Card borders, dividers — slate-800 */
--border-default:    #334155   /* Input borders, visible dividers — slate-700 */
--border-hover:      #475569   /* Hovered input borders — slate-600 */
--border-focus:      #2563EB   /* Focused input ring — matches brand */
--border-cyan:       #06B6D4   /* Accent borders for highlighted elements */
```

### 1.6 Semantic Colors

These remain consistent with the original spec but are adjusted for dark backgrounds.

```
/* Match Tier Colors (on dark backgrounds) */
--match-excellent:   #22C55E   /* 90-100% — green-500 */
--match-good:        #14B8A6   /* 75-89% — teal-500 */
--match-fair:        #F59E0B   /* 60-74% — amber-500 */
--match-weak:        #64748B   /* <60% — slate-500 at 50% opacity */

/* Feedback Colors */
--success:           #22C55E   /* green-500 */
--warning:           #F59E0B   /* amber-500 */
--error:             #EF4444   /* red-500 */
--info:              #38BDF8   /* sky-400 */

/* Feedback Background Tints (for toasts/alerts on dark) */
--success-bg:        #052E16   /* green-950 */
--warning-bg:        #451A03   /* amber-950 */
--error-bg:          #450A0A   /* red-950 */
--info-bg:           #082F49   /* sky-950 */
```

### 1.7 Ball Accent Colors (for color indicator swatches)

```
--ball-white:        #F1F5F9   /* Slightly off-white on dark bg for visibility */
--ball-yellow:       #FDE047
--ball-orange:       #FB923C
--ball-pink:         #F9A8D4
--ball-matte:        #94A3B8
```

### 1.8 Special Effects

Derived from the video's glowing particle effects. Use CSS for these — no images needed.

```
/* Glow effects for hero and featured elements */
--glow-blue:         0 0 20px rgba(37, 99, 235, 0.3), 0 0 60px rgba(37, 99, 235, 0.1);
--glow-cyan:         0 0 20px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1);
--glow-cyan-intense: 0 0 15px rgba(34, 211, 238, 0.5), 0 0 45px rgba(34, 211, 238, 0.2), 0 0 80px rgba(34, 211, 238, 0.1);

/* Gradient for hero backgrounds, feature sections */
--gradient-hero:     radial-gradient(ellipse at 50% 50%, #0A1628 0%, #030712 70%);
--gradient-card-hover: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(34, 211, 238, 0.03) 100%);
--gradient-accent-bar: linear-gradient(90deg, #2563EB, #22D3EE);
```

---

## 2. Complete Tailwind Configuration

Drop this into `tailwind.config.ts` (or merge into existing):

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#030712',
          card: '#0A1628',
          elevated: '#111D35',
          active: '#1A2744',
          highlight: '#1E3A5F',
        },
        brand: {
          DEFAULT: '#2563EB',
          hover: '#3B82F6',
          active: '#1D4ED8',
          muted: '#1E40AF',
          subtle: '#172554',
        },
        accent: {
          cyan: '#22D3EE',
          'cyan-dim': '#06B6D4',
          'cyan-bright': '#67E8F9',
          'cyan-subtle': '#083344',
        },
        match: {
          excellent: '#22C55E',
          good: '#14B8A6',
          fair: '#F59E0B',
          weak: '#64748B',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3), 0 0 60px rgba(37, 99, 235, 0.1)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)',
        'glow-cyan-intense': '0 0 15px rgba(34, 211, 238, 0.5), 0 0 45px rgba(34, 211, 238, 0.2), 0 0 80px rgba(34, 211, 238, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 1px rgba(34, 211, 238, 0.1)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at 50% 50%, #0A1628 0%, #030712 70%)',
        'accent-bar': 'linear-gradient(90deg, #2563EB, #22D3EE)',
        'card-hover-gradient': 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(34, 211, 238, 0.03) 100%)',
        'grid-pattern': 'linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'count-up': 'count-up 600ms ease-out',
        'fade-slide-up': 'fade-slide-up 400ms ease-out',
        'hero-fade-in': 'fade-slide-up 200ms ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}

export default config
```

---

## 3. Global Styles

Add to `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Surface */
  --surface-base: #030712;
  --surface-card: #0A1628;
  --surface-elevated: #111D35;
  --surface-active: #1A2744;

  /* Brand */
  --brand-primary: #2563EB;
  --accent-cyan: #22D3EE;

  /* Text */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Borders */
  --border-subtle: #1E293B;
  --border-default: #334155;
}

html {
  background-color: var(--surface-base);
  color: var(--text-primary);
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--surface-base);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--surface-base);
}
::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Selection color */
::selection {
  background: rgba(37, 99, 235, 0.3);
  color: var(--text-primary);
}
```

---

## 4. Component Styling Reference

### 4.1 Page Layout

```
<body>                    → bg-surface-base text-slate-100
  <header>                → bg-surface-card/80 backdrop-blur-lg border-b border-subtle
  <main>                  → bg-surface-base
    <section>             → (alternates: bg-surface-base / bg-surface-card)
  <footer>                → bg-surface-card border-t border-subtle
```

### 4.2 Navigation / Header

```
Container:    bg-surface-card/80 backdrop-blur-lg border-b border-[#1E293B]
              sticky top-0 z-50
Logo:         Use Logo.png (or FitMyBall text in #2563EB on dark)
Nav links:    text-slate-400 hover:text-white transition-colors
Active link:  text-white font-medium
              (optionally with small cyan underline indicator: border-b-2 border-accent-cyan)
CTA button:   bg-brand text-white rounded-button px-4 py-2 hover:bg-brand-hover
Mobile menu:  bg-surface-card border border-[#1E293B] rounded-card shadow-modal
```

### 4.3 Cards

All cards sit on `surface-card` and float above `surface-base`.

```
Default:
  bg-surface-card border border-[#1E293B] rounded-[12px] shadow-card
  overflow-hidden

Hover:
  hover:border-[#334155]
  hover:shadow-card-hover
  hover:bg-card-hover-gradient   (the subtle blue→cyan gradient tint)
  transition-all duration-200

Selected (comparison mode):
  border-brand ring-1 ring-brand/30

Featured (#1 recommendation):
  bg-surface-card border border-accent-cyan-dim/30
  shadow-glow-cyan
  (this gives the top pick a subtle cyan glow border)
```

**Ball Card specific:**
```jsx
<div className="bg-surface-card border border-slate-800 rounded-[12px] shadow-card
                hover:border-slate-700 hover:shadow-card-hover transition-all duration-200
                overflow-hidden group">
  {/* Ball image area — slightly darker background */}
  <div className="bg-surface-base p-6 flex justify-center">
    <img ... className="group-hover:scale-105 transition-transform duration-300" />
  </div>

  {/* Content area */}
  <div className="p-5 space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-display font-semibold text-slate-100">Ball Name</h3>
        <p className="text-sm text-slate-400">Manufacturer · $XX.XX/doz</p>
      </div>
    </div>

    {/* Match bar */}
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400">Match</span>
        <span className="text-match-excellent font-semibold">85%</span>
      </div>
      <div className="h-1.5 bg-surface-active rounded-full overflow-hidden">
        <div className="h-full bg-match-excellent rounded-full" style="width: 85%" />
      </div>
    </div>

    {/* Spec pills */}
    <div className="flex gap-2 flex-wrap">
      <span className="px-2.5 py-1 text-xs font-medium rounded-full
                        bg-surface-active text-slate-300 border border-slate-700">
        90 Comp
      </span>
      ...
    </div>

    {/* CTA */}
    <button className="w-full mt-2 py-2.5 text-sm font-medium rounded-button
                        bg-brand/10 text-brand-hover border border-brand/20
                        hover:bg-brand/20 transition-colors">
      View Details →
    </button>
  </div>
</div>
```

### 4.4 Buttons

**Primary (brand blue fill):**
```
bg-brand text-white font-medium rounded-button
px-6 py-3
hover:bg-brand-hover
active:bg-brand-active
disabled:opacity-40 disabled:cursor-not-allowed
shadow-glow-blue (optional, for hero CTA only)
transition-all duration-150
```

**Secondary (outline):**
```
bg-transparent text-slate-200 font-medium rounded-button
px-6 py-3
border border-slate-600
hover:border-slate-400 hover:text-white hover:bg-surface-elevated
active:bg-surface-active
transition-all duration-150
```

**Ghost:**
```
bg-transparent text-slate-400
hover:text-white hover:bg-surface-elevated
rounded-button px-4 py-2
transition-all duration-150
```

**Accent (cyan, use sparingly for special actions):**
```
bg-accent-cyan text-surface-base font-semibold rounded-button
px-6 py-3
hover:bg-accent-cyan-bright
transition-all duration-150
```

### 4.5 Form Inputs

```
Default:
  bg-surface-active border border-[#334155] rounded-input
  text-slate-100 placeholder:text-slate-500
  px-4 py-2.5
  focus:border-brand focus:ring-1 focus:ring-brand/30 focus:outline-none
  transition-colors duration-150

Error:
  border-red-500 focus:ring-red-500/30

Labels:
  text-sm font-medium text-slate-300 mb-1.5

Helper text:
  text-xs text-slate-500 mt-1

Error message:
  text-xs text-red-400 mt-1
```

**Select dropdowns:**
```
Same as input base styles
Dropdown popover: bg-surface-elevated border border-[#334155] rounded-[12px] shadow-modal
Option hover: bg-surface-active
Option selected: bg-brand/10 text-brand-hover
```

**Sliders:**
```
Track: bg-surface-active rounded-full h-2
Fill: bg-accent-bar (the blue-to-cyan gradient)
Thumb: bg-white border-2 border-brand w-5 h-5 rounded-full shadow-glow-blue
```

**Radio buttons / Checkboxes:**
```
Unchecked: border-2 border-slate-600 bg-surface-active
Checked: border-brand bg-brand
  (radio: inner dot white)
  (checkbox: checkmark white)
Focus: ring-2 ring-brand/30
```

### 4.6 Badges / Pills

**Spec pills (on ball cards):**
```
bg-surface-active text-slate-300 text-xs font-medium
border border-slate-700 rounded-full px-2.5 py-1
```

**Match tier badges:**
```
Excellent: bg-match-excellent/15 text-match-excellent border border-match-excellent/20
Good:      bg-match-good/15 text-match-good border border-match-good/20
Fair:      bg-match-fair/15 text-match-fair border border-match-fair/20
Weak:      bg-slate-700/50 text-slate-500 border border-slate-700
```

**Status badges:**
```
New:      bg-brand/15 text-brand-hover border border-brand/20 rounded-full px-3 py-1
Popular:  bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/20 rounded-full
Sale:     bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full
```

### 4.7 Progress Bar

**Quiz progress:**
```
Track:  bg-surface-active rounded-full h-2
Fill:   bg-accent-bar (linear-gradient 90deg: #2563EB → #22D3EE) rounded-full
        transition-all duration-500 ease-out
```

**Match percentage bar (on cards):**
```
Track:  bg-surface-active rounded-full h-1.5
Fill:   bg-{match-tier-color} rounded-full
```

### 4.8 Match Percentage Ring (Results Page)

The #1 recommendation uses a circular ring indicator:

```jsx
{/* Activity ring style — SVG circle with stroke */}
<svg viewBox="0 0 120 120" className="w-24 h-24">
  {/* Background ring */}
  <circle cx="60" cy="60" r="52" fill="none"
          stroke="#1A2744" strokeWidth="8" />
  {/* Score ring — stroke-dasharray animated */}
  <circle cx="60" cy="60" r="52" fill="none"
          stroke="#22C55E" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${score * 3.267} 326.7`}
          transform="rotate(-90 60 60)"
          className="transition-all duration-600 ease-out" />
  {/* Center text */}
  <text x="60" y="65" textAnchor="middle"
        className="fill-slate-100 text-2xl font-display font-bold">
    92%
  </text>
</svg>
```

Ring color uses match tier: green for 90+, teal for 75-89, amber for 60-74.

### 4.9 Tooltips & Popovers

```
bg-surface-elevated border border-[#334155] rounded-[8px]
shadow-modal
text-sm text-slate-200
px-3 py-2
```

### 4.10 Modals / Bottom Sheets

```
Overlay:    bg-black/60 backdrop-blur-sm
Container:  bg-surface-card border border-[#1E293B] rounded-[16px] shadow-modal
            max-w-lg mx-auto
Header:     border-b border-[#1E293B] px-6 py-4
            text-lg font-display font-semibold text-slate-100
Body:       px-6 py-4
Footer:     border-t border-[#1E293B] px-6 py-4 flex gap-3 justify-end

Mobile bottom sheet:
  rounded-t-[20px] rounded-b-none
  Drag handle: w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3
```

### 4.11 Tables (Comparison Page)

```
Container:  bg-surface-card border border-[#1E293B] rounded-[12px] overflow-hidden
Header row: bg-surface-active text-sm font-medium text-slate-300
            border-b border-[#1E293B]
Body rows:  border-b border-[#1E293B] last:border-0
Cell:       px-4 py-3 text-sm text-slate-200
Difference highlight: bg-accent-cyan-subtle (when values differ across balls)
Sticky first column (mobile): bg-surface-card border-r border-[#1E293B]
```

---

## 5. Page-Specific Guidance

### 5.1 Homepage Hero

The hero section sets the tone for the entire theme. It should feel like the video.

```
Section:     bg-hero-radial (radial gradient from #0A1628 center to #030712 edges)
             relative overflow-hidden min-h-[80vh]

Grid overlay (optional, subtle): 
             Use bg-grid-pattern bg-grid with opacity-20
             positioned absolute behind content

Left content (60%):
  Overline:  text-accent-cyan text-xs font-body uppercase tracking-[0.2em] font-semibold
             "DATA-DRIVEN BALL FITTING"
  Headline:  font-display text-5xl md:text-6xl font-bold text-white
             leading-tight tracking-tight
             "Find Your Perfect Golf Ball"
  Subtitle:  text-lg text-slate-400 max-w-md mt-4
  CTAs:      mt-8 flex gap-4
             Primary: bg-brand text-white shadow-glow-blue
             Secondary: border border-slate-600 text-slate-200

Right content (40%):
  The hero video (FitMyBallVideo.mp4) plays inline, muted, looped
  OR: A still frame from the video as a background with CSS glow effects
  The video/image should bleed slightly beyond its container for dramatic effect
```

**Important:** The video file should be embedded as an auto-playing, muted, looping `<video>` element. It already has the perfect aesthetic — use it directly rather than trying to recreate it with CSS.

```jsx
<video
  autoPlay muted loop playsInline
  className="w-full h-full object-cover rounded-2xl opacity-90"
  poster="/images/hero-poster.jpg"  // first frame as fallback
>
  <source src="/video/FitMyBallVideo.mp4" type="video/mp4" />
</video>
```

### 5.2 Quiz Flow

```
Page bg:     bg-surface-base

Progress:
  Container: bg-surface-card border border-[#1E293B] rounded-full p-1 mx-auto max-w-md
  Label:     text-sm text-slate-400 font-medium mb-2
             "Step 3 of 6 · Ball Flight & Spin"
  Track:     bg-surface-active rounded-full h-2
  Fill:      bg-accent-bar rounded-full (blue-to-cyan gradient)

Question card:
  bg-surface-card border border-[#1E293B] rounded-[12px] p-6 md:p-8

Radio/option cards (for quiz choices like "Low / Mid / High"):
  bg-surface-active border border-slate-700 rounded-[12px] p-4
  hover:border-slate-500 cursor-pointer
  Selected: border-brand bg-brand/5

Step transition: slide-in-from-right 250ms, outgoing slides left

Navigation:
  [← Back]  ghost button, left aligned
  [Next →]  primary button, right aligned
```

### 5.3 Results Page

```
Header area (for #1 pick):
  bg-surface-card border border-accent-cyan-dim/30 rounded-[16px]
  shadow-glow-cyan
  relative overflow-hidden

  Optional: subtle radial gradient behind the ball image
            radial-gradient(circle at 70% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 60%)

  "Best Match" badge:
    absolute top-4 left-4
    bg-match-excellent/20 text-match-excellent text-xs font-semibold
    border border-match-excellent/30 rounded-full px-3 py-1
    "🏆 Best Match"

Secondary cards grid:
  Standard ball cards on bg-surface-base
  4 columns desktop, 2 tablet, 1 mobile

"Select balls to compare" toggle:
  Small toggle switch with label, positioned above the grid
  Uses brand blue when active

Alternative options (Best Value / Step Up):
  bg-surface-card border border-[#1E293B] rounded-[12px]
  Small label badge at top: "💰 Best Value" or "🔝 Step Up"
```

### 5.4 Browse Page

```
Filter bar:
  bg-surface-card border border-[#1E293B] rounded-[12px] p-4
  Sticky below header on scroll

  Each filter trigger:
    bg-surface-active border border-slate-700 rounded-button px-4 py-2
    text-sm text-slate-300
    hover:border-slate-500
    Active filter: border-brand text-brand-hover

  Active filter pills (below bar):
    bg-brand/10 text-brand-hover text-xs rounded-full px-3 py-1
    border border-brand/20
    [×] remove icon

  Sort dropdown:
    Same as select styling

  Mobile: Single "Filters" button → opens bottom sheet with all filters stacked
```

### 5.5 Ball Detail Page

```
Image gallery area:
  bg-surface-card rounded-[12px] p-8 flex justify-center
  Optional subtle glow behind ball image

Specifications table:
  Use alternating rows: bg-surface-card and bg-surface-active
  Labels: text-slate-400
  Values: text-slate-100 font-medium

Spin profile radar chart:
  Use brand blue (#2563EB) for the filled area
  Accent cyan (#22D3EE) for the border line
  Grid lines: #1E293B
  Labels: text-slate-400
  Background: transparent (sits on card surface)

"Who Should Play This Ball" section:
  bg-surface-active/50 border border-[#1E293B] rounded-[12px] p-6
```

### 5.6 Authentication Pages

```
Centered card layout:
  Page: bg-surface-base with bg-hero-radial
  Card: bg-surface-card border border-[#1E293B] rounded-[16px]
        shadow-card max-w-md mx-auto p-8

  Logo above card (centered)
  Headline: font-display text-2xl font-bold text-white

  OAuth button ("Continue with Google"):
    bg-surface-active border border-slate-600 text-slate-200
    hover:bg-surface-elevated hover:border-slate-500
    Full width, with Google icon

  Divider ("or"):
    Horizontal rule with text: border-[#1E293B] with
    "or" in bg-surface-card text-slate-500 text-sm centered
```

### 5.7 Dashboard / Account Pages

```
Welcome section:
  bg-surface-card border border-[#1E293B] rounded-[12px] p-6
  "Welcome back, John" in font-display

Stat cards (Recommendations count, Balls Tried count):
  bg-surface-active border border-[#1E293B] rounded-[12px] p-5
  Number: text-3xl font-display font-bold text-accent-cyan
  Label: text-sm text-slate-400

Quick action buttons:
  Ghost button style, icon + label, arranged in grid

History cards:
  bg-surface-card border border-[#1E293B] rounded-[12px]
  Date: text-xs text-slate-500
  Ball name: font-medium text-slate-100
  Match %: colored by tier
```

### 5.8 404 Page

```
bg-surface-base with bg-hero-radial
Centered content

Headline: font-display text-4xl font-bold text-white
          "Looks Like That One Went OB"
Subtitle: text-slate-400 text-lg mt-3
          "The ball you're looking for isn't in our catalog..."
CTAs:     mt-6 flex gap-4
          [Browse All Balls] primary button
          [Go Home] secondary button
```

### 5.9 Error States

```
Error container:
  bg-error-bg border border-red-500/20 rounded-[12px] p-6
  Icon: text-error
  Heading: text-slate-100 font-semibold
  Body: text-slate-300

Empty states:
  text-center py-16
  Icon/illustration: text-slate-600 (large, muted)
  Heading: text-slate-300 font-display font-semibold
  Body: text-slate-500
  CTA: primary button
```

---

## 6. Typography on Dark

```
Display (hero headlines):
  font-display (Plus Jakarta Sans) font-bold text-white
  text-5xl md:text-6xl tracking-tight leading-tight

H1 (page titles):
  font-display font-bold text-white
  text-4xl tracking-tight

H2 (section headers):
  font-display font-semibold text-slate-100
  text-2xl md:text-3xl

H3 (card titles, subsection headers):
  font-body (Inter) font-semibold text-slate-100
  text-xl

H4:
  font-body font-semibold text-slate-200
  text-lg

Body text:
  font-body text-slate-300
  text-base leading-relaxed

Small / captions:
  font-body text-slate-400
  text-sm

Overline:
  font-body text-accent-cyan text-xs font-semibold
  uppercase tracking-[0.2em]
```

---

## 7. Shadows & Elevation 

On dark backgrounds, traditional shadows are nearly invisible. Instead, use a combination of subtle borders + light-source shadows + optional glow.

```
Level 0 (flush):     No shadow. border border-[#1E293B]
Level 1 (card):      shadow-card — 0 4px 12px rgba(0,0,0,0.4)
Level 2 (hover):     shadow-card-hover — 0 8px 25px rgba(0,0,0,0.5) + 0 0 1px cyan hint
Level 3 (dropdown):  shadow-modal — 0 20px 60px rgba(0,0,0,0.7)
Level 4 (featured):  shadow-glow-cyan — the cyan glow from the video aesthetic

Rule: Every floating element needs a visible border (border-[#1E293B] minimum)
      in addition to its shadow. On dark themes, borders do more work than shadows
      for establishing hierarchy.
```

---

## 8. Animation Adjustments for 

The theme benefits from subtle light-based animations (glows, shimmers) rather than the shadow-based transforms from the light spec.

```
Card hover:
  OLD: translateY(-2px) + shadow increase
  NEW: border color brightens (#1E293B → #334155) + subtle glow appears
       transition-all duration-200

Button hover:
  OLD: translateY(-1px) + darker bg
  NEW: bg lightens (brand → brand-hover) + glow-blue shadow appears
       transition-all duration-150

Match percentage reveal:
  Ring stroke animates from 0 to score value
  Duration: 600ms, ease-out-cubic
  Number counts up simultaneously

Results cards stagger:
  #1 card fades in (200ms)
  150ms pause
  Cards 2-5 stagger (50ms each), fade-slide-up

Quiz progress bar:
  Width transitions smoothly (500ms ease-out)
  Gradient fill adds a subtle shimmer on change (optional)

Page transitions:
  Fade in from 0 opacity: 300ms
  Content slides up from 12px: 400ms
```

---

## 9. Responsive Considerations

The theme applies identically across all breakpoints. No light/dark switching.

**Mobile bottom tab bar:**
```
bg-surface-card/95 backdrop-blur-lg
border-t border-[#1E293B]
safe-area-inset-bottom padding

Tab icons: text-slate-500
Active tab: text-accent-cyan
Active indicator: small dot or bar in accent-cyan below icon

MVP (4 tabs): Home | Fit | Browse | Me
Phase 2:      Home | Fit | Browse | Faves | Me
```

**Mobile filter bottom sheet:**
```
bg-surface-card rounded-t-[20px]
Drag handle: w-10 h-1 bg-slate-600 rounded-full mx-auto mt-3
Full-height scrollable filter list
"Apply Filters" sticky button at bottom: bg-brand text-white
```

---

## 10. Assets Checklist

For the development team to prepare:

```
[ ] Logo.png — already provided, place at /public/images/logo.png
[ ] FitMyBallVideo.mp4 — already provided, place at /public/video/FitMyBallVideo.mp4
[ ] Generate a poster image (first frame) for video fallback:
    ffmpeg -i FitMyBallVideo.mp4 -frames:v 1 hero-poster.jpg
[ ] Plus Jakarta Sans — load via Google Fonts or self-host
[ ] Inter — load via Google Fonts or self-host
[ ] Ensure all shadcn/ui components are restyled to use surface/brand/accent tokens
    (do NOT use shadcn default zinc/neutral theme)
```

---

## 11. shadcn/ui Theme Override

If using shadcn/ui, override the CSS variables in your theme. Replace the default neutral palette:

```css
@layer base {
  :root {
    --background: 222 47% 3%;        /* #030712 surface-base */
    --foreground: 210 40% 96%;       /* #F1F5F9 text-primary */
    --card: 217 50% 10%;             /* #0A1628 surface-card */
    --card-foreground: 210 40% 96%;
    --popover: 218 42% 14%;          /* #111D35 surface-elevated */
    --popover-foreground: 210 40% 96%;
    --primary: 217 91% 53%;          /* #2563EB brand */
    --primary-foreground: 0 0% 100%;
    --secondary: 217 50% 14%;        /* #1A2744 surface-active */
    --secondary-foreground: 210 40% 96%;
    --muted: 217 50% 14%;
    --muted-foreground: 215 16% 57%; /* #94A3B8 text-secondary */
    --accent: 188 94% 53%;           /* #22D3EE accent-cyan */
    --accent-foreground: 222 47% 3%;
    --destructive: 0 84% 60%;        /* #EF4444 error */
    --destructive-foreground: 0 0% 100%;
    --border: 217 33% 17%;           /* #1E293B border-subtle */
    --input: 215 25% 27%;            /* #334155 border-default */
    --ring: 217 91% 53%;             /* #2563EB brand (focus ring) */
    --radius: 0.75rem;               /* 12px card radius */
  }
}
```

---

## 12. Quick Reference: Old → New Mapping

| Element | Old (Light Theme) | New (Dark Theme) |
|---------|------------------|------------------|
| Page background | `#F8FAFC` | `#030712` (surface-base) |
| Card background | `#FFFFFF` | `#0A1628` (surface-card) |
| Card border | `#E5E7EB` | `#1E293B` (border-subtle) |
| Primary CTA | `#16A34A` (green) | `#2563EB` (brand blue) |
| CTA hover | `#15803D` | `#3B82F6` (brand-hover) |
| Accent/highlight | `#22C55E` (green) | `#22D3EE` (accent-cyan) |
| Primary text | `#1F2937` | `#F1F5F9` (text-primary) |
| Secondary text | `#6B7280` | `#94A3B8` (text-secondary) |
| Input background | `#FFFFFF` | `#1A2744` (surface-active) |
| Input border | `#E5E7EB` | `#334155` (border-default) |
| Hero background | `#0F172A` (dark section) | `radial-gradient(#0A1628, #030712)` |
| Match excellent | `#16A34A` | `#22C55E` |
| Match good | `#14B8A6` | `#14B8A6` (unchanged) |
| Match fair | `#D97706` | `#F59E0B` (brighter for dark bg) |
| Link color | `#2563EB` | `#3B82F6` (slightly brighter on dark) |
| Progress bar fill | green | `gradient: #2563EB → #22D3EE` |
| Display font | Plus Jakarta Sans | Plus Jakarta Sans (unchanged) |

---

*This template supersedes the color system and surface treatments from fitmyball-ui-ux-design-v2.md. All wireframe layouts, user flows, validation rules, accessibility specs, and responsive breakpoints from v2 remain in effect — only the visual skin changes.*
