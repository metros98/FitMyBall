"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/utils/browse-filters";

interface SortSelectProps {
  value: string;
  onChange: (sortBy: string, sortOrder: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const option = SORT_OPTIONS.find((o) => o.value === v);
        if (option) {
          onChange(option.sortBy, option.sortOrder);
        }
      }}
    >
      <SelectTrigger className="w-[200px]" aria-label="Sort by">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
