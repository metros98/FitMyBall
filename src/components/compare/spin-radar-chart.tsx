"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Ball, SpinLevel } from "@/types/ball";

interface SpinRadarChartProps {
  balls: Ball[];
}

const BALL_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea"];

const SPIN_LEVEL_MAP: Record<SpinLevel, number> = {
  LOW: 1,
  MID: 2,
  HIGH: 3,
};

interface ChartDataPoint {
  category: string;
  [key: string]: string | number;
}

export function SpinRadarChart({ balls }: SpinRadarChartProps) {
  if (balls.length === 0) {
    return null;
  }

  // Build chart data structure
  const chartData: ChartDataPoint[] = [
    {
      category: "Driver Spin",
      ...Object.fromEntries(
        balls.map((ball) => [ball.name, SPIN_LEVEL_MAP[ball.driverSpin]])
      ),
    },
    {
      category: "Iron Spin",
      ...Object.fromEntries(
        balls.map((ball) => [ball.name, SPIN_LEVEL_MAP[ball.ironSpin]])
      ),
    },
    {
      category: "Wedge Spin",
      ...Object.fromEntries(
        balls.map((ball) => [ball.name, SPIN_LEVEL_MAP[ball.wedgeSpin]])
      ),
    },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={90} domain={[0, 3]} tickCount={4} />

          {balls.map((ball, index) => (
            <Radar
              key={ball.id}
              name={ball.name}
              dataKey={ball.name}
              stroke={BALL_COLORS[index % BALL_COLORS.length]}
              fill={BALL_COLORS[index % BALL_COLORS.length]}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}

          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend for spin levels */}
      <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
        <span>1 = Low</span>
        <span>2 = Mid</span>
        <span>3 = High</span>
      </div>
    </div>
  );
}
