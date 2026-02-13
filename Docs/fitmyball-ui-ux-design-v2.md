# FitMyBall - UI/UX Design Document

**Version:** 2.0  
**Date:** February 12, 2026  
**Status:** Revised - Design Review Updates Applied  
**Related Documents:** PRD v1.0, Technical Spec v1.0, Database Schema v1.0

---

## 1. Executive Summary

This document defines the complete user interface and user experience design for the FitMyBall application. It provides detailed wireframes, user flows, component specifications, and design guidelines for the development team to build a consistent, accessible, and delightful user experience.

### 1.1 Design Principles

**Core Principles:**
1. **Clarity First** - Golf can be technical; our UI should simplify, not complicate
2. **Progressive Disclosure** - Show what's needed, when it's needed
3. **Mobile-First** - Most users will browse on mobile, optimize for that
4. **Trust Through Transparency** - Show our reasoning, build confidence
5. **Speed Matters** - Every interaction should feel instant

**Visual Identity:**
- Clean, modern, professional with a futuristic edge
- Golf-tech color palette (vibrant greens, dark surfaces, crisp whites)
- High-quality golf ball product photography on dark backgrounds
- Data visualization that's easy to understand
- Premium, precision-engineered aesthetic (think club fitting studio, not country club)

---

## 2. Design System

### 2.1 Color Palette

```
Primary Colors:
- Golf Green:     #16A34A (brand primary, CTAs — vibrant, modern green)
- Forest:         #15803D (darker variant)
- Fairway Green:  #22C55E (lighter variant, hover states, active elements)

Secondary Colors:
- Sky Blue:       #2563EB (links, interactive elements)
- Cool White:     #F8FAFC (backgrounds — slate-50, crisper tone)
- Pure White:     #FFFFFF (cards, surfaces)

Surface Colors:
- Dark Surface:   #0F172A (hero sections, featured cards, contrast areas — slate-900)

Neutral Colors:
- Charcoal:       #1F2937 (primary text)
- Gray:           #6B7280 (secondary text)
- Light Gray:     #E5E7EB (borders, dividers)
- Background:     #F8FAFC (page background)

Semantic Colors:
- Success:        #059669 (positive feedback)
- Warning:        #D97706 (caution)
- Error:          #DC2626 (errors, destructive actions)
- Info:           #0284C7 (informational messages)

Match Tier Colors:
- Excellent (90-100%): #16A34A (primary green)
- Good (75-89%):       #14B8A6 (teal — distinct from link blue)
- Fair (60-74%):       #D97706 (amber)
- Weak (<60%):         #94A3B8 at 50% opacity (slate, with "Weak Match" label)

Ball Accent Colors (for ball color indicators):
- White:          #FFFFFF
- Yellow:         #FDE047
- Orange:         #FB923C
- Pink:           #F9A8D4
- Matte:          #94A3B8
```

### 2.2 Typography

```
Font Family:
- Display: Plus Jakarta Sans (hero headlines, Display/H1/H2 only — premium geometric sans-serif)
- Primary: Inter (H3-H5, UI elements, buttons, navigation, labels)
- Secondary: System UI (body text, optimal performance)

Type Scale:
- Display:  3.75rem / 60px  (font-bold, -tracking-tight) → Plus Jakarta Sans
- H1:       3rem / 48px     (font-bold, -tracking-tight) → Plus Jakarta Sans
- H2:       2.25rem / 36px  (font-semibold)              → Plus Jakarta Sans
- H3:       1.875rem / 30px (font-semibold)              → Inter
- H4:       1.5rem / 24px   (font-semibold)              → Inter
- H5:       1.25rem / 20px  (font-medium)                → Inter
- Body Large: 1.125rem / 18px (font-normal)              → System UI
- Body:     1rem / 16px     (font-normal)                → System UI
- Body Small: 0.875rem / 14px (font-normal)              → System UI
- Caption:  0.75rem / 12px  (font-normal, uppercase tracking-wide) → Inter
- Overline: 0.75rem / 12px  (font-semibold, uppercase tracking-widest, primary green) → Inter

Line Heights:
- Tight:    1.25
- Normal:   1.5
- Relaxed:  1.75
```

### 2.3 Spacing System

```
Based on 4px base unit (Tailwind defaults):

1  = 0.25rem / 4px
2  = 0.5rem / 8px
3  = 0.75rem / 12px
4  = 1rem / 16px
5  = 1.25rem / 20px
6  = 1.5rem / 24px
8  = 2rem / 32px
10 = 2.5rem / 40px
12 = 3rem / 48px
16 = 4rem / 64px
20 = 5rem / 80px
24 = 6rem / 96px

Common Patterns:
- Section padding: py-12 md:py-16
- Card padding: p-6
- Button padding: px-6 py-3
- Input padding: px-4 py-2
- Gutter: 4 (mobile) / 6 (tablet) / 8 (desktop)
```

### 2.4 Border Radius

```
- sm:   0.125rem / 2px   (subtle elements)
- base: 0.375rem / 6px   (inputs)
- md:   0.5rem / 8px     (buttons)
- lg:   0.75rem / 12px   (cards, larger containers)
- xl:   1rem / 16px      (modals, hero elements, major containers)
- full: 9999px           (pills, badges)

Note: Cards use lg (12px) radius for a softer modern feel.
Buttons use md (8px) radius.
```

### 2.5 Shadows

```
- sm:   0 1px 2px rgba(0,0,0,0.05)
- base: 0 1px 3px rgba(0,0,0,0.1)
- md:   0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)
- lg:   0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)
- xl:   0 20px 40px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04)

Note: lg and xl use two-layer shadows for more natural, premium depth.

Elevation:
- Cards: shadow-md
- Hover cards: shadow-lg
- Modals: shadow-xl
- Dropdowns: shadow-lg
```

---

## 3. Component Library

### 3.1 Core Components (using shadcn/ui)

**Buttons:**
```typescript
// Primary Button
<Button variant="default" size="lg">
  Find My Ball
</Button>

// Secondary Button
<Button variant="outline" size="lg">
  Learn More
</Button>

// Ghost Button
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Destructive Button
<Button variant="destructive">
  Delete Account
</Button>

Sizes: xs, sm, default, lg, xl
States: default, hover, active, disabled, loading
```

**Cards:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>

Variants: default, bordered, elevated
```

**Form Elements:**
```typescript
// Input
<Input 
  type="text" 
  placeholder="Enter text" 
  label="Field Label"
  error="Error message"
  helperText="Helper text"
/>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>

// Slider
<Slider 
  min={0} 
  max={100} 
  step={1} 
  value={[50]}
  label="Driver Ball Speed"
  unit="mph"
/>

// Radio Group
<RadioGroup>
  <RadioGroupItem value="option1" />
  <Label>Option 1</Label>
</RadioGroup>

// Checkbox
<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms</Label>
```

**Badges:**
```typescript
<Badge variant="default">New</Badge>
<Badge variant="secondary">Popular</Badge>
<Badge variant="outline">Sale</Badge>
<Badge variant="destructive">Discontinued</Badge>

// Ball color badge
<Badge className="bg-yellow-400">Yellow</Badge>
```

**Progress:**
```typescript
// Quiz progress
<Progress value={60} className="h-2" />

