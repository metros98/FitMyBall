"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SliderFieldProps {
  label: string;
  description?: string;
  isOptional?: boolean;
  min: number;
  max: number;
  step?: number;
  unit: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  unknownCheckbox?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  };
  referenceGuide?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function SliderField({
  label,
  description,
  isOptional,
  min,
  max,
  step = 1,
  unit,
  value,
  onChange,
  unknownCheckbox,
  referenceGuide,
  error,
  disabled,
  className,
}: SliderFieldProps) {
  const isDisabled = disabled || unknownCheckbox?.checked;
  const displayValue = value ?? Math.round((min + max) / 2);

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label
              className={cn(
                "text-sm font-medium",
                isOptional && "text-muted-foreground",
              )}
            >
              {label}
            </Label>
            {isOptional && (
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            )}
          </div>
          {!isDisabled && value != null && (
            <span className="text-sm font-medium tabular-nums">
              {value} {unit}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {unknownCheckbox && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${label}-unknown`}
            checked={unknownCheckbox.checked}
            onCheckedChange={(checked) => {
              unknownCheckbox.onChange(checked === true);
              if (checked) onChange(undefined);
            }}
          />
          <Label
            htmlFor={`${label}-unknown`}
            className="text-sm font-normal cursor-pointer"
          >
            {unknownCheckbox.label}
          </Label>
        </div>
      )}

      <div className={cn(isDisabled && "opacity-50")}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={[displayValue]}
          onValueChange={([val]) => {
            if (!isDisabled) onChange(val);
          }}
          disabled={isDisabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>
            {min} {unit}
          </span>
          <span>
            {max} {unit}
          </span>
        </div>
      </div>

      {referenceGuide && (
        <p className="text-xs text-muted-foreground">{referenceGuide}</p>
      )}

      {error && (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
