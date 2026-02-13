# FitMyBall - Product Requirements Document (PRD)

**Version:** 1.1  
**Date:** February 12, 2026  
**Status:** Draft for Development

---

## 1. Executive Summary

### 1.1 Vision
Create an unbiased, comprehensive FitMyBall application that helps golfers of all skill levels find the optimal ball for their game based on performance data, preferences, and playing conditions. Unlike manufacturer-specific tools (Titleist, Bridgestone), this platform provides cross-brand recommendations with transparent reasoning.

### 1.2 Problem Statement
- Golfers struggle to choose from 100+ ball options across multiple manufacturers
- Manufacturer tools only recommend their own products, creating bias
- Most golfers don't understand how ball characteristics affect their game
- Temperature and playing conditions significantly impact ball performance but are rarely considered
- No single platform aggregates ball data across all major brands

### 1.3 Solution
A web-based ball selector that:
- Analyzes user swing data, preferences, and playing conditions
- Compares against a comprehensive multi-brand ball database
- Provides ranked recommendations with detailed explanations
- Offers seasonal/temperature-specific guidance
- Includes optional accounts for saving preferences and tracking ball performance

---

## 2. Product Overview

### 2.1 Target Audience

**Primary Users:**
- Mid-handicap golfers (10-25 HCP) seeking performance improvement
- Value-conscious players wanting best ball for their game
- Golfers transitioning between skill levels
- Players confused by marketing claims and ball variety

**Secondary Users:**
- Low-handicap players optimizing ball selection
- Beginners establishing their first "real" ball choice
- Golf coaches/fitters recommending balls to students
- Seasonal golfers needing warm vs cold weather options

### 2.2 User Personas

**Persona 1: "Improving Ian" - Mid Handicapper**
- 15 handicap, plays 30 rounds/year
- Currently plays whatever ball is on sale
- Wants better short game spin but budget-conscious
- Plays in varied weather (spring through fall)
- Would benefit from understanding ball impact on scores

**Persona 2: "Serious Sarah" - Competitive Player**
- 5 handicap, plays 75+ rounds/year
- Currently plays premium urethane ball
- Willing to pay for performance but wants validation she's using the right ball
- Plays year-round, needs warm and cold weather options
- Interested in data-driven decisions

**Persona 3: "Budget Bob" - Recreational Golfer**
- 25 handicap, plays 15 rounds/year
- Loses 3-5 balls per round
- Prioritizes durability and price over premium feel
- Doesn't need tour-level spin
- Wants "good enough" performance at best value

---

## 3. Feature Requirements

### 3.1 MVP Features (Version 1.0)

#### 3.1.1 Ball Selector Wizard
**Priority:** P0 (Critical)

Multi-step questionnaire collecting user data across 5 consolidated steps. The wizard uses conditional logic based on the user's priority selection in Step 1.

**Step 1: Your Golf Background & Priorities**