// Match percentage
<Progress value={matchScore} className="h-3" />
```

### 3.2 Custom Components

**Ball Card:**
```
┌─────────────────────────────────┐
│         [Ball Image]            │
│                                 │
│  Ball Name             $XX.XX   │
│  Manufacturer · /dozen          │
│                                 │
│  ████████░░ 85% Match           │
│                                 │
│  [90 Comp] [3-piece] [Soft]     │ ← pill badges (not bullets)
│                                 │
│  [View Details →]               │ ← single primary CTA
└─────────────────────────────────┘

States:
- Default
- Hover (elevated shadow, subtle border tint)
- Selected (border highlight) — only visible in comparison mode
- Comparison mode (checkbox visible — toggled via grid-level control)

Note: The [Compare] button is NOT shown on individual cards by default.
Comparison checkboxes appear only when user activates "Select balls to
compare" toggle at the top of the browse/results grid. This reduces
card clutter in the default state.
```

**Match Percentage Indicator:**
```
┌─────────────────────────────────┐
│  Match Score                    │
│                                 │
│     ┌───────┐                   │
│     │  92%  │ (large bold       │
│     └───────┘  number with thin │
│                circular ring    │
│                behind it —      │
│                Apple Watch      │
│                activity ring    │
│                style)           │
│                                 │
│  Excellent Match                │
│                                 │
│  Category Breakdown:            │
│  Swing Speed  ████████░░ 90%    │
│  Performance  █████████░ 95%    │
│  Preferences  ████████░░ 88%    │
│  Conditions   ███████░░░ 85%    │
└─────────────────────────────────┘

Color coding (uses Match Tier Colors):
90-100%: #16A34A Green (excellent)
75-89%:  #14B8A6 Teal (good — distinct from link blue)
60-74%:  #D97706 Amber (fair)
<60%:    #94A3B8 at 50% opacity (weak — with "Weak Match" label)

Note: Scores below 60% should not appear in quiz recommendations.
They may appear in the Browse page when viewed against a user's profile.
```

**Spin Chart (Radar Chart):**
```
        Driver
          ╱│╲
         ╱ │ ╲
        ╱  │  ╲
       ╱   │   ╲
      ╱    │    ╲
     ╱     │     ╲
Iron ───────────── Wedge

Displays:
- Driver spin (low/mid/high)
- Iron spin (low/mid/high)
- Wedge spin (low/mid/high)

Visual: Filled area with colored gradient
Interactive: Hover to see exact values
```

**Temperature Indicator:**
```
┌─────────────────────────────────┐
│  Temperature Performance        │
│                                 │
│  ❄️  🌡️  ☀️                    │
│  Cold  Moderate  Warm           │
│        ████                     │
│                                 │
│  Best Performance: Warm (70°+)  │
│  Cold Suitability: 3/5          │
└─────────────────────────────────┘
```

**Step Navigation (Quiz):**
```
┌─────────────────────────────────────────────┐
│  Step 3 of 6 · Ball Flight & Spin          │
│  ████████████████████░░░░░░░░░░             │
└─────────────────────────────────────────────┘

- Single continuous progress bar showing percentage completion
- Current step name displayed as text next to step count
- Dramatically simpler on mobile, no breakage at narrow widths
- Green fill color for completed portion

Note: The full labeled stepper with step names is shown ONLY on the
Review page (Step 7), where it serves as navigation for jumping back
to edit specific sections:

Step 1 ━━━━ Step 2 ━━━━ Step 3 ━━━━ Step 4 ━━━━ Step 5 ━━━━ Step 6 ━━━━ Review
  ✓           ✓           ✓           ✓           ✓           ✓         (Current)
Background  Priorities  Flight/Spin  Feel      Conditions  Metrics
```

---

## 4. Page Layouts & Wireframes

### 4.1 Homepage

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Navigation              [Account]   │ Header
├─────────────────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓ DARK HERO (#0F172A) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                                         │
│     [Overline: "DATA-DRIVEN BALL FITTING"               │
│      small caps, tracking-widest, primary green]        │
│                                                         │
│  ┌─── Left 60% ──────────┐  ┌─── Right 40% ─────────┐ │
│  │                        │  │                        │ │
│  │  Find Your             │  │   [High-quality golf   │ │
│  │  Perfect Golf Ball     │  │    ball render with    │ │
│  │                        │  │    dramatic lighting   │ │
│  │  Unbiased recs from    │  │    on dark background] │ │
│  │  all major brands,     │  │                        │ │
│  │  matched to your       │  │                        │ │
│  │  exact swing.          │  │                        │ │
│  │                        │  │                        │ │
│  │  [Find My Ball →]      │  │                        │ │
│  │  [Browse All Balls]    │  │                        │ │
│  │                        │  │                        │ │
│  └────────────────────────┘  └────────────────────────┘ │
│                                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  How It Works                                          │
│  ────────────                                          │
│                                                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐             │
│  │   📋    │   │   🎯    │   │   ⭐    │             │
│  │  Answer │   │   Get   │   │  Find   │             │
│  │   Quiz  │   │ Matched │   │  Your   │             │
│  │         │   │         │   │  Ball   │             │
│  └─────────┘   └─────────┘   └─────────┘             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Why Choose Our Selector?                              │
│  ─────────────────────────                             │
│                                                         │
│  ✓ Multi-brand unbiased recommendations                │
│  ✓ Temperature & seasonal guidance                     │
│  ✓ Budget-aware alternatives                           │
│  ✓ Data-driven matching algorithm                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Popular Balls                                         │
│  ─────────────                                         │
│                                                         │
│  [Ball Card] [Ball Card] [Ball Card] [Ball Card]      │
│                                                         │
│              [View All Balls →]                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Footer                                                │
│  About | Privacy | Terms | Contact                     │
│  © 2026 FitMyBall                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

Hero Design Notes:
- Dark background (#0F172A) makes CTA buttons and golf ball imagery pop
- Headline set in Plus Jakarta Sans (Display font) for brand presence
- Overline label ("DATA-DRIVEN BALL FITTING") in Inter, uppercase,
  tracking-widest, primary green color — signals tech positioning
- Hero text is white on dark surface
- CTA buttons: primary green fill for "Find My Ball", white outline
  for "Browse All Balls"
- Golf ball image: single white ball with subtle glow/shadow effect,
  product-launch aesthetic

Responsive Behavior:
Mobile: Stack hero vertically (text above, ball image below), full-width cards
Tablet: 2-column grid for features and balls, hero stays split
Desktop: 3-4 column grid, wider hero with full split layout

Key CTAs:
Primary: "Find My Ball" (large, prominent, green fill)
Secondary: "Browse All Balls" (outline variant)
```

### 4.2 Quiz Flow - Landing Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Quiz                    [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         Find Your Perfect Golf Ball                     │
│         ───────────────────────────                     │
│                                                         │
│         Answer 6 quick questions to get personalized    │
│         ball recommendations from all major brands.     │
│                                                         │
│         ⏱️ Takes about 2 minutes                        │
│         🎯 Unbiased recommendations                     │
│         ⚡ Instant results                              │
│                                                         │
│              [Start Quiz →]                            │
│                                                         │
│         Or if you have an account:                     │
│         [Load My Profile]                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  What to Expect                                        │
│  ──────────────                                        │
│                                                         │
│  Step 1: Your Golf Background                          │
│  Step 2: Performance Priorities                        │
│  Step 3: Ball Flight & Spin                            │
│  Step 4: Feel & Preferences                            │
│  Step 5: Playing Conditions                            │
│  Step 6: Performance Metrics                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

