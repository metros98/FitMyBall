# Compare Page Components

This directory contains all components for the Ball Comparison feature.

## Components Overview

### 1. `ball-search-combobox.tsx`
Searchable dropdown for adding balls to comparison.

**Features:**
- Text input with 300ms debounced search
- Dropdown showing results with ball name, manufacturer, compression, and price
- "Add" button per result (disabled if already selected or comparison is full)
- Calls `useCompare().addBall()` on selection
- Maximum 4 balls can be compared

**Usage:**
```tsx
import { BallSearchCombobox } from "@/components/compare/ball-search-combobox";

<BallSearchCombobox />
```

### 2. `comparison-table.tsx`
Responsive table displaying side-by-side ball specifications.

**Features:**
- First column (spec labels) is sticky with `sticky left-0 z-10 bg-white`
- Ball header row includes image, name, manufacturer, and remove button
- Rows where values differ are highlighted with `bg-green-50`
- Rows: Price, Compression, Construction, Cover, Feel, Driver/Iron/Wedge Spin, Launch, Durability, Skill Level, Colors, Temperature
- Horizontally scrollable with `overflow-x-auto`

**Usage:**
```tsx
import { ComparisonTable } from "@/components/compare/comparison-table";

<ComparisonTable balls={balls} />
```

### 3. `spin-radar-chart.tsx`
Recharts radar chart visualizing spin profiles across all clubs.

**Features:**
- Uses Recharts `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`
- Three axes: Driver Spin, Iron Spin, Wedge Spin
- SpinLevel mapping: `LOW=1`, `MID=2`, `HIGH=3`
- One radar line per ball with distinct colors: `["#2563eb", "#dc2626", "#16a34a", "#9333ea"]`
- Responsive container for proper sizing
- Includes legend explaining spin levels

**Usage:**
```tsx
import { SpinRadarChart } from "@/components/compare/spin-radar-chart";

<SpinRadarChart balls={balls} />
```

### 4. `guidance-section.tsx`
Cards displaying personalized guidance for each ball.

**Features:**
- Card per ball with "Best for:" bullets
- Shows standout specs based on comparison
- Uses `generateGuidance()` utility
- Responsive grid layout

**Usage:**
```tsx
import { GuidanceSection } from "@/components/compare/guidance-section";

<GuidanceSection balls={balls} />
```

### 5. `compare-actions.tsx`
Action buttons for print and share functionality.

**Features:**
- Print button: triggers `window.print()`
- Share button: copies URL to clipboard via `navigator.clipboard.writeText()`
- Shows toast notification on successful copy
- Visual feedback with checkmark when copied

**Usage:**
```tsx
import { CompareActions } from "@/components/compare/compare-actions";

<CompareActions />
```

### 6. Utility: `compare-guidance.ts`
Pure function that generates ball-specific guidance.

**Function:**
```typescript
generateGuidance(balls: Ball[]) → BallGuidance[]
```

**Logic:**
- Compares each ball vs the group
- Identifies: cheapest, most spin, softest, best durability, etc.
- Maps skill levels and attributes to readable guidance strings
- Returns `BallGuidance[]` with `ballId`, `ballName`, `bestFor[]`, `standoutSpecs[]`

## Page Implementation

The Compare Page route is implemented at `src/app/(main)/compare/page.tsx`.

### Key Features

1. **URL ↔ Context Sync (Bidirectional)**
   - Reads `?balls=id1,id2,...` from URL on mount
   - Syncs selected balls from context back to URL on changes
   - Preserves comparison state when sharing URLs

2. **States**
   - **Empty State** (< 2 balls): Shows search box with instructions
   - **Loading State**: Uses `loading.tsx` skeleton matching full page layout
   - **Error State**: Alert with error message and retry options
   - **Loaded State** (2-4 balls): Full comparison view

3. **Layout Structure**
   - Header with title and action buttons
   - Search combobox for adding more balls
   - Selected ball cards summary with "Clear All" button
   - Specifications comparison table
   - Spin profile radar chart
   - Guidance section with recommendations
   - Bottom action buttons

### Loading Skeleton

The loading skeleton (`loading.tsx`) matches the full page layout:
- Header skeleton with title and action buttons
- Search box skeleton
- Selected balls grid skeleton (4 cards)
- Table skeleton with header and 8 rows
- Circular chart skeleton (400x400)
- Guidance cards skeleton (4 cards)
- Bottom action buttons skeleton

## Dependencies

- **recharts** (v3.7.0+): For radar chart visualization
- **lucide-react**: For icons
- **sonner**: For toast notifications
- **@tanstack/react-query**: For data fetching
- **shadcn/ui**: Card, Button, Input, Badge components

## Context Integration

All components integrate with the existing `CompareProvider` context from `compare-context.tsx`:

```tsx
const { selectedBalls, addBall, removeBall, clearAll, isSelected, isFull, count } = useCompare();
```

## Styling Notes

- Uses Tailwind CSS with shadcn/ui design system
- Table uses sticky positioning for fixed first column
- Green highlighting (`bg-green-50`) indicates differing values
- Responsive design with mobile-first approach
- Print styles work with standard `window.print()` API
