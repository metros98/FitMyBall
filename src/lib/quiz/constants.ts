// Quiz option constants and label maps

export const BALL_BRANDS = [
  { value: "titleist", label: "Titleist" },
  { value: "callaway", label: "Callaway" },
  { value: "taylormade", label: "TaylorMade" },
  { value: "bridgestone", label: "Bridgestone" },
  { value: "srixon", label: "Srixon" },
  { value: "vice", label: "Vice" },
  { value: "cut", label: "Cut" },
  { value: "snell", label: "Snell" },
  { value: "wilson", label: "Wilson" },
  { value: "maxfli", label: "Maxfli" },
  { value: "other", label: "Other" },
  { value: "dont_know", label: "Don't Know" },
] as const;

export const BALL_MODELS_BY_BRAND: Record<
  string,
  { value: string; label: string }[]
> = {
  titleist: [
    { value: "Pro V1", label: "Pro V1" },
    { value: "Pro V1x", label: "Pro V1x" },
    { value: "AVX", label: "AVX" },
    { value: "Tour Speed", label: "Tour Speed" },
    { value: "Tour Soft", label: "Tour Soft" },
    { value: "TruFeel", label: "TruFeel" },
    { value: "Velocity", label: "Velocity" },
  ],
  callaway: [
    { value: "Chrome Soft", label: "Chrome Soft" },
    { value: "Chrome Soft X", label: "Chrome Soft X" },
    { value: "Chrome Tour", label: "Chrome Tour" },
    { value: "Supersoft", label: "Supersoft" },
    { value: "Warbird", label: "Warbird" },
  ],
  taylormade: [
    { value: "TP5", label: "TP5" },
    { value: "TP5x", label: "TP5x" },
    { value: "Tour Response", label: "Tour Response" },
    { value: "Soft Response", label: "Soft Response" },
    { value: "Distance+", label: "Distance+" },
    { value: "Noodle", label: "Noodle" },
  ],
  bridgestone: [
    { value: "Tour B X", label: "Tour B X" },
    { value: "Tour B XS", label: "Tour B XS" },
    { value: "Tour B RX", label: "Tour B RX" },
    { value: "Tour B RXS", label: "Tour B RXS" },
    { value: "e6", label: "e6" },
    { value: "e12 Contact", label: "e12 Contact" },
  ],
  srixon: [
    { value: "Z-Star", label: "Z-Star" },
    { value: "Z-Star XV", label: "Z-Star XV" },
    { value: "Z-Star Diamond", label: "Z-Star Diamond" },
    { value: "Q-Star Tour", label: "Q-Star Tour" },
    { value: "Soft Feel", label: "Soft Feel" },
    { value: "Distance", label: "Distance" },
  ],
  vice: [
    { value: "Pro Plus", label: "Pro Plus" },
    { value: "Pro", label: "Pro" },
    { value: "Pro Soft", label: "Pro Soft" },
    { value: "Tour", label: "Tour" },
    { value: "Drive", label: "Drive" },
  ],
  cut: [
    { value: "Cut Blue", label: "Cut Blue" },
    { value: "Cut Grey", label: "Cut Grey" },
    { value: "Cut DC", label: "Cut DC" },
  ],
  snell: [
    { value: "MTB Black", label: "MTB Black" },
    { value: "MTB X", label: "MTB X" },
    { value: "Get Sum", label: "Get Sum" },
  ],
  wilson: [
    { value: "Staff Model", label: "Staff Model" },
    { value: "Triad", label: "Triad" },
    { value: "Duo Soft+", label: "Duo Soft+" },
    { value: "Duo Optix", label: "Duo Optix" },
  ],
  maxfli: [
    { value: "Tour", label: "Tour" },
    { value: "Tour X", label: "Tour X" },
    { value: "Straightfli", label: "Straightfli" },
    { value: "Softfli", label: "Softfli" },
  ],
};

export const HANDICAP_OPTIONS = [
  { value: "0-5", label: "0-5 (Scratch/Low)" },
  { value: "6-10", label: "6-10" },
  { value: "11-15", label: "11-15" },
  { value: "16-20", label: "16-20" },
  { value: "21-30", label: "21-30" },
  { value: "30+", label: "30+" },
  { value: "dont_know", label: "Don't Know" },
] as const;

export const ROUNDS_PER_YEAR_OPTIONS = [
  { value: "<10", label: "Less than 10" },
  { value: "10-50", label: "10-50" },
  { value: "50-100", label: "50-100" },
  { value: "100+", label: "100+" },
] as const;

export const PRIORITY_TYPE_OPTIONS = [
  {
    value: "performance_only",
    label: "Performance Only",
    description: "Match based on flight, spin, and feel",
  },
  {
    value: "performance_and_preferences",
    label: "Performance & Preferences",
    description: "Balance flight, spin, feel with color and price",
  },
  {
    value: "preferences_only",
    label: "Preferences Only",
    description: "Match based on color and/or price",
  },
] as const;

export const MOST_IMPORTANT_OPTIONS = [
  { value: "short_game", label: "Short Game Performance" },
  { value: "approach", label: "Approach Shot Control" },
  { value: "trajectory", label: "Ball Flight / Trajectory" },
  { value: "all", label: "All of the Above Equally" },
] as const;

