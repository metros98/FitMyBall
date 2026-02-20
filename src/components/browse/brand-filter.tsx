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
import { MANUFACTURERS } from "@/lib/utils/browse-filters";
import { ChevronDown } from "lucide-react";

interface BrandFilterProps {
  selected: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({ selected, onChange }: BrandFilterProps) {
  function handleToggle(brand: string) {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand));
    } else {
      onChange([...selected, brand]);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Brand
          {selected.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Manufacturer</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MANUFACTURERS.map((brand) => (
          <DropdownMenuCheckboxItem
            key={brand}
            checked={selected.includes(brand)}
            onCheckedChange={() => handleToggle(brand)}
            onSelect={(e) => e.preventDefault()}
          >
            {brand}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
