"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string, value: string) => void;
  onResetAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onResetAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Badge
          key={`${filter.key}-${filter.value}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          <span className="text-xs text-muted-foreground">{filter.label}:</span>
          {filter.value}
          <button
            type="button"
            onClick={() => onRemove(filter.key, filter.value)}
            className="ml-0.5 rounded-sm p-0.5 hover:bg-secondary-foreground/20"
            aria-label={`Remove ${filter.label}: ${filter.value}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground"
        onClick={onResetAll}
      >
        Reset All
      </Button>
    </div>
  );
}
