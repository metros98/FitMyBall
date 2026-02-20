"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export function RangeFilter({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = String,
}: RangeFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [open, setOpen] = useState(false);

  const isActive = value[0] !== min || value[1] !== max;

  function handleApply() {
    onChange(localValue);
    setOpen(false);
  }

  function handleReset() {
    const resetValue: [number, number] = [min, max];
    setLocalValue(resetValue);
    onChange(resetValue);
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalValue(value);
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          {label}
          {isActive && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              1
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-4"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="px-0 pt-0">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-4 pt-2">
          <Slider
            min={min}
            max={max}
            step={step}
            value={localValue}
            onValueChange={(v) => setLocalValue(v as [number, number])}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatValue(localValue[0])}</span>
            <span>{formatValue(localValue[1])}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
