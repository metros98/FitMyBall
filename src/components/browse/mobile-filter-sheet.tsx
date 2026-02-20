"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import {
  MANUFACTURERS,
  CONSTRUCTIONS,
  COLORS,
  PRICE_RANGE,
  COMPRESSION_RANGE,
} from "@/lib/utils/browse-filters";

interface MobileFilters {
  brands: string[];
  constructions: string[];
  colors: string[];
  priceRange: [number, number];
  compressionRange: [number, number];
}

interface MobileFilterSheetProps {
  filters: MobileFilters;
  onApply: (filters: MobileFilters) => void;
  activeCount: number;
}

export function MobileFilterSheet({
  filters,
  onApply,
  activeCount,
}: MobileFilterSheetProps) {
  const [local, setLocal] = useState<MobileFilters>(filters);
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocal(filters);
    }
  }

  function handleApply() {
    onApply(local);
    setOpen(false);
  }

  function handleReset() {
    const reset: MobileFilters = {
      brands: [],
      constructions: [],
      colors: [],
      priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
      compressionRange: [COMPRESSION_RANGE.min, COMPRESSION_RANGE.max],
    };
    setLocal(reset);
    onApply(reset);
    setOpen(false);
  }

  function toggleItem(
    key: "brands" | "constructions" | "colors",
    item: string
  ) {
    setLocal((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(item)
          ? current.filter((v) => v !== item)
          : [...current, item],
      };
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden gap-1">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Narrow down golf balls by brand, price, and specs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Brand */}
          <FilterSection title="Brand">
            <div className="grid grid-cols-2 gap-2">
              {MANUFACTURERS.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={local.brands.includes(brand)}
                    onCheckedChange={() => toggleItem("brands", brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price">
            <div className="space-y-3">
              <Slider
                min={PRICE_RANGE.min}
                max={PRICE_RANGE.max}
                step={1}
                value={local.priceRange}
                onValueChange={(v) =>
                  setLocal((prev) => ({ ...prev, priceRange: v as [number, number] }))
                }
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${local.priceRange[0]}</span>
                <span>${local.priceRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          {/* Compression Range */}
          <FilterSection title="Compression">
            <div className="space-y-3">
              <Slider
                min={COMPRESSION_RANGE.min}
                max={COMPRESSION_RANGE.max}
                step={1}
                value={local.compressionRange}
                onValueChange={(v) =>
                  setLocal((prev) => ({
                    ...prev,
                    compressionRange: v as [number, number],
                  }))
                }
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{local.compressionRange[0]}</span>
                <span>{local.compressionRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          {/* Construction */}
          <FilterSection title="Construction">
            <div className="flex flex-col gap-2">
              {CONSTRUCTIONS.map((construction) => (
                <label
                  key={construction}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={local.constructions.includes(construction)}
                    onCheckedChange={() =>
                      toggleItem("constructions", construction)
                    }
                  />
                  {construction}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color">
            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={local.colors.includes(color)}
                    onCheckedChange={() => toggleItem("colors", color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset All
          </Button>
          <DialogClose asChild>
            <Button className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}