Navigation:
- Back to homepage
- Login/Register (if not logged in)
```

### 4.3 Quiz Flow - Step Template

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Quiz Progress            [Account]   │
│                                                         │
│ Step 3 of 6 · Ball Flight & Spin                        │
│ ████████████████████░░░░░░░░░░                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 3: Ball Flight & Spin                            │
│  ─────────────────────────                             │
│                                                         │
│  Preferred trajectory for approach shots               │
│                                                         │
│  ○ Low      ○ Mid      ○ High                          │
│                                                         │
│  [Visual: Arrow showing ball trajectory]               │
│                                                         │
│  ───────────────────────────────────                   │
│                                                         │
│  With your current ball, spin and control on approach  │
│  shots:                                                │
│                                                         │
│  ○ Too much release (ball runs out)                    │
│  ○ Just right                                          │
│  ○ Too much spin (ball checks too hard)               │
│                                                         │
│  ───────────────────────────────────                   │
│                                                         │
│  Could you benefit from more short game spin?          │
│                                                         │
│  ○ Yes    ○ No    ○ Not sure                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [← Back]                    [Next: Feel & Prefs →]   │
│                                                         │
└─────────────────────────────────────────────────────────┘

Key Elements:
- Progress indicator (always visible)
- Question grouping (related questions together)
- Clear labels and helper text
- Visual aids where helpful
- Validation on Next (show errors inline)
- Back button (preserves previous answers)
- Auto-save to localStorage (restore on refresh)

Responsive:
Mobile: Single column, larger touch targets
Desktop: Wider layout, side-by-side options where appropriate
```

### 4.4 Quiz Flow - Review Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Review Answers           [Account]   │
│                                                         │
│ Step 1 ━━━━ Step 2 ━━━━ Step 3 ━━━━ Step 4 ━━━━ Review│
│   ✓           ✓           ✓           ✓         ✓      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Review Your Answers                                   │
│  ────────────────────                                  │
│                                                         │
│  Make sure everything looks correct before we find     │
│  your perfect ball.                                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Your Golf Background                    [Edit]    │ │
│  ├───────────────────────────────────────────────────┤ │
│  │ Current Ball: Titleist Pro V1                     │ │
│  │ Handicap: 11-15                                   │ │
│  │ Rounds per Year: 50-100                           │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Performance Priorities                  [Edit]    │ │
│  ├───────────────────────────────────────────────────┤ │
│  │ Priority Type: Performance & Preferences          │ │
│  │ Most Important: Short Game Performance           │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Ball Flight & Spin                      [Edit]    │ │
│  ├───────────────────────────────────────────────────┤ │
│  │ Approach Trajectory: Mid                          │ │
│  │ Current Ball Spin: Too much release               │ │
│  │ Need Short Game Spin: Yes                         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ... (continue for all sections)                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [← Back]              [Get My Recommendations →]     │
│                                                         │
└─────────────────────────────────────────────────────────┘

Features:
- Collapsible sections for each step
- Edit button jumps to that step
- Clear, readable summary format
- Validation before submission
- Loading state on submit
```

### 4.5 Results Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Results                  [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your Fitting Results                                   │
│  ────────────────────                                   │
│                                                         │
│  Based on your swing, preferences, and conditions.      │
│                                                         │
│  [Save Results] [Share Link] [Email Me] [Retake Quiz]  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓ DARK SURFACE (#0F172A) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [🏆 Best Match — green badge #16A34A]          │   │
│  │                                                 │   │
│  │  [Ball Image]    Titleist Tour Speed      ┌───┐│   │
│  │                  Titleist                 │92%││   │
│  │                  $44.99/dozen            └───┘│   │
│  │                  (ring style: Apple Watch     │   │
│  │                   activity ring, green tier)  │   │
│  │                                                 │   │
│  │  Why This Matches You:                         │   │
│  │  • 85 compression perfect for 155 mph swing    │   │
│  │  • High wedge spin for short game control      │   │
│  │  • Mid trajectory matches your preference      │   │
│  │  • Premium performance in your budget          │   │
│  │                                                 │   │
│  │  What You'll Gain vs Pro V1:                   │   │
│  │  • More greenside spin and control             │   │
│  │  • Similar distance at lower price             │   │
│  │                                                 │   │
│  │  Performance Breakdown:                        │   │
│  │  Swing Speed   ████████░░ 90%                  │   │
│  │  Performance   █████████░ 95%                  │   │
│  │  Preferences   ████████░░ 88%                  │   │
│  │  Conditions    ███████░░░ 85%                  │   │
│  │                                                 │   │
│  │  Available in: [White] [Yellow]                │   │
│  │                                                 │   │
│  │  [Compare] [View Full Details] [Where to Buy] │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Other Great Matches                                   │
│  ────────────────────                                  │
│                                                         │
│  [Ball Card]    [Ball Card]    [Ball Card]    [Ball Card]│
│  88% Match      85% Match      82% Match      80% Match│
│                                                         │
│  [Compare Selected Balls]                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Alternative Options                                   │
│  ────────────────────                                  │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │ 💰 Best Value   │  │ 🔝 Step Up      │            │
│  ├─────────────────┤  ├─────────────────┤            │
│  │ Cut Blue        │  │ Titleist Pro V1 │            │
│  │ $24.99          │  │ $54.99          │            │
│  │ 85% Match       │  │ 94% Match       │            │
│  │                 │  │                 │            │
│  │ Similar perf,   │  │ Even better     │            │
│  │ lower price     │  │ performance     │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  (If temperature = Mixed)                              │
│                                                         │
│  Seasonal Recommendations                              │
│  ─────────────────────────                             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │ ☀️ Warm Weather │  │ ❄️ Cold Weather │            │
│  ├─────────────────┤  ├─────────────────┤            │
│  │ Titleist AVX    │  │ Bridgestone     │            │
│  │                 │  │ Tour B X        │            │
│  │ Optimized for   │  │ Maintains feel  │            │
│  │ 70°F+           │  │ below 50°F      │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘

Key Features:
- Hero card for #1 recommendation on dark surface (#0F172A) — visually
  distinct from the white cards below
- "Best Match" badge (green #16A34A fill, white text) in top-left corner
- Match percentage shown as large bold number with thin circular ring
  (Apple Watch activity ring style), colored by match tier
- Clear match percentage with tier color coding
- Detailed explanation personalized to user
- Performance breakdown visualization
- Secondary recommendations in grid (on white background)
- Alternatives section (value, premium)
- Seasonal recommendations if applicable
- Multiple CTAs (save, share, compare)
- [Select balls to compare] toggle at top of secondary grid

Responsive:
Mobile: Stack all cards vertically
Tablet: 2-column grid for secondary matches
Desktop: 4-column grid, wider top recommendation
```

