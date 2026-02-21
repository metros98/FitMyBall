"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare-context";
import { cn } from "@/lib/utils";
import type { Ball } from "@/types/ball";

interface ComparisonTableProps {
  balls: Ball[];
}

interface TableRow {
  label: string;
  getValue: (ball: Ball) => string | number;
  format?: (value: string | number) => string;
}

const TABLE_ROWS: TableRow[] = [
  {
    label: "Price",
    getValue: (ball) => ball.pricePerDozen,
    format: (val) => `$${val}/doz`,
  },
  {
    label: "Compression",
    getValue: (ball) => ball.compression,
  },
  {
    label: "Construction",
    getValue: (ball) => ball.construction,
  },
  {
    label: "Cover",
    getValue: (ball) => ball.coverMaterial,
  },
  {
    label: "Feel",
    getValue: (ball) => ball.feelRating,
    format: (val) => String(val).replace(/_/g, " "),
  },
  {
    label: "Driver Spin",
    getValue: (ball) => ball.driverSpin,
  },
  {
    label: "Iron Spin",
    getValue: (ball) => ball.ironSpin,
  },
  {
    label: "Wedge Spin",
    getValue: (ball) => ball.wedgeSpin,
  },
  {
    label: "Launch",
    getValue: (ball) => ball.launchProfile,
  },
  {
    label: "Durability",
    getValue: (ball) => ball.durability,
    format: (val) => `${val}/10`,
  },
  {
    label: "Skill Level",
    getValue: (ball) => ball.skillLevel.join(", "),
  },
  {
    label: "Colors",
    getValue: (ball) => ball.availableColors.join(", "),
  },
  {
    label: "Temperature",
    getValue: (ball) => ball.optimalTemp,
  },
];

function checkIfValuesDiffer(balls: Ball[], getValue: (ball: Ball) => string | number): boolean {
  if (balls.length < 2) return false;
  const values = balls.map(getValue);
  const firstValue = values[0];
  return values.some((v) => v !== firstValue);
}

export function ComparisonTable({ balls }: ComparisonTableProps) {
  const { removeBall } = useCompare();

  if (balls.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Empty cell for row labels */}
            <th className="sticky left-0 z-10 bg-background border-b border-r p-0 w-[140px]" />

            {/* Ball headers */}
            {balls.map((ball) => (
              <th
                key={ball.id}
                className="border-b border-l p-4 text-left align-top min-w-[200px]"
              >
                <div className="flex flex-col gap-3">
                  {/* Ball Image */}
                  {ball.imageUrl ? (
                    <div className="relative h-20 w-20 mx-auto">
                      <Image
                        src={ball.imageUrl}
                        alt={ball.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 mx-auto rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        No image
                      </span>
                    </div>
                  )}

                  {/* Ball Name & Manufacturer */}
                  <div className="space-y-1">
                    <div className="font-semibold text-sm leading-tight">
                      {ball.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ball.manufacturer}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBall(ball.id)}
                    className="gap-1.5 h-8 w-full"
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {TABLE_ROWS.map((row) => {
            const valuesDiffer = checkIfValuesDiffer(balls, row.getValue);

            return (
              <tr key={row.label}>
                {/* Row Label */}
                <td className="sticky left-0 z-10 bg-background border-r border-b px-4 py-3 font-medium text-sm">
                  {row.label}
                </td>

                {/* Ball Values */}
                {balls.map((ball) => {
                  const value = row.getValue(ball);
                  const displayValue = row.format
                    ? row.format(value)
                    : String(value);

                  return (
                    <td
                      key={ball.id}
                      className={cn(
                        "border-b border-l px-4 py-3 text-sm",
                        valuesDiffer && "bg-green-50"
                      )}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
