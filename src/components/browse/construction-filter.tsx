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
import { CONSTRUCTIONS } from "@/lib/utils/browse-filters";
import { ChevronDown } from "lucide-react";

interface ConstructionFilterProps {
  selected: string[];
  onChange: (constructions: string[]) => void;
}

export function ConstructionFilter({ selected, onChange }: ConstructionFilterProps) {
  function handleToggle(construction: string) {
    if (selected.includes(construction)) {
      onChange(selected.filter((c) => c !== construction));
    } else {
      onChange([...selected, construction]);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Construction
          {selected.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Construction</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CONSTRUCTIONS.map((construction) => (
          <DropdownMenuCheckboxItem
            key={construction}
            checked={selected.includes(construction)}
            onCheckedChange={() => handleToggle(construction)}
            onSelect={(e) => e.preventDefault()}
          >
            {construction}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