### 4.6 Ball Comparison Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Compare Balls            [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Compare Golf Balls                                    │
│  ───────────────────                                   │
│                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────┐  │
│  │ [Ball Image]  │  │ [Ball Image]  │  │ [+ Add]   │  │
│  │ Pro V1        │  │ Chrome Soft   │  │ Ball      │  │
│  │ Titleist      │  │ Callaway      │  │           │  │
│  │ [Remove]      │  │ [Remove]      │  │           │  │
│  └───────────────┘  └───────────────┘  └───────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Comparison Table                                      │
│                                                         │
│  ┌─────────────────┬───────────────┬───────────────┐  │
│  │ Feature         │ Pro V1        │ Chrome Soft   │  │
│  ├─────────────────┼───────────────┼───────────────┤  │
│  │ Price/Dozen     │ $54.99        │ $49.99        │  │
│  │ Compression     │ 90            │ 75            │  │
│  │ Construction    │ 3-piece       │ 3-piece       │  │
│  │ Cover           │ Urethane      │ Urethane      │  │
│  │ Feel            │ Soft          │ Very Soft     │  │
│  │ Driver Spin     │ Low           │ Low           │  │
│  │ Iron Spin       │ Mid           │ Mid           │  │
│  │ Wedge Spin      │ High          │ High          │  │
│  │ Launch          │ Mid           │ Mid           │  │
│  │ Durability      │ 4/5           │ 4/5           │  │
│  │ Colors          │ White, Yellow │ White, Yellow │  │
│  │ Target Handicap │ 0-20          │ 0-20          │  │
│  └─────────────────┴───────────────┴───────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Performance Comparison                                │
│                                                         │
│  [Spin Profile Radar Chart]                            │
│                                                         │
│  Shows overlaid spin profiles for all selected balls   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Who Should Choose Which?                              │
│                                                         │
│  Pro V1:                                               │
│  Best for players with swing speeds 150+ mph who       │
│  want firmer feel and maximum control.                 │
│                                                         │
│  Chrome Soft:                                          │
│  Best for players wanting softest feel with tour       │
│  performance, ideal for 135-160 mph swing speeds.      │
│                                                         │
└─────────────────────────────────────────────────────────┘

