"use client";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare-context";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  ball: {
    id: string;
    name: string;
  };
  variant?: "icon" | "button";
  className?: string;
}

/**
 * Reusable button for adding/removing balls from comparison.
 * Handles its own state via useCompare() context.
 *
 * Variants:
 * - "icon": Compact icon-only button for card overlays
 * - "button": Full button with text for inline use
 */
export function CompareButton({
  ball,
  variant = "button",
  className,
}: CompareButtonProps) {
  const { addBall, removeBall, isSelected, isFull } = useCompare();

  const selected = isSelected(ball.id);
  const disabled = !selected && isFull;

  const handleClick = () => {
    if (selected) {
      removeBall(ball.id);
    } else {
      addBall({ id: ball.id, name: ball.name });
    }
  };

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant={selected ? "default" : "secondary"}
        onClick={handleClick}
        disabled={disabled}
        className={cn("h-8 w-8", className)}
        aria-label={
          selected
            ? `Remove ${ball.name} from comparison`
            : `Add ${ball.name} to comparison`
        }
      >
        {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={selected ? "default" : "outline"}
      onClick={handleClick}
      disabled={disabled}
      className={cn("gap-1.5", className)}
    >
      {selected ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Remove from Compare
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" />
          Add to Compare
        </>
      )}
    </Button>
  );
}
