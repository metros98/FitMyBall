"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS } from "@/lib/utils/browse-filters";
import { ChevronDown } from "lucide-react";

interface ColorFilterProps {
  selected: string[];
  onChange: (colors: string[]) => void;
}

export function ColorFilter({ selected, onChange }: ColorFilterProps) {
  function handleToggle(color: string) {
    if (selected.includes(color)) {
      onChange(selected.filter((c) => c !== color));
    } else {
      onChange([...selected, color]);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Color
          {selected.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COLORS.map((color) => (
          <DropdownMenuCheckboxItem
            key={color}
            checked={selected.includes(color)}
            onCheckedChange={() => handleToggle(color)}
            onSelect={(e) => e.preventDefault()}
          >
            {color}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