Features:
- Compare 2-4 balls side-by-side
- Add/remove balls dynamically
- Search to add balls
- Highlight differences: rows where values differ across balls get a
  subtle background tint (#F0FDF4, green-50) for instant scannability
- Visual comparison (charts)
- Personalized recommendations
- Print/share comparison
```

### 4.7 Browse All Balls Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Browse Balls             [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Browse All Golf Balls                                 │
│  ──────────────────────                                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Search: "Search by name or brand..."]          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Brand ▾] [Price ▾] [Compression ▾]            │   │
│  │ [Construction ▾] [Color ▾]  [Reset]            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Active: [Srixon ×] [3-piece ×]    ← removable pills  │
│                                                         │
│  Sort By: [Best Match ▾]          Showing 24 of 52     │
│                                                         │
│  [Select balls to compare]  ← toggle for compare mode  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │      │ │      │ │      │ │      │                  │
│  │ Ball │ │ Ball │ │ Ball │ │ Ball │                  │
│  │ Card │ │ Card │ │ Card │ │ Card │                  │
│  │      │ │      │ │      │ │      │                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │      │ │      │ │      │ │      │                  │
│  │ Ball │ │ Ball │ │ Ball │ │ Ball │                  │
│  │ Card │ │ Card │ │ Card │ │ Card │                  │
│  │      │ │      │ │      │ │      │                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                         │
│  [Load More]                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

Filter Bar Behavior:
- Each filter is a dropdown trigger that opens a popover:
  - Brand: checkboxes (Titleist, Callaway, TaylorMade, Bridgestone, Srixon, etc.)
  - Price: range slider ($20-$60)
  - Compression: range slider (40-120)
  - Construction: checkboxes (2-piece, 3-piece, 4-piece, 5-piece)
  - Color: checkboxes (White, Yellow, Colored)
- Active filters shown as removable pill badges below the filter bar
- "Reset" clears all filters
- Full grid width for cards (no sidebar eating horizontal space)

Mobile: Filter triggers become a single "Filters" button that opens a
bottom sheet with all filter options stacked vertically
Tablet/Desktop: Horizontal filter bar as shown

Features:
- Real-time search
- Multi-select filters via dropdown popovers
- Range sliders for price/compression
- URL updates with filters (shareable filtered view)
- Responsive grid (1 col mobile, 2 tablet, 4 desktop)
- Infinite scroll or pagination
- Filter count badges on dropdown triggers
- Clear all filters
```

### 4.8 Individual Ball Details Page

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Ball Details             [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ← Back to Browse                                      │
│                                                         │
│  ┌───────────────┬─────────────────────────────────┐   │
│  │               │                                 │   │
│  │   [Ball       │  Titleist Pro V1                │   │
│  │    Image      │  Titleist                       │   │
│  │   Gallery]    │  $54.99 per dozen              │   │
│  │               │                                 │   │
│  │   [Photo 1]   │  ⭐⭐⭐⭐⭐ 4.8/5 (234 tried)   │   │
│  │   [Photo 2]   │                                 │   │
│  │   [Photo 3]   │  Available Colors:              │   │
│  │               │  [White] [Yellow]               │   │
│  │               │                                 │   │
│  │               │  [Add to Favorites]             │   │
│  │               │  [Compare] [Where to Buy]       │   │
│  │               │                                 │   │
│  └───────────────┴─────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Description                                           │
│  ───────────                                           │
│                                                         │
│  The #1 ball in golf, delivering total performance    │
│  with optimal flight and consistent spin.             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Specifications                                        │
│  ───────────────                                       │
│                                                         │
│  ┌──────────────────┬──────────────────────────────┐  │
│  │ Construction     │ 3-piece                      │  │
│  │ Cover Material   │ Cast Urethane                │  │
│  │ Compression      │ 90                           │  │
│  │ Feel             │ Soft                         │  │
│  │ Launch           │ Mid                          │  │
│  │ Durability       │ 4/5                          │  │
│  │ Target Handicap  │ 0-20                         │  │
│  └──────────────────┴──────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Spin Profile                                          │
│  ─────────────                                         │
│                                                         │
│  [Radar Chart Visualization]                           │
│                                                         │
│  • Driver Spin: Low                                    │
│  • Iron Spin: Mid                                      │
│  • Wedge Spin: High                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Who Should Play This Ball?                            │
│  ───────────────────────────                           │
│                                                         │
│  Ideal for golfers with:                               │
│  • Handicap: 0-20                                      │
│  • Swing speed: 150+ mph driver ball speed            │
│  • Priority: All-around tour performance              │
│  • Budget: Premium ($50+/dozen)                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Similar Balls                                         │
│  ──────────────                                        │
│                                                         │
│  [Ball Card] [Ball Card] [Ball Card] [Ball Card]      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  (If user is logged in and has tried this ball)       │
│                                                         │
│  Your Experience                                       │
│  ────────────────                                      │
│                                                         │
│  Rating: ⭐⭐⭐⭐⭐ 5/5                                 │
│  Rounds Played: 12                                     │
│  Notes: "Excellent all-around ball..."                │
│                                                         │
│  [Edit Review]                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘

Features:
- Image gallery with zoom
- Complete specifications
- Visual spin profile
- Personalized fit assessment
- Similar ball recommendations
- User reviews (if logged in and tried)
- Buy links to retailers
- Social sharing
```

### 4.9 User Account Pages

**Profile Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              My Account               [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Account Overview                                      │
│  ─────────────────                                     │
│                                                         │
│  Welcome back, John! 👋                                │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │ Recommendations │  │ Balls Tried     │            │
│  │      12         │  │       8         │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Quick Actions                                         │
│  ──────────────                                        │
│                                                         │
│  [Retake Quiz] [My Favorites] [Tried Balls] [Settings] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Recent Recommendations                                │
│  ──────────────────────                                │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Jan 15, 2026                        [View Results]│ │
│  │ Top Pick: Titleist Tour Speed                     │ │
│  │ Match: 92%                                        │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Dec 1, 2025                         [View Results]│ │
│  │ Top Pick: Callaway Chrome Soft                    │ │
│  │ Match: 88%                                        │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [View All Recommendations]                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  My Profiles                                           │
│  ────────────                                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ⭐ Summer Setup (Default)               [Edit]    │ │
│  │ Driver Speed: 155 mph                             │ │
│  │ Temperature: Warm                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Winter Setup                            [Edit]    │ │
│  │ Driver Speed: 150 mph                             │ │
│  │ Temperature: Cold                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [+ Create New Profile]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Favorites Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              My Favorites             [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  My Shortlist                                          │
│  ──────────────────                                    │
│                                                         │
│  Balls you've saved for later                          │
│                                                         │
│  [Ball Card] [Ball Card] [Ball Card]                   │
│  [❤️ Remove] [❤️ Remove] [❤️ Remove]                   │
│                                                         │
│  [Compare All] [Take Quiz to Find More]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Tried Balls Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              Balls I've Tried         [Account]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Balls I've Tried                                      │
│  ─────────────────                                     │
│                                                         │
│  Track your experience with different balls            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ [Ball Image] Titleist Pro V1                      │ │
│  │                                                   │ │
│  │ Rating: ⭐⭐⭐⭐⭐ 5/5                             │ │
│  │ Rounds Played: 12                                 │ │
│  │ Would Recommend: Yes                              │ │
│  │                                                   │ │
│  │ Distance: As Expected                             │ │
│  │ Spin: As Expected                                 │ │
│  │ Feel: As Expected                                 │ │
│  │                                                   │ │
│  │ Notes: "Excellent all-around ball. Great feel..." │ │
│  │                                                   │ │
│  │ [Edit Review] [Remove]                            │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [+ Add Ball You've Tried]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.10 Authentication Pages

**Login Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Welcome Back                           │
│                  ────────────                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  Email                                          │   │
│  │  [_____________________________]               │   │
│  │                                                 │   │
│  │  Password                                       │   │
│  │  [_____________________________]               │   │
│  │                                 Forgot?         │   │
│  │                                                 │   │
│  │  □ Remember me                                  │   │
│  │                                                 │   │
│  │  [Login]                                        │   │
│  │                                                 │   │
│  │  ─────────── or ───────────                    │   │
│  │                                                 │   │
│  │  [Continue with Google]                         │   │
│  │                                                 │   │
│  │  Don't have an account? Sign up                │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Register Page:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Create Account                         │
│                  ──────────────                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  Name                                           │   │
│  │  [_____________________________]               │   │
│  │                                                 │   │
│  │  Email                                          │   │
│  │  [_____________________________]               │   │
│  │                                                 │   │
│  │  Password                                       │   │
│  │  [_____________________________]               │   │
│  │  Must be at least 8 characters                  │   │
│  │                                                 │   │
│  │  □ I agree to Terms of Service and Privacy     │   │
│  │    Policy                                       │   │
│  │                                                 │   │
│  │  [Create Account]                               │   │
│  │                                                 │   │
│  │  ─────────── or ───────────                    │   │
│  │                                                 │   │
│  │  [Continue with Google]                         │   │
│  │                                                 │   │
│  │  Already have an account? Login                │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. User Flows

### 5.1 Guest User - Complete Quiz Flow

```
Homepage
   │
   ├──> Click "Find My Ball"
   │
   ├──> Quiz Landing Page
   │       │
   │       ├──> Click "Start Quiz"
   │       │
   │       ├──> Step 1: Background
   │       │      - Select current ball (optional)
   │       │      - Select handicap
   │       │      - Select rounds/year
   │       │      - Click "Next"
   │       │
   │       ├──> Step 2: Priorities
   │       │      - Select priority type
   │       │      - Select most important
   │       │      - Click "Next"
   │       │
   │       ├──> Step 3: Flight/Spin
   │       │      - Select trajectory
   │       │      - Select current ball spin
   │       │      - Select short game need
   │       │      - Click "Next"
   │       │
   │       ├──> Step 4: Feel/Preferences
   │       │      - Select feel
   │       │      - Select color
   │       │      - Select budget
   │       │      - Select durability
   │       │      - Click "Next"
   │       │
   │       ├──> Step 5: Conditions
   │       │      - Select temperature
   │       │      - Select improvement areas
   │       │      - Click "Next"
   │       │
   │       ├──> Step 6: Metrics
   │       │      - Set driver ball speed
   │       │      - Set 8-iron distance
   │       │      - Click "Next"
   │       │
   │       ├──> Step 7: Review
   │       │      - Review all answers
   │       │      - Edit if needed
   │       │      - Click "Get Recommendations"
   │       │
   │       └──> [Loading state: "Analyzing your game..."]
   │
   ├──> Results Page
   │       │
   │       ├──> View top 5 recommendations
   │       │      - See match percentages
   │       │      - Read explanations
   │       │      - View alternatives
   │       │
   │       ├──> Optional Actions:
   │       │      ├──> Generate shareable link
   │       │      ├──> Email results
   │       │      ├──> Compare balls
   │       │      ├──> View ball details
   │       │      └──> Retake quiz
   │       │
   │       └──> Prompt: "Create account to save results?"
   │              ├──> Yes: Go to register
   │              └──> No: Continue as guest
   │
   └──> Continue browsing or exit

Auto-save behavior:
- Quiz answers saved to localStorage
- If user refreshes, resume where they left off
- Results link expires after 30 days
```

### 5.2 Registered User - Using Saved Profile

```
Homepage
   │
   ├──> Login
   │
   ├──> Dashboard
   │       │
   │       ├──> View saved profiles
   │       │      - Summer Setup
   │       │      - Winter Setup
   │       │
   │       ├──> Click "Retake Quiz" from Summer profile
   │       │
   │       └──> Quiz auto-populated with saved data
   │
   ├──> Quiz Flow
   │       │
   │       ├──> Pre-filled with profile data
   │       │      - User can modify any field
   │       │      - Modifications don't overwrite profile
   │       │        (unless user chooses "Update Profile")
   │       │
   │       └──> Submit quiz
   │
   ├──> Results Page
   │       │
   │       ├──> Recommendations automatically saved to account
   │       │
   │       ├──> User actions:
   │       │      ├──> Add balls to favorites
   │       │      ├──> Mark balls as "tried"
   │       │      ├──> Add notes/ratings
   │       │      └──> Share results
   │       │
   │       └──> Recommendation saved to history
   │
   └──> Dashboard shows new recommendation in history
```

### 5.3 Ball Research & Comparison Flow

```
Homepage
   │
   ├──> Click "Browse All Balls"
   │
   ├──> Browse Page
   │       │
   │       ├──> Apply filters:
   │       │      - Brand: Titleist
   │       │      - Price: $40-$50
   │       │      - Compression: 80-95
   │       │
   │       ├──> Results update in real-time
   │       │
   │       ├──> Click ball card for details
   │       │
   │       └──> Ball Details Page
   │              │
   │              ├──> View full specs
   │              ├──> See spin profile chart
   │              ├──> Read who should play it
   │              ├──> Click "Compare"
   │              │
   │              └──> Comparison Page
   │                     │
   │                     ├──> Add 2nd ball to compare
   │                     ├──> Add 3rd ball (optional)
   │                     ├──> View side-by-side table
   │                     ├──> See visual comparisons
   │                     │
   │                     └──> Make decision:
   │                            ├──> Add to favorites
   │                            ├──> Mark as tried
   │                            └──> Click "Where to Buy"
   │
   └──> External retailer site opens
```

### 5.4 Account Management Flow

```
Logged In User
   │
   ├──> Click Account Icon
   │
   ├──> Dropdown Menu
   │       ├──> Dashboard
   │       ├──> My Favorites
   │       ├──> Balls I've Tried
   │       ├──> Settings
   │       └──> Logout
   │
   ├──> Settings Page
   │       │
   │       ├──> Profile Information
   │       │      - Update name, email
   │       │      - Update handicap
   │       │      - Update home course
   │       │
   │       ├──> User Profiles
   │       │      - Create new profile
   │       │      - Edit existing
   │       │      - Set default profile
   │       │      - Delete profile
   │       │
   │       ├──> Privacy
   │       │      - Marketing emails opt-in/out
   │       │      - Analytics opt-in/out
   │       │
   │       ├──> Data
   │       │      - Export my data (GDPR)
   │       │      - Delete account
   │       │
   │       └──> Save changes
   │
   └──> Success message → Back to dashboard
```

---

## 6. Responsive Behavior

### 6.1 Breakpoints

```
Mobile:    0px - 639px    (sm)
Tablet:    640px - 1023px (md)
Desktop:   1024px+        (lg, xl, 2xl)

Container max-widths:
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### 6.2 Layout Adjustments

**Mobile (< 640px):**
- Single column layouts
- Stacked navigation
- Hamburger menu
- Full-width cards
- Larger touch targets (min 44x44px)
- Bottom sheet modals
- Sticky header on scroll

**Tablet (640px - 1023px):**
- 2-column grids
- Top navigation with collapsible elements
- Medium card sizes
- Standard modals
- Hover states enabled

**Desktop (1024px+):**
- 3-4 column grids
- Full horizontal navigation
- Compact card sizes
- Rich hover interactions
- Multi-column forms
- Large modals

### 6.3 Component Responsiveness

**Quiz Steps:**
```
Mobile:  Full-width questions, stacked vertically
Tablet:  2-column option layouts where appropriate
Desktop: Wider container, side-by-side for radio groups
```

**Ball Cards:**
```
Mobile:  1 column
Tablet:  2 columns
Desktop: 4 columns (3 in narrow containers)
```

**Comparison Table:**
```
Mobile:  Horizontal scroll, sticky first column
Tablet:  Fit 2 balls side-by-side
Desktop: Fit 3-4 balls comfortably
```

**Navigation:**
```
Mobile:  Bottom tab bar (4 tabs MVP, 5 Phase 2) + hamburger menu
Tablet:  Top navigation with dropdowns
Desktop: Full horizontal navigation
```

---

## 7. Interactive States & Animations

### 7.1 Button States

```
Default:
- Background: primary color
- Shadow: subtle
- Cursor: pointer

Hover:
- Background: darker shade
- Shadow: elevated
- Transform: translateY(-1px)
- Transition: 150ms ease

Active/Pressed:
- Transform: translateY(0)
- Shadow: reduced

Disabled:
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

Loading:
- Show spinner
- Disable interaction
- Opacity: 0.7
- Text: "Loading..."
```

### 7.2 Card Interactions

```
Default:
- Background: white
- Border: light gray
- Shadow: md

Hover:
- Shadow: lg
- Transform: translateY(-2px)
- Border: primary color (subtle)
- Transition: 200ms ease

Selected (for comparison):
- Border: primary color (bold)
- Background: primary tint (5%)
- Checkmark visible
```

### 7.3 Form Validation States

```
Default:
- Border: gray
- Label: default color

Focus:
- Border: blue (2px)
- Outline: blue glow
- Label: blue

Valid (after blur):
- Border: green
- Icon: checkmark

Error:
- Border: red
- Icon: exclamation
- Error message below field
- Shake animation on submit

Disabled:
- Background: light gray
- Cursor: not-allowed
- Opacity: 0.6
```

### 7.4 Loading States

```
Page Load:
- Skeleton screens for content
- Shimmer animation
- No spinners unless quick action

Quiz Submit:
- Button shows spinner
- Text: "Analyzing your game..."
- Disable back navigation
- Progress bar (fake for UX)

Ball Card Load:
- Image placeholder with shimmer
- Gray boxes for text
- Fade in when loaded
```

### 7.5 Transitions & Animations

```
Page Transitions:
- Fade in: 300ms
- Slide in from right (quiz steps): 250ms

Quiz Step Changes:
- Current step: slide out left
- Next step: slide in from right
- Progress bar: animate width

Match Percentage Reveal:
- Count up from 0 to actual percentage
- Duration: 600ms (snappy, not labored)
- Easing: ease-out-cubic

Results Cards:
- #1 recommendation card animates in FIRST and alone (200ms fade+slide)
- Brief 150ms pause after #1 card lands
- Then remaining 4 cards stagger in (50ms delay each)
- Each card: slide in from bottom + fade
- Total duration: 400ms for secondary cards
- This creates a narrative beat: "Here's your best match...
  and here are the alternatives."
```

---

## 8. Accessibility (WCAG 2.1 AA)

### 8.1 Color Contrast

```
Text Contrast Ratios:
- Normal text (16px+): 4.5:1 minimum
- Large text (24px+):  3:1 minimum
- UI components:       3:1 minimum

Verified Combinations:
✓ Charcoal (#1F2937) on White (#FFFFFF) - 16.1:1
✓ Gray (#6B7280) on White (#FFFFFF) - 7.0:1
✓ Golf Green (#16A34A) on White (#FFFFFF) - 3.5:1 (large text / UI only)
✓ White text on Dark Surface (#0F172A) - 17.4:1
✓ Golf Green (#16A34A) on Dark Surface (#0F172A) - 3.8:1 (large text / UI only)
✓ Charcoal (#1F2937) on Cool White (#F8FAFC) - 14.8:1

Note: Primary green (#16A34A) meets 3:1 for large text and UI components
but falls short of 4.5:1 for normal text on white. For small green text
on white backgrounds, use Forest (#15803D) which achieves 4.8:1.
```

### 8.2 Keyboard Navigation

```
Tab Order:
- Logical flow top to bottom, left to right
- Skip to main content link (hidden, keyboard accessible)
- All interactive elements focusable

Focus Indicators:
- Visible outline: 2px blue
- Offset: 2px
- Never remove outline without replacement

Keyboard Shortcuts:
- Tab: Next element
- Shift+Tab: Previous element
- Enter/Space: Activate button
- Escape: Close modal/dropdown
- Arrow keys: Navigate radio/select groups
```

### 8.3 Screen Reader Support

```
Semantic HTML:
- Proper heading hierarchy (h1 > h2 > h3)
- <nav> for navigation
- <main> for main content
- <article> for ball cards
- <form> for all forms

ARIA Labels:
- aria-label on icon-only buttons
- aria-describedby for form hints
- aria-live for dynamic updates
- aria-current for active nav items

Alt Text:
- Descriptive for ball images
- Empty alt for decorative images
- Context in alt text, not just "image of..."

Form Labels:
- Every input has associated <label>
- Placeholder not used as label
- Error messages linked via aria-describedby
```

### 8.4 Additional Accessibility Features

```
Text:
- Minimum 16px font size
- Line height 1.5 minimum
- Max line length 80 characters
- Text resizes up to 200% without breaking

Images:
- Lazy loading for performance
- Meaningful alt text
- No text in images

Forms:
- Clear error messages
- Field instructions above/beside input
- Required fields marked visually and programmatically
- Success confirmation visible and announced

Modals:
- Focus trap when open
- Return focus on close
- Close on Escape key
- Background content inert

Links:
- Underlined in body text
- Descriptive text (not "click here")
- External links indicated
- Open in new tab announced
```

---

## 9. Form Validation Rules

### 9.1 Quiz Form Validation

**Step 1: Background**
```
Current Ball:
- Optional field
- If brand selected, model is required

Handicap:
- Required
- One option must be selected

Rounds per Year:
- Required
- One option must be selected
```

**Step 2: Priorities**
```
Priority Type:
- Required
- Default: "Performance & Preferences"

Most Important:
- Required
- No default selection
```

**Step 3: Flight/Spin**
```
Approach Trajectory:
- Required
- Default: "Mid"

Current Ball Spin:
- Required if current ball is specified
- Optional if no current ball

Short Game Spin:
- Required
- Default: "Not sure"
```

**Step 4: Feel/Preferences**
```
Preferred Feel:
- Required
- Default: "Soft"

Color Preference:
- Required
- Default: "White only"

Budget Range:
- Required
- Default: "Premium"

Durability:
- Required
- Default: "Multiple rounds"
```

**Step 5: Conditions**
```
Temperature:
- Required
- Default: "Moderate"

Improvement Areas:
- Optional (multi-select)
- At least 0 selections
```

**Step 6: Metrics**
```
Driver Ball Speed:
- Required
- Min: 80, Max: 250
- Default: 145
- Step: 5
- Validation: Integer only

8-Iron Distance:
- Required
- Min: 100, Max: 200
- Default: 145
- Step: 5
- Validation: Integer only
```

### 9.2 Authentication Form Validation

**Login Form**
```
Email:
- Required
- Valid email format (RFC 5322)
- Error: "Please enter a valid email address"

Password:
- Required
- Min length: 8 characters
- Error: "Password is required"
- No strength validation on login
```

**Registration Form**
```
Name:
- Required
- Min: 2 characters
- Max: 50 characters
- Pattern: Letters, spaces, hyphens only
- Error: "Please enter your full name"

Email:
- Required
- Valid email format
- Unique (backend validation)
- Error: "This email is already registered"

Password:
- Required
- Min length: 8 characters
- Must contain: 1 uppercase, 1 lowercase, 1 number
- Error: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"

Confirm Password:
- Required
- Must match password field
- Error: "Passwords do not match"

Terms Agreement:
- Required (checkbox)
- Error: "You must agree to the Terms of Service"
```

### 9.3 Ball Review Form

```
Rating:
- Required
- Range: 1-5 stars
- Default: unselected

Rounds Played:
- Optional
- Type: Integer
- Min: 1, Max: 999

Notes:
- Optional
- Max length: 500 characters
- Character counter shown

Would Recommend:
- Required
- Boolean (Yes/No radio)

Performance vs Expected:
- Optional (all three fields)
- Options: Better, As Expected, Worse
```

### 9.4 Validation Timing

```
On Input (as user types):
- Character count for limited fields
- Format validation for email (visual indicator)
- No error messages yet

On Blur (field loses focus):
- Run all validations
- Show errors if invalid
- Show success checkmark if valid

On Submit:
- Validate all fields
- Focus first invalid field
- Prevent submission if errors
- Show summary of errors at top (if multiple)
```

---

## 10. Performance Optimization Guidelines

### 10.1 Image Optimization

```
Ball Images:
- Format: WebP with PNG fallback
- Sizes: 300x300 (card), 600x600 (detail), 150x150 (thumbnail)
- Loading: Lazy load all below fold
- Compression: 80% quality
- CDN: All images served from CDN

Background Images:
- Format: WebP
- Multiple sizes for responsive
- Blur placeholder while loading
```

### 10.2 Code Splitting

```
Route-based Splitting:
- Each page is separate chunk
- Shared components in common chunk
- Quiz steps dynamically imported

Component Splitting:
- Heavy components (charts) lazy loaded
- Modal content loaded on demand
- Comparison tool separate chunk
```

### 10.3 Data Fetching

```
Static Data (balls):
- ISR (Incremental Static Regeneration)
- Revalidate every hour
- Client-side cache: 5 minutes

User Data:
- Client-side fetch with React Query
- Cache: 5 minutes
- Stale while revalidate

Quiz Results:
- Server-side generate
- Client-side cache session
- No refetch unless retake
```

---

## 11. Error States & Edge Cases

### 11.1 Error Messages

**Network Errors:**
```
┌─────────────────────────────────────┐
│  ⚠️  Connection Error               │
│                                     │
│  We couldn't connect to our         │
│  servers. Please check your         │
│  internet connection and try again. │
│                                     │
│  [Try Again]                        │
└─────────────────────────────────────┘
```

**API Errors:**
```
┌─────────────────────────────────────┐
│  ⚠️  Something went wrong           │
│                                     │
│  We encountered an error processing │
│  your request. Please try again.    │
│                                     │
│  [Try Again] [Contact Support]      │
└─────────────────────────────────────┘
```

**404 - Not Found:**
```
┌─────────────────────────────────────┐
│     Looks Like That One Went OB     │
│                                     │
│  The ball you're looking for isn't  │
│  in our catalog — it may have been  │
│  discontinued or the link might     │
│  be wrong.                          │
│                                     │
│  [Browse All Balls] [Go Home]       │
└─────────────────────────────────────┘
```

**Empty States:**
```
No Recommendations:
┌─────────────────────────────────────┐
│  No recommendations yet             │
│                                     │
│  Take our quiz to get personalized  │
│  ball recommendations.              │
│                                     │
│  [Start Quiz]                       │
└─────────────────────────────────────┘

No Favorites:
┌─────────────────────────────────────┐
│  Your shortlist is empty            │
│                                     │
│  Save balls you're interested in    │
│  to easily find them later.         │
│                                     │
│  [Explore the Catalog]              │
└─────────────────────────────────────┘

No Tried Balls:
┌─────────────────────────────────────┐
│  You haven't reviewed any balls     │
│                                     │
│  Track your experience with         │
│  different balls to help remember   │
│  what works for your game.          │
│                                     │
│  [Browse Balls]                     │
└─────────────────────────────────────┘
```

### 11.2 Edge Case Handling

**Quiz - No balls match criteria:**
```
Show message:
"We couldn't find balls that match all your criteria.
Here are our closest matches with some trade-offs:"

Still show top 5, with notes on what doesn't match
```

**Comparison - Only 1 ball selected:**
```
Show message:
"Add at least one more ball to compare"

Disable "Compare" button until 2+ selected
```

**Results - Session expired (>30 days):**
```
Show message:
"This recommendation has expired.
Retake the quiz for fresh results."

[Retake Quiz]
```

**Browser - LocalStorage disabled:**
```
Show warning:
"Your browser settings prevent saving quiz progress.
Consider enabling cookies for the best experience."

Allow quiz completion, but don't attempt auto-save
```

---

## 12. Mobile-Specific Considerations

### 12.1 Touch Interactions

```
Touch Targets:
- Minimum size: 44x44px
- Spacing between targets: 8px minimum
- No hover states (use :active instead)

Gestures:
- Swipe left/right for quiz navigation
- Pull to refresh on lists
- Tap to expand/collapse sections
- Long press for contextual menu (tried balls)

Input Optimization:
- Numeric keyboard for number inputs
- Email keyboard for email inputs
- No autocomplete on password
- Autocapitalize names only
```

### 12.2 Mobile Navigation

```
Bottom Tab Bar (Primary Navigation — MVP):
┌──────┬──────┬──────┬──────┐
│ Home │  Fit │Browse│  Me  │
└──────┴──────┴──────┴──────┘

"Fit" replaces "Quiz" — shorter label, sounds like the core value
proposition (fitting, not quizzing), differentiates from survey apps.

Phase 2 (after auth + favorites ship):
┌─────┬─────┬─────┬─────┬─────┐
│ Home│ Fit │Browse│Faves│ Me  │
└─────┴─────┴─────┴─────┴─────┘

Always visible
Icons + labels
Active state highlighted
Safe area insets respected
```

### 12.3 Mobile Performance

```
- Reduce animations on low-end devices
- Lazy load images aggressively
- Limit concurrent requests
- Use smaller image sizes
- Minimize JS bundle
- Prefer native select over custom dropdowns
- Progressive enhancement approach
```

---

## 13. Implementation Priorities

### 13.1 MVP Must-Haves (Week 1-6)

**Week 1-2: Foundation**
- [ ] Homepage with hero
- [ ] Basic navigation
- [ ] Design system setup (Tailwind + shadcn)
- [ ] Responsive layout structure

**Week 3-4: Core Quiz**
- [ ] 7-step quiz flow
- [ ] Form validation
- [ ] Progress indicator
- [ ] Review page
- [ ] LocalStorage auto-save

**Week 5-6: Results & Ball Display**
- [ ] Results page with top 5
- [ ] Ball cards component
- [ ] Match percentage display
- [ ] Basic filtering/search
- [ ] Individual ball details page

### 13.2 Phase 2 Features (Week 7-9)

- [ ] User authentication
- [ ] Account dashboard
- [ ] Favorites system
- [ ] Tried balls tracking
- [ ] Shareable links
- [ ] Email results

### 13.3 Polish & Enhancement (Week 10+)

- [ ] Comparison tool
- [ ] Advanced filtering
- [ ] Spin chart visualizations
- [ ] Seasonal recommendations
- [ ] Step-up/step-down alternatives
- [ ] Performance optimizations
- [ ] A11y audit & fixes

---

## 14. Design Deliverables Checklist

For handoff to Opus 4.6:

**Documentation:**
- ✅ Complete design system specification
- ✅ Color palette with hex codes
- ✅ Typography scale
- ✅ Component library specifications
- ✅ Responsive breakpoints
- ✅ Spacing system

**Wireframes:**
- ✅ All page layouts (10+ pages)
- ✅ User flows (4 primary flows)
- ✅ Component states
- ✅ Error states
- ✅ Empty states
- ✅ Loading states

**Interactive Specifications:**
- ✅ Button states & transitions
- ✅ Form validation rules
- ✅ Animation specifications
- ✅ Touch interactions
- ✅ Keyboard navigation

**Accessibility:**
- ✅ WCAG 2.1 AA compliance guidelines
- ✅ Color contrast ratios
- ✅ Screen reader considerations
- ✅ Keyboard navigation map

**Content:**
- ✅ Microcopy (error messages, CTAs, etc.)
- ✅ Empty state messaging
- ✅ Loading state text
- ✅ Success confirmations

---

## 15. Open Design Questions

### 15.1 Pending Decisions

1. **Ball Images Source**
   - Question: Where do we get ball product images?
   - Options: Manufacturer websites, stock photos, custom photography
   - Recommendation: Start with manufacturer sites, attribute properly

2. **Data Visualization Library**
   - Question: Which charting library for spin profiles?
   - Options: Recharts, Chart.js, D3.js
   - Recommendation: Recharts (React-native, good defaults)

3. **Icon System**
   - Question: Custom icons or icon library?
   - Options: Heroicons, Lucide, custom SVG
   - Recommendation: Lucide (modern, comprehensive)

4. **Email Templates**
   - Question: Design for recommendation email?
   - Recommendation: Use React Email for templates

---

## 16. Next Steps for Development

**Immediate Actions:**
1. Review all 4 documents (PRD, Technical Spec, Database Schema, UI/UX)
2. Set up Next.js project with Tailwind + shadcn/ui
3. Implement design system (colors, typography, components)
4. Build component library in Storybook (optional but helpful)
5. Start with homepage and quiz flow
6. Iteratively build each page following wireframes

**Success Criteria:**
- Design system fully implemented in code
- All pages match wireframe specifications
- WCAG 2.1 AA compliance verified
- Mobile-first responsive design working
- All interactive states implemented
- Form validation working as specified

---

## Document Control

**Created by:** Design Team  
**Last Updated:** February 12, 2026  
**Status:** Revised — Ready for Development  
**Distribution:** Development Team, Stakeholders

**Change Log:**
- v2.0 (Feb 12, 2026): Design review updates — modernized color palette (vibrant greens, dark surfaces), added Plus Jakarta Sans display font, redesigned hero to dark split layout, replaced quiz stepper with segmented progress bar, updated ball cards to use pill badges, added dark surface treatment for #1 recommendation, changed match tier colors (teal replaces blue for "good"), replaced browse sidebar with horizontal filter bar, refined animation timings, updated microcopy throughout, simplified mobile nav to 4 tabs for MVP, bumped border radius on cards, improved shadow depth model, added comparison row highlighting, golf-flavored 404 page
- v1.0 (Feb 12, 2026): Initial UI/UX design document - complete specification ready for Opus 4.6

---

**All 4 specification documents now complete and ready for development handoff to Opus 4.6!** 🎉

**v2.0 Design Review Summary:**
All changes target the "modern golf-tech" aesthetic: vibrant greens over earthy tones, dark hero surfaces, Plus Jakarta Sans for brand presence, streamlined quiz navigation, cleaner card layouts with pill badges, horizontal filter bar for browse, snappier animations, and golf-flavored personality in microcopy.
