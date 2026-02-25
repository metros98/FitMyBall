// Ball types — derived from Prisma schema enums and Ball model

export type SpinLevel = "LOW" | "LOW_MID" | "MID" | "MID_HIGH" | "HIGH";
export type LaunchLevel = "LOW" | "LOW_MID" | "MID" | "MID_HIGH" | "HIGH";
export type FeelLevel = "VERY_SOFT" | "SOFT" | "MEDIUM" | "FIRM";
export type TempLevel = "WARM" | "MODERATE" | "COLD" | "ALL";

export interface BallSpinProfile {
  driver: SpinLevel;
  iron: SpinLevel;
  wedge: SpinLevel;
}

export interface RetailerLink {
  retailer: string;
  url: string;
  isAffiliate?: boolean;
  affiliateUrl?: string;
}

export interface Ball {
  id: string;
  name: string;
  manufacturer: string;
  modelYear: number | null;
  description: string | null;
  construction: string;
  coverMaterial: string;
  layers: number;
  compression: number;
  driverSpin: SpinLevel;
  ironSpin: SpinLevel;
  wedgeSpin: SpinLevel;
  launchProfile: LaunchLevel;
  feelRating: FeelLevel;
  durability: number;
  skillLevel: string[];
  pricePerDozen: number;
  availableColors: string[];
  inStock: boolean;
  discontinued: boolean;
  optimalTemp: TempLevel;
  coldSuitability: number;
  imageUrl: string | null;
  manufacturerUrl: string | null;
  productUrls: RetailerLink[];
  slug: string;
}
