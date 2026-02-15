"use client";

import { useQuiz } from "@/components/quiz/quiz-context";
import { RadioOptionGroup } from "@/components/quiz/radio-option-group";
import { SliderField } from "@/components/quiz/slider-field";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TEMPERATURE_OPTIONS,
  IMPROVEMENT_AREA_OPTIONS,
} from "@/lib/quiz/constants";

export function StepConditions() {
  const { form, isPreferencesOnly } = useQuiz();

  const ballSpeedUnknown = form.watch("ballSpeedUnknown");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Playing Conditions</h2>
        <p className="text-muted-foreground mt-1">
          Help us factor in your environment and performance data.
        </p>
      </div>

      {/* Temperature */}
      <FormField
        control={form.control}
        name="typicalTemperature"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Typical playing temperature"
              name="typicalTemperature"
              options={TEMPERATURE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              layout="horizontal"
            />
          </FormItem>
        )}
      />

      {/* Improvement Areas */}
      <FormField
        control={form.control}
        name="improvementAreas"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Areas of your game you want to improve</FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {IMPROVEMENT_AREA_OPTIONS.map((area) => (
                <div
                  key={area.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={field.value?.includes(area.value)}
                    onCheckedChange={(checked) => {
                      const current = field.value ?? [];
                      if (checked) {
                        field.onChange([...current, area.value]);
                      } else {
                        field.onChange(
                          current.filter(
                            (v: string) => v !== area.value,
                          ),
                        );
                      }
                    }}
                    id={`improve-${area.value}`}
                  />
                  <Label
                    htmlFor={`improve-${area.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Driver Ball Speed */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label
            className={cn(
              "text-sm font-medium",
              isPreferencesOnly && "text-muted-foreground",
            )}
          >
            Driver ball speed
          </Label>
          {isPreferencesOnly && (
            <Badge variant="secondary" className="text-xs">
              Optional
            </Badge>
          )}
        </div>
        {isPreferencesOnly && (
          <p className="text-sm text-muted-foreground mb-3">
            Providing your ball speed improves recommendation accuracy.
          </p>
        )}
        <FormField
          control={form.control}
          name="driverBallSpeed"
          render={({ field, fieldState }) => (
            <FormItem>
              <SliderField
                label=""
                min={100}
                max={200}
                step={1}
                unit="mph"
                value={field.value}
                onChange={field.onChange}
                unknownCheckbox={{
                  checked: ballSpeedUnknown ?? false,
                  onChange: (checked) => {
                    form.setValue("ballSpeedUnknown", checked);
                    if (checked) {
                      form.setValue("driverBallSpeed", undefined);
                      form.clearErrors("driverBallSpeed");
                    }
                  },
                  label: "I don't know my ball speed",
                }}
                referenceGuide="Typical amateur ball speeds: Short hitter ~120mph, Average ~140mph, Long hitter ~160mph, Tour avg ~167mph"
                error={fieldState.error?.message}
              />
            </FormItem>
          )}
        />
      </div>

      {/* 8-Iron Distance */}
      <FormField
        control={form.control}
        name="ironDistance8"
        render={({ field, fieldState }) => (
          <FormItem>
            <SliderField
              label="8-iron carry distance"
              description="Average carry distance with your 8-iron"
              isOptional={isPreferencesOnly}
              min={100}
              max={200}
              step={1}
              unit="yards"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
