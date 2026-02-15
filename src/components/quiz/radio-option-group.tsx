"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioOptionGroupProps {
  label: string;
  description?: string;
  isOptional?: boolean;
  options: readonly RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  name: string;
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function RadioOptionGroup({
  label,
  description,
  isOptional,
  options,
  value,
  onChange,
  error,
  name,
  layout = "vertical",
  className,
}: RadioOptionGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
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
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <RadioGroup
        onValueChange={onChange}
        value={value ?? ""}
        className={cn(
          layout === "horizontal"
            ? "flex flex-wrap gap-4"
            : "space-y-2",
        )}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={opt.value}
              id={`${name}-${opt.value}`}
              className="mt-0.5"
            />
            <div>
              <Label
                htmlFor={`${name}-${opt.value}`}
                className={cn(
                  "font-normal cursor-pointer",
                  isOptional && "text-muted-foreground",
                )}
              >
                {opt.label}
              </Label>
              {opt.description && (
                <p className="text-xs text-muted-foreground">
                  {opt.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