- Current Ball Being Played
  - Brand (dropdown: Titleist, Callaway, TaylorMade, Bridgestone, Srixon, Vice, Cut, Snell, Wilson, Maxfli, Other, Don't Know)
  - Model (dynamic dropdown based on brand)
- Handicap/Skill Level (0-5, 6-10, 11-15, 16-20, 21-30, 30+, Don't Know)
- Average Rounds Per Year (<10, 10-50, 50-100, 100+)
- What do you prioritize most?
  - Performance Only (Flight, Spin, Feel)
  - Performance and Preferences (Flight, Spin, Feel, Color, Price)
  - Preferences Only (Color and/or Price)
- What's most important to play your best?
  - Short Game Performance
  - Approach Shot Control
  - Ball Flight/Trajectory
  - All of the Above Equally

**Conditional Logic for "Preferences Only" Users:**
When a user selects "Preferences Only" in Step 1, Steps 2 and 4 (performance-oriented steps covering spin, trajectory, and ball speed) are still displayed but clearly marked as **optional** with helper text: "These fields are optional based on your priorities, but providing them will improve your recommendations." If left blank, the algorithm redistributes the Performance Priorities (30%) and Swing Speed Match (25%) weights proportionally across Preferences (becomes ~55%) and Playing Conditions (becomes ~40%), with Current Ball Analysis remaining at 10% (or redistributed per section 3.1.3 if unknown).

**Step 2: Ball Flight & Spin**
*Marked as optional if user selected "Preferences Only" in Step 1*

- Preferred trajectory for approach shots (Low, Mid, High)
- With your current ball, spin and control on approach shots:
  - Too much release (ball runs out)
  - Just right
  - Too much spin (ball checks too hard)
- Could you benefit from more short game spin and control?
  - Yes
  - No
  - Not sure

**Step 3: Feel & Preferences**

- Preferred ball feel
  - Very Soft
  - Soft
  - Medium/Firm
  - Don't care about feel
- Ball color preference
  - White only
  - Open to colored balls
  - Open to graphic/pattern balls
  - Color/graphics required
- Budget range per dozen
  - Budget (<$20)
  - Value ($20-35)
  - Premium ($35-50)
  - Tour Level ($50+)
  - Price not a factor
- Durability priority
  - Single round performance (don't care about durability)
  - Multiple rounds (need it to last)
  - Cost per round matters most

**Step 4: Playing Conditions & Performance Metrics**
*Ball speed and 8-iron distance fields marked as optional if user selected "Preferences Only" in Step 1*

- Typical playing temperature
  - Warm (70°F and above)
  - Moderate (50-70°F)
  - Cold (Below 50°F)
  - Mixed/Year-round
- Areas of your game you want to improve (select all that apply)
  - Distance off the tee
  - Accuracy off the tee
  - Approach shot control
  - Short game spin
  - Putting feel
- Driver ball speed average
  - Slider: 100-200 mph (narrowed from original 80-250 range for better UX in the common amateur range)
  - "I don't know" checkbox option
  - Helper text: "If unknown, check the box above. We can estimate from your 8-iron distance. If you have access to a launch monitor or simulator, ball speed is typically shown on the summary screen."
  - Reference guide displayed below slider: "Typical amateur ball speeds: Short hitter ~120mph, Average ~140mph, Long hitter ~160mph, Tour avg ~167mph"
- 8-iron distance (slider: 100-200 yards)
  - Helper text: "Average carry distance with 8-iron"

**Ball Speed "I Don't Know" Fallback Logic:**
When the user checks "I don't know" for driver ball speed, the algorithm estimates ball speed from 8-iron distance using this mapping:
- 8-iron carry 100-115 yds → estimated ball speed ~115-125 mph
- 8-iron carry 115-130 yds → estimated ball speed ~125-140 mph
- 8-iron carry 130-150 yds → estimated ball speed ~140-155 mph
- 8-iron carry 150-170 yds → estimated ball speed ~155-170 mph
- 8-iron carry 170-200 yds → estimated ball speed ~170-190 mph

If both ball speed and 8-iron distance are unknown, the algorithm uses handicap as a rough proxy:
- 0-5 HCP → estimated ball speed ~155-170 mph
- 6-10 HCP → estimated ball speed ~145-160 mph
- 11-15 HCP → estimated ball speed ~135-150 mph
- 16-20 HCP → estimated ball speed ~125-140 mph
- 21-30 HCP → estimated ball speed ~115-130 mph
- 30+ HCP → estimated ball speed ~105-120 mph

These estimates are flagged as low-confidence and affect the Recommendation Confidence Level (see section 3.1.3).

**Step 5: Review & Submit**
- Summary of all inputs displayed in card format
- Edit any section (click to jump back to that step)
- Confidence indicator showing "Your recommendation accuracy" based on how many fields were completed
- Submit for recommendations

**Acceptance Criteria for Wizard:**
- Given a user on mobile, the wizard displays one step at a time with a progress bar showing step X of 5
- Given a user selects "Preferences Only," Steps 2 and 4 performance fields show "(Optional)" labels and muted styling
- Given a user clicks "Edit" on the review screen, the wizard navigates to the relevant step with all prior answers preserved
- Given a user completes all required fields, the Submit button becomes active
- Given a user leaves optional fields blank, the system accepts submission without error
- Given a user returns to a previous step and changes an answer, dependent fields (e.g., ball model after changing brand) reset appropriately

#### 3.1.2 Ball Database
**Priority:** P0 (Critical)

Comprehensive database including all major manufacturers:

**Required Data Fields Per Ball:**
- Ball Name
- Manufacturer
- Construction (2-piece, 3-piece, 4-piece, 5-piece)
- Cover Material (Ionomer, Urethane, Surlyn, Cast Urethane, etc.)
- Compression Rating (numeric: 40-110+)
- Spin Profile
  - Driver Spin (Low, Mid, High)
  - Iron Spin (Low, Mid, High)
  - Wedge Spin (Low, Mid, High)
- Launch Characteristics (Low, Mid, High)
- Feel Rating (Very Soft, Soft, Medium, Firm)
- Price per Dozen (MSRP)
- Available Colors (White, Yellow, Orange, Pink, Matte, Multi-color, Graphic)
- Target Handicap Range (0-10, 10-20, 20+, All)
- Durability Rating (1-5 scale)
- Temperature Performance
  - Optimal Range (Warm, Moderate, Cold, All)
  - Cold Weather Suitability (1-5 scale)
- Marketing/Description (short)
- Product Page URLs (array of objects: `{ retailer: string, url: string }`)
  - Manufacturer product page (primary)
  - Up to 3 additional retailer links (e.g., PGA Superstore, Golf Galaxy, Amazon)
  - Note: V1 uses simple product page links. Affiliate tagging will be added in a future update. The DB schema should include a `is_affiliate` boolean field (default: false) and `affiliate_url` nullable field on the retailer link objects to support future affiliate integration without schema migration.

**Initial Ball Inventory (Minimum 40-50 models):**
- Titleist: Pro V1, Pro V1x, AVX, Tour Speed, Tour Soft, TruFeel, Velocity
- Callaway: Chrome Soft, Chrome Soft X, Chrome Tour, Supersoft, Warbird
- TaylorMade: TP5, TP5x, Tour Response, Soft Response, Distance+
- Bridgestone: Tour B X, Tour B XS, Tour B RX, Tour B RXS, e6, e12
- Srixon: Z-Star, Z-Star XV, Q-Star Tour, Soft Feel
- Vice: Pro, Pro Plus, Pro Soft, Tour, Drive
- Cut: Blue, Grey, Red, Matte
- Snell: MTB-X, MTB Black, Prime
- Wilson: Staff Model, Duo Soft, Duo Soft+
- Maxfli: Tour, Tour X, SoftFli, Straightfli

#### 3.1.3 Matching Algorithm
**Priority:** P0 (Critical)

Weighted scoring system that evaluates each ball against user inputs:

**Weighting Categories (Default Weights):**
1. **Swing Speed Match (25%)**
2. **Performance Priorities (30%)**
3. **Preferences (20%)**
4. **Playing Conditions (15%)**
5. **Current Ball Analysis (10%)**

**Weight Redistribution Rules:**
- If user selects "Preferences Only" AND skips optional performance fields: redistribute Swing Speed (25%) and Performance (30%) proportionally across Preferences (~55%) and Playing Conditions (~40%), Current Ball Analysis remains 10%
- If current ball is "Don't Know" for both brand and model: redistribute that 10% proportionally across the remaining four categories (Swing Speed becomes ~27.8%, Performance becomes ~33.3%, Preferences becomes ~22.2%, Playing Conditions becomes ~16.7%)
- If both current ball is unknown AND Preferences Only with skipped fields: Preferences becomes ~64.7%, Playing Conditions becomes ~35.3%

---

**Scoring Rubric: Swing Speed Match (25%)**

Uses driver ball speed to determine optimal compression range. Based on industry fitting standards, the primary risk is fast swingers over-compressing soft balls, not slow swingers under-compressing firm balls. The mapping uses overlapping ranges to account for personal preference:

| Driver Ball Speed | Optimal Compression Range | Ideal Construction | Score Mapping |
|---|---|---|---|
| Under 125 mph | 30-70 (Low) | 2-piece or 3-piece | Ball in range = 100%, within 10 pts of range = 75%, outside = 50% |
| 125-145 mph | 60-90 (Medium) | 3-piece or 4-piece | Ball in range = 100%, within 10 pts of range = 75%, outside = 50% |
| 145-165 mph | 80-105 (High) | 3-piece, 4-piece, or 5-piece | Ball in range = 100%, within 10 pts of range = 75%, outside = 50% |
| Over 165 mph | 95-110+ (Tour) | 4-piece or 5-piece | Ball in range = 100%, within 10 pts of range = 75%, outside = 50% |

Construction match scoring: Ball construction matches recommended type = 100%, adjacent type (e.g., 3-piece when 4-piece recommended) = 80%, two steps away = 60%.

Combined Swing Speed score = (Compression match × 0.6) + (Construction match × 0.4)

**Important nuance for algorithm implementation:** Compression is a guideline, not an absolute rule. At amateur swing speeds, even "mismatched" compression balls will compress adequately. The real performance differentiator at similar compression levels is spin profile and cover material. This rubric should be treated as a starting-point fit signal, not a hard filter. No ball should be eliminated solely on compression mismatch.

**VALIDATION NOTE:** These compression-to-ball-speed ranges are based on current industry fitting consensus (sources: TrackMan fitting data, MyGolfSpy ball lab, manufacturer fitting tools). These ranges should be validated during beta testing with 20-30 golfers across skill levels and refined based on user feedback and launch monitor data. The ranges intentionally overlap to prevent hard cutoffs.

---

**Scoring Rubric: Performance Priorities (30%)**

Sub-weights within this category:
- Spin characteristics (40% of this category)
- Launch profile (30% of this category)
- Feel match (30% of this category)

*Spin scoring:*
- User wants "more short game spin" + ball has High wedge spin = 100%
- User says current ball "runs out too much" + ball has High wedge spin and Mid/High iron spin = 100%
- User says spin is "just right" + ball has similar spin profile to current ball = 100%
- User says "too much spin" + ball has Low/Mid wedge spin = 100%
- Each mismatch level reduces score by 25% (e.g., wants High, ball is Mid = 75%; wants High, ball is Low = 50%)

*Launch scoring:*
- Exact match (user wants High, ball launches High) = 100%
- One step off (user wants High, ball launches Mid) = 70%
- Two steps off (user wants High, ball launches Low) = 40%

*Feel scoring:*
- Exact match = 100%
- One step off (e.g., user wants Soft, ball is Very Soft or Medium) = 70%
- Two steps off = 40%
- User selected "Don't care about feel" = 100% for all balls

---

**Scoring Rubric: Preferences (20%)**

Sub-weights within this category:
- Price within budget (50% of this category)
- Color availability (25% of this category)
- Durability (25% of this category)

*Price scoring:*
- Ball MSRP falls within selected budget range = 100%
- Ball is one tier below budget (cheaper) = 90% (still good, just below what they'd spend)
- Ball is one tier above budget = 50%
- Ball is two+ tiers above budget = 20%
- User selected "Price not a factor" = 100% for all balls

*Color scoring:*
- "White only": ball available in white = 100%, not available in white = 0%
- "Open to colored balls": ball available in any color = 100%
- "Open to graphic/pattern balls": ball available in any format = 100%
- "Color/graphics required": ball available in non-white options = 100%, white only = 30%

*Durability scoring:*
- "Single round performance": ignore durability rating, score all = 100%
- "Multiple rounds": durability 4-5 = 100%, 3 = 70%, 1-2 = 40%
- "Cost per round matters most": (durability rating × 20%) + inverse price weight. Calculated as: durability score (above) × 0.5 + price score (above) × 0.5

---

**Scoring Rubric: Playing Conditions (15%)**

- Ball's optimal temperature range matches user's typical conditions = 100%
- Ball rated "All" for temperature = 90% (good but not specialized)
- Temperature mismatch by one range (e.g., user plays Cold, ball is Moderate) = 60%
- Temperature mismatch by two ranges (e.g., user plays Cold, ball is Warm) = 30%

For "Mixed/Year-round" users: score = average of the ball's warm and cold suitability scores. These users will also receive separate warm-weather and cold-weather recommendations (see section 3.1.4).

Cold weather suitability rating (1-5 scale) is used as a tiebreaker within this category when users indicate Cold or Mixed conditions.

---

**Scoring Rubric: Current Ball Analysis (10%)**

- If current ball is known: compare recommended ball's specs against current ball
  - Addresses stated issues (e.g., "too much release" → new ball has more spin) = 100%
  - Similar profile to current ball when user says things are "just right" = 100%
  - Marginal improvement over current ball = 75%
  - Lateral move (different ball, similar performance) = 50%
  - Potential regression in an area the user didn't flag as a problem = 25%
- If current ball is "Don't Know": redistribute this 10% proportionally across the remaining four categories

---

**Recommendation Confidence Level:**

Each recommendation includes a confidence indicator based on data completeness:

| Data Provided | Confidence Level | Display |
|---|---|---|
| Ball speed (actual) + current ball known + all fields completed | High | "High confidence — we have strong data to match you" |
| Ball speed estimated from 8-iron OR current ball unknown, most fields completed | Medium | "Good confidence — a few more details would sharpen this" |
| Ball speed and 8-iron unknown, estimated from handicap, OR multiple fields skipped | Low | "Directional — provide swing data for more accurate results" |

Confidence level is displayed on each recommendation card and on the results page header.

---

**Output Requirements:**
- Match percentage (0-100%) for each ball
- Minimum display threshold: **50% match** — balls below 50% are not shown
- If fewer than 3 balls score above 50%: show all balls above 50% plus the next-best balls to reach 3 results, with a note: "Based on your inputs, fewer balls matched strongly. Here are the closest options."
- If user inputs are conflicting (e.g., wants tour-level spin but budget under $20): flag the trade-off in results with a callout: "No ball under $20 offers tour-level wedge spin. Here's the closest match at your budget, and what you'd gain by stepping up."
- Top 5 recommendations ranked by match score (minimum 3, maximum 5)
- Detailed "Why this ball" explanation for each
- Trade-off analysis (what you gain/lose vs current ball)
- Confidence level indicator

**Acceptance Criteria for Algorithm:**
- Given a user with 150mph ball speed who selects "Performance Only" with High spin preference, the top recommendation should be a 3-piece or 4-piece urethane ball in the 80-105 compression range
- Given a user who selects "Preferences Only" and skips all optional fields, the algorithm produces valid recommendations using only price, color, durability, and temperature data
- Given a user whose inputs produce no balls above 50% match, the system displays the top 3 balls with the appropriate low-match messaging
- Given two users with identical inputs except temperature (one Warm, one Cold), they receive different top recommendations if temperature-sensitive balls exist in the database
- Given a user with conflicting inputs (budget <$20 + tour-level spin), the results page displays a trade-off callout explaining the conflict

#### 3.1.4 Results & Recommendations Page
**Priority:** P0 (Critical)

**Results Page Header:**
- Recommendation confidence level indicator (High/Medium/Low)
- Summary of key inputs that drove the recommendations
- "Retake Quiz" and "Edit Answers" buttons

**Top Recommendations Section:**
- Card-based layout showing top 3-5 balls (minimum 3 if available above threshold)
- Each card displays:
  - Ball image
  - Name and manufacturer
  - Match percentage with visual indicator (color-coded: 75%+ green, 60-74% yellow, 50-59% orange)
  - Price per dozen
  - Available colors
  - Key specs (compression, construction, cover)
  - "Why this matches" summary (2-3 sentences)
  - Pros/Cons relative to user's game
  - "Learn More" link (to manufacturer product page)
  - "Where to Buy" links (product page URLs from database)

**Trade-Off Callouts:**
- If user inputs conflict (see algorithm section), display a prominent callout card above results explaining the trade-off
- Example: "You asked for tour-level spin under $20/dozen. These goals are in tension — urethane covers that deliver maximum spin typically start at $35+. We've optimized for the best spin you can get at your budget."

**Alternative Options:**
- "Similar Performance, Different Price" section
  - Step-down: Similar performance at lower price
  - Step-up: Better performance at higher price
- "If Money Were No Object" - best absolute match ignoring price
- "Best Value" - highest match score under $30

**Temperature/Seasonal Recommendations:**
- If user indicated "Mixed/Year-round" conditions:
  - "Warm Weather Pick" (70°F+)
  - "Cold Weather Pick" (<50°F)
  - Explanation of why different balls for different temps

**Action Items:**
- Save recommendations (requires account or generates shareable link)
- Email results to myself
- Share link (copy URL)
- Print recommendations

**Acceptance Criteria for Results Page:**
- Given results are generated, the page loads in under 2 seconds
- Given a "Mixed/Year-round" user, the page displays separate warm and cold weather recommendation sections
- Given a match percentage below 60%, the card displays an orange indicator with appropriate context
- Given the user is not logged in, "Save" prompts account creation or generates a shareable link
- Given results are generated, each ball card includes at least one working "Where to Buy" link

#### 3.1.5 Ball Comparison Tool
**Priority:** P1 (Important) — *Moved from P0. Does not block core value proposition of quiz → recommendations. Ship in fast-follow after MVP wizard and results page are validated.*

**Standalone Feature (accessible without taking quiz):**
- Search for any balls in database
- Select 2-4 balls to compare
- Side-by-side spec table
- Visual performance charts (radar chart for spin, launch, feel)
- Price comparison
- "Who should play this ball" for each

#### 3.1.6 Optional User Accounts
**Priority:** P1 (Important) — *Auth scaffolding begins in Phase 1 alongside DB schema (see section 12).*

**Account Creation:**
- Email + password OR social login (Google, Apple)
- Optional - can use tool without account
- Prompt to create account after first recommendation

**Account Benefits:**
- Save user profile (quiz answers)
- Save recommendation history
- Track balls tried (with notes/ratings)
- Seasonal profiles (summer vs winter ball)
- Wishlist/favorites
- Email notifications (price drops, new ball releases)

**Guest User Alternative:**
- Generate shareable link to results
- Email results without account
- Link expires after 30 days

#### 3.1.7 Search & Browse
**Priority:** P1 (Important)

- Browse all balls by manufacturer
- Filter by:
  - Price range
  - Construction type
  - Compression
  - Color
  - Spin profile
- Sort by:
  - Price (low to high, high to low)
  - Compression
  - Name (A-Z)
  - Newest releases

### 3.2 Future Features (Post-V1)

#### 3.2.1 Launch Monitor Integration
**Priority:** P2 (Nice to Have)

- Import data from:
  - CGQuad
  - GSPro
  - TrackMan
  - FlightScope
  - Foresight GC3/Quad
- Automatically populate swing metrics
- Store multiple ball test sessions
- Compare actual vs predicted performance

#### 3.2.2 Ball Switching Calculator
**Priority:** P2 (Nice to Have)

- Input: Current ball → Target ball
- Output: Expected changes in:
  - Driver distance
  - Spin rates
  - Feel difference
  - Launch angle impact
  - When the switch makes sense

#### 3.2.3 Community Features
**Priority:** P3 (Future)

- User reviews and ratings
- "I play this ball" count
- Handicap distribution for each ball
- Photo uploads (ball condition after rounds)
- Comments/discussions

#### 3.2.4 Advanced Features
**Priority:** P3 (Future)

- Course condition optimizer (firm/soft greens, wet/dry)
- Ball performance in wind
- Altitude adjustments (high elevation courses)
- "Ball of the month" subscription box recommendations
- Pro player ball usage tracker
- Price history and alerts

#### 3.2.5 Affiliate Integration
**Priority:** P2 (Post-Launch)

- Convert product page links to affiliate-tagged URLs
- Partner with major retailers (Golf Galaxy, PGA Superstore, Amazon, GlobalGolf)
- Track click-through and conversion rates
- A/B test affiliate vs direct links for user trust
- DB schema already supports this via `is_affiliate` and `affiliate_url` fields on retailer link objects

---

## 4. Competitive Advantages

### 4.1 Key Differentiators

1. **Multi-Brand Unbiased Recommendations**
   - Only platform comparing all major manufacturers
   - No financial incentive to recommend specific brands
   - Transparent matching criteria

2. **Temperature/Seasonal Recommendations**
   - Warm vs cold weather ball selection
   - Year-round players get two ball recommendations
   - Explains performance impact of temperature

3. **Budget Awareness**
   - Step-up/step-down options
   - Value alternatives to premium balls
   - Cost-per-round calculations for frequent players

4. **Current Ball Analysis**
   - Addresses specific issues with current ball
   - Migration path from beginner to advanced balls
   - "What am I missing?" comparison

5. **Optional Accounts with Real Value**
   - Track multiple balls tried
   - Seasonal profiles (summer/winter setups)
   - Historical recommendations
   - No account required to use core features

6. **Data-Driven Matching**
   - Uses actual swing metrics (ball speed, distances)
   - Weighted algorithm based on priorities
   - Confidence levels based on data completeness
   - Not just marketing claims

### 4.2 Competitive Landscape

**Manufacturer Tools (Titleist, Bridgestone, Callaway):**
- Limitation: Only recommend own products
- Our advantage: Cross-brand comparison

**Retail Fittings (Golf Galaxy, PGA Superstore):**
- Limitation: In-person only, limited selection, sales pressure
- Our advantage: Unbiased, access anytime, complete market coverage

**Generic "Ball Selector" Content:**
- Limitation: Generic advice, no personalization
- Our advantage: Actual matching algorithm with user data

**Golf Forums/Reddit:**
- Limitation: Anecdotal, conflicting opinions, outdated info
- Our advantage: Data-driven, current pricing/availability

---

## 5. Success Metrics

### 5.1 Launch Metrics (First 90 Days)

**User Engagement:**
- 1,000+ quiz completions
- 65%+ completion rate (users who start finish)
- Average time on site: 5+ minutes
- 40%+ users view comparison tool

**Content Metrics:**
- 50+ balls in database at launch
- 95%+ of top-selling balls included
- Monthly database updates (new releases, price changes)

**User Satisfaction:**
- 30%+ account creation rate
- 20%+ users save or share results
- Positive feedback mechanism (thumbs up/down)

### 5.2 Long-term Success Indicators

**Growth:**
- 10,000+ quiz completions in first year
- 25%+ month-over-month growth first 6 months
- 15%+ returning user rate

**Engagement:**
- 50%+ of accounts log back in within 30 days
- Average 2+ balls added to "tried list" per user
- 40%+ users engage with seasonal recommendations

**Monetization Potential (Future):**
- Affiliate click-through rate to retailers
- Premium account conversion (if implemented)
- B2B partnerships (golf courses, coaches)

---

## 6. User Input Fields - Complete Reference

### 6.1 Required Inputs

| Field | Type | Options | Validation | Purpose |
|-------|------|---------|------------|---------|
| Current Ball - Brand | Dropdown | 15+ manufacturers + "Don't Know" | Required, single select | Baseline comparison |
| Current Ball - Model | Dynamic Dropdown | Based on brand selection, includes "Don't Know" | Required if brand selected (not "Don't Know") | Current performance analysis |
| Handicap | Range Select | 0-5, 6-10, 11-15, 16-20, 21-30, 30+, Don't Know | Required, single select | Skill level matching |
| Rounds per Year | Radio | <10, 10-50, 50-100, 100+ | Required, single select | Durability/price priority |
| Priority Type | Radio | Performance Only, Performance + Preferences, Preferences Only | Required, single select | Algorithm weighting + conditional step logic |
| Most Important | Radio | Short Game, Approach, Trajectory, All Above | Required, single select | Performance focus |
| Approach Trajectory | Radio | Low, Mid, High | Required unless "Preferences Only" | Launch profile match |
| Current Ball Spin | Radio | Too much release, Just right, Too much spin | Required unless "Preferences Only" | Issue identification |
| Need Short Game Spin | Radio | Yes, No, Not sure | Required unless "Preferences Only" | Spin requirement |
| Preferred Feel | Radio | Very Soft, Soft, Medium/Firm, Don't Care | Required, single select | Feel matching |
| Color Preference | Radio | White only, Open to color, Open to graphics, Color/graphics required | Required, single select | Availability filter |
| Budget Range | Radio | <$20, $20-35, $35-50, $50+, No limit | Required, single select | Price filtering |
| Durability Priority | Radio | Single round, Multiple rounds, Cost per round | Required, single select | Construction recommendation |
| Typical Temperature | Radio | Warm (70+), Moderate (50-70), Cold (<50), Mixed | Required, single select | Temperature matching |
| Improvement Areas | Multi-select Checkbox | Tee distance, Tee accuracy, Approach, Short game, Putting | At least one selection required | Performance priorities |
| Driver Ball Speed | Slider + Checkbox | 100-200 mph + "I don't know" checkbox | Slider required unless checkbox checked | Compression matching |
| 8-Iron Distance | Slider | 100-200 yards | Required unless "Preferences Only" with skipped fields | Swing speed validation / ball speed estimation |

### 6.2 Optional Inputs (Stretch Goal)

| Field | Type | Source | Purpose |
|-------|------|--------|---------|
| Launch Monitor Data | File Upload/API | CGQuad, GSPro, TrackMan | Precise fitting |
| Spin Rates | Numeric | Launch monitor | Direct spin matching |
| Launch Angle | Numeric | Launch monitor | Launch profile |
| Carry Distance | Numeric | Launch monitor | Performance validation |

---

## 7. Output Requirements

### 7.1 Recommendation Format

**Each Recommended Ball Must Include:**

**Summary Card:**
- Ball image (product photo)
- Name and manufacturer
- Match percentage with color-coded tier (75%+ green, 60-74% yellow, 50-59% orange)
- Recommendation confidence level badge (High/Medium/Low)
- Price per dozen
- One-sentence headline ("Perfect for low-spin players needing durability")

**Detailed Information:**
- Construction details (3-piece urethane cover, etc.)
- Compression rating
- Spin profile (visual: Low/Mid/High for driver, iron, wedge)
- Feel description
- Available colors (with swatches)
- Target handicap range

**Personalized Analysis:**
- "Why this matches you" (3-4 bullet points specific to user inputs)
- "What you'll gain" vs current ball
- "Trade-offs" (if any)
- "Best for" scenarios

**Action Items:**
- "Where to Buy" links (product page URLs, 1-4 retailer links per ball)
- Add to favorites (if logged in)
- Compare with other balls (links to comparison tool when available)
- Read reviews (future)

### 7.2 Alternative Recommendations

**Step-Down Option:**
- "Similar performance at lower price"
- What you might sacrifice
- Cost savings

**Step-Up Option:**
- "Enhanced performance at higher price"
- What you gain
- When the upgrade makes sense

**Temperature Alternatives (if applicable):**
- Warm weather recommendation
- Cold weather recommendation
- Explanation of seasonal switching

---

## 8. Account System Requirements

### 8.1 Account Features

**Registration:**
- Email + password
- Social login (Google, Apple)
- Email verification required
- Terms of service acceptance

**User Profile:**
- Basic info (name, handicap, home course optional)
- Saved quiz responses
- Default temperature/playing conditions

**Saved Data:**
- Recommendation history (with dates)
- Balls tried (with personal ratings/notes)
- Favorites/wishlist
- Seasonal profiles (summer vs winter ball)

**Privacy & Security:**
- Password reset flow
- Email preferences (promotional opt-in/out)
- Data export (GDPR compliance)
- Account deletion

### 8.2 Guest User Experience

**Without Account:**
- Complete quiz and get recommendations
- Generate shareable link (URL with encoded results)
- Email results to self (no account required)
- Link valid for 30 days
- Prompt to save: "Create account to save your results and track balls you try"

---

## 9. Technical Requirements

### 9.1 Platform Requirements

**Device Support:**
- Responsive web design (mobile-first)
- Desktop browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers: iOS Safari, Android Chrome
- Tablet optimized

**Performance:**
- Quiz completion in <2 minutes
- Results page load <2 seconds
- Database query response <500ms
- 99% uptime target

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatible
- Color contrast standards
- Alt text for all images

### 9.2 Data Requirements

**Ball Database:**
- Minimum 50 balls at launch
- Monthly updates (new releases, price changes)
- Quarterly data validation (review specs)
- Version control for ball database

**User Data Storage:**
- Secure password hashing
- Encrypted sensitive data
- GDPR/CCPA compliant
- Regular backups

---

## 10. Error States & Edge Cases

### 10.1 Algorithm Edge Cases

| Scenario | Behavior |
|---|---|
| No balls above 50% match | Show top 3 balls regardless, with messaging: "Based on your inputs, fewer balls matched strongly. Here are the closest options." |
| Conflicting inputs (e.g., tour spin + budget <$20) | Show trade-off callout card above results explaining the conflict and best compromise |
| All performance fields skipped (Preferences Only) | Algorithm uses only Preferences + Playing Conditions weights; recommendations are valid but lower confidence |
| Both ball speed and 8-iron distance unknown | Estimate from handicap (see fallback logic in 3.1.1); mark confidence as Low |
| Handicap also unknown ("Don't Know") | Use median values (ball speed ~135mph, mid compression); mark confidence as Low with prompt: "For better recommendations, try to provide your ball speed or 8-iron distance" |
| Current ball brand selected but model is "Don't Know" | Use brand-average characteristics for Current Ball Analysis scoring |
| User selects a current ball that is not in the database | Skip Current Ball Analysis scoring; redistribute 10% weight |

### 10.2 UI/UX Edge Cases

| Scenario | Behavior |
|---|---|
| User refreshes mid-wizard | Answers are preserved in session storage; user returns to the step they were on |
| Shareable link accessed after 30 days | Display friendly expiration message with option to retake quiz |
| Database has fewer than 5 balls matching above threshold | Show all matches above threshold (minimum 3); do not pad with irrelevant results |
| Ball in database is discontinued | Flag as "Discontinued" on card; still show in results if it matches but deprioritize; hide "Where to Buy" if links are dead |
| User attempts to compare balls without any selected | Disable "Compare" button; show tooltip "Select 2-4 balls to compare" |

---

## 11. Out of Scope (V1)

**Explicitly NOT included in MVP:**
- ❌ Launch monitor API integrations (stretch goal)
- ❌ Mobile native apps (web-responsive only)
- ❌ E-commerce/purchasing (external retailer links only)
- ❌ Community reviews/ratings
- ❌ Ball subscription service
- ❌ Pro player endorsements/usage tracking
- ❌ Course-specific recommendations
- ❌ Multi-language support (English only V1)
- ❌ Live chat support
- ❌ Video tutorials
- ❌ Ball fitting appointment booking
- ❌ Affiliate link tracking/revenue (simple product links only in V1)

---

## 12. Open Questions & Decisions Needed

### 12.1 Business Model
- **Question:** Revenue model - affiliate links, premium accounts, B2B partnerships?
- **Decision Needed:** Finalize monetization strategy before launch
- **Options:** 
  - Free with affiliate links
  - Freemium (basic free, premium $5/mo for advanced features)
  - B2B licensing to courses/coaches

### 12.2 Data Maintenance
- **Question:** How to keep ball database current?
- **Decision Needed:** Manual updates vs automated scraping
- **Recommendation:** Start manual, automate later if volume justifies

### 12.3 Algorithm Validation
- **Question:** How do we validate matching algorithm accuracy?
- **Decision Needed:** Testing methodology
- **Recommendation:** Beta test with 20-30 golfers, gather feedback, iterate. Specifically validate the compression-to-ball-speed mapping (section 3.1.3) with launch monitor data across the full speed range.

### 12.4 Retailer Partnerships
- **Question:** Direct partnerships with Golf Galaxy, PGA Superstore, etc.?
- **Decision Needed:** Affiliate vs partnership approach
- **Recommendation:** Start with simple product page links (V1), pursue affiliate programs post-launch, then direct partnerships based on traffic volume

---

## 13. Timeline & Milestones

### Phase 1: Foundation (Weeks 1-2)
- Database schema design
- **Auth system scaffolding** (user model, session management, social login setup)
- Ball data collection (target 50 balls)
- Matching algorithm logic design
- Retailer product page URL collection for all balls in database

### Phase 2: Core Development (Weeks 3-6)
- Quiz flow implementation (5-step wizard with conditional logic)
- Database build and population
- Matching algorithm coding (all scoring rubrics)
- Results page development
- Confidence level system implementation

### Phase 3: Polish & Test (Weeks 7-8)
- UI/UX refinement
- Beta testing with real users
- **Algorithm tuning** — validate compression-to-ball-speed mapping with beta testers
- Bug fixes
- Edge case handling (see section 10)

### Phase 4: Launch Prep (Week 9)
- **Account system completion** (registration flows, saved data, profile — building on Phase 1 scaffolding)
- Final data validation
- Performance optimization
- Deployment preparation
- Shareable link and email results functionality

### Phase 5: Launch (Week 10)
- Soft launch to limited audience
- Monitor metrics
- Quick iteration based on early feedback
- Public launch

### Phase 5.1: Fast Follow (Weeks 11-12)
- Ball Comparison Tool (P1)
- Search & Browse functionality (P1)
- Address top user feedback items

---

## 14. Appendix

### 14.1 Glossary

- **Compression:** Measure of ball firmness (lower = softer, typically 40-110 scale)
- **Urethane Cover:** Soft, tour-level cover material providing maximum spin
- **Ionomer/Surlyn:** Firmer, more durable cover materials
- **Spin Profile:** Ball's spin characteristics across clubs (driver, irons, wedges)
- **Launch Angle:** Initial trajectory angle of ball flight
- **Ball Speed:** Speed of ball coming off clubface (approximately 1.44-1.50× club head swing speed for driver, depending on strike quality — this ratio is called "smash factor")
- **Smash Factor:** Ratio of ball speed to club head speed. Tour average is ~1.49; amateur average is ~1.44. Higher smash factor indicates more efficient energy transfer (better strike quality).
- **Confidence Level:** FitMyBall's indicator of how reliable a recommendation is, based on the completeness and precision of user-provided data

### 14.2 Reference Materials

**Data Sources:**
- USGA Conforming Ball List: https://www.usga.org/ConformingGolfBall/
- MyGolfSpy Ball Testing: https://www.mygolfspy.com/ball-lab/
- Manufacturer websites (specs and pricing)
- Retail sites (PGA Superstore, Golf Galaxy, GlobalGolf)

**Competitor Analysis:**
- Titleist Ball Fitting: https://www.titleist.com/golf-balls/ball-fitting
- Bridgestone Ball Fitting: https://www.bridgestonegolf.com/en-us/ballfitting
- Callaway Ball Selector: https://www.callawaygolf.com/ball-selector/

**Compression/Fitting Research:**
- TrackMan average swing speed data (trackmangolf.com)
- MyGolfSpy Golf Ball Compression Guide
- Snell Golf compression fitting methodology

### 14.3 API Contract Summary (for Tech Spec)

**POST /api/recommendations**

*Request body:*
```json
{
  "current_ball": { "brand": "string|null", "model": "string|null" },
  "handicap": "string|null",
  "rounds_per_year": "string",
  "priority_type": "performance_only|performance_and_preferences|preferences_only",
  "most_important": "short_game|approach|trajectory|all",
  "approach_trajectory": "low|mid|high|null",
  "current_ball_spin": "too_much_release|just_right|too_much_spin|null",
  "need_short_game_spin": "yes|no|not_sure|null",
  "preferred_feel": "very_soft|soft|medium_firm|dont_care",
  "color_preference": "white_only|open_to_color|open_to_graphics|color_required",
  "budget_range": "budget|value|premium|tour|no_limit",
  "durability_priority": "single_round|multiple_rounds|cost_per_round",
  "typical_temperature": "warm|moderate|cold|mixed",
  "improvement_areas": ["tee_distance", "tee_accuracy", "approach", "short_game", "putting"],
  "driver_ball_speed": "number|null",
  "ball_speed_unknown": "boolean",
  "eight_iron_distance": "number|null"
}
```

*Response body:*
```json
{
  "confidence_level": "high|medium|low",
  "confidence_message": "string",
  "recommendations": [
    {
      "ball_id": "string",
      "ball_name": "string",
      "manufacturer": "string",
      "match_percentage": "number",
      "match_tier": "strong|good|moderate",
      "headline": "string",
      "why_this_matches": ["string"],
      "pros": ["string"],
      "cons": ["string"],
      "specs": { "compression": "number", "construction": "string", "cover": "string", "spin_profile": {}, "feel": "string" },
      "price_per_dozen": "number",
      "available_colors": ["string"],
      "product_urls": [{ "retailer": "string", "url": "string" }],
      "image_url": "string"
    }
  ],
  "trade_off_callout": "string|null",
  "alternatives": {
    "step_down": { "ball_id": "string", "savings": "string", "trade_off": "string" },
    "step_up": { "ball_id": "string", "extra_cost": "string", "benefit": "string" },
    "best_value": { "ball_id": "string" },
    "money_no_object": { "ball_id": "string" }
  },
  "seasonal_picks": {
    "warm_weather": { "ball_id": "string", "reason": "string" },
    "cold_weather": { "ball_id": "string", "reason": "string" }
  }
}
```

---

## Document Control

**Created by:** Product Team  
**Last Updated:** February 12, 2026  
**Next Review:** Post-Technical Spec completion  
**Distribution:** Development Team, Design Team, Stakeholders

**Change Log:**
- v1.0 (Feb 11, 2026): Initial PRD created
- v1.1 (Feb 12, 2026): Major revision incorporating development recommendations:
  - Consolidated wizard from 7 steps to 5 steps for improved mobile completion rates
  - Added conditional logic for "Preferences Only" users (performance steps shown but marked optional)
  - Added complete algorithm scoring rubric with concrete thresholds for all 5 weight categories
  - Added compression-to-ball-speed mapping based on industry fitting standards (flagged for beta validation)
  - Added ball speed estimation fallback logic (from 8-iron distance, then handicap)
  - Added Recommendation Confidence Level system (High/Medium/Low)
  - Added Error States & Edge Cases section (section 10)
  - Added API contract summary for tech spec alignment (section 14.3)
  - Moved Ball Comparison Tool from P0 to P1 to reduce MVP scope
  - Moved auth scaffolding to Phase 1 (from Phase 4/Week 9)
  - Added Fast Follow phase (Weeks 11-12) for P1 features
  - Added retailer link data model (simple product page URLs with future affiliate support)
  - Narrowed driver ball speed slider range (100-200 mph) and added "I don't know" option
  - Added acceptance criteria for wizard and algorithm
  - Added "Don't Know" weight redistribution logic for current ball
  - Added conflicting-input trade-off messaging
  - Added glossary entries for Smash Factor and Confidence Level
  - Updated Data Sources with compression/fitting research references