export const TRAJECTORY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "mid", label: "Mid" },
  { value: "high", label: "High" },
] as const;

export const SPIN_FEEDBACK_OPTIONS = [
  { value: "too_much_release", label: "Too much release (ball runs out)" },
  { value: "just_right", label: "Just right" },
  { value: "too_much_spin", label: "Too much spin (ball checks too hard)" },
] as const;

export const SHORT_GAME_SPIN_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const FEEL_OPTIONS = [
  { value: "very_soft", label: "Very Soft" },
  { value: "soft", label: "Soft" },
  { value: "medium_firm", label: "Medium / Firm" },
  { value: "dont_care", label: "Don't care about feel" },
] as const;

export const COLOR_OPTIONS = [
  { value: "white_only", label: "White only" },
  { value: "open_to_color", label: "Open to colored balls" },
  { value: "open_to_graphics", label: "Open to graphic / pattern balls" },
  { value: "color_required", label: "Color or graphics required" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget", description: "Under $20/dozen" },
  { value: "value", label: "Value", description: "$20-35/dozen" },
  { value: "premium", label: "Premium", description: "$35-50/dozen" },
  { value: "tour_level", label: "Tour Level", description: "$50+/dozen" },
  { value: "no_limit", label: "Price Not a Factor", description: "" },
] as const;

export const DURABILITY_OPTIONS = [
  {
    value: "single_round",
    label: "Single round performance",
    description: "Don't care about durability",
  },
  {
    value: "multiple_rounds",
    label: "Multiple rounds",
    description: "Need it to last",
  },
  {
    value: "cost_per_round",
    label: "Cost per round matters most",
    description: "",
  },
] as const;

export const TEMPERATURE_OPTIONS = [
  { value: "warm", label: "Warm", description: "70\u00B0F and above" },
  { value: "moderate", label: "Moderate", description: "50-70\u00B0F" },
  { value: "cold", label: "Cold", description: "Below 50\u00B0F" },
  { value: "mixed", label: "Mixed / Year-round", description: "" },
] as const;

export const IMPROVEMENT_AREA_OPTIONS = [
  { value: "tee_distance", label: "Distance off the tee" },
  { value: "tee_accuracy", label: "Accuracy off the tee" },
  { value: "approach", label: "Approach shot control" },
  { value: "short_game", label: "Short game spin" },
  { value: "putting", label: "Putting feel" },
] as const;

export const STEP_METADATA = [
  { number: 1, name: "Your Golf Background", shortName: "Background" },
  { number: 2, name: "Ball Flight & Spin", shortName: "Flight & Spin" },
  { number: 3, name: "Feel & Preferences", shortName: "Feel & Prefs" },
  { number: 4, name: "Playing Conditions", shortName: "Conditions" },
  { number: 5, name: "Review & Submit", shortName: "Review" },
] as const;

// Human-readable label maps for the review page
export const LABEL_MAPS = {
  handicap: {
    "0-5": "0-5 (Scratch/Low)",
    "6-10": "6-10",
    "11-15": "11-15",
    "16-20": "16-20",
    "21-30": "21-30",
    "30+": "30+",
    dont_know: "Don't Know",
  },
  roundsPerYear: {
    "<10": "Less than 10",
    "10-50": "10-50",
    "50-100": "50-100",
    "100+": "100+",
  },
  priorityType: {
    performance_only: "Performance Only",
    performance_and_preferences: "Performance & Preferences",
    preferences_only: "Preferences Only",
  },
  mostImportant: {
    short_game: "Short Game Performance",
    approach: "Approach Shot Control",
    trajectory: "Ball Flight / Trajectory",
    all: "All Equally",
  },
  approachTrajectory: {
    low: "Low",
    mid: "Mid",
    high: "High",
  },
  currentBallSpin: {
    too_much_release: "Too much release",
    just_right: "Just right",
    too_much_spin: "Too much spin",
  },
  needShortGameSpin: {
    yes: "Yes",
    no: "No",
    not_sure: "Not sure",
  },
  preferredFeel: {
    very_soft: "Very Soft",
    soft: "Soft",
    medium_firm: "Medium / Firm",
    dont_care: "Don't care",
  },
  colorPreference: {
    white_only: "White only",
    open_to_color: "Open to color",
    open_to_graphics: "Open to graphics",
    color_required: "Color required",
  },
  budgetRange: {
    budget: "Budget (under $20)",
    value: "Value ($20-35)",
    premium: "Premium ($35-50)",
    tour_level: "Tour Level ($50+)",
    no_limit: "Price not a factor",
  },
  durabilityPriority: {
    single_round: "Single round performance",
    multiple_rounds: "Multiple rounds",
    cost_per_round: "Cost per round matters most",
  },
  typicalTemperature: {
    warm: "Warm (70\u00B0F+)",
    moderate: "Moderate (50-70\u00B0F)",
    cold: "Cold (below 50\u00B0F)",
    mixed: "Mixed / Year-round",
  },
  improvementAreas: {
    tee_distance: "Distance off the tee",
    tee_accuracy: "Accuracy off the tee",
    approach: "Approach shot control",
    short_game: "Short game spin",
    putting: "Putting feel",
  },
} as const;
